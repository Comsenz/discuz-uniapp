<template>
  <view class="orderlist">
    <cell-item class="orderlist-wrap" title="时间：本月" slot-right>
      <view @tap="showFilter">
        <text>状态：所有状态</text>
        <qui-icon class="text" name="icon-screen" size="16" color="#333"></qui-icon>
        <filter-modal
          v-model="show"
          @confirm="confirm"
          :filter-list="filterList"
          :if-need-confirm="true"
        ></filter-modal>
      </view>
    </cell-item>
    <view class="orderlist-items">
      <cell-item
        title="审核中"
        brief="今天上午10:22"
        addon="-¥1120.0"
        brief-right="支付成功"
      ></cell-item>
      <cell-item
        title="您的账号存在异常情况，请联系系统管理员,请稍后关注处理信息"
        brief="2020-12-13 上午07：22"
        addon="-¥210.0"
        brief-right="支付成功"
      ></cell-item>
    </view>
  </view>
</template>

<script>
import cellItem from '@/components/qui-cell-item';
import filterModal from '@/components/qui-filter-modal';

export default {
  components: {
    cellItem,
    filterModal,
  },
  data: () => {
    return {
      show: false,
      filterList: [
        {
          title: '类型',
          data: [
            { label: '所有', value: '1' },
            { label: '支出', value: '2' },
            { label: '收入', value: '3' },
            { label: '其他类型', value: '4' },
          ],
        },
      ],
    };
  },
  methods: {
    confirm(e) {
      console.log(e);
    },
    showFilter() {
      this.show = true;
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #f9fafc;
}
.orderlist {
  border-bottom: 2rpx solid #ededed;
  .cell-item {
    padding-right: 40rpx;
  }
  /deep/ .cell-item__body {
    height: 150rpx;
  }
  /deep/ .cell-item__body__right-text {
    font-weight: bold;
    color: #189a00;
  }
  .icon-screen {
    margin-left: 20rpx;
  }
}
.orderlist-items {
  padding-left: 40rpx;
  background: #fff;
}
.orderlist-wrap {
  padding-top: 40rpx;
  padding-left: 40rpx;
  margin-bottom: 30rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;
}
.orderlist-wrap /deep/ .cell-item__body {
  height: 78rpx;
}
</style>
