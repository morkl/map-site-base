import { useEffect, useState } from "react";

const queries = {};
export function useMediaQuery(query) {
  if (!queries[query]) {
    queries[query] = window.matchMedia(query);
  }
  const q = queries[query];
  const [matches, setMatches] = useState(q.matches);
  useEffect(() => {
    function onChange(evt) {
      setMatches(evt.matches);
    }

    q.addEventListener("change", onChange);
    return () => {
      q.removeEventListener("change", onChange);
    };
  }, [q]);
  return matches;
}
