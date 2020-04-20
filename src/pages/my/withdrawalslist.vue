<template>
  <view class="withdrawalslist-page">
    <cell-item class="head-wrap" :title="`时间：`" slot-right>
      <view>
        <text>状态：所有状态</text>
        <text class="quiicons icon-screen"></text>
      </view>
    </cell-item>
    <view class="items-wrap">
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
.withdrawalslist-page {
  border-bottom: 2rpx solid #ededed;
  .qui-cell-item {
    padding-right: 40rpx;
  }
  .items-wrap {
    padding-left: 40rpx;
    background: #fff;
  }
  /deep/ .qui-cell-item-body {
    height: 150rpx;
  }
  /deep/ .qui-cell-addon-text {
    font-weight: bold;
  }
  .head-wrap {
    padding-top: 40rpx;
    padding-left: 40rpx;
    margin-bottom: 30rpx;
    background: #fff;
    border-bottom: 2rpx solid #ededed;
  }
  .head-wrap /deep/ .qui-cell-item-body {
    height: 78rpx;
  }
  .icon-screen {
    margin-left: 20rpx;
  }
}
</style>
