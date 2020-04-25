<template>
  <view class="walletlist">
    <cell-item class="walletlist-head" title="时间：本月" slot-right>
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
    <view class="walletlist-items">
      <cell-item
        v-for="(item, index) in dataList"
        :key="index"
        :title="item.change_desc"
        :brief="item.created_at"
        :addon="item.change_available_amount"
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
      filterSelected: { label: '全部', value: '' }, // 筛选类型
      dataList: [],
      filterList: [
        {
          title: '类型',
          data: [
            { label: '所有', value: '', selected: false },
            { label: '提现冻结', value: 10, selected: false },
            { label: '提现成功', value: 11, selected: false },
            { label: '提现解冻', value: 12, selected: false },
            { label: '注册收入', value: 30, selected: false },
            { label: '打赏收入', value: 31, selected: false },
            { label: '人工收入', value: 32, selected: false },
            { label: '人工支出', value: 50, selected: false },
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
      this.getList({ change_type: e[0].value });
    },
    showFilter() {
      this.show = true;
    },
    getList(obj) {
      // change_type 10提现冻结，11提现成功，12提现解冻，30注册收入，31打赏收入，32人工收入，50人工支出
      const params = {
        include: ['user', 'order.user', 'order.thread', 'order.thread.firstPost'],
        'filter[user]': 1,
        'page[number]': 1,
        'page[limit]': 10,
        // 'filter[start_time]': '',
        // 'filter[end_time]': '',
      };
      if (obj && obj.change_type) {
        params['filter[change_type]'] = obj.change_type;
      }
      status
        .run(() => this.$store.dispatch('jv/get', ['wallet/log', { params }]))
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
</style>
