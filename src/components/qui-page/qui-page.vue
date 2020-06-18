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
    <view v-else><slot /></view>

    <!-- #ifdef MP-WEIXIN -->
    <uni-popup ref="auth" type="bottom">
      <qui-auth @login="login" @close="close"></qui-auth>
    </uni-popup>
    <!-- #endif -->
  </view>
</template>

<script>
import { mapState } from 'vuex';
// #ifdef H5
import user from '@/mixin/user';
import forums from '@/mixin/forums';
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  // #ifdef H5
  mixins: [forums, appCommonH, user],
  // #endif
  computed: {
    ...mapState({
      forumError: state => state.forum.error,
    }),
    loading() {
      return this.forumError.loading;
    },
    showMessage() {
      return (
        [
          'not_install',
          'site_closed',
          'ban_user',
          'model_not_found',
          'dataerro',
          'permission_denied',
        ].indexOf(this.forumError.code) !== -1
      );
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
    // #ifdef MP-WEIXIN
    this.$store.dispatch('session/setAuth', this.$refs.auth);
    if (!this.loading && !this.showMessage) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$refs.auth.open();
      }
    }
    // #endif
    // #ifdef H5
    this.$store.dispatch('session/setAuth', {
      open: () => {
        const url = '/pages/home/index';
        console.log('forums', this.forums);
        console.log('微信浏览器：', appCommonH.isWeixin().isWeixin);
        if (appCommonH.isWeixin().isWeixin) {
          // 微信浏览器
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
            // 用户名模式
            console.log('用户名模式跳转到注册并绑定页');
            this.$store
              .dispatch('session/wxh5Login')
              .then(res => {
                console.log('校验成功', res);
                this.logind();
                uni.navigateTo({
                  url: '/pages/home/index',
                });
              })
              .catch(err => {
                console.log(err);
                uni.navigateTo({
                  url: `/pages/user/register-bind?url=${url}`,
                });
              });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
            // 手机号模式
            console.log('手机号模式跳转到手机号+验证码登陆页');
            this.$store
              .dispatch('session/wxh5Login')
              .then(res => {
                console.log('校验成功', res);
                this.logind();
                uni.navigateTo({
                  url: '/pages/home/index',
                });
              })
              .catch(err => {
                console.log(err);
                uni.navigateTo({
                  url: `/pages/user/verification-code-login?url=${url}`,
                });
              });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
            // 无感模式
            console.log('无感模式');
            this.$store
              .dispatch('session/wxh5Login')
              .then(res => {
                console.log('校验成功', res);
                this.logind();
                uni.navigateTo({
                  url: '/pages/home/index',
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
            // 手机号模式
            console.log('手机号模式跳转到手机号+验证码登陆页');
            uni.navigateTo({
              url: `/pages/user/verification-code-login?url=${url}`,
            });
          }
          if (this.forums && this.forums.qcloud && !this.forums.qcloud.qcloud_sms) {
            // 用户名模式
            console.log('用户名模式跳转到注册并绑定页');
            uni.navigateTo({
              url: `/pages/user/register?url=${url}`,
            });
          }
        }
      },
    });
    // #endif
  },
  methods: {
    // #ifdef MP-WEIXIN
    close() {
      this.$refs.auth.close();
    },
    login() {
      this.$refs.auth.close();
    },
    // #endif
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.qui-page {
  width: 100%;
  min-height: 100%;
  color: --color(--qui-FC-333);
  background-color: --color(--qui-BG-1);
  transition: $switch-theme-time;
}
</style>
