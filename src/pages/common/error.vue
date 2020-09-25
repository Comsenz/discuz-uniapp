<template>
  <view class="page-message">
    <image class="page-message--icon" src="@/static/msg-404.svg" mode="aspectFit" lazy-load></image>
    <qui-button size="medium" @click="handleClick">
      返回上一页
    </qui-button>
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },

  methods: {
    handleClick() {
      const pages = getCurrentPages();
      const delta = pages.indexOf(pages[pages.length - 1]);
      if (delta === 0) {
        uni.redirectTo({
          url: `/pages/home/index`,
        });
      } else {
        uni.navigateBack({
          delta: 1,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
.page-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &--icon {
    height: 140rpx;
    margin: 140rpx 0 40rpx;
  }
}
</style>
