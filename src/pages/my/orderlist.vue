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
          :if-need-confirm="false"
        ></filter-modal>
      </view>
    </cell-item>
    <view class="orderlist-items">
      <cell-item
        v-for="(item, index) in dataList"
        :key="index"
        :title="type[item.type - 1]"
        :brief="item.created_at"
        :addon="item.amount"
        :brief-right="item.status == 1 ? '已付款' : '待付款'"
      ></cell-item>
    </view>
  </view>
</template>

<script>
import cellItem from '@/components/qui-cell-item';
import filterModal from '@/components/qui-filter-modal';
import { status } from 'jsonapi-vuex';

export default {
  components: {
    cellItem,
    filterModal,
  },
  data: () => {
    return {
      show: false,
      dataList: [],
      type: ['注册', '打赏', '付费主题'],
      filterList: [
        {
          title: '类型',
          data: [
            { label: '所有', value: '1', selected: false },
            { label: '支出', value: '2', selected: false },
            { label: '收入', value: '3', selected: false },
            { label: '其他类型', value: '4', selected: false },
          ],
        },
      ],
    };
  },
  onLoad() {
    this.getList();
  },
  methods: {
    confirm(e) {
      console.log(e);
    },
    showFilter() {
      this.show = true;
    },
    getList() {
      const params = {
        include: 'thread.firstPost',
        'filter[user]': 1,
        'page[number]': 1,
        'page[limit]': 10,
        // 'filter[cash_status]': '', // 1：待审核，2：审核通过，3：审核不通过，4：待打款， 5，已打款， 6：打款失败
        // 'filter[start_time]': '',
        // 'filter[end_time]': '',
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['order', { params }]))
        .then(res => {
          const data = JSON.parse(JSON.stringify(res));
          // eslint-disable-next-line no-underscore-dangle
          delete data._jv;
          this.dataList = data;
        });
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
