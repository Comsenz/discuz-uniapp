<template>
  <view class="orderlist">
    <cell-item class="orderlist-wrap" slot-right>
      <view @tap="showFilter">
        <text>状态：{{ filterSelected.label }}</text>
        <qui-icon class="text" name="icon-screen" size="16" color="#333"></qui-icon>
        <filter-modal
          v-model="show"
          @confirm="confirm"
          @change="changeType"
          :filter-list="filterList"
          :if-need-confirm="true"
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
    <view class="orderlist-items">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDown"
        class="scroll-y"
      >
        <cell-item
          v-for="(item, index) in dataList"
          :key="index"
          :title="type[item.type - 1]"
          :brief="item.created_at"
          :addon="item.amount"
          :brief-right="item.status == 1 ? '已付款' : '待付款'"
        ></cell-item>
      </scroll-view>
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
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const currentDate = `${year}-${month}`;
    return {
      totalData: 0, // 总数
      pageSize: 10,
      pageNum: 1, // 当前页数
      show: false,
      date: currentDate,
      dataList: [],
      filterSelected: { label: '全部', value: '' }, // 筛选类型
      type: ['注册', '打赏', '付费主题'],
      filterList: [
        {
          title: '类型',
          data: [
            { label: '所有', value: '', selected: true },
            { label: '待付款', value: 0 },
            { label: '已付款', value: 1 },
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
      this.getList({ status: e[0].data.value });
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
      this.pageNum = 1;
      this.dataList = [];
      this.getList();
    },
    getList(obj) {
      const dateArr = this.date.split('-');
      const days = new Date(dateArr[0], dateArr[1], 0).getDate();
      // status 0待付款，1已付款
      const params = {
        include: 'thread.firstPost',
        'filter[user]': 1,
        'page[number]': 1,
        'page[limit]': 10,
        'filter[start_time]': `${this.date}-01-00-00-00 `,
        'filter[end_time]': `${this.date}-${days}-00-00-00 `,
      };
      if (obj && obj.status !== '') {
        params.pageNum = 1;
        this.dataList = [];
        params['filter[status]'] = obj.status;
      }
      status
        .run(() => this.$store.dispatch('jv/get', ['order', { params }]))
        .then(res => {
          // eslint-disable-next-line no-underscore-dangle
          this.totalData = res._jv.json.meta.total;
          const data = JSON.parse(JSON.stringify(res));
          // eslint-disable-next-line no-underscore-dangle
          delete data._jv;
          this.dataList = Object.assign(data, this.dataList);
        });
    },
    // 下拉加载
    pullDown() {
      if (this.pageNum * this.pageSize < this.totalData) {
        this.pageNum += 1;
        this.getList();
      }
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
  height: calc(100vh - 148rpx);
}
</style>
