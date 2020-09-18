<template>
  <view class="pc-login">
    <view class="pc-login-tp">
      <view class="pc-login__box">
        <image class="pc-login__box__img" src="@/static/logo.png"></image>
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
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
// #endif
let switchdata = true;

/* eslint-disable */
export default {
  // #ifdef H5
  mixins: [appCommonH],
  // #endif
  data: () => {
    return {
      num: false,
      code: '',
      sessionId: '',
      token: '',
      // #ifdef H5
      isWeixin: false, // 默认不是微信浏览器
      // #endif
      switch: false,
      datas: {},
    };
  },
  onLoad(content) {
    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif
    uni.getStorage({
      key: 'access_token',
      success(e) {
        if (e.data) {
          switchdata = false;
          this.token = content.session_token;
          uni.setStorage({
            key: 'session_token_data',
            data: content.session_token,
          });
        }
      },
      fail() {
        switchdata = true;
        if (content.session_token) {
          uni.setStorage({
            key: 'session_token_data',
            data: content.session_token,
            success() {
              if (switchdata) {
                switchdata = true;
                this.$store.dispatch('session/wxPcLogin');
              } else {
                this.token = content.session_token;
              }
            },
          });
        }
        if (content.sessionId) {
          this.datas = content;
        }
      },
    });
  },
  methods: {
    pcLogin() {
      if (switchdata) {
        console.log(switchdata, '444');
        this.$store
          .dispatch('session/scancodeverification', this.datas)
          .then(res => {
            console.log(res);
            if (res && res.data && res.data.errors) {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('user.loginSuccessFail'),
                duration: 2000,
              });
            }
            if (res && res.data && res.data.data) {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('user.loginSuccess'),
                duration: 2000,
              });
              setTimeout(() => {
                WeixinJSBridge.call('closeWindow');
              }, 1500);
            }
          })
          .catch(err => {
            setTimeout(() => {
              console.log(111);
              WeixinJSBridge.call('closeWindow');
            }, 1000);
            if (err && err.data) {
              if (err.data.errors[0].sstatus === 500) {
                uni.showToast({
                  icon: 'none',
                  title: err.data.errors[0].code,
                  duration: 2000,
                });
              }
            }
          });
      } else {
        console.log(333);
        console.log(switchdata);
        this.datas.token = this.token;
        this.$store
          .dispatch('session/loginscancodeverification', this.datas)
          .then(res => {
            if (res && res.data && res.data.errors) {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('user.loginSuccessFail'),
                duration: 2000,
              });
            }
            if (res && res.data && res.data.pc_login) {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('user.loginSuccess'),
                duration: 2000,
              });
              setTimeout(() => {
                WeixinJSBridge.call('closeWindow');
              }, 1500);
            }
          })
          .catch(err => {
            if (err && err.data) {
              if (err.data.errors[0].sstatus === 500) {
                uni.showToast({
                  icon: 'none',
                  title: err.data.errors[0].code,
                  duration: 2000,
                });
              }
            }
          });
      }
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
    height: 70rpx;
    margin: 0 auto;
    &__img {
      width: 100%;
      height: 120%;
    }
  }
  &__title {
    width: 235rpx;
    height: 45rpx;
    margin: 63rpx auto 0;
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
    width: 112rpx;
    height: 37rpx;
    margin: 80rpx auto 0;
    font-size: $fg-f3;
    font-weight: 400;
    color: #1878f3;
  }
  &-bt {
    margin-bottom: 223rpx;
  }
}
</style>
