<template>
  <qui-page :data-qui-theme="theme" class="power-box">
    <view class="power-box__package">
      <view class="power-box__package-head">
        <view
          :class="
            typenum1
              ? 'power-box__package-head-smore boder-bottom'
              : 'power-box__package-head-smore'
          "
          @click="powerlist(1)"
        >
          权力列表
        </view>
        <view
          :class="
            typenum2
              ? 'power-box__package-head-smore boder-bottom'
              : 'power-box__package-head-smore'
          "
          @click="powerlist(2)"
        >
          已购权力
        </view>
      </view>
      <view class="power-box__package-foot" v-if="typenum1">
        <view class="power-box__package-foot-list">
          <qui-cell-item
            title="全站白金会员"
            slot-right
            :arrow="false"
            brief="你好"
            :border="false"
          >
            <view class="money">¥1150.0</view>
          </qui-cell-item>
        </view>
        <view class="power-box__package-foot-list">
          <qui-cell-item
            title="全站白金会员"
            slot-right
            :arrow="false"
            brief="你好"
            :border="false"
          >
            <view class="money">¥1150.0</view>
          </qui-cell-item>
        </view>
        <view class="power-box__package-foot-list">
          <qui-cell-item
            title="全站白金会员"
            slot-right
            :arrow="false"
            brief="你好"
            :border="false"
          >
            <view class="money">¥1150.0</view>
          </qui-cell-item>
        </view>
      </view>
      <view class="power-box__package-foots" v-if="typenum2">
        <view class="power-box__package-foots-list">
          <qui-cell-item
            title="全站白金会员"
            slot-right
            :arrow="false"
            brief="你好"
            :border="false"
          >
            <view class="time">2013-3-3 到期</view>
          </qui-cell-item>
        </view>
        <view class="power-box__package-foots-list">
          <qui-cell-item
            title="全站白金会员"
            slot-right
            :arrow="false"
            brief="你好"
            :border="false"
          >
            <view class="time">2013-3-3 到期</view>
          </qui-cell-item>
        </view>
        <view class="power-box__package-foots-list">
          <qui-cell-item
            title="全站白金会员"
            slot-right
            :arrow="false"
            brief="你好"
            :border="false"
          >
            <view class="time">2013-3-3 到期</view>
          </qui-cell-item>
        </view>
      </view>
    </view>
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
.power-box {
  background: #f9fafc;
  box-sizing: border-box;
  &__package {
    width: 100vw;
    /* #ifndef H5 */
    height: 100vh;
    /* #endif */
    background-color: #f9fafc;
    box-sizing: border-box;
    &-head {
      display: flex;
      width: 100%;
      height: 108rpx;
      border-bottom: 2rpx solid #ededed;
      &-smore {
        width: 240rpx;
        height: 100%;
        font-size: 28rpx;
        font-weight: bold;
        line-height: 108rpx;
        color: #333;
        text-align: center;
      }
      .boder-bottom {
        border-bottom: 4rpx solid #1878f3;
      }
    }
    &-foot {
      padding-left: 40rpx;
      margin-top: 40rpx;
      background: #fff;
      box-sizing: border-box;
      &-list {
        height: 150rpx;
        padding-right: 40rpx;
        border-bottom: 2rpx solid #ededed;
      }
    }
    &-foots {
      padding-left: 40rpx;
      margin-top: 40rpx;
      background: #fff;
      box-sizing: border-box;
      &-list {
        height: 150rpx;
        padding-right: 40rpx;
        border-bottom: 2rpx solid #ededed;
      }
    }
  }
}
/deep/.cell-item__body__content-title {
  margin-top: 40rpx;
  font-size: 28rpx;
  color: #333;
}
.money {
  font-size: 28rpx;
  font-weight: bold;
  color: #fa5151;
}
.time {
  font-size: 28rpx;
  font-weight: 400;
  color: #777;
}
</style>
