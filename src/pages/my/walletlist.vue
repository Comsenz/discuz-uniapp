<template>
  <view class="walletlist">
    <cell-item class="walletlist-head" slot-right>
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
    <view class="walletlist-items">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDown"
        class="scroll-y"
      >
        <cell-item
          v-for="(item, index) in dataList"
          :key="index"
          :title="item.change_desc"
          :brief="item.created_at"
          :addon="item.change_available_amount"
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
      // change_type 10提现冻结，11提现成功，12提现解冻，30注册收入，31打赏收入，32人工收入，50人工支出
      const params = {
        include: ['user', 'order.user', 'order.thread', 'order.thread.firstPost'],
        'filter[user]': 1,
        'page[number]': 1,
        'page[limit]': 10,
        'filter[start_time]': `${this.date}-01-00-00-00 `,
        'filter[end_time]': `${this.date}-${days}-00-00-00 `,
      };
      if (obj && obj.change_type) {
        params.pageNum = 1;
        this.dataList = [];
        params['filter[change_type]'] = obj.change_type;
      }
      status
        .run(() => this.$store.dispatch('jv/get', ['wallet/log', { params }]))
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
      console.log(this.pageNum * this.pageSize);
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
