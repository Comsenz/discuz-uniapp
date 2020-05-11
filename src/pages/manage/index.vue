<template>
  <view class="manage">
    <view class="manage-items">
      <navigator url="./users" hover-class="none">
        <qui-cell-item title="成员管理" arrow slot-right>
          <text>设置</text>
        </qui-cell-item>
      </navigator>
      <navigator url="./invite" hover-class="none">
        <qui-cell-item title="邀请成员" arrow :border="false"></qui-cell-item>
      </navigator>
    </view>
  </view>
</template>

<script>
export default {
  components: {},

  data() {
    return {};
  },

  methods: {},
};
</script>

<style lang="scss" scope>
page {
  background-color: #f9fafc;
}
.manage-items {
  padding-left: 40rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;

  .cell-item {
    padding-right: 40rpx;
  }
}
</style>
