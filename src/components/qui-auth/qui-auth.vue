<template>
  <view class="auth">
    <view class="auth__header">
      <qui-icon @tap="close" class="auth__header__close" name="icon-close" size="36"></qui-icon>
    </view>
    <view class="auth__content">
      <image
        class="auth__content__image"
        mode="aspectFit"
        :src="(forums && forums.set_site && forums.set_site.site_logo) || '/static/logo.png'"
      ></image>

      <qui-button
        type="primary"
        open-type="getUserInfo"
        @getuserinfo="handleGetUserInfo"
        lang="zh_CN"
        size="medium"
      >
        {{ t.userinfo }}
      </qui-button>
    </view>
  </view>
</template>

<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import { SITE_PAY } from '@/common/const';
import { getCurUrl } from '@/utils/getCurUrl';

export default {
  mixins: [forums, user],
  data() {
    return {
      isSuccess: true, // 默认无感登录成功
    };
  },
  computed: {
    t() {
      return this.i18n.t('auth');
    },
  },
  methods: {
    handleGetUserInfo(res) {
      if (res.detail.errMsg === 'getUserInfo:ok') {
        this.getParams();
      } else {
        this.$emit('login');
      }
    },
    getParams() {
      return new Promise((resolve, reject) => {
        uni.login({
          success: loginRes => {
            if (loginRes.errMsg === 'login:ok') {
              const { code } = loginRes;
              uni.getUserInfo({
                success: res => {
                  const params = {
                    data: {
                      attributes: {
                        js_code: code,
                        iv: res.iv,
                        encryptedData: res.encryptedData,
                      },
                    },
                  };
                  if (
                    this.forums &&
                    this.forums.set_reg &&
                    this.forums.set_reg.register_type !== 2
                  ) {
                    if (this.isSuccess) {
                      this.noSenseLogin(params);
                    } else {
                      this.loginMode(params);
                    }
                  } else {
                    // 无感模式
                    this.noSenseLogin(params, 1);
                  }
                },
                fail: error => {
                  console.log(error);
                  reject(error);
                },
              });
            }
          },
          fail: error => {
            console.log(error);
            reject(error);
          },
        });
      });
    },
    noSenseLogin(param, register = 0) {
      const params = param;
      params.data.attributes.register = register;
      const inviteCode = this.$store.getters['session/get']('inviteCode');
      console.log('inviteCode', inviteCode);
      if (inviteCode !== '') {
        params.data.attributes.code = inviteCode;
      }
      this.$store
        .dispatch('session/noSenseMPLogin', params)
        .then(res => {
          if (res && res.data) {
            this.$emit('login');
            if (res.data.data && res.data.data.id) {
              this.isSuccess = true;
              this.logind();
              if (
                this.forums &&
                this.forums.set_site &&
                this.forums.set_site.site_mode !== SITE_PAY
              ) {
                uni.getStorage({
                  key: 'page',
                  success(resData) {
                    uni.redirectTo({
                      url: resData.data,
                    });
                  },
                });
              }
              if (
                this.forums &&
                this.forums.set_site &&
                this.forums.set_site.site_mode === SITE_PAY &&
                this.user &&
                !this.user.paid
              ) {
                uni.redirectTo({
                  url: '/pages/site/info',
                });
              }
              uni.showToast({
                title: this.i18n.t('user.loginSuccess'),
                duration: 2000,
              });
            }
            if (
              res.data.errors &&
              (res.data.errors[0].code === 'no_bind_user' ||
                res.data.errors[0].code === 'register_close')
            ) {
              this.isSuccess = false;
              this.getParams();
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    loginMode(param) {
      const params = param;
      const routes = getCurrentPages();
      const curRoute = routes[routes.length - 1].route;
      console.log('getCurrentPages()', getCurrentPages());
      if (curRoute !== 'pages/site/partner-invite') {
        uni.setStorage({
          key: 'page',
          data: getCurUrl(),
        });
      } else {
        uni.setStorage({
          key: 'page',
          data: '/pages/home/index',
        });
      }
      const inviteCode = this.$store.getters['session/get']('inviteCode');
      console.log('inviteCode', inviteCode);
      if (inviteCode !== '') {
        params.data.attributes.code = inviteCode;
      }
      // #ifdef MP-WEIXIN
      this.$store.dispatch('session/setParams', params);
      // #endif
      console.log('params', params);
      if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
        // 用户名模式 跳转到登录并绑定页
        uni.navigateTo({
          url: '/pages/user/login-bind',
        });
      }
      if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
        // 手机号模式 跳转到手机号码登录页
        uni.navigateTo({
          url: '/pages/user/phone-login',
        });
      }
      if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
        // 无感模式
        this.noSenseLogin(params, 1);
      }
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.auth {
  height: 400rpx;
  background: --color(--qui-BG-2);
  &__header {
    padding: 30rpx 32rpx;
    text-align: right;
    &__close {
      justify-content: flex-end;
      color: --color(--qui-FC-AAA);
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &__image {
      max-height: 65rpx;
      margin: 10rpx 0 57rpx;
    }
  }
}
</style>
