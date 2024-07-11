import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Input } from "@mantine/core";
import { useBearStore } from "src/store";

export function Test() {
  const { bears } = useBearStore();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication" centered>
        <div className="flex gap-2 items-center">
          <Input placeholder="Input component" className="flex-grow" />
          <Button variant="filled">保存</Button>
        </div>
      </Modal>

      <Button onClick={open}>Open modal</Button>
    </>
  );
}
