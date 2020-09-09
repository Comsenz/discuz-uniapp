/**
 * 存cookie
 * @param name 名字
 * @param value 对应的值
 * @param day 过期天数
 *
 * example:
 * setCookie(name, value, day)
 * 清除cookie：将day设置为-1
 */
export const setCookie = (name, value, day) => {
  const date = new Date();
  date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toGMTString()}`;
  document.cookie = `${name}=${value};${expires}`;
};
