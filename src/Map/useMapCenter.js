import { useEffect, useState } from "react";

export function useMapCenter(map) {
  const [center, setCenter] = useState(null);
  useEffect(() => {
    if (!map) {
      return;
    }
    const v = map.getView();
    function c() {
      setCenter(v.getCenter());
    }
    setCenter(v.getCenter());
    v.on("change:center", c);
    return () => v.un("change:center", c);
  }, [map]);
  return center;
}
