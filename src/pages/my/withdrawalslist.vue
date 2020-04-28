<template>
  <view class="withdrawalslist">
    <cell-item class="withdrawalslist-head" slot-right>
      <view @tap="showFilter">
        <text>状态：{{ filterSelected.label }}</text>
        <qui-icon class="text" name="icon-screen" size="16" color="#333"></qui-icon>
        <filter-modal
          v-model="show"
          @confirm="confirm"
          :filter-list="filterList"
          :if-need-confirm="false"
          ref="filter"
        ></filter-modal>
      </view>
    </cell-item>
    <picker
      mode="date"
      :value="date"
      :start="startDate"
      :end="endDate"
      @change="bindDateChange"
      fields="month"
      class="date-picker"
    >
      <view class="uni-input">{{ `时间：${date}` }}</view>
    </picker>
    <view class="withdrawalslist-items">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDown"
        @scrolltoupper="refresh"
        show-scrollbar="false"
        class="scroll-y"
      >
        <cell-item
          v-for="(item, index) in dataList"
          :key="index"
          :title="operateStatus[item.cash_status - 1]"
          :brief="item.cash_sn"
          :addon="'¥' + item.cash_apply_amount"
          :brief-right="item.created_at"
          :class="item.cash_status === 3 ? '#fa5151' : '#777'"
        ></cell-item>
      </scroll-view>
      <load-more :status="loadingType"></load-more>
    </view>
  </view>
</template>

<script>
import cellItem from '@/components/qui-cell-item';
import filterModal from '@/components/qui-filter-modal';
import { status } from 'jsonapi-vuex';
import loadMore from '@/components/qui-load-more';

export default {
  components: {
    cellItem,
    filterModal,
    loadMore,
  },
  data: () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const currentDate = `${year}-${month}`;
    return {
      loadingType: 'more',
      totalData: 0, // 总数
      pageSize: 10,
      pageNum: 1, // 当前页数
      show: false,
      date: currentDate,
      filterSelected: { label: '全部', value: '' }, // 筛选类型
      operateStatus: ['待审核', '审核通过', '审核不通过', '待打款', '已打款', '打款失败'],
      showDate: false,
      dataList: [],
      filterList: [
        {
          title: '类型',
          data: [
            { label: '全部', value: '' },
            { label: '待审核', value: 1 },
            { label: '审核通过', value: 2 },
            { label: '审核不通过', value: 3 },
            { label: '待打款', value: 4 },
            { label: '已打款', value: 5 },
            { label: '打款失败', value: 6 },
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
      this.filterSelected = { ...e[0].data };
      this.getList('filter');
    },
    changeType(e) {
      this.filterList = e;
    },
    showFilter() {
      this.show = true;
      this.$refs.filter.setData();
    },
    // 日期选中
    bindDateChange(e) {
      this.date = e.target.value;
      this.getList('filter');
    },
    getList(type) {
      const dateArr = this.date.split('-');
      const days = new Date(dateArr[0], dateArr[1], 0).getDate();
      const params = {
        'filter[user]': 1,
        'page[number]': 1,
        'page[limit]': 10,
        'filter[start_time]': `${this.date}-01-00-00-00 `,
        'filter[end_time]': `${this.date}-${days}-00-00-00 `,
      };
      if (type && type === 'filter') {
        params.pageNum = 1;
        this.dataList = [];
      }
      if (this.filterSelected.value) {
        params['filter[cash_status]'] = this.filterSelected.value;
      }
      status
        .run(() => this.$store.dispatch('jv/get', ['wallet/cash', { params }]))
        .then(res => {
          // eslint-disable-next-line no-underscore-dangle
          this.totalData = res._jv.json.meta.total;
          // eslint-disable-next-line no-underscore-dangle
          const data = JSON.parse(JSON.stringify(res));
          // eslint-disable-next-line no-underscore-dangle
          delete data._jv;
          this.loadingType = data.length === 10 ? 'more' : 'nomore';
          this.dataList = Object.assign(data, this.dataList);
        });
    },
    // 下拉加载
    pullDown() {
      if (this.pageNum * this.pageSize < this.totalData) {
        this.pageNum += 1;
        this.getList();
      } else {
        this.loadingType = 'nomore';
      }
    },
    refresh() {
      this.pageNum = 1;
      this.data = [];
      this.getList();
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
.date-picker {
  position: absolute;
  top: 40rpx;
  left: 40rpx;
  z-index: 10;
  width: 50%;
  height: 78rpx;
}
.date-picker .uni-input {
  width: 100%;
  height: 78rpx;
  font-size: 28rpx;
  line-height: 78rpx;
}
.scroll-y {
  max-height: calc(100vh - 148rpx);
}
</style>
