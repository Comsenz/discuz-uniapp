import Vue from 'vue';
import App from './App';
// 导入配置好的国际化语言包
import { i18n, localeUse } from './locale';
import store from './store';
import guid from './utils/guid';
import mixin from './mixin/mixin';

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.prototype.$localeUse = localeUse;
// 因为小程序识别不了模板文件中的 $t 等 vue-i18n 相关的语法 api，因此直接挂载到 vue 的原型上，直接使用
Vue.prototype.i18n = i18n;
const $u = {
  guid,
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
