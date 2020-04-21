<template>
  <view class="withdrawalslist">
    <cell-item class="withdrawalslist-head" :title="`时间：`" slot-right>
      <view>
        <text>状态：所有状态</text>
        <qui-icon class="text" name="icon-screen" size="16" color="#333"></qui-icon>
      </view>
    </cell-item>
    <view class="withdrawalslist-items">
      <cell-item
        title="审核中"
        brief="今天上午10:22"
        addon="¥1120.0"
        brief-right="待审核"
      ></cell-item>
      <cell-item
        title="您的账号存在异常情况，请联系系统管理员,请稍后关注处理信息"
        brief="2020-12-13 上午07：22"
        addon="¥210.0"
        brief-right="审核不通过"
      ></cell-item>
    </view>
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

<style lang="scss" scope>
page {
  background-color: #f9fafc;
}
.withdrawalslist {
  border-bottom: 2rpx solid #ededed;
  .cell-item {
    padding-right: 40rpx;
  }
  /deep/ .cell-item__body {
    height: 150rpx;
  }
  /deep/ .cell-item__body__right-text {
    font-weight: bold;
  }
  .icon-screen {
    margin-left: 20rpx;
  }
}

.withdrawalslist-items {
  padding-left: 40rpx;
  background: #fff;
}
.withdrawalslist-head {
  padding-top: 40rpx;
  padding-left: 40rpx;
  margin-bottom: 30rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;
}
.withdrawalslist-head /deep/ .cell-item__body {
  height: 78rpx;
}
</style>
