/**
 * 是否为微信浏览器
 * @return true为微信浏览器
 */
export const isWeiXinBrowser = () => {
  // window.navigator.userAgent中包含浏览器类型、版本、操作系统类型、浏览器引擎类型等信息
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) === 'micromessenger') {
    return true;
  }
  return false;
};
