// 外部输入变量
const accountLevel = 0; // 示例值，0: 非会员, 1: 基础会员, 2: 专业会员
const expectedConsumePower = 9; // 示例值
const remainingPower = 10; // 示例值
const isPreprocessed = false; // 示例值
const currentSelectedModalId = 1; // 示例值

// 受控语义变量，按钮文案相关
const subscribe_member_txt = accountLevel === 0 && !(currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower < expectedConsumePower;
const upgrade_member_txt = accountLevel === 1 && !(currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower < expectedConsumePower;
const start_training_txt = (accountLevel === 1 || accountLevel === 2) && (currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower >= expectedConsumePower && !isPreprocessed || (accountLevel === 1 || accountLevel === 2) && (currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower >= expectedConsumePower && isPreprocessed;
const recharge_power_txt = accountLevel === 2 && remainingPower < expectedConsumePower;

// 受控语义变量，按钮颜色相关
const gray_color = (accountLevel === 1 || accountLevel === 2) && (currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower >= expectedConsumePower && !isPreprocessed;
const gold_color = (accountLevel === 0 && !(currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower < expectedConsumePower) || (accountLevel === 1 && !(currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower < expectedConsumePower) || (accountLevel === 2 && remainingPower < expectedConsumePower);
const blue_color = (accountLevel === 1 || accountLevel === 2) && (currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower >= expectedConsumePower && isPreprocessed;

// 受控语义变量，按钮状态相关
const disable = (accountLevel === 1 || accountLevel === 2) && (currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower >= expectedConsumePower && !isPreprocessed;
const clickable = (accountLevel === 0 && !(currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower < expectedConsumePower) || (accountLevel === 1 && !(currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower < expectedConsumePower) || (accountLevel === 1 || accountLevel === 2) && (currentSelectedModalId !== 18 || accountLevel === 2) && remainingPower >= expectedConsumePower && isPreprocessed || (accountLevel === 2 && remainingPower < expectedConsumePower);

// 受控语义变量，提示相关
const show_power_insufficient_prompt = remainingPower < expectedConsumePower;
const show_sdxl_permission_prompt = currentSelectedModalId === 18 && accountLevel !== 2;