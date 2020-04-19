// 将 api 的请求链接统一写在这个文件中
// https://ext.dcloud.net.cn/plugin?id=392
import Request from '@/utils/request';
import { DISCUZ_REQUEST_HOST } from '@/common/const';

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

// 在请求之后拦截
http.interceptor.response(
  response => {
    // if (response.config.custom.verification) {
    //   // 演示自定义参数的作用
    //   return response.data;
    // }
    return response;
  },
  response => {
    // 对响应错误做点什么 （statusCode !== 200），必须return response
    uni.showToast({ title: response.errMsg });
    return response;
  },
);

export { http };
