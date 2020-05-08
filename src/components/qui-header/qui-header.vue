<template>
  <view class="header" :style="{ 'background-image': 'url(' + backgroundHeadFullImg + ')' }">
    <view class="logoBox">
      <image class="logo" :src="headImg"></image>
    </view>
    <view class="circleDet">
      <text>
        {{ t.theme }}
        <text class="circleDet-num">{{ themeNum }}</text>
      </text>
      <text>
        {{ t.homecontent }}
        <text class="circleDet-num">{{ postNum }}</text>
      </text>

      <view class="circleDet-share" @click="open">
        <qui-icon class="qui-icon" name="icon-share1" size="28" color="#fff"></qui-icon>
        {{ t.share }}
      </view>
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
    homecontent: {
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
  computed: {
    // 语言包
    t() {
      return this.i18n.t('home');
    },
  },
  onLond() {},
  methods: {
    open(evt) {
      this.$emit('click', evt);
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.header {
  position: relative;
  width: 100%;
  height: 400rpx;
  background: #1878f3;
  .logo {
    display: block;
    width: 400rpx;
    max-height: 88rpx;
    padding-top: 159rpx;
    margin: 0 auto;
    // filter: grayscale(100%);
    // filter: drop-shadow(18px #fff);
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
  }
  .circleDet-num {
    color: --color(--qui-BG-2);
  }
  .circleDet-share {
    width: 100rpx;
    font-size: $fg-f26;
    color: --color(--qui-BG-2);
  }
  .qui-icon {
    padding-right: 13rpx;
  }
}
</style>
