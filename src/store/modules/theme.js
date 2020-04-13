/* eslint-disable-next-line no-param-reassign */
import { SET_THEME } from '@/store/types/theme';
import { THEME_DEFAULT } from '@/common/const';

const state = {
  currentTheme: THEME_DEFAULT,
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
  },
};

const mutations = {
  [SET_THEME](state, payload) {
    if (payload) state.currentTheme = payload;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
