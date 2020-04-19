import Vue from 'vue';
import Vuex from 'vuex';

// https://vuex.reststate.codingitwrong.com/
import { mapResourceModules } from '@reststate/vuex';
import { http } from '@/api/api-request';
import theme from '@/store/modules/theme';
import dzThreads from '@/store/modules/threads';

Vue.use(Vuex);

const store = new Vuex.Store({
  namespaced: true,
  actions: {},
  getters: {},
  modules: {
    ...mapResourceModules({
      // 请求的模块，如果控制台报 action not found 错误的话，需要将 action 作为模块
      // 写入到 names 中。如 users/related not found，则将 users 填写在下面👇
      names: ['threads', 'users', 'posts', 'categories', 'thread-video', 'dialog', 'notification'],
      httpClient: http,
    }),
    theme,
    dzThreads,
  },
  state: {},
  mutations: {},
});

export default store;
