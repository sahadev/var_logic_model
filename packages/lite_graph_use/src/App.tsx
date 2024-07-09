// eslint-disable
import "./App.css";
import { getInstance } from "./Graph";

const graphInstance = getInstance();
const addNode = graphInstance.addAddNode();
// const input = graphInstance.addInput();
// const output = graphInstance.addOutput();

// input.connect(0, addNode, 0);
// input.connect(0, addNode, 1);
// addNode.connect(0, output, 0);

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;
