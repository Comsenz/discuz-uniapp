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

/**
 * 权限列表
 */
export const PERMISSION_LIST = {
  viewThreads: '查看主题列表',
  'thread.viewPosts': '查看主题',
  createThread: '发布文本',
  'thread.reply': '回复主题',
  'attachment.create.0': '上传附件',
  'attachment.create.1': '上传图片',
  'attachment.view.0': '查看附件',
  'attachment.view.1': '查看图片',
  viewUserList: '站点会员列表',
  'attachment.delete': '删除附件',
  'cash.create': '申请提现',
  'order.create': '创建订单',
  'thread.hide': '删除主题',
  'thread.hidePosts': '删除回复',
  'thread.favorite': '帖子收藏',
  'thread.likePosts': '帖子点赞',
  'user.view': '查看某个用户信息权限',
  viewSiteInfo: '站点信息',
  'user.edit': '编辑用户状态',
  'group.edit': '编辑用户组',
  createInvite: '管理-邀请加入',
  'thread.batchEdit': '批量管理主题',
  'thread.editPosts': '编辑',
  'thread.essence': '加精',
  'thread.sticky': '置顶',
  createThreadLong: '发布帖子',
  createThreadVideo: '发布视频',
  'dialog.create': '发布私信 ',
  showGroups: '显示用户组名',
  'userFollow.create': '关注用户',
  'trade.pay.order': '订单支付',
};
