import "yet-another-react-lightbox/styles.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Overlay from "ol/Overlay";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { fromUserCoordinate, toUserCoordinate } from "ol/proj";
import {
  arrow,
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { Cluster } from "ol/source";
import { getIconSize } from "../Customize/getIconSize.js";

import styles from "./MainMapView.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faHourglassHalf,
  faInfo,
  faMinus,
  faMoon,
  faPlus,
  faShuffle,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { Intro } from "../Intro/Intro.jsx";
import { useBigScreen } from "../util/useBigScreen.jsx";
import { useTheme } from "../Theme/useTheme.jsx";
import { useSetTheme } from "../Theme/useSetTheme.jsx";
import { useSlowMode } from "../Slow/useSlowMode.js";
import { useSetSlowMode } from "../Slow/useSetSlowMode.js";
import { usePreload } from "./usePreload";
import { easeIn, easeOut } from "ol/easing";
import { useMapClick } from "./useMapClick.js";
import { ShowEntry } from "../ShowEntry/ShowEntry.jsx";
import { getFeatures } from "../Customize/getFeatures.js";
import { Modify, Select } from "ol/interaction";
import { Circle, Fill, Stroke } from "ol/style";
import { settings } from "../Customize/settings.js";
import { useData } from "./useData.js";
import { useMapCenter } from "./useMapCenter.js";
import { useMap } from "./useMap.js";
import { getUniqueId } from "../Customize/getUniqueId.js";
import { getImagePreviewUrl } from "../Customize/getImagePreviewUrl.js";

const styleCache = {};
const editingStyle = new Style({
  image: new Circle({
    fill: new Fill({ color: "rgba(128, 128, 255, 0.2)" }),
    stroke: new Stroke({
      color: "rgba(60, 60, 200, 0.5)",
      width: 2,
    }),
    radius: 5,
  }),
});
const editingOverriddenStyle = new Style({
  image: new Circle({
    fill: new Fill({ color: "rgba(255, 128, 128, 0.2)" }),
    stroke: new Stroke({
      color: "rgba(200, 60, 60, 0.5)",
      width: 2,
    }),
    radius: 5,
  }),
});

export function MainMapView() {
  const [data, overrides, setOverrides] = useData();

  const [editing, setEditing] = useState(false);
  const [editingSelected, setEditingSelected] = useState(null);
  const theme = useTheme();
  const setTheme = useSetTheme();
  const big = useBigScreen();
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const [show, setShow] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [popup, setPopup] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);

  const showEntry = useCallback(
    function (entry, xOffset) {
      setShow(entry);
      let override = overrides?.[getUniqueId(entry)];
      const longitude = override?.[0] ?? entry.longitude;
      const latitude = override?.[1] ?? entry.latitude;
      popup?.setPosition([longitude + xOffset, latitude]);
    },
    [popup, overrides],
  );

  const arrowRef = useRef(null);
  const {
    refs,
    floatingStyles,
    context: floatingContext,
  } = useFloating({
    whileElementsMounted: show
      ? (reference, floating, update) =>
          autoUpdate(reference, floating, update, { animationFrame: true })
      : undefined,
    open: show !== null,
    middleware: [
      autoPlacement(),
      shift(),
      arrow({
        element: arrowRef,
      }),
      offset(settings.popupArrowHeight + settings.popupGap),
    ],
  });

  const map = useMap(containerRef);
  const center = useMapCenter(map);

  useEffect(() => {
    if (map) {
      map.updateSize(); // redraw after opening/closing editing panel
    }
  }, [map, editing]);

  const preload = usePreload();

  const features = useMemo(
    () => getFeatures(data, overrides),
    [data, overrides],
  );

  useEffect(() => {
    if (!features) {
      return;
    }
    const vectorSource = new VectorSource({
      features,
    });

    const v = map.getView();
    const clusterSource = new Cluster({
      distance:
        getIconSize(v.getResolution()) * settings.iconClusterDistanceFactor,
      minDistance: settings.iconClusterMinDistance,
      source: vectorSource,
    });
    function onResolutionChange(evt) {
      const resolution = evt.target.getResolution();
      const s = getIconSize(resolution) * 0.4;
      clusterSource.setDistance(s);
    }
    v.on("change:resolution", onResolutionChange);

    const vectorLayer = new VectorLayer({
      source: editing ? vectorSource : clusterSource,
      renderOrder: (a, b) => {
        return (
          // render in latitude order to make overlap make sense
          b.getGeometry().getCoordinates()[1] -
          a.getGeometry().getCoordinates()[1]
        );
      },
      updateWhileAnimating: true,
      style: function (feature, resolution) {
        if (editing) {
          const d = feature.get("data");
          return overrides && Object.hasOwn(overrides, getUniqueId(d))
            ? editingOverriddenStyle
            : editingStyle;
        }

        const features = feature.get("features");
        const count = features.length;
        const s = getIconSize(resolution);
        styleCache[s] ??= {};

        if (count === 1) {
          styleCache[s][count] ??= {};
          const icon = features[0].get("icon");
          return (styleCache[s][count][icon] ??= new Style({
            image: new Icon({
              src: settings.icons[icon].src,
              height: s * settings.icons[icon].scale,
              anchor: settings.icons[icon].anchor,
            }),
          }));
        }

        const dy = s / 2;
        const dx = s / 3;

        return (styleCache[s][count] ??= [
          ...(count > 2
            ? [
                new Style({
                  image: new Icon({
                    src: settings.icons[settings.iconClusterIcons[1][0]].src,
                    height: s,
                    displacement: [dx, dy],
                  }),
                }),
                new Style({
                  image: new Icon({
                    src: settings.icons[settings.iconClusterIcons[1][1]].src,
                    height: s,
                    displacement: [-dx, dy],
                  }),
                }),
                new Style({
                  image: new Icon({
                    src: settings.icons[settings.iconClusterIcons[1][2]].src,
                    height: s,
                    displacement: [0, 0],
                  }),
                }),
              ]
            : [
                new Style({
                  image: new Icon({
                    src: settings.icons[settings.iconClusterIcons[0][0]].src,
                    height: s,
                    displacement: [-dx, 0],
                  }),
                }),
                new Style({
                  image: new Icon({
                    src: settings.icons[settings.iconClusterIcons[0][1]].src,
                    height: s,
                    displacement: [dx, 0],
                  }),
                }),
              ]),
        ]);
      },
    });
    map.addLayer(vectorLayer);
    setVectorLayer(vectorLayer);

    const popup = new Overlay({
      element: popupRef.current,
      positioning: "auto",
      stopEvent: false,
    });
    map.addOverlay(popup);
    setPopup(popup);

    return () => {
      map.removeLayer(vectorLayer);
      map.removeOverlay(popup);
      v.un("change:resolution", onResolutionChange);
    };
  }, [editing, map, features, overrides]);

  const editingSelectedRef = useRef(editingSelected); // Waiting patiently for useEffectEvent
  editingSelectedRef.current = editingSelected;
  useEffect(() => {
    if (!map || !vectorLayer || !editing) {
      return;
    }
    const select = new Select();
    if (editingSelectedRef.current) {
      const feature = features.find((x) => {
        const d = x.get("data");
        return getUniqueId(d) === getUniqueId(editingSelectedRef.current);
      });
      select.getFeatures().push(feature);
    }
    const modify = new Modify({
      features: select.getFeatures(),
    });

    map.addInteraction(select);
    map.addInteraction(modify);
    select.on("select", (evt) => {
      setEditingSelected(
        evt.selected?.length === 1 ? evt.selected[0].get("data") : null,
      );
    });
    modify.on("modifyend", (evt) => {
      const modified = evt.features.getArray().map((f) => ({
        coordinates: f.getGeometry().getCoordinates(),
        data: f.get("data"),
      }));
      setOverrides((overrides) => {
        const newOverrides = { ...overrides };
        for (const m of modified) {
          newOverrides[getUniqueId(m.data)] = m.coordinates;
        }
        return newOverrides;
      });
    });

    return () => {
      map.removeInteraction(modify);
      map.removeInteraction(select);
    };
  }, [map, vectorLayer, editing, features, setOverrides]);

  useEffect(() => {
    if (!map || !vectorLayer) {
      return;
    }
    async function onPointerMove(evt) {
      if (editing) {
        return;
      }
      const clusters = await vectorLayer.getFeatures(evt.pixel);
      if (clusters.length > 0) {
        this.getTargetElement().style.cursor = "pointer";

        if (clusters.length === 1) {
          const features = clusters[0].get("features");
          if (features.length === 1) {
            const single = features[0];
            const thumb = single.get("data").thumb;
            preload(thumb);
          }
        }
      } else {
        this.getTargetElement().style.cursor = "";
      }
    }
    map.on("pointermove", onPointerMove);
    return () => {
      map.un("pointermove", onPointerMove);
    };
  }, [map, editing, preload, vectorLayer]);

  useMapClick(
    !editing,
    setShow,
    setShowLightbox,
    showEntry,
    map,
    popup,
    vectorLayer,
  );

  const zoomIn = useCallback(() => {
    map?.getView().animate({
      zoom: map.getView().getZoom() + 1,
      duration: 250,
    });
  }, [map]);
  const zoomOut = useCallback(() => {
    map?.getView().animate({
      zoom: map.getView().getZoom() - 1,
      duration: 250,
    });
  }, [map]);

  const [showingIntro, setShowingIntro] = useState(true);
  const showIntro = useCallback(() => setShowingIntro(true), []);
  const hideIntro = useCallback(() => setShowingIntro(false), []);

  const closeShow = useCallback(() => {
    setShow(null);
    setShowLightbox(false);
  }, []);
  const openLightbox = useCallback(() => setShowLightbox(true), []);
  const closeLightbox = useCallback(() => setShowLightbox(false), []);

  const slowMode = useSlowMode();
  const setSlowMode = useSetSlowMode();

  const [flyingToEntry, setFlyingToEntry] = useState(false);

  const goToEntry = useCallback(
    (entry) => {
      closeShow();
      setFlyingToEntry(true);

      let override = overrides?.[getUniqueId(entry)];

      const longitude = override?.[0] ?? entry.longitude;
      const latitude = override?.[1] ?? entry.latitude;

      const duration = 2000;
      const targetZoom = 8;
      const flyTop = 3;
      const bounceLimit = 3;

      const view = map.getView();
      const xOffset = Math.floor((180 + view.getCenter()[0]) / 360) * 360;

      const rotation = view.getRotation();
      const resolution = view.getResolutionForZoom(targetZoom);
      const size = map.getSize();

      let newCenter = [longitude + xOffset, latitude];
      if (big) {
        const centeredElementHeightApproximation =
          666 + settings.popupArrowHeight + settings.popupGap;

        const position = [
          size[0] / 2,
          size[1] / 2 -
            Math.min(centeredElementHeightApproximation / 2, size[1] / 2),
        ];

        const projection = view.getProjection();
        const coordinate = fromUserCoordinate(newCenter, projection);

        // Borrowed from private function ol.View.calculateCenterOn
        // https://github.com/openlayers/openlayers/blob/85219a86c52428e7736957e7255f45a34e645cef/src/ol/View.js#L2143
        const cosAngle = Math.cos(-rotation);
        let sinAngle = Math.sin(-rotation);
        let rotX = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
        let rotY = coordinate[1] * cosAngle + coordinate[0] * sinAngle;
        rotX += (size[0] / 2 - position[0]) * resolution;
        rotY += (position[1] - size[1] / 2) * resolution;
        // go back to original angle
        sinAngle = -sinAngle; // go back to original rotation
        const centerX = rotX * cosAngle - rotY * sinAngle;
        const centerY = rotY * cosAngle + rotX * sinAngle;

        newCenter = toUserCoordinate([centerX, centerY], projection);
      }
      const oldZoom = view.getZoom();
      const oldCenter = view.getCenter();

      function onAfterAnimate(finished) {
        setFlyingToEntry(false);
        if (finished) {
          showEntry({ ...entry, longitude, latitude }, xOffset);
        }
      }

      setTimeout(() => {
        if (oldZoom > bounceLimit) {
          view.animate(
            {
              zoom: flyTop,
              duration: duration / 2,
              center: [
                (newCenter[0] + oldCenter[0]) / 2,
                (newCenter[1] + oldCenter[1]) / 2,
              ],
              easing: easeIn,
            },
            {
              center: newCenter,
              zoom: targetZoom,
              duration: duration / 2,
              easing: easeOut,
            },
            onAfterAnimate,
          );
        } else {
          view.animate(
            {
              zoom: targetZoom,
              duration: duration / 2,
              center: newCenter,
            },
            onAfterAnimate,
          );
        }
      }, 10);
    },
    [big, closeShow, map, showEntry, overrides],
  );
  const goToSpecific = useCallback(
    (condition) => {
      const entry = data.find(condition);
      goToEntry(entry);
    },
    [data, goToEntry],
  );
  const goToRandom = useCallback(() => {
    let entry;
    do {
      entry = data[Math.floor(Math.random() * data.length)];
    } while (
      data.length > 1 &&
      show &&
      getUniqueId(entry) === getUniqueId(show)
    );
    goToEntry(entry);
  }, [data, show, goToEntry]);

  return (
    <div className={styles.wrapper}>
      {showingIntro && <Intro close={hideIntro} goToSpecific={goToSpecific} />}
      <div id="map" className={styles.map} ref={containerRef}>
        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 1,
            fontSize: "x-small",
          }}
        >
          {center?.[0].toFixed(2)}, {center?.[1].toFixed(2)}
        </span>
        <div className={styles.controls}>
          <button onClick={showIntro}>
            <FontAwesomeIcon icon={faInfo} title="Information" />
          </button>
          <button onClick={zoomIn}>
            <FontAwesomeIcon icon={faPlus} title="Zoom in" />
          </button>
          <button onClick={zoomOut}>
            <FontAwesomeIcon icon={faMinus} title="Zoom out" />
          </button>
          <button
            onClick={() => setTheme("light")}
            className={theme === "light" ? "checked" : undefined}
          >
            <FontAwesomeIcon icon={faSun} title="Light mode" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={theme === "dark" ? "checked" : undefined}
          >
            <FontAwesomeIcon icon={faMoon} title="Dark mode" />
          </button>
          <button onClick={goToRandom} disabled={flyingToEntry}>
            <FontAwesomeIcon icon={faShuffle} title="Random submission" />
          </button>
          {settings.slowModeEnabled && (
            <button
              onClick={() => setSlowMode((x) => !x)}
              className={slowMode ? "checked" : undefined}
            >
              <FontAwesomeIcon
                icon={faHourglassHalf}
                title={slowMode ? "Disable slow mode" : "Enable slow mode"}
              />
            </button>
          )}
          {settings.editingEnabled && (
            <button
              onClick={() => setEditing((x) => !x)}
              className={editing ? "checked" : undefined}
            >
              <FontAwesomeIcon
                icon={faEdit}
                title={
                  slowMode ? "Disable editing mode" : "Enable editing mode"
                }
              />
            </button>
          )}
        </div>
        <div
          ref={(el) => {
            popupRef.current = el;
            refs.setReference(el);
          }}
        />
      </div>
      {editing && (
        <div className={styles.editingPanel}>
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <td>{editingSelected?.name}</td>
              </tr>
              <tr>
                <th>Place</th>
                <td>{editingSelected?.place}</td>
              </tr>
              <tr>
                <th>Caption</th>
                <td>{editingSelected?.caption}</td>
              </tr>
              {editingSelected && (
                <tr>
                  <td colSpan={2}>
                    <img src={getImagePreviewUrl(editingSelected)} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <textarea
            className={styles.overrides}
            value={JSON.stringify(overrides, null, 2)}
            onChange={(evt) => {
              try {
                const d = JSON.parse(evt.target.value);
                setOverrides(d);
              } catch {
                // if syntax error, ignore
              }
            }}
          />
          <textarea
            className={styles.overrides}
            value={JSON.stringify(
              data.map((d) => ({
                ...d,
                latitude: overrides[getUniqueId(d)]?.[0] ?? d.latitude,
                longitude: overrides[getUniqueId(d)]?.[1] ?? d.longitude,
              })),
              null,
              2,
            )}
          />
        </div>
      )}
      <ShowEntry
        show={show}
        closeShow={closeShow}
        showLightbox={showLightbox}
        openLightbox={openLightbox}
        closeLightbox={closeLightbox}
        big={big}
        floatingStyles={floatingStyles}
        floatingContext={floatingContext}
        setFloatingRef={refs.setFloating}
        arrowRef={arrowRef}
      />
    </div>
  );
}
