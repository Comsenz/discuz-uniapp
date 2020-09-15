<template>
  <view class="pc-login">
    <view class="pc-login-tp">
      <view class="pc-login__box">
        <image class="pc-login__box__img" src="@/static/logo.png"></image>
      </view>
      <view class="pc-login__title">
        PC端登录确认
      </view>
    </view>
    <view class="pc-login-bt">
      <view class="pc-login__btn" @click="pcLogin">
        登录
      </view>
      <view class="pc-login__cancel" @click="cancelPclogin">
        取消登录
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
    };
  },
  onLoad(data) {
    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif
    this.token = data.session_token;
    if (this.switch) {
      this.datas = data;
    }
  },
  methods: {
    pcLogin(data) {
      this.switch = true;
      setTimeout(() => {
        if (this.switch) {
          this.$store.dispatch('session/wxPcLogin');
          if (this.isWeixin) {
            this.$store
              .dispatch('session/scancodeverification', data)
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      }, 200);
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
