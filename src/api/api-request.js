// 将 api 的请求链接统一写在这个文件中
// https://ext.dcloud.net.cn/plugin?id=392
import Request from '@/utils/request';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import { i18n } from '@/locale';

const http = new Request();

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
        authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIiLCJqdGkiOiIxMDc3ODEzZDIwOWVlOTk2YjQyODlkYjQzZTNjMWYyYzA5OWNhZGRkYjQxMWY0YjU0ODU2MTI1NjY1Mzc1MzRhOGJkYzcxMWMyNThjNTA0ZSIsImlhdCI6MTU4NzI3NTI3OSwibmJmIjoxNTg3Mjc1Mjc5LCJleHAiOjE1ODk4NjcyNzksInN1YiI6IjEiLCJzY29wZXMiOltudWxsXX0.qLB4FHb0fmCSYnUwWHXDO_lQ2zQzgTiRErNLKMUbHYsAMAc3WdyyUs3SKSMYfMgqHS9xF8m9CiqCY0PcExnrMXPuCU2sPiaOUPd2cCRCRLLnQNQK2uc3bHacn_v097LKxHvGslKrkQ2AI646HQhRjs1JtTiI8AU3efQCnct0GrvyyV2ArY7DF_kK_waLVZx7qjCJ1wRHpX1Pt0Pg2K0xi3ax3L-bMIVbb9HD5Da5yQsvgSqntcKBrLsK5EQDcxCZTXpF3FNEwF4eHw_cHuumYiK5IAm8-eExoPeWW8APnIECvAYk21MsIkr3XGHxrrd5vtbDf9Ao_P7yptPAOXeh8w',
      },
    },
  };
});

/**
 * @param { Function} cancel - 取消请求,调用cancel 会取消本次请求，但是该函数的catch() 仍会执行; 不会进入响应拦截器
 *
 * @param {String} text ['handle cancel'| any] - catch((err) => {}) err.errMsg === 'handle cancel'。非必传，默认'handle cancel'
 * @cancel {Object} config - catch((err) => {}) err.config === config; 非必传，默认为request拦截器修改之前的config
 * function cancel(text, config) {}
 */
http.interceptor.request(config => {
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
    // 状态码 >= 200 < 300 会走这里
    // if (response.config.custom.verification) {
    //   // 演示自定义参数的作用
    //   return response.data;
    // }
    return response;
  },
  response => {
    // 对响应错误做点什么 （statusCode !== 200），必须return response
    if (response && response.data && response.errors) {
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
