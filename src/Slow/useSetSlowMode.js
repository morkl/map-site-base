import {useContext} from "react";
import {SetSlowModeContext} from "./SetSlowModeContext.jsx";

export function useSetSlowMode() {
    return useContext(SetSlowModeContext);
}