// https://stylelint.io/user-guide/get-started
// http://stylelint.cn/user-guide/rules/
module.exports = {
  defaultSeverity: 'error',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    indentation: 2,
    // 不要使用已被 autoprefixer 支持的浏览器前缀
    'media-feature-name-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'comment-empty-line-before': null,
    'function-name-case': [
      'lower',
      {
        ignoreFunctions: ['/colorPalette/'],
      },
    ],
    'no-invalid-double-slash-comments': null,
    'no-descending-specificity': null,
    'declaration-empty-line-before': null,
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['upx', 'rpx'],
      },
    ],
    // SASS
    // All @includes after properties
    // Nested selectors after properties

    // Variables dash-dashed
    // This regexp matches:
    // $button-text-background-color--hover-hola
    // regex under construction
    // 'scss/dollar-variable-pattern': '\b[a-z]+(?:-)+(\b[a-z]+(?:-))*',

    // forbid extend
    'at-rule-blacklist': ['extend'],

    // Nesting depth
    'max-nesting-depth': 3,

    /* ==========================================================================
      Best practices
       ========================================================================== */
    // Specificity
    // https://gist.github.com/angelzou/dbd70b78242043f4d479f2a15fc0b341
    // To learn more about this:
    // http://csswizardry.com/2014/07/hacks-for-dealing-with-specificity/
    // "id,class,type",
    // selector-max-specificity
    'declaration-no-important': true,
    'selector-max-compound-selectors': 3,
    'selector-no-qualifying-type': true,

    // Selectors
    'no-duplicate-selectors': true,

    // Blocks
    'block-no-empty': true,
    // 每个样式规则前后都有空行，除了第一条规则与规则前有注释
    'at-rule-empty-line-before': null,
    // More styling rules for more consistency
    'at-rule-name-case': 'lower',

    // Colors
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,

    // strings
    'string-quotes': 'single',
    'selector-pseudo-element-colon-notation': 'single',

    // Values
    // Disallow vendor prefix, they are added by autoprefixer
    'value-no-vendor-prefix': true,
    'value-list-comma-space-after': 'always-single-line',

    // Disallows margin: 1px 1px 1px 1px;
    'shorthand-property-no-redundant-values': true,

    'function-comma-space-before': 'never',

    // Numbers
    // 属性值 0 后面不加单位
    'length-zero-no-unit': true,
    'number-no-trailing-zeros': true,

    // 每个属性声明末尾都要加分号
    'declaration-block-trailing-semicolon': 'always',

    // Declaration blocks
    'declaration-block-no-duplicate-properties': true,

    // Prevents adding unnecesary Specificity or complicated sass stuff
    'scss/selector-no-redundant-nesting-selector': true,

    // 空格
    // 注释 "/*" 后和 "*/" 前必须有空格
    'comment-whitespace-inside': 'always',
    // 属性名 ":" 后必须有空格
    'declaration-colon-space-after': 'always',
    // 属性名 ":" 前不能有空格
    'declaration-colon-space-before': 'never',
    // 声明属性末尾 ";" 前不能有空格
    'declaration-block-semicolon-space-before': 'never',
    // 属性值中的 "," 后必须有空格
    'function-comma-space-after': 'always',
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
  },
};
