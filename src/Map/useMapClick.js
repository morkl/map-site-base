import { useEffect } from "react";
import { createEmpty, extend } from "ol/extent";

export function useMapClick(
  enabled,
  setShow,
  setShowLightbox,
  showEntry,
  map,
  popup,
  vectorLayer,
) {
  useEffect(() => {
    if (!map || !enabled) {
      return;
    }

    async function onClick(evt) {
      const cluster = (await vectorLayer.getFeatures(evt.pixel))?.[0];
      if (!cluster) {
        setShow(null);
        setShowLightbox(false);
        return;
      }

      const xOffset = Math.floor((180 + evt.coordinate[0]) / 360) * 360;

      const features = cluster.get("features");
      if (features.length === 1) {
        showEntry(features[0].get("data"), xOffset);
        return;
      }

      const extent = createEmpty();
      features.forEach((feature) => {
        const c = feature.getGeometry().getCoordinates();
        const x = c[0] + xOffset;
        const y = c[1];

        extend(extent, [x, y, x, y]);
      });
      const view = map.getView();
      //const resolution = map.getView().getResolution();
      const z = view.getZoom();
      const mz = view.getMaxZoom();
      //const gwe = getWidth(extent);
      //const gh = getHeight(extent);

      //if (z === mz || (gwe < resolution && gh < resolution)) {
      if (z === mz) {
        // Show an expanded view of the cluster members.
        //clickFeature = features[0];
        //clickResolution = resolution;
        //clusterCircles.setStyle(clusterCircleStyle);
      } else {
        // Zoom to the extent of the cluster members.
        view.fit(extent, { duration: 500, padding: [200, 200, 200, 200] });
      }
    }

    map.on("click", onClick);
    return () => {
      map.un("click", onClick);
    };
  }, [enabled, map, popup, vectorLayer, setShow, setShowLightbox, showEntry]);
}
