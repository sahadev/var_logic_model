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
      </Modal>
    </>
  );
}
