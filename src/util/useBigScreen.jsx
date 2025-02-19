import { useMediaQuery } from "./useMediaQuery.jsx";

export function useBigScreen() {
  return useMediaQuery("(min-width: 768px) and (min-height: 400px)");
}
