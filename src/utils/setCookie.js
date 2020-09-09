/**
 * 存cookie
 *
 * example:
 * setCookie()
 */
export const setCookie = (name, value, day) => {
  const date = new Date();
  date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toGMTString()}`;
  document.cookie = `${name}=${value};${expires}`;
};
