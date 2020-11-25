<template>
  <view class="pc-login">
    <view class="pc-login-tp">
      <view class="pc-login__box">
        <image class="pc-login__box__img" :src="pcLoginLogo" mode="widthFix"></image>
      </view>
      <view class="pc-login__title">
        {{ i18n.t('user.pcloginconfirm') }}
      </view>
    </view>
    <view class="pc-login-bt">
      <view class="pc-login__btn" @click="pcLogin">
        {{ i18n.t('user.login') }}
      </view>
      <view class="pc-login__cancel" @click="cancelPclogin">
        {{ i18n.t('user.cancelpclogin') }}
      </view>
    </view>
  </view>
</template>

<script>
/* eslint-disable */
import { http } from '@/api/api-request';
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data: () => {
    return {
      num: false,
      code: '',
      sessionId: '',
      token: '',
      switch: false,
      content: {},
      showPage: false,
      pcLoginLogo: '',
      registers: '',
    };
  },
  watch:{
    forums: {
      handler(newValue) {
        if (newValue) {
          this.pcLoginLogo = this.forums.set_site.site_logo || '/static/logo.png';
          if (this.forums.set_reg.register_type === 2) {
            this.registers = 1;
          }
        }
      },
      deep: true,
    }
  },
  onLoad(content) {
    this.content = content;
    this.isLogin = this.$store.getters['session/get']('isLogin');
    if(content.session_token) {
      uni.showToast({
        icon: 'none',
        title: this.i18n.t('user.loging'),
      });
      uni.setStorage({
        key: 'session_token_data',
        data: content.session_token,
        success: () => {
          this.token = content.session_token;
          this.$store.dispatch('session/wxPcLogin');
        },
      });
    }
  },
  methods: {
    pcLogin() {
      uni.getStorage({
        key: 'session_token_data',
        success: (e) => {
          if (e.data != '') {
            const sessionToken = e.data;
            const code = this.content.code;
            const state = this.content.state;
            const sessionId = this.content.sessionId;
            const Insensibility = this.registers;
            this.$store.dispatch('session/scancodeverification', {
              code,
              state,
              sessionId,
              sessionToken,
              Insensibility,
            })
            .then((res) => {
              if (res && res.data && res.data.data) {
                uni.showToast({
                  icon: 'none',
                  title: this.i18n.t('user.loginSuccess'),
                  success: () => {
                    this.cancelPclogin();
                  }
                });
              }
            })
            .catch((err) => {
              if (err && err.data && err.data.errors) {
                if (err.data.errors[0].code === 'no_bind_user') {
                  uni.showToast({
                    icon: 'none',
                    title: this.i18n.t('user.loginSuccess'),
                    success: () => {
                      this.cancelPclogin();
                    }
                  });
                }
              }
            })
          }
        },
      });
    },
    cancelPclogin() {
      WeixinJSBridge.call('closeWindow');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.pc-login {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100%;
  padding-top: 417rpx;
  background: #fff;
  box-sizing: border-box;
  justify-content: space-between;
  &__box {
    width: 437rpx;
    margin: 0 auto;
    &__img {
      display: block;
      width: 100%;
    }
  }
  &__title {
    height: 45rpx;
    margin-top: 63rpx;
    font-size: $fg-f5;
    font-weight: 400;
    line-height: 45rpx;
    color: #777;
    text-align: center;
  }
  &__btn {
    width: 670rpx;
    height: 90rpx;
    margin: 0 auto;
    font-size: $fg-f3;
    font-weight: 400;
    line-height: 90rpx;
    color: #fff;
    text-align: center;
    background: #1878f3;
    border-radius: 5rpx;
  }
  &__cancel {
    height: 37rpx;
    margin-top: 80rpx;
    font-size: $fg-f3;
    font-weight: 400;
    color: #1878f3;
    text-align: center;
  }
  &-bt {
    margin-bottom: 223rpx;
  }
}
</style>
