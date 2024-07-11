export { ContextMenu } from "./LiteGraph/ContextMenu";
export { LGraph } from "./LiteGraph/LGraph";
export { LiteGraph } from "./LiteGraph/LiteGraph";
export { LGraphCanvas } from "./LiteGraph/LGraphCanvas";
export { DragAndScale, LGraphGroup, LGraphNode } from "./LiteGraph/Node";

import './nodes/base';

(function () {
    if (typeof window != "undefined" && !window["requestAnimationFrame"]) {
        window.requestAnimationFrame =
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }
})();



