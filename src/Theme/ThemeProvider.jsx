import { useCallback, useEffect, useState } from "react";
import { SetThemeContext } from "./SetThemeContext.jsx";
import { ThemeContext } from "./ThemeContext.jsx";
import { useMediaQuery } from "../util/useMediaQuery.jsx";

export function ThemeProvider({ children }) {
  const prefersLight = useMediaQuery("(prefers-color-scheme: light)");
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [override, setOverrideInternal] = useState(() =>
    localStorage.getItem("theme-override"),
  );
  const setOverride = useCallback(
    (valueOrCallback) => {
      setOverrideInternal((prev) => {
        const nv =
          typeof valueOrCallback === "function"
            ? valueOrCallback(prev)
            : valueOrCallback;
        if (
          !nv ||
          (nv === "light" && prefersLight) ||
          (nv === "dark" && prefersDark)
        ) {
          localStorage.removeItem("theme-override");
        } else if (nv) {
          localStorage.setItem("theme-override", nv);
        }
        return nv;
      });
    },
    [prefersDark, prefersLight],
  );

  const theme =
    override ?? (prefersDark ? "dark" : prefersLight ? "light" : "dark");
  
  useEffect(() => {
    setOverride((v) => (v === "light" && prefersLight ? null : v));
  }, [prefersLight, setOverride]);
  useEffect(() => {
    setOverride((v) => (v === "dark" && prefersDark ? null : v));
  }, [prefersDark, setOverride]);

  useEffect(() => {
    if (
      theme === "light" &&
      !document.documentElement.classList.contains("light")
    ) {
      document.documentElement.classList.add("light");
    }
    if (
      theme === "dark" &&
      document.documentElement.classList.contains("light")
    ) {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  return (
    <ThemeContext value={theme}>
      <SetThemeContext value={setOverride}>{children}</SetThemeContext>
    </ThemeContext>
  );
}
