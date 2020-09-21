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
        <view class="power-box__package-foot-list" @click="godetails">
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
        <view class="power-box__package-foot-list" @click="godetails">
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
        <view class="power-box__package-foot-list" @click="godetails">
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
        <view class="power-box__package-foots-list" @click="godetails">
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
        <view class="power-box__package-foots-list" @click="godetails">
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
        <view class="power-box__package-foots-list" @click="godetails">
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
    godetails() {
      uni.navigateTo({
        url: '/pages/modify/rightdetails',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.power-box {
  background: --color(--qui-BG-1);
  box-sizing: border-box;
  &__package {
    width: 100vw;
    /* #ifndef H5 */
    height: 100vh;
    /* #endif */
    background-color: --color(--qui-BG-1);
    box-sizing: border-box;
    &-head {
      display: flex;
      width: 100%;
      height: 108rpx;
      background: --color(--qui-BG-2);
      border-bottom: 2rpx solid --color(--qui-BG-777);
      &-smore {
        width: 240rpx;
        height: 100%;
        font-size: 28rpx;
        font-weight: bold;
        line-height: 108rpx;
        color: --color(--qui-FC-333);
        text-align: center;
      }
      .boder-bottom {
        border-bottom: 4rpx solid --color(--qui-BG-HIGH-LIGHT);
      }
    }
    &-foot {
      padding-left: 40rpx;
      margin-top: 40rpx;
      background: --color(--qui-BG-2);
      box-sizing: border-box;
      &-list {
        height: 150rpx;
        padding-right: 40rpx;
        border-bottom: 2rpx solid --color(--qui-BG-777);
      }
    }
    &-foots {
      padding-left: 40rpx;
      margin-top: 40rpx;
      background: --color(--qui-BG-2);
      box-sizing: border-box;
      &-list {
        height: 150rpx;
        padding-right: 40rpx;
        border-bottom: 2rpx solid --color(--qui-BG-777);
      }
    }
  }
}
/deep/.cell-item__body__content-title {
  margin-top: 40rpx;
  font-size: 28rpx;
  color: --color(--qui-FC-333);
}
.money {
  font-size: 28rpx;
  font-weight: bold;
  color: --color(--qui-RED);
}
.time {
  font-size: 28rpx;
  font-weight: 400;
  color: --color(--qui-FC-TAG);
}
</style>
