import { useReducer, useState } from "react";
import Cube1 from "./components/Cube1";
import Cube2 from "./components/Cube2";
import Cube3 from "./components/Cube3";
import { useRenderCount } from "./hooks/useRenderCount";
import { AppContext, AppContextProvider } from "./context/AppObservableContext";
import Cube4 from "./components/Cube4";
import { Middleware } from "@ivbrajkovic/flat-state/types/class/Observable";

const chromeExtensionMiddleware: Middleware<AppContext> = {
  afterChange: (key, newValue) => {
    window.postMessage(
      { type: "OBSERVABLE_UPDATE", payload: { key, newValue } },
      "*",
    );
  },
};

function App() {
  const renderCount = useRenderCount("App");
  const [render, setRender] = useState(0);
  const [showCube1, toggleCube1] = useReducer((s) => !s, true);
  const [showCube2, toggleCube2] = useReducer((s) => !s, true);
  const [showCube3, toggleCube3] = useReducer((s) => !s, true);
  return (
    <AppContextProvider
      initial={{ name: "React", count: 0 }}
      middlewares={[chromeExtensionMiddleware]}
    >
      <h1>React Render Count {renderCount}</h1>
      <button onClick={() => setRender(render ^ 1)}>Render</button> cube 1
      <br />
      <br />
      <div style={{ display: "flex", gap: 16 }}>
        <button onClick={toggleCube1}>
          {showCube1 ? "hide cube 1" : "show cube 1"}
        </button>
        <button onClick={toggleCube2}>
          {showCube2 ? "hide cube 2" : "show cube 2"}
        </button>
        <button onClick={toggleCube3}>
          {showCube3 ? "hide cube 3" : "show cube 3"}
        </button>
      </div>
      <br />
      <div className="cube-container">
        {showCube1 ? <Cube1></Cube1> : null}
        {showCube2 ? <Cube2></Cube2> : null}
        {showCube3 ? <Cube3></Cube3> : null}
        <Cube4></Cube4>
      </div>
    </AppContextProvider>
  );
}

export default App;
