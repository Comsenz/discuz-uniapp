import Vue from 'vue';
import Vuex from 'vuex';

// https://vuex.reststate.codingitwrong.com/
import { mapResourceModules } from '@reststate/vuex';
import theme from '@/store/modules/theme';
import { http } from './api-request';

Vue.use(Vuex);

const store = new Vuex.Store({
  actions: {},
  getters: {},
  modules: {
    ...mapResourceModules({
      // 请求的模块
      names: ['forum', 'threads'],
      httpClient: http,
    }),
    theme,
  },
  state: {},
  mutations: {},
});

export default store;
