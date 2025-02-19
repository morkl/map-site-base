import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { settings } from "./settings.js";
import { getUniqueId } from "./getUniqueId.js";

export function getFeatures(data, overrides) {
  return data?.map((x, i) => {
    const override = overrides?.[getUniqueId(x)];
    const f = new Feature({
      geometry: new Point([
        override?.[0] ?? x.longitude,
        override?.[1] ?? x.latitude,
      ]),
      data: {
        ...x,
        longitude: override?.[0] ?? x.longitude,
        latitude: override?.[1] ?? x.latitude,
      },
      icon: i % settings.icons.length,
    });
    return f;
  });
}
