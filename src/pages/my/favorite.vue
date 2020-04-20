<template>
  <view class="favorite">
    <cell-item class="favorite-head" title="147条收藏"></cell-item>
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
.favorite-head {
  padding-top: 40rpx;
  padding-left: 40rpx;
  margin-bottom: 30rpx;
  border-bottom: 2rpx solid #ededed;
}
.favorite-head /deep/ .cell-item__body {
  height: 78rpx;
}
</style>
