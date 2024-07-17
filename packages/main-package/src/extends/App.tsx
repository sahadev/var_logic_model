// eslint-disable
// @ts-ignore
import React, { useCallback } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./App.css";
import { getInstance } from "./Graph";
import { ModifyModal, Serialize } from "../components/index";
import { RawDefineNodeTypeEnum } from "./nodes/RawDefineNode";
const graphInstance = getInstance();

const packageLevelNode = graphInstance.addRawNode({
  position: 0,
  title: "packageLevel",
  value: 0,
});

const effectiveNode = graphInstance.addRawNode({
  position: 1,
  title: "effective",
  value: 0,
  widgetType: RawDefineNodeTypeEnum.Boolean
});

const isNotVip = graphInstance.addEqualNode({
  position: 0,
  title: "非会员",
  value: "input === 0",
});

const isFreeVip = graphInstance.addEqualNode({
  position: 1,
  title: "免费版会员",
  value: "input == 1",
});

const isBasicVip = graphInstance.addEqualNode({
  position: 2,
  title: "基础版会员",
  value: "input == 2",
});

const isProVip = graphInstance.addEqualNode({
  position: 3,
  title: "专业版会员",
  value: "input == 3",
});

packageLevelNode.connect(0, isNotVip, 0);
packageLevelNode.connect(0, isFreeVip, 0);
packageLevelNode.connect(0, isBasicVip, 0);
packageLevelNode.connect(0, isProVip, 0);

effectiveNode.connect(0, isNotVip, 1);
effectiveNode.connect(0, isFreeVip, 1);
effectiveNode.connect(0, isBasicVip, 1);
effectiveNode.connect(0, isProVip, 1);

function App() {
  const requestSerlize = useCallback(() => {}, []);

  return (
    <div className="App">
      <MantineProvider>
        <header className="App-header"></header>
        <ModifyModal />
        <Serialize />
      </MantineProvider>
    </div>
  );
}

export default App;
