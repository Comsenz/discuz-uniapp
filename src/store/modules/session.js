/* eslint no-underscore-dangle: ["error", { "allow": ["_jv"] }] */
import { http } from '@/api/api-request';
import { utils } from '@/library/jsonapi-vuex/index';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import {
  SET_USER_ID,
  CHECK_SESSION,
  SET_ACCESS_TOKEN,
  SET_AUTH,
  SET_PARAMS,
  SET_CODE,
  SET_TOKEN,
  SET_INVITE_CODE,
  SET_CATEGORYID,
  SET_CATEGORYINDEX,
  DELETE_USER_ID,
  DELETE_ACCESS_TOKEN,
} from '@/store/types/session';

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
  token: '',
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
  setParams: (context, payload) => {
    context.commit(SET_PARAMS, payload);
  },
  setCode: (context, payload) => {
    context.commit(SET_CODE, payload);
  },
  setToken: (context, payload) => {
    context.commit(SET_TOKEN, payload);
  },
  setInviteCode: (context, payload) => {
    context.commit(SET_INVITE_CODE, payload);
  },
  // #ifdef MP-WEIXIN
  noSenseMPLogin: (context, payload = {}) => {
    return new Promise(resolve => {
      return http
        .post('oauth/wechat/miniprogram', payload)
        .then(results => {
          resolve(results);
          setUserInfoStore(context, results, resolve);
        })
        .catch(err => resolve(err));
    });
  },
  // #endif
  // #ifdef H5
  wxh5Login: (context, payload = {}) => {
    console.log(payload);
    const url = encodeURIComponent(`${DISCUZ_REQUEST_HOST}pages/user/wechat`);
    window.location = `${DISCUZ_REQUEST_HOST}api/oauth/wechat?redirect=${url}`;
  },
  // #endif
  // #ifdef H5
  noSenseh5Login: (context, payload = {}) => {
    let inviteCode = '';
    let register = 0;
    uni.getStorage({
      key: 'register',
      success(resData) {
        register = resData.data || 0;
      },
    });
    uni.getStorage({
      key: 'inviteCode',
      success(resData) {
        inviteCode = resData.data || '';
      },
    });
    const options = { custom: { showTost: false } };
    return new Promise(resolve => {
      return http
        .get(
          `oauth/wechat/user?sessionId=${payload.sessionId}&code=${payload.code}&state=${payload.state}&register=${register}&inviteCode=${inviteCode}`,
          options,
        )
        .then(results => {
          resolve(results);
          setUserInfoStore(context, results, resolve);
        })
        .catch(err => resolve(err));
    });
  },
  // #endif
  verificationCodeh5Login: (context, payload = {}) => {
    return new Promise(resolve => {
      return http
        .post('sms/verify', payload)
        .then(res => setUserInfoStore(context, res, resolve))
        .catch(err => resolve(err));
    });
  },
  h5Login: (context, payload = {}) => {
    return new Promise(resolve => {
      return http
        .post('login', payload)
        .then(res => {
          resolve(res);
          setUserInfoStore(context, res, resolve);
        })
        .catch(err => resolve(err));
    });
  },
  ucLogin: (context, payload = {}) => {
    return new Promise(resolve => {
      return http
        .post('uc/login', payload)
        .then(res => {
          resolve(res);
          setUserInfoStore(context, res, resolve);
        })
        .catch(err => resolve(err));
    });
  },
  h5Register: (context, payload = {}) => {
    const options = { custom: { showTost: false } };
    return new Promise(resolve => {
      return http
        .post('register', payload, options)
        .then(res => {
          resolve(res);
          setUserInfoStore(context, res, resolve);
        })
        .catch(err => resolve(err));
    });
  },
  logout: context => {
    return new Promise(resolve => {
      context.commit(DELETE_USER_ID);
      context.commit(DELETE_ACCESS_TOKEN);
      uni.removeStorage({
        key: 'inviteCode',
      });
      uni.removeStorage({
        key: 'page',
      });
      resolve();
    });
  },
  // #ifdef MP-WEIXIN
  bindPhonenum: (context, payload = {}) => {
    return new Promise(resolve => {
      return http
        .post('mobile/bind/miniprogram', payload)
        .then(res => resolve(res))
        .catch(err => resolve(err));
    });
  },
  // #endif
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
  [SET_PARAMS](state, payload) {
    state.params = payload;
  },
  [SET_CODE](state, payload) {
    state.code = payload;
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
  [SET_TOKEN](state, payload) {
    state.token = payload;
  },
  [SET_INVITE_CODE](state, payload) {
    state.inviteCode = payload;
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
