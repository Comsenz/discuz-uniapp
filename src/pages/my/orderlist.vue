<template>
  <view class="orderlist">
    <cell-item class="orderlist-wrap" title="时间：本月" slot-right>
      <view @tap="showFilter">
        <text>状态：{{ filterSelected.label }}</text>
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
      filterSelected: { label: '全部', value: '' }, // 筛选类型
      type: ['注册', '打赏', '付费主题'],
      filterList: [
        {
          title: '类型',
          data: [
            { label: '所有', value: '', selected: false },
            { label: '待付款', value: 0, selected: false },
            { label: '已付款', value: 1, selected: false },
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
      this.filterSelected = { ...e[0] };
      this.getList({ status: e[0].value });
    },
    showFilter() {
      this.show = true;
    },
    getList(obj) {
      // status 0待付款，1已付款
      const params = {
        include: 'thread.firstPost',
        'filter[user]': 1,
        'page[number]': 1,
        'page[limit]': 10,
        // 'filter[start_time]': '',
        // 'filter[end_time]': '',
      };
      if (obj && obj.status !== '') {
        params['filter[status]'] = obj.status;
      }
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
