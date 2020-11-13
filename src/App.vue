<script>
/* eslint-disable */
import '@/common/stat';
import { SITE_PAY, STORGE_GET_USER_TIME } from '@/common/const';
import Vue from 'vue';

const themeListeners = [];

export default {
  data() {
    return {
      statisticsCode: '', // 统计代码
    };
  },
  globalData: {
    // #ifdef H5
    appLoadedStatus: false,
    // #endif
    themeChanged(theme) {
      Vue.prototype.$u.currentTheme = theme;
      themeListeners.forEach(listener => {
        listener(theme);
      });
      uni.setStorage({
        key: 'theme',
        data: theme,
      });
    },
    watchThemeChange(listener) {
      if (themeListeners.indexOf(listener) < 0) {
        themeListeners.push(listener);
      }
    },
    unWatchThemeChange(listener) {
      const index = themeListeners.indexOf(listener);
      if (index > -1) {
        themeListeners.splice(index, 1);
      }
    },
  },
  async onLaunch() {
    const init = async () => {
      // #ifdef H5
      const t2StartDate = new Date();
      const t2StartYear = t2StartDate.getFullYear();
      const t2StartMonth = t2StartDate.getMonth() + 1;
      const t2StartDay = t2StartDate.getDate();
      const t2StartHours = t2StartDate.getHours();
      const t2StartMinutes = t2StartDate.getMinutes();
      const t2StartSeconds = t2StartDate.getSeconds();
      const t2StartMilliseconds = t2StartDate.getMilliseconds();
      aegis.time('T2开始', t2StartYear + '-' + t2StartMonth + '-' + t2StartDay + ' ' + t2StartHours + ':' + t2StartMinutes + ':' + t2StartSeconds + ':' + t2StartMilliseconds);
      // #endif
      const forums = await this.$store.dispatch('jv/get', [
        'forum',
        {
          params: {
            include: 'users',
          },
        },
      ]);
      const userId = this.$store.getters['session/get']('userId');
      let user = {};
      if (userId) {
        const params = {
          include: 'groups,wechat',
        };
        user = await this.$store.dispatch('jv/get', [`users/${userId}`, { params }]);
        uni.setStorageSync(STORGE_GET_USER_TIME, new Date().getTime());
      }
      this.statisticsCode = forums.set_site.site_stat;
      uni.$emit('stat', {
        statisticsCode: this.statisticsCode,
      });
      let currentPage = {};
      const pages = getCurrentPages();
      if (pages.length > 0) {
          currentPage = pages[pages.length - 1];
      }
      if (forums.set_site.site_mode === SITE_PAY) {
        // #ifndef H5
        const res = uni.getSystemInfoSync();
        if (res.platform === 'ios') {
          this.$store.dispatch('forum/setError', { loading: false, code: 'dataerro' });
          return;
        }
        // #endif
        if (pages.length > 0) {
          currentPage = pages[pages.length - 1];
          if (currentPage.route === 'pages/user/pc-login') {
            uni.redirectTo({
              url: currentPage.__page__.fullPath,
            });
            return;
          }
          if (currentPage.route === 'pages/user/pc-relation') {
            uni.redirectTo({
              url: currentPage.__page__.fullPath,
            });
            return;
          }
          if (!user.paid && currentPage.route !== 'pages/site/info' && currentPage.route !== 'pages/site/partner-invite') {
            uni.redirectTo({
              url: '/pages/site/info',
            });
          }
        } else if (!user.paid) {
          uni.redirectTo({
            url: '/pages/site/info',
          });
        }
      }
      // #ifdef H5
      this.globalData.appLoadedStatus = true;
      uni.$emit('apploaded');
      // #endif
      if (!this.$store.state.forum.error.code) {
        this.$store.dispatch('forum/setError', { loading: false });
      }
      // #ifdef H5
      const t2EndDate = new Date();
      const t2EndYear = t2EndDate.getFullYear();
      const t2EndMonth = t2EndDate.getMonth() + 1;
      const t2EndDay = t2EndDate.getDate();
      const t2EndHours = t2EndDate.getHours();
      const t2EndMinutes = t2EndDate.getMinutes();
      const t2EndSeconds = t2EndDate.getSeconds();
      const t2EndMilliseconds = t2EndDate.getMilliseconds();
      aegis.timeEnd('T2结束', t2EndYear + '-' + t2EndMonth + '-' + t2EndDay + ' ' + t2EndHours + ':' + t2EndMinutes + ':' + t2EndSeconds + ':' + t2EndMilliseconds);
      // #endif
    };
    try {
      await init();
    } catch (errs) {
      if (errs && errs.data && errs.data.errors) {
        if (errs.data.errors[0].code === 'access_denied') {
          this.$store.dispatch('session/logout').then(init);
        } else {
          this.$store.dispatch('forum/setError', {
            loading: false,
            ...errs.data.errors[0],
          });
        }
      }
    }
  },

  onShow(options) {
    // 解决各类回调的兼容问题,验证码捕获captchaResult
    // #ifdef MP-WEIXIN
    if (!this.captchaTicketExpire) this.captchaTicketExpire = {};
    if (options.scene === 1038 && options.referrerInfo.appId === 'wx5a3a7366fd07e119') {
      const result = options.referrerInfo.extraData;
      if (result && result.ret === 0) {
        const theTicket = result.ticket;
        if (!this.captchaTicketExpire[theTicket]) {
          this.captchaTicketExpire[theTicket] = true;
          this.$u.event.$emit('captchaResult', result);
        }
      } else {
        this.$u.event.$emit('closeChaReault', result);
        // 用户关闭了验证码
      }
    }
    // #endif
  },
  onHide() {},
  onPageNotFound() {
    const url = '/pages/common/error';
    uni.redirectTo({url});
  },
};
</script>

<style lang="scss">
/* 每个页面公共css */
@import '@/styles/base/reset.scss';
</style>
