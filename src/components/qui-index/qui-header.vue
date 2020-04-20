<template>
  <view class="header">
    <view class="logoBox">
      <image class="logo" :src="headImg"></image>
    </view>
    <view class="circleDet">
      <text>
        主题
        <text class="circleDet-num">123</text>
      </text>
      <text>
        帖子
        <text class="circleDet-num">32.2k+</text>
      </text>
      <text class="circleDet-share" @click="btnShare">
        <qui-icon name="icon-share1" size="18" color="#fff" @click="handleClick"></qui-icon>
        分享
      </text>
    </view>
  </view>
</template>
<script>
export default {
  name: 'QuiHeader',
  props: {
    headImg: {
      type: String,
      default: '',
    },
    backgroundHeadFullImg: {
      type: String,
      default: '',
    },
  },
  data: () => {
    return {};
  },
  onLond() {},
  methods: {
    btnShare() {
      console.log('是分享哦');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.header {
  width: 100%;
  height: 271rpx;
  // background: #1878f3;
  .logo {
    display: block;
    width: 400rpx;
    max-height: 88rpx;
    padding-top: 74rpx;
    margin: 0 auto;
  }
  .circleDet {
    display: flex;
    justify-content: space-between;
    padding: 34rpx;
    line-height: 37rpx;
    color: --color(--qui-FC-AAA);
    text-align: center;
    // border-bottom: 1rpx solid #ccc;
    text {
      padding: 0 14rpx;
      font-size: $fg-f26;
      line-height: 37rpx;
      text-align: center;
    }
    .circleDet-num {
      color: --color(--qui-BG-2);
    }
    .circleDet-share {
      color: --color(--qui-BG-2);
    }
  }
}
</style>
