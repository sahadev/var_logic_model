// eslint-disable
// @ts-ignore
import React, { useState } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";
import { ModifyModal, Serialize, DataRecordList, PerformanceTest } from "../components/index";
import { Notifications } from "@mantine/notifications";

function App() {

  const [isPerformanceTest, setIsPerformanceTest] = useState(false);

  return (
    <div className="App">
      <MantineProvider>
        <header className="App-header"></header>
        <Notifications position="top-center" autoClose={1500} />
        {isPerformanceTest && <PerformanceTest />}
        <DataRecordList />
        <ModifyModal />
        <Serialize />
      </MantineProvider>

      <div className="absolute bottom-1 left-1 cursor-pointer" onClick={() => setIsPerformanceTest(!isPerformanceTest)}>{isPerformanceTest ? "停止性能测试" : "启动性能测试"}</div>
    </div>
  );
}

export default App;
