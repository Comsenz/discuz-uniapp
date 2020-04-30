<template>
  <view :data-qui-theme="currentTheme" class="qui-page">
    <!--
      放在这里是因为数据是异步请求的，然后判断论坛的显示状态。
      这样每个页面还是需要引入这个组件，一个是和主题相关，一个是和站点显示状态有关
    -->
    <qui-page-message v-if="forumError.status === '401'"></qui-page-message>
    <slot v-else />

    <uni-popup ref="auth" type="bottom">
      <qui-auth @login="login"></qui-auth>
    </uni-popup>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      currentTheme: state => state.theme.currentTheme,
      forumError: state => state.forum.error,
    }),

    isLogin() {
      return this.$store.getters['session/get']('isLogin');
    },
  },
  watch: {
    // 监听得到的数据
    isLogin: {
      handler(newVal) {
        console.log(this.$refs.auth, this);
        // this.$refs.auth.open();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    login() {
      this.$refs.auth.close();
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/theme/fn.scss';

.qui-page {
  min-height: 100vh;
  color: --color(--qui-FC-333);
  background-color: --color(--qui-BG-1);
}
</style>
