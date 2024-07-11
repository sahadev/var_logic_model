import React from "react";
import { useBearStore } from "../store";

export const Test = () => {
    const { bears } = useBearStore();
    // return <div>bears: {bears}</div>;
};

// 不能加载可能的原因是 包里面的代码都必须是编译过的，或者没有对包里的源码进行解析处理。
