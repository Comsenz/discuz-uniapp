/**
 * 项目中定义的常量
 * 开发|测试：.env.development
 * 正式：.env.producment
 */
export const DISCUZ_TITLE = process.env.VUE_APP_TITLE;
export const DISCUZ_REQUEST_HOST = process.env.VUE_APP_REQUEST_HOST;

/**
 * cookie 相关
 */
// 存储到 cookie 中的当前语言 key 值
export const COOKIE_CURRENT_LANGUAGE = '__discuzq_lang';
export const STORGE_GET_USER_TIME = '__discuzq_getusertime';

/**
 * 主题
 */
export const THEME_DEFAULT = 'light';
export const THEME_DARK = 'dark';

/**
 * 语言
 */
export const LANG_ZH = 'zh';
export const LANG_EN = 'en';

export const SITE_PAY = 'pay';

/**
 * 二维码地址
 */
export const CODE_ADDRESS = 'https://dq.comsenz-service.com/api/oauth/wechat/miniprogram/code';

/**
 * 头像地址
 */
export const AVATAR_ADDRESS = 'https://discuz.chat/static/images/noavatar.gif';
