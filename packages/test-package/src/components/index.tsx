import { useBearStore } from "src/store";

export const Test = () => {
  const { bears } = useBearStore();

  return <div>bears: {bears}</div>;
};
