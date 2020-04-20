<template>
  <view class="walletlist">
    <cell-item class="walletlist-head" title="时间：本月" slot-right>
      <view>
        <text>状态：所有状态</text>
        <text class="quiicons icon-screen"></text>
      </view>
    </cell-item>
    <view class="walletlist-detail">
      <view class="walletlist-detail__time">
        <view>区间</view>
        <view>2012-3-01 至 2012-03-30</view>
      </view>
      <view class="walletlist-detail__money">
        <view>支出￥1548.0</view>
        <view>收入￥5784.0</view>
      </view>
    </view>
    <view class="walletlist-items">
      <cell-item
        title="审核中"
        brief="今天上午10:22"
        addon="¥1120.0"
        brief-right="入账成功"
      ></cell-item>
      <cell-item
        title="您的账号存在异常情况，请联系系统管理员,请稍后关注处理信息"
        brief="2020-12-13 上午07：22"
        addon="-¥210.0"
        brief-right="扣除金额"
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

<style lang="scss">
page {
  background-color: #f9fafc;
}
.walletlist {
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
.walletlist-items {
  padding-left: 40rpx;
  background: #fff;
}

.walletlist-head {
  padding-top: 40rpx;
  padding-left: 40rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;
}
.walletlist-head /deep/ .cell-item__body {
  height: 78rpx;
}
.walletlist-detail {
  display: flex;
  height: 120rpx;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx;
  font-size: 24rpx;
  color: #777;
}
.walletlist-detail__time {
  justify-content: flex-start;
}
.walletlist-detail__money {
  justify-content: flex-end;
}
</style>
