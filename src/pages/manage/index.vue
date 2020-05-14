<template>
  <qui-page>
    <view class="manage-items">
      <navigator url="./users" hover-class="none">
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
.manage-items {
  padding-left: 40rpx;

  .cell-item {
    padding-right: 40rpx;
  }
}
</style>
