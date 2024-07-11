const { override } = require('customize-cra');

module.exports = override(
    // 禁用 ESLint
    function (config) {
        config.module.rules = config.module.rules.filter(
            rule => !Array.isArray(rule.use) || rule.use[0].loader !== 'eslint-loader'
        );
        return config;
    }
);