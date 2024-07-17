import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getInstance } from "src/extends/Graph";
const graphInstance = getInstance();

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

  return (
    <div className="fixed bottom-5 right-5 flex gap-3">
      <Button
        variant="filled"
        color={opened ? "red" : ""}
        onClick={() => (opened ? closeTask() : openTask())}
      >
        {opened ? "停止" : "开始"}
      </Button>
      <Button variant="filled">Serialize</Button>
    </div>
  );
};
