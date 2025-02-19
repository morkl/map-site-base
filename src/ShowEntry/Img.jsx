import { useCallback, useState } from "react";
import { Loading } from "../Loading/Loading.jsx";
import styles from "./Img.module.scss";
import { useSlowMode } from "../Slow/useSlowMode.js";

export function Img({ src, full, openLightbox }) {
  const slow = useSlowMode();
  const [state, setState] = useState(0);
  const load = useCallback(
    function () {
      if (slow) {
        setTimeout(function () {
          setState(1);
        }, 3000);
      } else {
        setState(1);
      }
    },
    [slow],
  );
  const error = useCallback(
    function () {
      if (slow) {
        setTimeout(function () {
          setState(2);
        }, 3000);
      } else {
        setState(2);
      }
    },
    [slow],
  );
  return (
    <div
      className={[styles.container, state === 1 && styles.loaded]
        .filter((x) => x)
        .join(" ")}
    >
      <div
        className={
          state === 0
            ? [styles.loadingPlaceholder, styles.fade, styles.fadeIn].join(" ")
            : [styles.loadingPlaceholder, styles.fade, styles.fadeOut].join(" ")
        }
      >
        <Loading loading={state === 0} />
      </div>
      <div
        className={
          state === 2
            ? [styles.fail, styles.fade, styles.fadeIn].join(" ")
            : [styles.fail, styles.fade, styles.fadeOut].join(" ")
        }
      >
        <div>
          <p>Could not load image :(</p>
        </div>
      </div>
      <div
        className={[styles.imgWrapper, state === 1 && styles.loaded]
          .filter((x) => x)
          .join(" ")}
      >
        <a
          style={{
            margin: 0,
            padding: 0,
          }}
          href={full}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(evt) => {
            if (!evt.ctrlKey) {
              openLightbox?.();
              evt.preventDefault();
            }
          }}
        >
          <img
            onLoad={load}
            onError={error}
            src={src}
            className={
              state === 1
                ? [styles.img, styles.fade, styles.fadeIn].join(" ")
                : [styles.img, styles.fade, styles.fadeOut].join(" ")
            }
          />
        </a>
      </div>
    </div>
  );
}
