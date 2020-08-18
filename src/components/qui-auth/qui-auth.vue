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
      if (this.forums && !this.forums.set_reg.register_close) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('core.register_close'),
        });
        return;
      }
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
                  if (this.isSuccess) {
                    this.noSenseLogin(params);
                  } else {
                    this.loginMode(params);
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
    noSenseLogin(params) {
      this.$store
        .dispatch('session/noSenseMPLogin', params)
        .then(res => {
          if (res && res.data) {
            this.$emit('login');
            if (res.data.data && res.data.data.id) {
              this.isSuccess = true;
              this.logind();
            }
            if (
              (res.data.errors && res.data.errors[0].code === 'no_bind_user') ||
              (res.data.errors && res.data.errors[0].code === 'account_has_been_bound')
            ) {
              this.isSuccess = false;
              if (!this.$store.getters['session/get']('isLogin')) {
                this.$emit('open');
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    loginMode(param) {
      let url = '/pages/home/index';
      const params = param;
      const pages = getCurrentPages();
      const page = pages[pages.length - 1].route;
      if (page !== '/pages/home/index') {
        url = page;
      }
      // 邀请页面带上邀请码
      if (page === 'pages/site/partner-invite') {
        const inviteCode = pages[pages.length - 1].options.code;
        params.data.attributes.code = inviteCode;
      }
      // #ifdef MP-WEIXIN
      this.$store.dispatch('session/setParams', params);
      // #endif
      console.log('params', params);
      if (this.forums && this.forums.passport && this.forums.passport.offiaccount_close) {
        // 开启微信公众号
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
          // 用户名模式 跳转到注册并绑定页
          uni.navigateTo({
            url: `/pages/user/register-bind?url=${url}`,
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 手机号模式 跳转到手机号+验证码登陆页
          uni.navigateTo({
            url: `/pages/user/phone-login?url=${url}`,
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          // 无感模式
        }
      } else {
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
          // 用户名模式
          uni.navigateTo({
            url: `/pages/user/login?url=${url}`,
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 手机号模式
          uni.navigateTo({
            url: `/pages/user/phone-login?url=${url}`,
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
            // 手机号模式
            uni.navigateTo({
              url: `/pages/user/phone-login?url=${url}`,
            });
          } else {
            // 用户名模式
            uni.navigateTo({
              url: `/pages/user/login?url=${url}`,
            });
          }
        }
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
