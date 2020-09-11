<template>
  <qui-page :data-qui-theme="theme" class="parse-goods">
    <view class="parse-goods-box">
      <view>现以支持以下商品链接</view>
      <view class="parse-goods-box-image">
        <image class="image" lazy-load src="@/static/jingdong.svg" />
        <image class="image left right" lazy-load src="@/static/taobao.svg" />
        <image class="image right" lazy-load src="@/static/tmall.svg" />
        <image class="image" lazy-load src="@/static/pinduoduo.svg" />
      </view>
      <textarea v-model="link" />
      <qui-button>下一步</qui-button>
    </view>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      link: '',
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.parse-goods {
  font-size: $fg-f3;
  color: #000;
  background: #fff;

  &-box {
    margin: 40rpx;

    &-image {
      margin: 30rpx 0;

      .image {
        width: 80rpx;
        height: 80rpx;
      }

      .left {
        margin-left: 14rpx;
      }

      .right {
        margin-right: 14rpx;
      }
    }
  }
}
</style>
