import Vue from 'vue';
import Vuex from 'vuex';

// https://vuex.reststate.codingitwrong.com/
import { mapResourceModules } from '@/library/reststate-vuex';
import theme from '@/store/modules/theme';
import { http } from './api-request';

Vue.use(Vuex);

const store = new Vuex.Store({
  namespaced: true,
  actions: {},
  getters: {},
  modules: {
    ...mapResourceModules({
      // 请求的模块
      names: ['threads'],
      httpClient: http,
    }),
    theme,
  },
  state: {},
  mutations: {},
});

export default store;
