/* eslint no-underscore-dangle: ["error", { "allow": ["_jv"] }] */
import { http } from '@/api/api-request';
import { utils } from 'jsonapi-vuex';
import { SET_USER_ID, CHECK_SESSION, SET_ACCESS_TOKEN, SET_AUTH } from '@/store/types/session';

const state = {
  userId: 0,
  wxLogin: false,
  accessToken: '',
  auth: {},
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
  login: (context, payload = {}) => {
    return new Promise((resolve, reject) => {
      uni.login({
        success: res => {
          if (res.errMsg === 'login:ok') {
            const { code } = res;
            uni.getUserInfo({
              // eslint-disable-next-line no-shadow
              success: res => {
                const data = {
                  data: {
                    attributes: {
                      js_code: code,
                      iv: res.iv,
                      encryptedData: res.encryptedData,
                    },
                  },
                };
                data = Object.assign(payload, data);
                return http.post('oauth/wechat/miniprogram', data).then(results => {
                  const resData = utils.jsonapiToNorm(results.data.data);
                  uni.setStorageSync('user_id', resData._jv.id);
                  uni.setStorageSync('access_token', resData.access_token);
                  context.commit(SET_USER_ID, resData._jv.id);
                  context.commit(CHECK_SESSION, true);
                  context.commit(SET_ACCESS_TOKEN, resData.access_token);

                  resolve(resData);
                });
              },
              fail: error => {
                reject(error);
              },
            });
          }
        },
        fail: error => {
          reject(error);
        },
      });
    });
  },
};

const mutations = {
  [SET_USER_ID](state, payload) {
    state.userId = payload;
  },
  [CHECK_SESSION](state, payload) {
    state.wxLogin = payload;
  },
  [SET_ACCESS_TOKEN](state, payload) {
    state.accessToken = payload;
  },
  [SET_AUTH](state, payload) {
    state.auth = payload;
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
