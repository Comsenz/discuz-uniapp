// 将 api 的请求链接统一写在这个文件中
// https://ext.dcloud.net.cn/plugin?id=392
import Request from '@/utils/request';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import { i18n } from '@/locale';

const http = new Request();
const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIiLCJqdGkiOiI0ZDY0ODg0ZmI3YmI2ZDdlNTQ3OWI1NzdmZDYyMjQyMmM1MTg4YjI2NTYzZmE0NzFlNmM4ZWI2ZjQ5Zjk3MjVjZDczMjcyNDU0NGFkZDY0NyIsImlhdCI6MTU4NzYxMDE3OSwibmJmIjoxNTg3NjEwMTc5LCJleHAiOjE1OTAyMDIxNzksInN1YiI6IjEiLCJzY29wZXMiOltudWxsXX0.e9hEqDkZYBWpwwdagQfp5d65FgvCgAVJyooyIT8AJMj9_e1SE_xS7rFblqkl8nDhoGbXH6HdGmmFThj7BTbrcjOYxSv8WcvfyW-dx-SwDTJIQMX4LmlNeZ5c5LxXWwyZmgKv9Ts3ncBgbXvnTkkZ1yOy5bvXs9OL4DL63sRh4opWtWSsfr5gAj2a6btHWDnQhEGxG4dMcFzRgCQ_xSE0hyQMK4Du_mVr5c_--boY4HO2cw9eZtwBGlubfPZUGvgRUXcPv8Vlbpe98LUhcqmqyatn7Ap3Yt7ShtQVAkvti1CbZFAgvvRhf4rOZNkQ-6dCQVpKqWchhi-evQV9TEFjHA';
// 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIiLCJqdGkiOiIzMzUyZDQ3ZDY5ZGY4NWIyMzJlNTVlODViZGQ4Y2M3MGU1MzU0NTMzZjZkN2Y4YWFkNmEzOWZkZjAwOWMzMzFjNDM3Mjg3YTA3YWExOTY0MCIsImlhdCI6MTU4Njg2MTE5MywibmJmIjoxNTg2ODYxMTkzLCJleHAiOjE1ODk0NTMxOTMsInN1YiI6IjEyMjkiLCJzY29wZXMiOltudWxsXX0.YfxzCyAxJ_ZAliYe0IiwwUc06kBR2MkjtuY60Fkb9ic6eawvIz2eNvP_3lYIlyBRzEEJlaa2eA1F8AOJip4cvhRZ_asJwnoWeKfXfjg65ksezFVWqyRqiy9OQsK4miOKfjYlN-aCMnNtqlQVZkkO0oeY5uLzOSA_hvfeO6u6ef30cc-wW3BUhH_VTIJA9xs0ZCuhK_0wY7EnELH5XYiHHNVEPLyCpIxt_Fb7PKG2PBgxDNyYqtAa4TwDCtU7a5nUbjOGyUl6PtEXcpRH5lYJqCQ9huBdWD-yN-zu4FU3j4zF0taccWQ6Nep3a6QaAwKDw31h-f1M0pSmaqv56MFKng';

/**
 * @description 修改全局默认配置
 * @param {Function}
 */
http.setConfig(config => {
  /* config 为默认全局配置 */
  return {
    ...config,
    ...{
      baseUrl: DISCUZ_REQUEST_HOST,
      header: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        authorization: `Bearer  ${token}`,
      },
    },
  };
});
http.validateStatus = statusCode => {
  return statusCode >= 200 && statusCode < 300;
};
/**
 * @param { Function} cancel - 取消请求,调用cancel 会取消本次请求，但是该函数的catch() 仍会执行; 不会进入响应拦截器
 *
 * @param {String} text ['handle cancel'| any] - catch((err) => {}) err.errMsg === 'handle cancel'。非必传，默认'handle cancel'
 * @cancel {Object} config - catch((err) => {}) err.config === config; 非必传，默认为request拦截器修改之前的config
 * function cancel(text, config) {}
 */
http.interceptor.request(config => {
  uni.showLoading();
  // cancel 为函数，如果调用会取消本次请求。需要注意：调用cancel,本次请求的catch仍会执行。必须return config
  try {
    const accessToken = uni.getStorageSync('access_token');
    if (accessToken) {
      // eslint-disable-next-line no-param-reassign
      config.header.Authorization = `Bearer ${accessToken}`;
    }
  } catch (e) {
    // error
  }

  return config;
});

// 在请求之后拦截
http.interceptor.response(
  response => {
    uni.hideLoading();
    // 状态码 >= 200 < 300 会走这里
    // if (response.config.custom.verification) {
    //   // 演示自定义参数的作用
    //   return response.data;
    // }
    response.status = response.statusCode;
    return response;
  },
  response => {
    uni.hideLoading();
    // 对响应错误做点什么 （statusCode !== 200），必须return response
    if (response && response.data && response.data.errors) {
      response.data.errors.map(error => {
        switch (error.code) {
          case 'access_denied':
            // token 无效 重新请求
            uni.removeStorage({
              key: 'access_token',
              success() {
                delete response.config.header.Authorization;
                http.request(response.config);
              },
            });
            break;
          default:
            uni.showToast({ title: error.detail ? error.detail : i18n.t(`core.${error.code}`) });
        }
        return error;
      });
    } else {
      uni.showToast({ title: response.errMsg });
    }
    return response;
  },
);

export { http };
