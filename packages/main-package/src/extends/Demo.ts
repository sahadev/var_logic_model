import { getInstance } from "./Graph";
import { RawDefineNodeTypeEnum } from "./nodes/RawDefineNode";

const graphInstance = getInstance();

let column1Index = 0;
let column2Index = 0;
let column3Index = 0;
let column4Index = 0;

/**
 * 定义原始数据节点
 */
function defineRawNode() {
    const packageLevelNode = graphInstance.addRawNode({
        position: column1Index++,
        title: "packageLevel",
        value: 0,
    });

    const effectiveNode = graphInstance.addRawNode({
        position: column1Index++,
        title: "effective",
        value: 0,
        widgetType: RawDefineNodeTypeEnum.Boolean,
    });

    // 预计消耗算力
    const preusePointNode = graphInstance.addRawNode({
        position: column1Index++,
        title: "预计消耗算力",
        value: 300,
    });

    // 剩余算力
    const remainPointNode = graphInstance.addRawNode({
        position: column1Index++,
        title: "剩余算力",
        value: 300,
    });

    // 是否选择SDXL。这种有明确使用语义的，被定义在第二列
    const SDXLNode = graphInstance.addRawNode({
        position: column2Index++,
        title: "已选择SDXL",
        value: 0,
        widgetType: RawDefineNodeTypeEnum.Boolean,
        column: 1,
    });

    // 剩余空间
    const remainSpaceNode = graphInstance.addRawNode({
        position: column1Index++,
        title: "剩余空间",
        value: 1,
    });

    // 是否预处理完成。这种有明确使用语义的，被定义在第二列
    const preprocessedNode = graphInstance.addRawNode({
        position: column2Index++,
        title: "预处理完成",
        value: 0,
        widgetType: RawDefineNodeTypeEnum.Boolean,
        column: 1,
    });

    return {
        packageLevelNode,
        effectiveNode,
        preusePointNode,
        remainPointNode,
        SDXLNode,
        remainSpaceNode,
        preprocessedNode
    };
}

/**
 * 定义会员身份节点
 * @returns
 */
function defineVipNode() {
    const isNotVip = graphInstance.addEqualNode({
        position: column2Index++,
        title: "非会员",
        value: "input === 0 || input2",
    });

    const isFreeVip = graphInstance.addEqualNode({
        position: column2Index++,
        title: "免费版会员",
        value: "input == 1 && input2",
    });

    const isBasicVip = graphInstance.addEqualNode({
        position: column2Index++,
        title: "基础版会员",
        value: "input == 2 && input2",
    });

    const isNotProVip = graphInstance.addEqualNode({
        position: column2Index++,
        title: "非专业版会员",
        value: "input !== 3 && input2",
    });

    return {
        isNotVip,
        isFreeVip,
        isBasicVip,
        isNotProVip,
    };
}

/**
 * 定义过期节点
 */
function defineExpiredNode() {
    const isNotExpired = graphInstance.addEqualNode({
        position: column2Index++,
        title: "未过期",
        value: "input2", // e
    });

    const isExpired = graphInstance.addEqualNode({
        position: column2Index++,
        title: "已过期",
        value: "input > 0 && !input2",
    });

    return {
        isNotExpired,
        isExpired,
    };
}

/**
 * 定义算力是否充足节点
 */
function definePointNode() {
    const isPointAdequacy = graphInstance.addEqualNode({
        position: column2Index++,
        title: "算力足够",
        value: "input <= input2", // e
    });

    const isPointDeficiency = graphInstance.addEqualNode({
        position: column2Index++,
        title: "算力不足",
        value: "input > input2",
    });

    return {
        isPointAdequacy,
        isPointDeficiency
    }
}


/**
 * 定义空间是否充足节点
 */
function defineSpaceNode() {
    const isSpaceAdequacy = graphInstance.addEqualNode({
        position: column2Index++,
        title: "空间足够",
        value: "input > 0", // e
    });

    const isSpaceDeficiency = graphInstance.addEqualNode({
        position: column2Index++,
        title: "空间不足",
        value: "input <= 0",
    });

    return {
        isSpaceAdequacy,
        isSpaceDeficiency
    }
}

/**
 * 定义预处理节点
 */
function definePreprocessNode() {
    const isNotPreprocess = graphInstance.addEqualNode({
        position: column2Index++,
        title: "没有完成预处理",
        value: "!input", // e
    });

    return {
        isNotPreprocess
    }
}

/**
 * 定义末端展示节点
 */
function defineOutputNode() {
    const myBenefit = graphInstance.addOutput({
        position: column3Index++,
        title: "我的权益",
        value: "input"
    })

    const upgrade = graphInstance.addOutput({
        position: column3Index++,
        title: "升级会员",
        value: "input"
    })

    const freeTrain = graphInstance.addOutput({
        position: column3Index++,
        title: "免费训练",
        value: "input"
    })

    const startTrain = graphInstance.addOutput({
        position: column3Index++,
        title: "开始训练",
        value: "input"
    })

    const purchase = graphInstance.addOutput({
        position: column3Index++,
        title: "开通会员",
        value: "input"
    })

    const charge = graphInstance.addOutput({
        position: column3Index++,
        title: "算力充值",
        value: "input"
    })

    const clean = graphInstance.addOutput({
        position: column3Index++,
        title: "清理空间",
        value: "input"
    })

    return {
        myBenefit,
        upgrade,
        freeTrain,
        startTrain,
        purchase,
        charge,
        clean
    }
}

export function defineAndNode() {
    const upgrade1 = graphInstance.addAndNode({
        position: column4Index++,
        title: "免费版 算力不足 选择了SDXL",
    })

    return {
        upgrade1
    }
}

/**
 * 建立所有节点的联系
 */
export function relativeNode() {
    const { isNotVip, isFreeVip, isBasicVip, isNotProVip } = defineVipNode();
    const { isNotExpired, isExpired } = defineExpiredNode();
    const {
        isPointAdequacy,
        isPointDeficiency } = definePointNode();
    const {
        isSpaceAdequacy,
        isSpaceDeficiency } = defineSpaceNode();

    const { isNotPreprocess } = definePreprocessNode();

    const {
        myBenefit,
        upgrade,
        freeTrain,
        startTrain,
        purchase,
        charge,
        clean
    } = defineOutputNode();


    const { packageLevelNode, effectiveNode,
        preusePointNode,
        remainPointNode, SDXLNode, remainSpaceNode, preprocessedNode } = defineRawNode();

    const { upgrade1 } = defineAndNode();


    // 计算会员身份
    packageLevelNode.connect(0, isNotVip, 0);
    packageLevelNode.connect(0, isFreeVip, 0);
    packageLevelNode.connect(0, isBasicVip, 0);
    packageLevelNode.connect(0, isNotProVip, 0);

    //计算是否过期
    packageLevelNode.connect(0, isNotExpired, 0);
    packageLevelNode.connect(0, isExpired, 0);
    effectiveNode.connect(0, isNotExpired, 1);
    effectiveNode.connect(0, isExpired, 1);


    // 计算会员身份
    isExpired.connect(0, isNotVip, 1);
    isNotExpired.connect(0, isFreeVip, 1);
    isNotExpired.connect(0, isBasicVip, 1);
    isNotExpired.connect(0, isNotProVip, 1);

    // 算力足够
    preusePointNode.connect(0, isPointAdequacy, 0);
    remainPointNode.connect(0, isPointAdequacy, 1);

    // 算力不足
    preusePointNode.connect(0, isPointDeficiency, 0);
    remainPointNode.connect(0, isPointDeficiency, 1);

    // 算力足够
    remainSpaceNode.connect(0, isSpaceAdequacy, 0);

    // 算力不足
    remainSpaceNode.connect(0, isSpaceDeficiency, 0);

    // 预处理
    preprocessedNode.connect(0, isNotPreprocess, 0);

    // 已过期到我的权益
    // isExpired.connect(0, myBenefit, 0);

    // 免费版 算力不足 选择了SDXL 升级会员 
    isFreeVip.connect(0, upgrade1, 0);
    isPointDeficiency.connect(0, upgrade1, 1);
    SDXLNode.connect(0, upgrade1, 2);

    upgrade1.connect(0, myBenefit);
}