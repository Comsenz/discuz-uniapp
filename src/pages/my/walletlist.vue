<template>
  <view class="walletlist-page">
    <cell-item class="head-wrap" title="时间：本月" slot-right>
      <view>
        <text>状态：所有状态</text>
        <text class="quiicons icon-screen"></text>
      </view>
    </cell-item>
    <view class="detail">
      <view class="time">
        <view>区间</view>
        <view>2012-3-01 至 2012-03-30</view>
      </view>
      <view class="money">
        <view>支出￥1548.0</view>
        <view>收入￥5784.0</view>
      </view>
    </view>
    <view class="items-wrap">
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
.walletlist-page {
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
    background: #fff;
    border-bottom: 2rpx solid #ededed;
  }
  .head-wrap /deep/ .qui-cell-item-body {
    height: 78rpx;
  }
  .icon-screen {
    margin-left: 20rpx;
  }
  .detail {
    display: flex;
    height: 120rpx;
    align-items: center;
    justify-content: space-between;
    padding: 0 40rpx;
    font-size: 24rpx;
    color: #777;
  }
  .time {
    justify-content: flex-start;
  }
  .money {
    justify-content: flex-end;
  }
}
</style>
