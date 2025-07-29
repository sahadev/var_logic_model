// 外部输入变量
const accountLevel = 0; // 示例值，0: 非会员, 2: 基础会员, 3: 专业会员
const expectedConsumePower = 9; // 示例值
const remainingPower = 10; // 示例值
const isPreprocessed = false; // 示例值
const currentSelectedModalId = 1; // 示例值

// 原子语义变量，用户会员身份
const is_non_member = accountLevel === 0;
const is_basic_member = accountLevel === 1;
const is_pro_member = accountLevel === 2;
const is_basic_or_pro_member = is_basic_member || is_pro_member;
const is_not_pro_member = !is_pro_member;

//原子语义变量， 训练配置相关
const is_config_not_completed = !isPreprocessed;
const is_config_completed = isPreprocessed;

// 原子语义变量，算力配置相关
const is_power_enough = remainingPower >= expectedConsumePower;
const is_power_not_enough = remainingPower < expectedConsumePower;

// 原子语义变量，SDXL配置相关
const is_sdxl_selected = currentSelectedModalId === 18;

// 原子语义变量，衍生相关
const is_not_meet_sdxl_condition = is_sdxl_selected && is_not_pro_member;
const is_meet_sdxl_condition = !is_not_meet_sdxl_condition;
const is_meet_train_condition = is_meet_sdxl_condition && is_power_enough;
const is_not_meet_train_condition = !is_meet_train_condition;

// 与语义变量
const is_non_member_unqualified = is_non_member && is_not_meet_train_condition;
const is_basic_member_unqualified = is_basic_member && is_not_meet_train_condition;
const is_basic_or_pro_meet_train_config_pending = is_basic_or_pro_member && is_meet_train_condition && is_config_not_completed;
const is_basic_or_pro_meet_train_config_ready = is_basic_or_pro_member && is_meet_train_condition && is_config_completed;
const is_pro_member_power_insufficient = is_pro_member && is_power_not_enough;

// 受控语义变量，按钮文案相关
const subscribe_member_txt = is_non_member_unqualified;
const upgrade_member_txt = is_basic_member_unqualified;
const start_training_txt = is_basic_or_pro_meet_train_config_pending || is_basic_or_pro_meet_train_config_ready;
const recharge_power_txt = is_pro_member_power_insufficient;

// 受控语义变量，按钮颜色相关
const gray_color = is_basic_or_pro_meet_train_config_pending;
const gold_color = is_non_member_unqualified || is_basic_member_unqualified || is_pro_member_power_insufficient;
const blue_color = is_basic_or_pro_meet_train_config_ready;

// 受控语义变量，按钮状态相关
const disable = is_basic_or_pro_meet_train_config_pending;
const clickable = is_non_member_unqualified || is_basic_member_unqualified || is_basic_or_pro_meet_train_config_ready || is_pro_member_power_insufficient;

// 受控语义变量，提示相关
const show_power_insufficient_prompt = is_power_not_enough;
const show_sdxl_permission_prompt = is_not_meet_sdxl_condition;
