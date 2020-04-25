<template>
  <view class="withdrawalslist">
    <cell-item
      class="withdrawalslist-head"
      :title="`时间：`"
      slot-right
      @contentClick="contentClick"
    >
      <view @tap="showFilter">
        <text>状态：所有状态</text>
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
      operateStatus: ['待审核', '审核通过', '审核不通过', '待打款', '已打款', '打款失败'],
      showDate: false,
      dataList: [],
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
    getList() {
      const params = {
        'filter[user]': 1,
        'page[number]': 1,
        'page[limit]': 10,
        // 'filter[cash_status]': '', // 1：待审核，2：审核通过，3：审核不通过，4：待打款， 5，已打款， 6：打款失败
        // 'filter[start_time]': '',
        // 'filter[end_time]': '',
      };
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
