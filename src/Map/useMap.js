import { useEffect, useState } from "react";
import { settings } from "../Customize/settings.js";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps } from "ol/source";
import Map from "ol/Map";
import { defaults } from "ol/control";
import View from "ol/View";
import { useTheme } from "../Theme/useTheme.jsx";
import { useGeographic } from "ol/proj";

useGeographic(); // eslint-disable-line react-hooks/rules-of-hooks -- not a hook

export function useMap(containerRef) {
  const [map, setMap] = useState(null);
  const theme = useTheme();
  const [initialTheme] = useState(theme);
  const [useFallbackMap, setUseFallbackMap] = useState(false);

  useEffect(() => {
    const stadiaDark =
      settings.stadiaApiKey &&
      new TileLayer({
        source: new StadiaMaps({
          layer: "alidade_smooth_dark",
          retina: true,
          apiKey: settings.stadiaApiKey,
        }),
        visible: initialTheme === "dark",
        title: "Stadia Alidade Smooth Dark",
        dark: true,
      });

    const stadiaLight =
      settings.stadiaApiKey &&
      new TileLayer({
        source: new StadiaMaps({
          layer: "alidade_smooth",
          retina: true,
          apiKey: settings.stadiaApiKey,
        }),
        visible: initialTheme === "light",
        title: "Stadia Alidade Smooth",
        dark: false,
      });

    const osmDark = new TileLayer({
      source: new OSM(),
      fallback: !!settings.stadiaApiKey,
      visible: !settings.stadiaApiKey && initialTheme === "dark",
      dark: true,
    });
    osmDark.on("prerender", (evt) => {
      if (evt.context) {
        evt.context.filter = "grayscale(80%) invert(100%) hue-rotate(200deg)";
        evt.context.globalCompositeOperation = "source-over";
      }
    });
    osmDark.on("postrender", (evt) => {
      if (evt.context) {
        evt.context.filter = "none";
      }
    });

    const osmLight = new TileLayer({
      source: new OSM(),
      fallback: !!settings.stadiaApiKey,
      visible: !settings.stadiaApiKey && initialTheme === "light",
      dark: false,
    });

    function switchToFallback() {
      setUseFallbackMap(true);
    }

    const layers = [osmDark, osmLight, stadiaDark, stadiaLight].filter(
      (x) => x,
    );
    layers
      .filter((x) => !x.get("fallback"))
      .forEach((x) => {
        x.getSource()?.on("tileloaderror", switchToFallback);
      });

    const map = new Map({
      controls: defaults({
        zoom: false,
      }),
      layers,
      target: containerRef.current,
      view: new View({
        center: [0, -30],
        zoom: 2,
      }),
    });

    setMap(map);
    return () => {
      map.setTarget(null);
      setMap(null);
    };
  }, [initialTheme, containerRef]);

  useEffect(() => {
    if (!map) {
      return;
    }
    map.getLayers().forEach((layer) => {
      const d = layer.get("dark");
      const f = layer.get("fallback") ?? false;
      if (typeof d !== "boolean") {
        return;
      }
      const v = layer.getVisible();

      if ((useFallbackMap === f && (theme === "dark") === d) !== v) {
        layer.setVisible(!v);
      }
    });
  }, [theme, map, useFallbackMap]);

  return map;
}
