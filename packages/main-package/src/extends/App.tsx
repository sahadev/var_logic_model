// eslint-disable
// @ts-ignore
import React from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./App.css";
import { ModifyModal, Serialize } from "../components/index";
import { relativeNode } from "./Demo";

// relativeNode();

function App() {

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
