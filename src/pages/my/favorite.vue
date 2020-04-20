<template>
  <view class="favorite-page">
    <cell-item class="head-wrap" title="147条收藏"></cell-item>
  </view>
</template>

<script>
import cellItem from '@/components/qui-cell-item';

export default {
  components: {
    cellItem,
  },
};
</script>

<style lang="scss">
.favorite-page {
  .head-wrap {
    padding-top: 40rpx;
    padding-left: 40rpx;
    margin-bottom: 30rpx;
    border-bottom: 2rpx solid #ededed;
  }
  .head-wrap /deep/ .qui-cell-item-body {
    height: 78rpx;
  }
}
</style>
