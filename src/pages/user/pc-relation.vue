<template>
  <view class="pc-relation">
    <view class="pc-relation-tp">
      <view class="pc-relation__box">
        <image class="pc-relation__box__img" src="@/static/logo.png"></image>
      </view>
      <view class="pc-relation__imgbox">
        <view class="pc-relation__image">
          <image class="pc-relation__image-img" src="@/static/noavatar.gif"></image>
        </view>
        <view class="pc-relation__text">李李李</view>
      </view>
      <view class="pc-relation__title">
        {{ i18n.t('user.pcrelation') }}
      </view>
    </view>
    <view class="pc-relation-bt">
      <view class="pc-relation__btn" @click="authorization">
        {{ i18n.t('user.pcrelation') }}
      </view>
      <view class="pc-relation__cancel" @click="cancelPcrelation">
        {{ i18n.t('user.cancelpcrelation') }}
      </view>
    </view>
  </view>
</template>

<script>
/* eslint-disable */
import { http } from '@/api/api-request';

export default {
  data: () => {
    return {
      code: '',
      sessionId: '',
      token: '',
      content: {},
    };
  },
  onLoad(content) {
    this.content = content;
    console.log(this.content);
    if(content.session_token) {
      uni.setStorage({
        key: 'session_token_data',
        data: content.session_token,
        success: () => {
          this.token = content.session_token;
        },
      });
    } else {
      this.pcrelation();
    }
  },
  methods: {
    authorization() {
      this.$store.dispatch('session/wxPcRelation');
    },
    pcrelation() {
      uni.getStorage({
        key: 'session_token_data',
        success: (e) => {
          if (e.data != '') {
            console.log(e.data);
            const sessionToken = e.data;
            const code = this.content.code;
            const state = this.content.state;
            const sessionId = this.content.sessionId;
            this.$store.dispatch('session/pcrelation', {
              code,
              sessionId,
              state,
              sessionToken
            }).then((res) => {
              console.log(res);
              if (res && res.data && res.data.data) {
                uni.showToast({
                  icon: 'none',
                  title: this.i18n.t('user.pcrelationsuccess'),
                  success: () => {
                    this.cancelPclogin();
                  }
                });
              }
            });
          }
        },
      });
    },
    cancelPcrelation() {
      WeixinJSBridge.call('closeWindow');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.pc-relation {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100%;
  padding-top: 288rpx;
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
  &__imgbox {
    margin-top: 58rpx;
  }
  &__text {
    height: 37rpx;
    margin-top: 18rpx;
    font-size: $fg-f4;
    font-weight: bold;
    line-height: 37rpx;
    color: #000;
    text-align: center; 
  }
  &__image {
    width: 120rpx;
    height: 120rpx;
    margin: 0 auto;
    border-radius: 50%;
    &-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
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
