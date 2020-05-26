<template>
  <view :data-qui-theme="currentTheme" class="qui-page">
    <!--
      放在这里是因为数据是异步请求的，然后判断论坛的显示状态。
      这样每个页面还是需要引入这个组件，一个是和主题相关，一个是和站点显示状态有关
    -->
    <view v-if="loading">加载中...</view>
    <qui-page-message v-else-if="showMessage"></qui-page-message>
    <slot v-else />

    <uni-popup ref="auth" type="bottom">
      <qui-auth @login="login" @close="close"></qui-auth>
    </uni-popup>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import { THEME_DEFAULT } from '@/common/const';

export default {
  data() {
    return {
      navBarColor: {
        frontColor: '#000000',
        backgroundColor: '#ffffff',
      },
    };
  },
  computed: {
    ...mapState({
      currentTheme: state => state.theme.currentTheme,
      forumError: state => state.forum.error,
    }),
    loading() {
      return this.forumError.loading;
    },
    showMessage() {
      return ['not_install', 'site_closed'].indexOf(this.forumError.code) !== -1;
    },
  },
  watch: {
    currentTheme: {
      handler(n) {
        this._setColor(n);
        uni.setNavigationBarColor(this.navBarColor);
      },
    },
  },
  mounted() {
    this.$store.dispatch('session/setAuth', this.$refs.auth);
    if (!this.loading && !this.showMessage) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$refs.auth.open();
      }
    }
  },
  methods: {
    close(res) {
      this.$emit('close', res);
      this.$refs.auth.close();
    },
    login(data) {
      this.$emit('login', data);
      this.$refs.auth.close();
    },
    _setColor(theme) {
      this.navBarColor.frontColor = theme === THEME_DEFAULT ? '#000000' : '#ffffff';
      this.navBarColor.backgroundColor = theme === THEME_DEFAULT ? '#ffffff' : '#2e2f30';
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.qui-page {
  width: 100%;
  min-height: 100vh;
  color: --color(--qui-FC-333);
  background-color: --color(--qui-BG-1);
  transition: $switch-theme-time;
}
</style>
