import Vue from 'vue';
import Vuex from 'vuex';

// https://github.com/mrichar1/jsonapi-vuex
import { jsonapiModule } from 'jsonapi-vuex';
import { http } from '@/api/api-request';
import theme from '@/store/modules/theme';
import atMember from '@/store/modules/atMember';
import session from '@/store/modules/session';
import forum from '@/store/modules/forum';
import pay from '@/store/modules/pay';

Vue.use(Vuex);

const store = new Vuex.Store({
  namespaced: true,
  actions: {},
  getters: {},
  modules: {
    jv: jsonapiModule(http.request.bind(http), { preserveJson: true, mergeRecords: true }),
    theme,
    atMember,
    session,
    forum,
    pay,
  },
  state: {},
  mutations: {},
});

export default store;
