import {
  faInfo,
  faMinus,
  faMoon,
  faPlus,
  faShuffle,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Intro.module.scss";
import { useOnEsc } from "../util/useOnEsc.jsx";
import { useTheme } from "../Theme/useTheme.jsx";
import { useSetTheme } from "../Theme/useSetTheme.jsx";
import { useCallback } from "react";

function GoTo({ name, goTo }) {
  return (
    <a
      href="#"
      onClick={(evt) => {
        goTo?.(name);
        evt.preventDefault();
      }}
    >
      {name}
    </a>
  );
}

export function Intro({ close, goToSpecific }) {
  const theme = useTheme();
  const setTheme = useSetTheme();
  useOnEsc(close);
  const goTo = useCallback(
    (username) => {
      close();
      goToSpecific((x) => x.name.toUpperCase() === username.toUpperCase());
    },
    [close, goToSpecific],
  );
  return (
    <div className={styles.backdrop}>
      <div className={styles.introContainer}>
        <div className={styles.intro} onClick={(evt) => evt.stopPropagation()}>
          <div className={styles.introWrapper}>
            <div>
              <div className={styles.header}>
                <h1>Hello!</h1>
                <div>
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
                  <button onClick={close}>
                    <FontAwesomeIcon icon={faXmark} title="Close" />
                  </button>
                </div>
              </div>
              <hr />
            </div>
            <div className={styles.content}>
              <p>
                This is a map thing. Entries can be linked from here:{" "}
                <GoTo name="Foo" goTo={goTo} />
              </p>
              <h2>Instructions</h2>
              <ul>
                <li>
                  Press the{" "}
                  <FontAwesomeIcon icon={faInfo} title="Information" /> button
                  to show this dialog.
                </li>
                <li>
                  Press the <FontAwesomeIcon icon={faPlus} title="Zoom in" />/
                  <FontAwesomeIcon icon={faMinus} title="Zoom out" /> buttons,
                  double-click, pinch or use the scroll wheel to zoom.
                </li>
                <li>
                  Poke an icon in the map to bring up the submission. Poke the
                  photo to show it in full size.
                </li>
                <li>
                  Press the <FontAwesomeIcon icon={faXmark} title="Close" />{" "}
                  button or the Escape key to get out of any dialog.
                </li>
                <li>
                  Press the{" "}
                  <FontAwesomeIcon icon={faShuffle} title="Random submission" />{" "}
                  button to go to a random submission.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
