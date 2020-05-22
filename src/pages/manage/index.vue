<template>
  <qui-page>
    <view class="manage-items">
      <navigator url="./member" hover-class="none">
        <qui-cell-item title="成员管理" arrow slot-right>
          <text>设置</text>
        </qui-cell-item>
      </navigator>
      <navigator url="./invite" hover-class="none">
        <qui-cell-item title="邀请成员" arrow></qui-cell-item>
      </navigator>
    </view>
  </qui-page>
</template>

<style lang="scss" scope>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.manage-items {
  height: 100vh;
  padding: 0rpx 0rpx 0rpx 40rpx;
  background: --color(--qui-BG-2);

  .cell-item {
    padding: 0rpx 40rpx 0rpx 0rpx;
  }
}
</style>
