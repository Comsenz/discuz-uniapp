<template>
  <view class="header" :style="{ 'background-image': 'url(' + backgroundHeadFullImg + ')' }">
    <view class="logoBox">
      <image
        class="logo"
        :src="headImg != '' && headImg != null ? headImg : '/static/admin-logo-x2.png'"
        mode="aspectFit"
      ></image>
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
        <qui-icon class="qui-icon" name="icon-share1" size="26" :color="iconcolor"></qui-icon>
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
    themeNum: {
      type: Number,
      default: 0,
    },
    homecontent: {
      type: String,
      default: '',
    },
    iconcolor: {
      type: String,
      default: '#fff',
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
    return {
      // navigationBarStyle: {
      //   iconText: '类目', // 导航栏文字
      // },
    };
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
    // width: 100%;
    max-height: 88rpx;
    padding-top: 159rpx;
    margin: 0 auto;
  }
  .circleDet {
    display: flex;
    justify-content: space-between;
    padding: 69rpx 20rpx 47rpx;
    line-height: 37rpx;
    color: --color(--qui-FC-FFF);
    text-align: center;
    opacity: 0.5;
    text {
      // padding: 0 15rpx;
      font-size: $fg-f26;
      line-height: 37rpx;
      text-align: center;
    }
  }
  .circleDet-num {
    padding-left: 15rpx;
    font-size: $fg-f28;
    color: --color(--qui-FC-FFF);
  }
  .circleDet-share {
    font-size: $fg-f26;
    color: --color(--qui-FC-FFF);
  }
  .qui-icon {
    padding-right: 18rpx;
  }
  .bar-sticky {
    position: sticky;
    // position: -webkit-sticky;
    top: 0;
    z-index: 101;
  }
}
</style>
