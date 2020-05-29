<template>
  <view class="qui-page">
    <!--
      放在这里是因为数据是异步请求的，然后判断论坛的显示状态。
      这样每个页面还是需要引入这个组件，一个是和主题相关，一个是和站点显示状态有关
    -->
    <view v-if="loading" class="loading">
      <u-loading :size="60"></u-loading>
    </view>
    <qui-page-message v-else-if="showMessage"></qui-page-message>
    <slot v-else />

    <uni-popup ref="auth" type="bottom">
      <qui-auth @login="login" @close="close"></qui-auth>
    </uni-popup>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      forumError: state => state.forum.error,
    }),
    loading() {
      return this.forumError.loading;
    },
    showMessage() {
      return ['not_install', 'site_closed', 'ban_user'].indexOf(this.forumError.code) !== -1;
    },
  },
  watch: {
    forumError(newValue) {
      if (newValue.loading === false && !newValue.code) {
        this.$emit('pageLoaded');
      }
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
    close() {
      this.$refs.auth.close();
    },
    login() {
      this.$refs.auth.close();
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
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
}
</style>
