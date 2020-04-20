<template>
  <view class="freeze-page">
    <view class="head-wrap">
      <view class="num-wrap">
        <text>共有</text>
        <text class="num">2</text>
        <text>条记录</text>
      </view>
      <view class="money-wrap">
        <text>涉及金额</text>
        <text class="money">¥1548.0</text>
      </view>
    </view>
    <view class="items-wrap">
      <cell-item
        title="冻结原因：提现中"
        brief="ID:148754"
        addon="¥1120.0"
        brief-right="今天上午07:22"
      ></cell-item>
      <cell-item
        title="冻结原因：违规调查中"
        brief="ID:148755"
        addon="¥210.0"
        brief-right="今天上午07:22"
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
.freeze-page {
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
  .num,
  .money,
  /deep/ .qui-cell-addon-text {
    font-weight: bold;
  }
  .num {
    margin: 0 5rpx;
  }
  .money {
    margin-left: 10rpx;
  }
  .head-wrap {
    display: flex;
    height: 78rpx;
    align-items: center;
    justify-content: space-between;
    padding: 0 40rpx;
    padding-top: 40rpx;
    margin-bottom: 30rpx;
    font-size: 24rpx;
    background: #fff;
    border-bottom: 2rpx solid #ededed;
  }
  .num-wrap {
    justify-content: flex-start;
  }
  .money-wrap {
    justify-content: flex-end;
  }
}
</style>
