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
      switchdata: true,
    };
  },
  onLoad(content) {
    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif
    if (content.session_token) {
      console.log(111);
      uni.setStorage({
        key: 'session_token_data',
        data: content.session_token,
      });
      this.$store.dispatch('session/wxPcLogin');
    }
    if (content.sessionId) {
      console.log(222);
      this.datas = content;
    }
    uni.getStorage({
      key: 'session_token_data',
      success(e) {
        if (e.data !== '') {
          this.token = e.data;
        }
      },
    });
    // if (!this.switch) {
    //   uni.setStorage({
    //     key: 'session_token_data',
    //     data: content.session_token,
    //     success() {
    //       this.switchdata = false;
    //     },
    //   });
    //   this.$store.dispatch('session/wxPcLogin');
    // }
  },
  methods: {
    pcLogin() {
      this.datas.token = this.token;
      console.log(this.datas);
      if (this.isWeixin) {
        this.$store
          .dispatch('session/scancodeverification', this.datas)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    cancelPclogin() {},
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
