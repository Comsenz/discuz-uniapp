/* eslint-disable no-underscore-dangle */
<template>
  <view class="freeze">
    <view class="freeze-head">
      <view class="freeze-head__num">
        <text>共有</text>
        <text class="freeze-head__num__detail">{{ total }}</text>
        <text>条记录</text>
      </view>
      <view class="freeze-head__money">
        <text>涉及金额</text>
        <text class="freeze-head__money__detail">¥{{ totalamount }}</text>
      </view>
    </view>
    <view class="freeze-items">
      <cell-item
        v-for="(freezeItem, index) in freezelist"
        :key="index"
        :title="freezeItem.change_desc"
        :brief="'ID:' + freezeItem.id"
        :addon="'¥' + freezeItem.change_freeze_amount"
        :brief-right="freezeItem.created_at"
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
  onLoad(params) {
    this.totalamount = params.totalamount || 0;
    this.getFreezelist();
  },
  data() {
    return {
      total: 0,
      totalamount: 0,
      data: [],
      freezelist: [],
    };
  },
  methods: {
    // 获取冻结金额列表数据
    getFreezelist() {
      const params = {
        'filter[user]': 1,
        'filter[change_type]': 10,
      };
      this.$store.dispatch('jv/get', ['wallet/log', { params }]).then(res => {
        // eslint-disable-next-line no-underscore-dangle
        this.total = res._jv.json.meta.total;
        const data = JSON.parse(JSON.stringify(res));
        // eslint-disable-next-line no-underscore-dangle
        delete data._jv;
        this.freezelist = data;
        console.log(res);
      });
    },
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
