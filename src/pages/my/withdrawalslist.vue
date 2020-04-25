<template>
  <view class="withdrawalslist">
    <cell-item
      class="withdrawalslist-head"
      :title="`时间：`"
      slot-right
      @contentClick="contentClick"
    >
      <view @tap="showFilter">
        <text>状态：{{ filterSelected.label }}</text>
        <qui-icon class="text" name="icon-screen" size="16" color="#333"></qui-icon>
        <filter-modal
          v-model="show"
          @confirm="confirm"
          :filter-list="filterList"
          :if-need-confirm="false"
        ></filter-modal>
        <date-pop size="height" :show="showDate" @close="closeDate">
          <date-picker @cancel="cancelDate" @sure="sureDate"></date-picker>
        </date-pop>
      </view>
    </cell-item>
    <view class="withdrawalslist-items">
      <cell-item
        v-for="(item, index) in dataList"
        :key="index"
        :title="operateStatus[item.cash_status - 1]"
        :brief="item.cash_sn"
        :addon="'¥' + item.cash_apply_amount"
        :brief-right="item.created_at"
        :class="item.cash_status === 3 ? '#fa5151' : '#777'"
      ></cell-item>
    </view>
  </view>
</template>

<script>
import cellItem from '@/components/qui-cell-item';
import filterModal from '@/components/qui-filter-modal';
import datePicker from '@/components/qui-date-picker/picker';
import datePop from '@/components/qui-date-picker/pop';
import { status } from 'jsonapi-vuex';

export default {
  components: {
    cellItem,
    filterModal,
    datePicker,
    datePop,
  },
  data: () => {
    return {
      show: false,
      filterSelected: { label: '全部', value: '' }, // 筛选类型
      operateStatus: ['待审核', '审核通过', '审核不通过', '待打款', '已打款', '打款失败'],
      showDate: false,
      dataList: [],
      filterList: [
        {
          title: '类型',
          data: [
            { label: '全部', value: '', selected: false },
            { label: '待审核', value: 1, selected: false },
            { label: '审核通过', value: 2, selected: false },
            { label: '审核不通过', value: 3, selected: false },
            { label: '待打款', value: 4, selected: false },
            { label: '已打款', value: 5, selected: false },
            { label: '打款失败', value: 6, selected: false },
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
      this.getList({ cash_status: e[0].value });
    },
    showFilter() {
      this.show = true;
    },
    contentClick() {
      console.log(111);
      this.showDate = true;
    },
    cancelDate() {
      this.close();
    },
    sureDate(e) {
      console.log(e);
    },
    closeDate() {
      this.showDate = false;
    },
    getList(obj) {
      const params = {
        'filter[user]': 1,
        'page[number]': 1,
        'page[limit]': 10,
        // 'filter[start_time]': '',
        // 'filter[end_time]': '',
      };
      if (obj && obj.cash_status) {
        params['filter[cash_status]'] = obj.cash_status;
      }
      status
        .run(() => this.$store.dispatch('jv/get', ['wallet/cash', { params }]))
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

<style lang="scss" scope>
page {
  background-color: #f9fafc;
}
.withdrawalslist {
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

.withdrawalslist-items {
  padding-left: 40rpx;
  background: #fff;
}
.withdrawalslist-head {
  padding-top: 40rpx;
  padding-left: 40rpx;
  margin-bottom: 30rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;
}
.withdrawalslist-head /deep/ .cell-item__body {
  height: 78rpx;
}
/deep/ .filter-modal {
  top: 118rpx;
}
</style>
