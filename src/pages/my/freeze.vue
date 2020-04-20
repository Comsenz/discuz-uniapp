<template>
  <view class="freeze">
    <view class="freeze-head">
      <view class="freeze-head__num">
        <text>共有</text>
        <text class="freeze-head__num__detail">2</text>
        <text>条记录</text>
      </view>
      <view class="freeze-head__money">
        <text>涉及金额</text>
        <text class="freeze-head__money__detail">¥1548.0</text>
      </view>
    </view>
    <view class="freeze-items">
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
.freeze {
  border-bottom: 2rpx solid #ededed;
  .cell-item {
    padding-right: 40rpx;
  }
  /deep/ .cell-item__body {
    height: 150rpx;
  }
  .freeze-head__num__detail,
  .freeze-head__money__detail,
  /deep/ .cell-item__body__right-text {
    font-weight: bold;
  }
}
.freeze-items {
  padding-left: 40rpx;
  background: #fff;
}
.freeze-head__num__detail {
  margin: 0 5rpx;
}
.freeze-head__money__detail {
  margin-left: 10rpx;
}
.freeze-head {
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
.freeze-head__num {
  justify-content: flex-start;
}
.freeze-head__money {
  justify-content: flex-end;
}
</style>
