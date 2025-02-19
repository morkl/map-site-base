import { useState } from "react";
import { SlowModeContext } from "./SlowModeContext.jsx";
import { SetSlowModeContext } from "./SetSlowModeContext.jsx";

export function SlowModeProvider({ children }) {
  const [slow, setSlow] = useState(false);
  return (
    <SetSlowModeContext value={setSlow}>
      <SlowModeContext value={slow}>{children}</SlowModeContext>
    </SetSlowModeContext>
  );
}
