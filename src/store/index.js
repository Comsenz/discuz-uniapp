import Vue from 'vue';
import Vuex from 'vuex';

// https://github.com/mrichar1/jsonapi-vuex
import { jsonapiModule } from 'jsonapi-vuex';
import { http } from '@/api/api-request';
import theme from '@/store/modules/theme';

Vue.use(Vuex);

const store = new Vuex.Store({
  namespaced: true,
  actions: {},
  getters: {},
  modules: {
    jv: jsonapiModule(http.request.bind(http)),
    theme,
  },
  state: {},
  mutations: {},
});

export default store;
