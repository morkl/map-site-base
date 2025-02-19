import { useEffect, useState } from "react";
import { settings } from "../Customize/settings.js";
import { getOverrides } from "../Customize/getOverrides.js";
import { getData } from "../Customize/getData.js";

export function useData() {
  const [data, setData] = useState(null);
  const [overrides, setOverrides] = useState({});
  useEffect(() => {
    (async function () {
      const [data, overrides] = await Promise.all(
        [getData(), settings.useOverrides && getOverrides()].filter((x) => x),
      );
      setData(data);
      setOverrides(overrides);
    })();
  }, []);
  return [data, overrides, setOverrides];
}
