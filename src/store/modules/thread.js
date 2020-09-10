/* eslint-disable-next-line no-param-reassign */
import { SET_THREAD } from '@/store/types/thread';

const state = {
  thread: {},
};

const actions = {};

const mutations = {
  [SET_THREAD](state, payload) {
    if (payload !== '') state.thread = payload;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
