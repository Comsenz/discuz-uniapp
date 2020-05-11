// 将 api 的请求链接统一写在这个文件中
// https://ext.dcloud.net.cn/plugin?id=392
import Request from '@/utils/request';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import { i18n } from '@/locale';

const http = new Request();
const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIiLCJqdGkiOiJmYjllOGM3ZDhjNGQ5ZThhYjhiZmM4MzAwN2E0MDgyNjAyN2ZhODE3ZmEzMzRiYjQxNWQ0ZTg1N2ZlMGI1YjQyM2Y0Mjk2Y2MzNGJmY2E1YyIsImlhdCI6MTU4ODkxOTE0MCwibmJmIjoxNTg4OTE5MTQwLCJleHAiOjE1OTE1MTExNDAsInN1YiI6IjEiLCJzY29wZXMiOltudWxsXX0.EhytuhU8Q5yQi4NajuBY0rxSkV3FBgPleIzI6c3n3-7Ayc0XFsDXEcWh4tk_RRr61Ch1Mmxm4N01U_8PYxKTYoZxJq-BRr_4hHNPS-CMyENiugJD1UYkO7UDMI3QBnpxK3OCcznqjB3W1CajX_pP2KXJfpY2LH-UILyjqpyA8kYrPYMWWve7w83MNnMFCSXodS547xrZbBJeAs-s_WZSGYLoHzLtyWuEqSBdpkZ2P4SY2at671F5Zu2KwKGRaE-bptjdKU6IvHV6LVd2RPKlCF74eA12WlPG7RNtvVTjdJJV4KH-oL9X0nDlEz6QfA4g3GmGEW4UTRZPL3_cJt7j9A';

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
