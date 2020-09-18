<template>
  <qui-page :data-qui-theme="theme" class="details">
    <viwe class="details-box" style="height: 100%;">
      <view class="details-box__head">
        全站白金会员
      </view>
      <view class="details-box__center">
        让青小蛙把压箱底的工具都 翻了出来，有用来保护眼睛的护目镜、防灰尘的口罩手
        套鬼知道当年青小蛙为了什么买齐了全套。但是，这好 像不太够。
        亚马逊的这些防护用品来自美国亚马逊、日本亚马逊德 国亚马逊和英国亚马逊，均可以直邮中国大陆。
      </view>
      <view class="details-box__foot">
        <view class="details-box__foot__top">
          购买后拥有以下权限：
        </view>
        <view class="details-box__foot__center">
          <view class="details-box__foot__center__box">帖子操作</view>
          <view class="details-box__foot__center__box">帖子操作帖子操作帖子操作</view>
          <view class="details-box__foot__center__box">帖子操作</view>
          <view class="details-box__foot__center__box">帖子操作</view>
          <view class="details-box__foot__center__box">帖子操作</view>
        </view>
      </view>
      <view class="details-box__bottom">
        <view class="details-box__bottom__top">
          有效期：
        </view>
        <view class="details-box__bottom__bot">
          购买90天后
        </view>
      </view>
      <view class="details-box__purchase">
        <view class="details-box__purchase-list">
          <qui-cell-item title="¥20元" slot-right :arrow="false" brief="你好" :border="false">
            <view class="details-box__purchase-list-btn">立即购买</view>
          </qui-cell-item>
        </view>
      </view>
    </viwe>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      typenum1: true,
      typenum2: false,
    };
  },
  methods: {
    powerlist(index) {
      if (index === 1) {
        this.typenum1 = true;
        this.typenum2 = false;
      } else {
        this.typenum1 = false;
        this.typenum2 = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.details /deep/ {
  width: 100vw;
  height: 100vh;
  background: #fff;
  box-sizing: border-box;
  .details-box {
    width: 100%;
    height: 100%;
  }
}
.details {
  &-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    box-sizing: border-box;
    &__head {
      width: 100%;
      height: 97rpx;
      padding-left: 40rpx;
      font-size: 36rpx;
      font-weight: bold;
      line-height: 97rpx;
      color: #303133;
      box-sizing: border-box;
    }
    &__center {
      width: 100%;
      padding: 0 40rpx;
      font-size: 28rpx;
      line-height: 45rpx;
      box-sizing: border-box;
    }
    &__foot {
      width: 100%;
      &__top {
        width: 100%;
        height: 31rpx;
        padding-left: 40rpx;
        margin-top: 50rpx;
        font-size: 28rpx;
        font-weight: bold;
        line-height: 31rpx;
        color: #333;
        box-sizing: border-box;
      }
      &__center {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        padding-left: 40rpx;
        margin-top: 21rpx;
        box-sizing: border-box;
      }
    }
    &__bottom {
      width: 100%;
      &__top {
        width: 100%;
        height: 31rpx;
        padding-left: 40rpx;
        margin-top: 50rpx;
        font-size: 28rpx;
        font-weight: bold;
        line-height: 31rpx;
        color: #333;
        box-sizing: border-box;
      }
      &__bot {
        width: 100%;
        height: 40rpx;
        padding: 0 40rpx;
        margin-top: 20rpx;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 40rpx;
        color: #333;
        box-sizing: border-box;
      }
    }
    &__purchase {
      bottom: 0;
      width: 100%;
      height: 130rpx;
      padding: 15rpx 40rpx 0;
      border-top: 2rpx solid #ededed;
      box-sizing: border-box;
    }
  }
}
.details-box__foot__center__box {
  height: 50rpx;
  min-width: 136rpx;
  margin: 40rpx 40rpx 0 0;
  font-size: 24rpx;
  font-weight: 400;
  line-height: 50rpx;
  color: #777;
  text-align: center;
  background: #f7f7f7;
}
.details-box__purchase-list-btn {
  width: 230rpx;
  height: 90rpx;
  font-size: 28rpx;
  font-weight: 400;
  line-height: 90rpx;
  color: #fff;
  text-align: center;
  background: #fa5151;
}
</style>
