<template>
  <view class="post-box">
    <view class="post-box__header">
      <view class="post-box__header-l">
        <qui-icon name="icon-expression" />
        <qui-icon name="icon-call" />
      </view>
      <text class="post-box__header-r">
        还能输入450个字
      </text>
    </view>
    <view>
      <textarea></textarea>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Post',
};
</script>

<style lang="scss" scoped>
.post-box {
  width: 100vw;
  padding: 40rpx;
  box-sizing: border-box;
  &__header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
