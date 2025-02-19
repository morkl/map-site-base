import {useContext} from "react";
import {SetThemeContext} from "./SetThemeContext.jsx";

export function useSetTheme() {
    return useContext(SetThemeContext);
}