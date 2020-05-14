<template>
  <view class="no-data">
    <view class="no-data__body">
      <qui-icon :name="iconName" color="#aaa" size="25"></qui-icon>
      <text class="tips">{{ tips }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    tips: {
      type: String,
      default: '暂无数据',
    },
    iconName: {
      type: String,
      default: 'icon-noData',
    },
  },
};
</script>

<style lang="scss" scoped>
.no-data {
  padding-bottom: 40rpx;
  font-size: 28rpx;
  color: #aaa;
  text-align: center;
}
.tips {
  margin-left: 20rpx;
}
</style>
