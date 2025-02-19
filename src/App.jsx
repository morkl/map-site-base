import "./App.scss";
import { MainMapView } from "./Map/MainMapView.jsx";
import { SlowModeProvider } from "./Slow/SlowModeProvider.jsx";
import { ThemeProvider } from "./Theme/ThemeProvider.jsx";

function App() {
  return (
    <SlowModeProvider>
      <ThemeProvider>
        <MainMapView />
      </ThemeProvider>
    </SlowModeProvider>
  );
}

export default App;
