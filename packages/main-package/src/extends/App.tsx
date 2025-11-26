// eslint-disable
// @ts-ignore
import React from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";
import { ModifyModal, Serialize, DataRecordList } from "../components/index";
import { Notifications } from "@mantine/notifications";

function App() {
  return (
    <div className="App">
      <MantineProvider>
        <header className="App-header"></header>
        <Notifications position="top-center" autoClose={1500} />
        <DataRecordList />
        <ModifyModal />
        <Serialize />
      </MantineProvider>
    </div>
  );
}

export default App;
