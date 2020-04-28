<template>
  <view class="header" :style="{ 'background-image': 'url(' + backgroundHeadFullImg + ')' }">
    <view class="logoBox">
      <image class="logo" :src="headImg"></image>
    </view>
    <view class="circleDet">
      <text>
        {{ theme }}
        <text class="circleDet-num">{{ themeNum }}</text>
      </text>
      <text>
        {{ post }}
        <text class="circleDet-num">{{ postNum }}</text>
      </text>
      <text class="circleDet-share" @click="open">
        <qui-icon class="qui-icon" name="shareBtn" size="28" color="#c33"></qui-icon>
        {{ share }}
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
    theme: {
      type: String,
      default: '',
    },
    themeNum: {
      type: Number,
      default: 0,
    },
    post: {
      type: String,
      default: '',
    },
    postNum: {
      type: Number,
      default: 0,
    },
    share: {
      type: String,
      default: '',
    },
    shareBtn: {
      type: String,
      default: '',
    },
  },
  data: () => {
    return {};
  },
  onLond() {},
  methods: {
    open(evt) {
      this.$emit('click', evt);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.header {
  width: 100%;
  height: 400rpx;
  background: #1878f3;
  .logo {
    display: block;
    width: 400rpx;
    max-height: 88rpx;
    padding-top: 159rpx;
    margin: 0 auto;
    // background-image: url('https://discuz.chat/static/images/logo.png'), linear-gradient(#f00, #f00);
    // background-blend-mode: lighten;
    // background-size: cover;
  }
  .circleDet {
    display: flex;
    justify-content: space-between;
    padding-top: 69rpx;
    padding-right: 20rpx;
    padding-bottom: 47rpx;
    padding-left: 20rpx;
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
    .qui-icon {
      width: 30rpx;
      height: 30rpx;
      background: chartreuse;
    }
  }
}
</style>
