<template>
  <view :data-qui-theme="currentTheme" class="qui-page">
    <!--
      放在这里是因为数据是异步请求的，然后判断论坛的显示状态。
      这样每个页面还是需要引入这个组件，一个是和主题相关，一个是和站点显示状态有关
    -->
    <qui-page-message v-if="forumError.status === '401'"></qui-page-message>
    <slot v-else />

    <uni-popup ref="auth" type="bottom">
      <qui-auth @login="login" @close="close"></qui-auth>
    </uni-popup>
    <qui-footer v-if="footer"></qui-footer>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    footer: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      currentTheme: state => state.theme.currentTheme,
      forumError: state => state.forum.error,
    }),
  },
  mounted() {
    this.$store.dispatch('session/setAuth', this.$refs.auth);
    if (!this.$store.getters['session/get']('isLogin')) {
      this.$refs.auth.open();
    }
  },
  methods: {
    close(res) {
      this.$emit('close', res);
      this.$refs.auth.close();
    },
    login(res, data) {
      this.$emit('login', res, data);
      this.$refs.auth.close();
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/theme/fn.scss';

.qui-page {
  width: 100%;
  min-height: 100vh;
  color: --color(--qui-FC-333);
  background-color: --color(--qui-BG-1);
  transition: 0.4s;
}
</style>
