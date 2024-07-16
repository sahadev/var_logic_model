// eslint-disable
// @ts-ignore
import React, { useCallback } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./App.css";
import { getInstance } from "./Graph";
import { ModifyModal, Serialize } from "../components/index";
const graphInstance = getInstance();

const packageLevelNode = graphInstance.addRawNode({
  position: 0,
  title: "packageLevel",
  value: 0,
});

packageLevelNode.connect(
  0,
  graphInstance.addOutput({
    position: 0,
    title: "观察packageLevel",
  }),
  0
);

const isVip = graphInstance.addEqualNode({
  position: 1,
  title: "非会员",
  value: "input === 0",
});

const isBasicVip = graphInstance.addEqualNode({
  position: 2,
  title: "基础版会员",
  value: "input == 1",
});
const isProVip = graphInstance.addEqualNode({
  position: 3,
  title: "专业版会员",
  value: "input == 2",
});

packageLevelNode.connect(0, isVip, 0);
packageLevelNode.connect(0, isBasicVip, 0);
packageLevelNode.connect(0, isProVip, 0);

isVip.connect(
  0,
  graphInstance.addOutput({
    position: 1,
    title: "观察非会员",
  }),
  2
);
isBasicVip.connect(
  0,
  graphInstance.addOutput({
    position: 2,
    title: "观察基础版会员",
  }),
  2
);
isProVip.connect(
  0,
  graphInstance.addOutput({
    position: 3,
    title: "观察专业版会员",
  }),
  2
);

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
