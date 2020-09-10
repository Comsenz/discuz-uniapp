import Vue from 'vue';
import Vuex from 'vuex';

// https://github.com/mrichar1/jsonapi-vuex
import { jsonapiModule } from '@/library/jsonapi-vuex/index';
import { http } from '@/api/api-request';
import atMember from '@/store/modules/atMember';
import session from '@/store/modules/session';
import forum from '@/store/modules/forum';
import emoji from '@/store/modules/emoji';
import pay from '@/store/modules/pay';
import footerTab from '@/store/modules/footerTab';
import thread from '@/store/modules/thread';

Vue.use(Vuex);

const store = new Vuex.Store({
  namespaced: true,
  actions: {},
  getters: {},
  modules: {
    jv: jsonapiModule(http.request.bind(http), { preserveJson: true, mergeRecords: true }),
    atMember,
    session,
    forum,
    emoji,
    pay,
    footerTab,
    thread,
  },
  state: {},
  mutations: {},
});

export default store;
