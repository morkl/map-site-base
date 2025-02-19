import { useEffect, useState } from "react";
import { BounceLoader, CircleLoader } from "react-spinners";

function Bounce() {
  const theme = useTheme();
  return <BounceLoader color={theme === "dark" ? "lightgrey" : "darkgrey"} />;
}
function Circle() {
  const theme = useTheme();
  return <CircleLoader color={theme === "dark" ? "lightgrey" : "darkgrey"} />;
}

import styles from "./Loading.module.scss";
import { useTheme } from "../Theme/useTheme.jsx";
export function Loading({ loading }) {
  const [spinner] = useState(() => {
    const s = [Circle, Bounce];
    const i = Math.round(Math.random() * (s.length - 1));
    const C = s[i];
    return <C />;
  });
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(function () {
      setShow(true);
    }, 50);
  }, []);

  return <div className={styles.loading}>{show && loading && spinner}</div>;
}
