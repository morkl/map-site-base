import { useEffect } from "react";

export function useOnEsc(callback) {
  useEffect(() => {
    function h(evt) {
      if (evt.keyCode === 27) {
        callback();
      }
    }
    window.addEventListener("keydown", h);
    return () => {
      window.removeEventListener("keydown", h);
    };
  }, [callback]);
}
