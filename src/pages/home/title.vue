<template>
  <qui-page>
    <view class="ioschoice">
      <view class="ioschoice-img">
        <image class="ioschoice-img-icon" src="@/static/msg-warning.svg"></image>
      </view>
      <view class="ioschoice-title">
        {{ i18n.t('home.ioschoicetitle') }}
      </view>
      <view class="ioschoice-content">
        {{ i18n.t('home.ioschoicecontent') }}
      </view>
      <navigator open-type="exit" target="miniProgram" class="close-btn complete">
        {{ i18n.t('discuzq.pageHeader.title') }}
      </navigator>
    </view>
  </qui-page>
</template>

<script></script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.ioschoice {
  width: 100%;
  height: 100vh;
  padding-top: 240rpx;
}
.ioschoice-img {
  width: 140rpx;
  height: 140rpx;
  margin: 0 auto;
}
.ioschoice-img-icon {
  width: 100%;
  height: 100%;
}
.ioschoice-title {
  margin: 60rpx 0 20rpx;
  font-size: 34rpx;
  font-weight: bold;
  line-height: 45rpx;
  color: rgba(51, 51, 51, 1);
  text-align: center;
}
.ioschoice-content {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 37rpx;
  color: rgba(170, 170, 170, 1);
  text-align: center;
}
.close-btn {
  width: 510rpx;
  height: 90rpx;
  margin: 50rpx auto 0;
  font-size: 28rpx;
  font-weight: 400;
  line-height: 90rpx;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  background: rgba(24, 120, 243, 1);
  border: 2rpx solid 2px rgba(237, 237, 237, 1);
}
</style>
