/* eslint-disable-next-line no-param-reassign */
import { SET_THEME } from '@/store/types/theme';
import { THEME_DEFAULT } from '@/common/const';

const theme = uni.getStorageSync('theme') || THEME_DEFAULT;

const state = {
  currentTheme: theme,
};

const actions = {
  /**
   * 获取主题
   */
  getTheme() {},
  /**
   * 设置主题
   */
  setTheme(context, payload) {
    context.commit(SET_THEME, payload);
    uni.setStorageSync('theme', payload);
  },
};

const mutations = {
  [SET_THEME](state, payload) {
    if (payload) state.currentTheme = payload;
  },
};

const getters = {
  get: state => {
    return data => {
      return state[data];
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
