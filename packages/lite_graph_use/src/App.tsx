// eslint-disable
// @ts-ignore
import "./App.css";
import { getInstance } from "./Graph";

const graphInstance = getInstance();

const rawNode = graphInstance.addRawNode();
rawNode.connect(0, graphInstance.addOutput(), 0);

const equalNode = graphInstance.addEqualNode(1);
rawNode.connect(0, equalNode, 0);

equalNode.connect(0, graphInstance.addOutput(1), 2);

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;
