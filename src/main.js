import Vue from 'vue';
import App from './App';
// 导入配置好的国际化语言包
import { i18n, localeUse } from './locale';
import store from './store';
import guid from './utils/guid';
import mixin from './mixin/mixin';
import { THEME_DEFAULT, THEME_DARK, DISCUZ_REQUEST_HOST, SITE_PAY } from './common/const';

// #ifdef H5
const publicWhitelistPage = [
  '/pages/home/index',
  '/pages/topic/index',
  '/pages/topic/comment',
  '/pages/profile/index',
  '/pages/user/login',
  '/pages/user/login-bind',
  '/pages/user/register-bind',
  '/pages/user/register',
  '/pages/user/phone-number-login',
  '/pages/user/verification-code-login',
];
const payWhiteListPage = [
  '/pages/site/info',
  '/pages/user/login',
  '/pages/user/login-bind',
  '/pages/user/register-bind',
  '/pages/user/register',
  '/pages/user/phone-number-login',
  '/pages/user/verification-code-login',
];
const apploaded = () => {
  const app = getApp();
  const forums = app.$store.getters['jv/get']('forums/1');
  if (forums.set_site) {
    const isLogin = app.$store.getters['session/get']('isLogin');
    if (forums.set_site.site_mode === SITE_PAY) {
      if (payWhiteListPage.indexOf(app._route.path) === -1 && !isLogin) {
        uni.redirectTo({
          url: '/pages/site/info',
        });
        return;
      }
      const userId = app.$store.getters['session/get']('userId');
      let user = {};
      if (userId) {
        user = app.$store.getters['jv/get'](`users/${userId}`);
      }
      if (!user.id) return;
      if (payWhiteListPage.indexOf(app._route.path) === -1 && !user.paid) {
        uni.redirectTo({
          url: '/pages/site/info',
        });
      }
    } else if (publicWhitelistPage.indexOf(app._route.path) === -1 && !isLogin) {
      uni.redirectTo({
        url: '/pages/home/index',
      });
    }
  }
};
uni.$on('apploaded', apploaded);
// #endif

// 兼容 allSettled 方法处理：https://www.npmjs.com/package/promise.allsettled
const allSettled = require('promise.allsettled');

Promise.allSettled = Promise.allSettled || allSettled;

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.prototype.$localeUse = localeUse;
// 因为小程序识别不了模板文件中的 $t 等 vue-i18n 相关的语法 api，因此直接挂载到 vue 的原型上，直接使用
Vue.prototype.i18n = i18n;
const currentTheme = uni.getStorageSync('theme') || THEME_DEFAULT;
const $u = {
  guid,
  currentTheme,
  light: () => THEME_DEFAULT,
  dark: () => THEME_DARK,
  host: () => DISCUZ_REQUEST_HOST,
  event: new Vue(),
};
Vue.prototype.$u = $u;
Vue.mixin(mixin);
const app = new Vue({
  // 注入配置好的国际化语言配置
  i18n,
  store,
  ...App,
});
app.$mount();
