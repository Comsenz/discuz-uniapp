/* eslint no-underscore-dangle: ["error", { "allow": ["_jv"] }] */
import { http } from '@/api/api-request';
import { utils } from '@/library/jsonapi-vuex/index';
import {
  SET_USER_ID,
  CHECK_SESSION,
  SET_ACCESS_TOKEN,
  SET_AUTH,
  SET_CATEGORYID,
  SET_CATEGORYINDEX,
  DELETE_USER_ID,
  DELETE_ACCESS_TOKEN,
} from '@/store/types/session';

import { GetUrlParam } from '@/utils/url';

const accessToken = uni.getStorageSync('access_token');

const setUserInfoStore = (context, results, resolve) => {
  const resData = utils.jsonapiToNorm(results.data.data);
  context.commit(SET_USER_ID, resData._jv.id);
  context.commit(CHECK_SESSION, true);
  context.commit(SET_ACCESS_TOKEN, resData.access_token);
  uni.$emit('logind');
  resolve(resData);
};

const state = {
  userId: 0,
  wxLogin: false,
  accessToken,
  auth: {},
  categoryId: 0,
  categoryIndex: 0,
};

const actions = {
  /**
   * 设置用户ID
   */
  setUserId: (context, payload) => {
    context.commit(SET_USER_ID, payload);
  },
  checkSession: (context, payload) => {
    context.commit(CHECK_SESSION, payload);
  },
  setAccessToken: (context, payload) => {
    context.commit(SET_ACCESS_TOKEN, payload);
  },
  setAuth: (context, payload) => {
    context.commit(SET_AUTH, payload);
  },
  // #ifdef MP-WEIXIN
  login: (context, payload = {}) => {
    return new Promise((resolve, reject) => {
      uni.login({
        success: res => {
          console.log(res);
          if (res.errMsg === 'login:ok') {
            const { code } = res;
            uni.getUserInfo({
              // eslint-disable-next-line no-shadow
              success: res => {
                let data = {
                  data: {
                    attributes: {
                      js_code: code,
                      iv: res.iv,
                      encryptedData: res.encryptedData,
                    },
                  },
                };
                data = Object.assign(payload, data);
                return http
                  .post('oauth/wechat/miniprogram', data)
                  .then(results => setUserInfoStore(context, results, resolve));
              },
              fail: error => {
                console.log(error);
                reject(error);
              },
            });
          }
        },
        fail: error => {
          console.log(error);
          reject(error);
        },
      });
    });
  },
  // #endif
  // #ifdef H5
  wxh5Login: (context, payload = {}) => {
    console.log('payload', payload);
    return new Promise(resolve => {
      console.log('http', http);
      console.log('resolve', resolve);
      const url = encodeURIComponent(`https://dq.comsenz-service.com/pages/home/index`);
      window.location.href = `https://dq.comsenz-service.com/api/oauth/wechat?redirect=${url}`;
      const code = GetUrlParam(window.location.href);
      console.log('-----code-------', code);
      // uni.setStorageSync('code', results.data.code);
      // uni.setStorageSync('sessionId', results.data.sessionId);
    });
  },
  // #endif
  // #ifdef H5
  noSenseh5Login: (context, payload = {}) => {
    console.log('payload', payload);
    return new Promise(resolve => {
      console.log('http', http);
      return http
        .get('oauth/wechat/user', payload)
        .then(results => setUserInfoStore(context, results, resolve));
    });
  },
  // #endif
  // #ifdef H5
  verificationCodeh5Login: (context, payload = {}) => {
    console.log('payload', payload);
    return new Promise(resolve => {
      console.log('http', http);
      return http
        .post('sms/verify', payload)
        .then(results => setUserInfoStore(context, results, resolve));
    });
  },
  // #endif
  // #ifdef H5
  h5Login: (context, payload = {}) => {
    console.log('payload', payload);
    return new Promise(resolve => {
      console.log('http', http);
      return http
        .post('login', payload)
        .then(results => setUserInfoStore(context, results, resolve));
    });
  },
  // #endif
  // #ifdef H5
  h5Register: (context, payload = {}) => {
    console.log('payload', payload);
    return new Promise(resolve => {
      console.log('http', http);
      return http
        .post('register', payload)
        .then(results => setUserInfoStore(context, results, resolve));
    });
  },
  // #endif
  logout: context => {
    return new Promise(resolve => {
      context.commit(DELETE_USER_ID);
      context.commit(DELETE_ACCESS_TOKEN);
      resolve();
    });
  },
};

const mutations = {
  [SET_USER_ID](state, payload) {
    uni.setStorageSync('user_id', payload);
    state.userId = payload;
  },
  [CHECK_SESSION](state, payload) {
    state.wxLogin = payload;
  },
  [SET_ACCESS_TOKEN](state, payload) {
    uni.setStorageSync('access_token', payload);
    state.accessToken = payload;
  },
  [SET_AUTH](state, payload) {
    state.auth = payload;
  },
  [SET_CATEGORYID](state, payload) {
    state.categoryId = payload;
  },
  [SET_CATEGORYINDEX](state, payload) {
    state.categoryIndex = payload;
  },
  [DELETE_USER_ID](state) {
    uni.removeStorageSync('user_id');
    state.userId = 0;
  },
  [DELETE_ACCESS_TOKEN](state) {
    uni.removeStorageSync('access_token');
    state.accessToken = '';
  },
};

const getters = {
  get: state => {
    return data => {
      switch (data) {
        case 'userId':
          state.userId = uni.getStorageSync('user_id') || 0;
          return state.userId;
        case 'isWxLogin':
          return state.wxLogin;
        case 'isLogin':
          return !!uni.getStorageSync('access_token');
        default:
          return state[data];
      }
    };
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
