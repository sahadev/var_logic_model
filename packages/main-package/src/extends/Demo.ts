import { getInstance } from "./Graph";
import { RawDefineNodeTypeEnum } from "./nodes/RawDefineNode";

const graphInstance = getInstance();

let column1Index = 0;
let column2Index = 0;
let column3Index = 0;
let column4Index = 0;
let column5Index = 0;

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
        preprocessedNode,
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

    const isNotFreeVip = graphInstance.addEqualNode({
        position: column2Index++,
        title: "非免费版会员",
        value: "input !== 1 && input2",
    });

    return {
        isNotVip,
        isFreeVip,
        isBasicVip,
        isNotProVip,
        isNotFreeVip,
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
        isPointDeficiency,
    };
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
        isSpaceDeficiency,
    };
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
        isNotPreprocess,
    };
}

/**
 * 定义终端展示节点
 */
function defineOutputNode() {
    const myBenefit = graphInstance.addOutput({
        position: column5Index++,
        title: "我的权益",
        value: "input",
    });

    const upgrade = graphInstance.addOutput({
        position: column5Index++,
        title: "升级会员",
        value: "input",
    });

    const freeTrain = graphInstance.addOutput({
        position: column5Index++,
        title: "免费训练",
        value: "input",
    });

    const freeTrainDisabled = graphInstance.addOutput({
        position: column5Index++,
        title: "免费训练置灰",
        value: "input",
    });

    const startTrain = graphInstance.addOutput({
        position: column5Index++,
        title: "开始训练",
        value: "input",
    });

    const startTrainDisabled = graphInstance.addOutput({
        position: column5Index++,
        title: "开始训练置灰",
        value: "input",
    });

    const purchase = graphInstance.addOutput({
        position: column5Index++,
        title: "开通会员",
        value: "input",
    });

    const charge = graphInstance.addOutput({
        position: column5Index++,
        title: "算力充值",
        value: "input",
    });

    const clean = graphInstance.addOutput({
        position: column5Index++,
        title: "清理空间",
        value: "input",
    });

    return {
        myBenefit,
        upgrade,
        freeTrain,
        freeTrainDisabled,
        startTrain,
        startTrainDisabled,
        purchase,
        charge,
        clean,
    };
}

export function defineAndNode() {
    const and1 = graphInstance.addAndNode({
        position: column3Index++,
        title: "非免费版 && 已过期",
    });

    const and2 = graphInstance.addAndNode({
        position: column3Index++,
        title: "基础版 && 算力不足 && 选择了SDXL",
    });

    const and3 = graphInstance.addAndNode({
        position: column3Index++,
        title: "基础版 && 算力不足 && 选择了SDXL",
    });

    const and4 = graphInstance.addAndNode({
        position: column3Index++,
        title: "免费版 && 算力充足 && 空间充足",
    });

    const and5 = graphInstance.addAndNode({
        position: column3Index++,
        title: "基础版 && 算力足够 && 空间不足",
    });

    const and6 = graphInstance.addAndNode({
        position: column3Index++,
        title: "基础版 && 算力足够 && 空间充足",
    });

    const and7 = graphInstance.addAndNode({
        position: column3Index++,
        title: "免费版 && 算力不足 && 空间不足 && 选择了SDXL",
    });

    const and8 = graphInstance.addAndNode({
        position: column3Index++,
        title: "基础版 && 算力不足 && 空间不足",
    });

    const and9 = graphInstance.addAndNode({
        position: column3Index++,
        title: "未完成预处理 && 算力足够 && 空间不足",
    });

    const and10 = graphInstance.addAndNode({
        position: column3Index++,
        title: "已完成预处理 && 非专业版 && 算力足够 && 空间足够",
    });

    return {
        and1,
        and2,
        and3,
        and4,
        and5,
        and6,
        and7,
        and8,
        and9,
        and10,
    };
}

export function defineOrNode() {
    const upgradeHub = graphInstance.addOrNode({
        position: column4Index++,
        title: "展示升级会员",
    });

    const startTrainHub = graphInstance.addOrNode({
        position: column4Index++,
        title: "展示开始训练（蓝）",
    });

    const startTrainDisableHub = graphInstance.addOrNode({
        position: column4Index++,
        title: "展示开始训练（灰）",
    });

    const or11 = graphInstance.addOrNode({
        position: column4Index++,
        title: "and1 || and2 || and3 || and4 || and5",
    });

    const or12 = graphInstance.addOrNode({
        position: column4Index++,
        title: "非会员 || and6",
    });

    const or13 = graphInstance.addOrNode({
        position: column4Index++,
        title: "and11 || and12",
    });

    return {
        upgradeHub,
        startTrainHub,
        startTrainDisableHub,
        or11,
        or12,
        or13
    };
}

/**
 * 定义取反节点
 */
export function defineNotNode() {
    const otherCase = graphInstance.addEqualNode({
        column: 4,
        position: column4Index++,
        title: "其余情况",
        value: "!input", // e
    });

    return {
        otherCase
    }
}

/**
 * 建立所有节点的联系
 */
export function relativeNode() {

    const {
        packageLevelNode,
        effectiveNode,
        preusePointNode,
        remainPointNode,
        SDXLNode,
        remainSpaceNode,
        preprocessedNode,
    } = defineRawNode();

    const {
        myBenefit,
        upgrade,
        freeTrain,
        freeTrainDisabled,
        startTrain,
        startTrainDisabled,
        purchase,
        charge,
        clean,
    } = defineOutputNode();

    const { isNotVip, isFreeVip, isBasicVip, isNotProVip, isNotFreeVip } =
        defineVipNode();
    const { isNotExpired, isExpired } = defineExpiredNode();
    const { isPointAdequacy, isPointDeficiency } = definePointNode();
    const { isSpaceAdequacy, isSpaceDeficiency } = defineSpaceNode();

    const { isNotPreprocess } = definePreprocessNode();

    const {
        and1,
        and2,
        and3,
        and4,
        and5,
        and6,
        and7,
        and8,
        and9,
        and10,
    } = defineAndNode();
    const { upgradeHub, startTrainHub, startTrainDisableHub, or11, or12, or13 } = defineOrNode();

    const { otherCase } = defineNotNode();

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

    // ========== 链接And节点 =======================================================

    // 非免费版 && 已过期到我的权益
    isNotFreeVip.connect(0, and1);
    isExpired.connect(0, and1, 1);

    // 基础版 && 算力不足 && 选择了SDXL
    isBasicVip.connect(0, and2, 0);
    isPointDeficiency.connect(0, and2, 1);
    SDXLNode.connect(0, and2, 2);

    // 免费版 && 算力充足 && 空间充足
    isFreeVip.connect(0, and3);
    isPointAdequacy.connect(0, and3, 1);
    isSpaceAdequacy.connect(0, and3, 2);

    // 基础版 && 算力足够 && 空间不足
    isBasicVip.connect(0, and4);
    isPointAdequacy.connect(0, and4, 1);
    isSpaceDeficiency.connect(0, and4, 2);

    // 基础版 && 算力足够 && 空间充足
    isBasicVip.connect(0, and5);
    isPointAdequacy.connect(0, and5, 1);
    isSpaceAdequacy.connect(0, and5, 2);

    // 免费版 && 算力不足 && 空间不足 && 选择了SDXL
    isFreeVip.connect(0, and6, 0);
    isPointDeficiency.connect(0, and6, 1);
    isSpaceDeficiency.connect(0, and6, 2);
    SDXLNode.connect(0, and6, 3);

    // 基础版 && 算力不足 && 空间不足
    isBasicVip.connect(0, and7, 0);
    isPointDeficiency.connect(0, and7, 1);
    isSpaceDeficiency.connect(0, and7, 2);

    // 未完成预处理 && 算力足够 && 空间不足
    isNotPreprocess.connect(0, and8, 0);
    isPointAdequacy.connect(0, and8, 1);
    isSpaceDeficiency.connect(0, and8, 2);

    // 未完成预处理 && 算力足够 && 空间不足
    isNotPreprocess.connect(0, and9, 0);
    isPointAdequacy.connect(0, and9, 1);
    isSpaceDeficiency.connect(0, and9, 2);

    // 已完成预处理 && 非专业版 && 算力足够 && 空间足够
    preprocessedNode.connect(0, and10, 0);
    isNotProVip.connect(0, and10, 1);
    isPointAdequacy.connect(0, and10, 2);
    isSpaceAdequacy.connect(0, and10, 3);

    // 其余情况
    and1.connect(0, or11, 0);
    and2.connect(0, or11, 1);
    and3.connect(0, or11, 2);
    and4.connect(0, or11, 3);
    and5.connect(0, or11, 4);

    isNotVip.connect(0, or12, 0);
    and6.connect(0, or12, 1);

    or11.connect(0, or13, 0);
    or12.connect(0, or13, 1);

    // ========== 链接Or节点 =======================================================

    // 接入升级会员或
    and2.connect(0, upgradeHub);
    and6.connect(0, upgradeHub, 1);
    and7.connect(0, upgradeHub, 2);

    // 接入开始训练或
    and5.connect(0, startTrainHub);
    and10.connect(0, startTrainHub, 1);

    // 接入开始训练灰或
    and4.connect(0, startTrainDisableHub);
    and9.connect(0, startTrainDisableHub, 1);

    // ========== 取反节点节点 =======================================================
    or13.connect(0, otherCase);

    // ========== 直连终端节点 =======================================================

    // 聚合结果控制升级会员
    upgradeHub.connect(0, upgrade);
    startTrainHub.connect(0, startTrain);
    startTrainDisableHub.connect(0, startTrainDisabled);
    and1.connect(0, myBenefit);
    and4.connect(0, clean);
    and8.connect(0, freeTrainDisabled);
    and3.connect(0, freeTrain);
    isNotVip.connect(0, purchase);
    otherCase.connect(0, charge);
}
