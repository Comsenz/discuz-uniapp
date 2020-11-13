/* eslint-disable */
import Vue from 'vue';
import App from './App';
// 导入配置好的国际化语言包
import { i18n, localeUse } from './locale';
import store from './store';
import guid from './utils/guid';
import mixin from './mixin/mixin';
import { THEME_DEFAULT, THEME_DARK, DISCUZ_REQUEST_HOST, SITE_PAY } from './common/const';

// #ifdef H5
const aegis = new Aegis({
  id: "7411", // 项目ID
  reportApiSpeed: true, // 接口测速
  reportAssetSpeed: true, // 静态资源测速
  pagePerformance: true, // 页面测速
});
// #endif

// #ifdef H5
const publicWhitelistPage = [
  '/pages/home/index',
  '/topic/index',
  '/pages/topic/list',
  '/pages/topic/content',
  '/pages/topic/comment',
  '/pages/profile/index',
  '/pages/user/pc-login',
  '/pages/user/pc-relation',
  '/pages/user/login',
  '/pages/user/uc-login',
  '/pages/user/weichat',
  '/pages/user/login-bind',
  '/pages/user/login-bind-phone',
  '/pages/user/register-bind',
  '/pages/user/register-bind-phone',
  '/pages/user/register',
  '/pages/user/phone-login',
  '/pages/user/phone-login-register',
  '/pages/modify/findpwd',
  '/preview-image',
  '/pages/site/search',
  '/pages/site/search-theme',
  '/pages/site/search-user',
  '/pages/site/info',
  '/pages/site/partner-invite',
  '/pages/topic/position',
  '/pages/common/error'
];
const payWhiteListPage = [
  '/pages/site/info',
  '/pages/user/pc-login',
  '/pages/user/pc-relation',
  '/pages/user/login',
  '/pages/user/uc-login',
  '/pages/user/weichat',
  '/pages/user/login-bind',
  '/pages/user/login-bind-phone',
  '/pages/user/register-bind',
  '/pages/user/register-bind-phone',
  '/pages/user/register',
  '/pages/user/phone-login',
  '/pages/user/phone-login-register',
  '/pages/modify/findpwd',
  '/pages/site/partner-invite',
];

const t1StartDate = new Date();
const t1StartYear = t1StartDate.getFullYear();
const t1StartMonth = t1StartDate.getMonth() + 1;
const t1StartDay = t1StartDate.getDate();
const t1StartHours = t1StartDate.getHours();
const t1StartMinutes = t1StartDate.getMinutes();
const t1StartSeconds = t1StartDate.getSeconds();
const t1StartMilliseconds = t1StartDate.getMilliseconds();
aegis.time('t1开始', t1StartYear + '-' + t1StartMonth + '-' + t1StartDay + ' ' + t1StartHours + ':' + t1StartMinutes + ':' + t1StartSeconds + ':' + t1StartMilliseconds);

const apploaded = () => {

  aegis.info('上报一条白名单日志，这两种情况这条日志才会报到后台：1、打开页面的用户在名单中；2、对应的页面发生了错误🤨');
  aegis.infoAll('上报了一条日志，该上报与info唯一的不同就在于，所有用户都会上报');
  aegis.report(new Error('上报一个错误'));

  const app = getApp();
  const forums = app.$store.getters['jv/get']('forums/1');
  if (forums.set_site) {
    const isLogin = app.$store.getters['session/get']('isLogin');
    if (forums.set_site.site_mode === SITE_PAY) {
      if (app._route.path === '/pages/user/pc-login' && !isLogin) {
        uni.redirectTo({
          url: app._route.fullPath,
        });
        return;
      }
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

  const link = document.querySelector('link[rel*="icon"]') || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = forums.set_site ? forums.set_site.site_favicon : '';
  document.getElementsByTagName('head')[0].appendChild(link);

  const t1EndDate = new Date();
  const t1EndYear = t1EndDate.getFullYear();
  const t1EndMonth = t1EndDate.getMonth() + 1;
  const t1EndDay = t1EndDate.getDate();
  const t1EndHours = t1EndDate.getHours();
  const t1EndMinutes = t1EndDate.getMinutes();
  const t1EndSeconds = t1EndDate.getSeconds();
  const t1EndMilliseconds = t1EndDate.getMilliseconds();
  aegis.timeEnd('t1结束', t1EndYear + '-' + t1EndMonth + '-' + t1EndDay + ' ' + t1EndHours + ':' + t1EndMinutes + ':' + t1EndSeconds + ':' + t1EndMilliseconds);
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
  data: function() {
    return {
      siteInfoStat: '',
      evalscripts: [],
      JSLOADED: [],
    };
  },
  created() {
    // #ifndef MP-WEIXIN
    uni.$on('stat', arg => {
      this.siteInfoStat = arg;
      // console.log(this.siteInfoStat.statisticsCode, '这是Main里面');
      this.evalscript(this.siteInfoStat.statisticsCode);
    });
    // #endif
  },
  // watch: {
  //   siteInfoStat: function(newVal, oldVal) {
  //     this.siteInfoStat = newVal;
  //     this.evalscript(this.siteInfoStat);
  //   },
  // },
  methods: {
    // #ifndef MP-WEIXIN
    evalscript(s) {
      // console.log(s, '222222222222');
      if (s.indexOf('<script') == -1) return s;
      var p = /<script[^\>]*?>([^\x00]*?)<\/script>/gi;
      var arr = [];
      while ((arr = p.exec(s))) {
        var p1 = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/i;
        var arr1 = [];
        arr1 = p1.exec(arr[0]);
        if (arr1) {
          this.appendscript(arr1[1], '', arr1[2], arr1[3]);
        } else {
          p1 = /<script(.*?)>([^\x00]+?)<\/script>/i;
          arr1 = p1.exec(arr[0]);
          this.appendscript('', arr1[2], arr1[1].indexOf('reload=') != -1);
        }
      }
      return s;
    },

    appendscript(src, text, reload, charset) {
      var id = this.hash(src + text);
      if (!reload && this.in_array(id, this.evalscripts)) return;
      if (reload && $('#' + id)[0]) {
        $('#' + id)[0].parentNode.removeChild($('#' + id)[0]);
      }
      // console.log(id, '~~~~~~~~~~~');
      this.evalscripts = [];
      this.evalscripts.push(id);
      var scriptNode = document.createElement('script');
      scriptNode.type = 'text/javascript';
      scriptNode.id = id;
      scriptNode.charset = charset
        ? charset
        : !document.charset
        ? document.characterSet
        : document.charset;
      try {
        if (src) {
          scriptNode.src = src;
          scriptNode.onloadDone = false;
          scriptNode.onload = () => {
            scriptNode.onloadDone = true;
            this.JSLOADED = [];
            this.JSLOADED[src] = 1;
          };
          scriptNode.onreadystatechange = function() {
            if (
              (scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') &&
              !scriptNode.onloadDone
            ) {
              scriptNode.onloadDone = true;
              this.JSLOADED[src] = 1;
            }
          };
        } else if (text) {
          scriptNode.text = text;
        }
        document.getElementsByTagName('head')[0].appendChild(scriptNode);
      } catch (e) {
        console.log(e);
      }
    },
    hash(string, length) {
      var length = length ? length : 32;
      var start = 0;
      var i = 0;
      var result = '';
      var filllen = '';
      filllen = length - (string.length % length);
      for (i = 0; i < filllen; i += 1) {
        string += '0';
      }
      while (start < string.length) {
        result = this.stringxor(result, string.substr(start, length));
        start += length;
      }
      return result;
    },
    stringxor(s1, s2) {
      var s = '';
      var hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var max = Math.max(s1.length, s2.length);
      for (var i = 0; i < max; i++) {
        var k = s1.charCodeAt(i) ^ s2.charCodeAt(i);
        s += hash.charAt(k % 52);
      }
      return s;
    },
    in_array(needle, haystack) {
      if (typeof needle == 'string' || typeof needle == 'number') {
        for (var i in haystack) {
          if (haystack[i] == needle) {
            return true;
          }
        }
      }
      return false;
    },
    // #endif
  },
});
app.$mount();
