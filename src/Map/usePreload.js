import { useCallback, useEffect, useState } from "react";
import { useSlowMode } from "../Slow/useSlowMode.js";

export function usePreload() {
  const slow = useSlowMode();
  const [preloadedImages, setPreloadedImages] = useState({});
  useEffect(() => {
    const keys = Object.keys(preloadedImages);
    for (const k of keys) {
      if (preloadedImages[k] === 0) {
        const img = document.createElement("img");
        img.style.display = "none";
        img.src = k;
        img.onload = function () {
          document.body.removeChild(img);
          setPreloadedImages((v) => ({ ...v, [k]: 2 }));
        };
        document.body.appendChild(img);
        setPreloadedImages((v) => ({ ...v, [k]: 1 }));
      }
    }
    return () => {};
  }, [preloadedImages, slow]);
  return useCallback(
    function (url) {
      if (slow || !url) {
        return;
      }
      setPreloadedImages((v) => {
        if (Object.hasOwn(v, url)) {
          return v;
        }
        return { ...v, [url]: 0 };
      });
    },
    [slow],
  );
}
