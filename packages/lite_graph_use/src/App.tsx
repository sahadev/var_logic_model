// eslint-disable
// @ts-ignore
import "./App.css";
import { getInstance } from "./Graph";

const graphInstance = getInstance();
graphInstance.addRawNode().connect(0, graphInstance.addOutput(), 0);

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;
