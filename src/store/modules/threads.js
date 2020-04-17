import { mergeRelatedData } from '@/api/data-format';
import { API_THREADS } from '@/api/index';
import { LOAD_ALL_THREADS } from '@/store/types/threads';

const state = {
  all: [],
};

const actions = {
  /**
   * 获取主题
   */
  loadAll(context, payload) {
    const { dispatch, rootGetters, commit } = context;
    mergeRelatedData(API_THREADS, payload, dispatch, rootGetters).then(data => {
      commit(LOAD_ALL_THREADS, data);
    });
  },
};

const mutations = {
  [LOAD_ALL_THREADS](state, data = []) {
    state.all = data || [];
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
