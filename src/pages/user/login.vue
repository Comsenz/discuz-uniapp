<template>
  <qui-page :data-qui-theme="theme" class="login-box">
    <view>
      <view class="login-box-h">{{ i18n.t('user.login') }}</view>
      <view class="login-box-con">
        <input
          class="input"
          maxlength="15"
          :placeholder="i18n.t('user.username')"
          placeholder-style="color: #ddd"
          v-model="username"
        />
        <input
          class="input"
          type="password"
          maxlength="50"
          :placeholder="i18n.t('user.password')"
          placeholder-style="color: #ddd"
          v-model="password"
        />
      </view>
      <view class="login-box-btn" @click="handleLogin">
        {{ i18n.t('user.login') }}
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <qui-login-mode
        :show-wx-icon="showMpIcon"
        :show-phone-icon="showPhoneIcon"
        :show-uc-icon="showUcIcon"
        :show-register-btn="showRegisterBtn"
        :is-no-sense-mode="isNoSenseMode"
        @jump2WechatLogin="jump2WechatLogin"
        @jump2PhoneLogin="jump2PhoneLogin"
        @jump2UcLogin="jump2UcLogin"
        @jump2Register="jump2Register"
        @jump2findpwd="jump2findpwd"
      ></qui-login-mode>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <qui-login-mode
        :show-wx-icon="showH5Icon"
        :show-phone-icon="showPhoneIcon"
        :show-uc-icon="showUcIcon"
        :show-register-btn="showRegisterBtn"
        :is-no-sense-mode="isNoSenseMode"
        @jump2WechatLogin="jump2WechatLogin"
        @jump2PhoneLogin="jump2PhoneLogin"
        @jump2UcLogin="jump2UcLogin"
        @jump2Register="jump2Register"
        @jump2findpwd="jump2findpwd"
      ></qui-login-mode>
      <!-- #endif -->
    </view>
    <qui-registration-agreement></qui-registration-agreement>
  </qui-page>
</template>

<script>
import user from '@/mixin/user';
import loginModule from '@/mixin/loginModule';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  mixins: [
    user,
    loginModule,
    // #ifdef H5
    appCommonH,
    // #endif
  ],
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      isPaid: false, // 默认未付费
      forum: {}, // 配置
      isShow: false,
      // #ifdef H5
      isWeixin: false, // 默认不是微信浏览器
      // #endif
    };
  },
  computed: {
    showMpIcon() {
      return this.forum && this.forum.passport && this.forum.passport.miniprogram_close;
    },
    showH5Icon() {
      return this.forum && this.forum.passport && this.forum.passport.offiaccount_close;
    },
    showPhoneIcon() {
      return this.forum && this.forum.qcloud && this.forum.qcloud.qcloud_sms;
    },
    showUcIcon() {
      return this.forum && this.forum.ucenter && this.forum.ucenter.ucenter && this.isShow;
    },
    showRegisterBtn() {
      return (
        this.forum &&
        this.forum.set_reg &&
        this.forum.set_reg.register_type === 0 &&
        this.forum.set_reg.register_close
      );
    },
    isNoSenseMode() {
      return this.forum && this.forum.set_reg && this.forum.set_reg.register_type !== 2;
    },
  },
  onLoad() {
    this.$store.dispatch('forum/setError', {
      code: 'user_login',
      status: 200,
    });
    this.getForum();
    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif
  },
  methods: {
    handleLogin() {
      const params = {
        data: {
          attributes: {
            username: this.username,
            password: this.password,
          },
        },
      };
      this.getLoginParams(params, this.i18n.t('user.loginSuccess'));
    },
    jump2WechatLogin() {
      // #ifdef MP-WEIXIN
      this.mpLogin();
      // #endif
      // #ifdef H5
      if (this.isWeixin) {
        this.wxh5Login(0, 0);
      } else {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.unLogin'),
          duration: 2000,
        });
      }
      // #endif
    },
    jump2PhoneLogin() {
      if (this.forum && this.forum.set_reg && this.forum.set_reg.register_type === 0) {
        this.jump2PhoneLoginPage();
      } else {
        this.jump2PhoneLoginRegisterPage();
      }
    },
    jump2Register() {
      if (
        !this.isWeixin &&
        this.forum &&
        this.forum.set_reg &&
        this.forum.set_reg.register_type === 2
      ) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.unLogin'),
          duration: 2000,
        });
      } else {
        this.jump2RegisterPage();
      }
    },
    jump2findpwd() {
      this.jump2findpwdPage();
    },
    jump2UcLogin() {
      uni.navigateTo({
        url: '/pages/user/uc-login',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.login-box {
  padding-bottom: 40px;
  font-size: $fg-f4;
  background-color: --color(--qui-BG-2);

  &-h {
    padding: 60rpx 0rpx 80rpx 40rpx;
    font-size: 50rpx;
    font-weight: bold;
    color: --color(--qui-FC-333);
  }

  &-con {
    margin: 0rpx 40rpx;

    .input {
      width: 100%;
      height: 100rpx;
      padding: 0rpx 0rpx 0rpx 20rpx;
      font-size: $fg-f5;
      line-height: 100rpx;
      text-align: left;
      border-bottom: 2rpx solid --color(--qui-BOR-ED);
    }
  }

  &-btn {
    width: 670rpx;
    height: 90rpx;
    margin: 50rpx auto 0rpx;
    line-height: 90rpx;
    color: --color(--qui-FC-FFF);
    text-align: center;
    background-color: --color(--qui-MAIN);
    border-radius: 5rpx;
  }
}
</style>
