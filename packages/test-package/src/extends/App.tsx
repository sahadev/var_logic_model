// eslint-disable
// @ts-ignore
import React from "react";
import "./App.css";
import { getInstance } from "./Graph";
const graphInstance = getInstance();

const rawNode = graphInstance.addRawNode();
rawNode.connect(0, graphInstance.addOutput(), 0);

// const isVip = graphInstance.addEqualNode(1, "是否会员");
// const isBasicVip = graphInstance.addEqualNode(
//   2,
//   "是否基础版会员",
//   "input == 1"
// );
// const isProVip = graphInstance.addEqualNode(3, "是否专业版会员", "input == 2");
// rawNode.connect(0, isVip, 0);
// rawNode.connect(0, isBasicVip, 0);
// rawNode.connect(0, isProVip, 0);

// isVip.connect(0, graphInstance.addOutput(1), 2);
// isBasicVip.connect(0, graphInstance.addOutput(2), 2);
// isProVip.connect(0, graphInstance.addOutput(3), 2);

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;
