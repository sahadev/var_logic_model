import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Input } from "@mantine/core";
import { useBearStore } from "src/store";
import { useCallback, useEffect, useState } from "react";

export function ModifyModal() {
  const { currentEditEntity } = useBearStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [inputStr, setInputStr] = useState("");

  useEffect(() => {
    if (currentEditEntity) {
      setInputStr(currentEditEntity.value);
      open();
    }
  }, [currentEditEntity]);

  const btnClick = useCallback(() => {
    if (currentEditEntity) {
      currentEditEntity.onCallback(inputStr);
      close();
    }
  }, [inputStr, currentEditEntity]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`修改: ${currentEditEntity?.title}`}
        centered
      >
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Input component"
            value={inputStr}
            onChange={(event) => setInputStr(event.currentTarget.value)}
            className="flex-grow"
          />
          <Button variant="filled" onClick={btnClick}>
            保存
          </Button>
        </div>

        <div className="mt-2 text-[12px]">
          如果是修改表达式，则使用"input"代替上一个节点传入的变量。例：input ==
          1，就代表如果如果输入节点等于1，则此节点输出一个true的值。

          <br />
          如果有多个输入变量，则依次使用input+序号的的方式输入。例如input2/input3.
          <br />
          常见符号：等于 ==，大于 {">"}，小于 {"<"}
        </div>
      </Modal>
    </>
  );
}
