import {useContext} from "react";
import {SlowModeContext} from "./SlowModeContext.jsx";

export function useSlowMode() {
    return useContext(SlowModeContext);
}