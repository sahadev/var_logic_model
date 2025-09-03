import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback } from "react";
import { getInstance } from "src/extends/Graph";
const graphInstance = getInstance();
import { notifications } from "@mantine/notifications";

import { relativeNode } from "../extends/Demo";
const CONFIG_SAVE_KEY = "litegrapheditor_clipboard";

/**
 * 提供序列化的入口
 */
export const Serialize = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const openTask = () => {
    open();
    graphInstance.start();
  };

  const closeTask = () => {
    close();
    graphInstance.stop();
  };

  const loadConfig = useCallback(async () => {
    const localConfig = localStorage.getItem(CONFIG_SAVE_KEY);
    graphInstance.graph.configure(JSON.parse(localConfig), false);
    notifications.show({
      title: "已加载",
      message: "Loaded",
    });
  }, []);

  const save = useCallback(async () => {
    localStorage.setItem(
      CONFIG_SAVE_KEY,
      JSON.stringify(graphInstance.graph.serialize())
    );
    notifications.show({
      title: "已保存",
      message: "Saved",
    });
  }, []);

  const loadDemo = useCallback(() => {
    relativeNode();
  }, []);

  return (
    <div className="fixed bottom-5 right-5 flex gap-3">
      <Button
        variant="filled"
        color={opened ? "red" : ""}
        onClick={() => (opened ? closeTask() : openTask())}
      >
        {opened ? "停止仿真" : "开始仿真"}
      </Button>
      <Button variant="filled" onClick={save}>
        序列化保存
      </Button>
      <Button variant="filled" onClick={loadConfig}>
        加载序列化数据
      </Button>
      <Button variant="filled" onClick={loadDemo}>
        加载Demo
      </Button>
    </div>
  );
};
