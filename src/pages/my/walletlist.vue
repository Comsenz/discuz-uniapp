<template>
  <qui-page class="walletlist">
    <view class="walletlist-head">
      <qui-cell-item slot-right :border="false">
        <view @tap="showFilter">
          <text>{{ `${i18n.t('profile.status')} ：${filterSelected.label}` }}</text>
          <qui-icon class="text" name="icon-screen" size="30" color="#777"></qui-icon>
          <qui-filter-modal
            v-model="show"
            @confirm="confirm"
            @change="changeType"
            :filter-list="filterList"
            :if-need-confirm="false"
            ref="filter"
          ></qui-filter-modal>
        </view>
      </qui-cell-item>
    </view>
    <picker
      mode="date"
      :value="date"
      :start="startDate"
      :end="endDate"
      @change="bindDateChange"
      fields="month"
      class="date-picker"
    >
      <view class="uni-input">{{ `${i18n.t('profile.time')}：${date}` }}</view>
    </picker>
    <view class="walletlist-items">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDown"
        show-scrollbar="false"
        class="scroll-y"
      >
        <qui-cell-item
          v-for="(item, index) in dataList"
          :key="index"
          :title="item.change_desc"
          :brief="timeHandle(item.created_at)"
          :addon="item.change_available_amount"
          :class-item="item.change_available_amount > 0 ? 'fail' : 'success'"
        ></qui-cell-item>
        <qui-load-more :status="loadingType"></qui-load-more>
      </scroll-view>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import { time2MinuteOrHour } from '@/utils/time';

export default {
  data() {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    const currentDate = `${year}-${month}`;
    return {
      loadingType: 'more',
      pageSize: 20,
      pageNum: 1, // 当前页数
      show: false,
      userId: uni.getStorageSync('user_id'), // 获取当前登陆用户的ID
      date: currentDate,
      filterSelected: { label: this.i18n.t('profile.all'), value: '' }, // 筛选类型
      dataList: [],
      filterList: [
        {
          title: this.i18n.t('profile.type'),
          data: [
            { label: this.i18n.t('profile.all'), value: '', selected: true },
            { label: this.i18n.t('profile.withdrawalfreeze'), value: 10 },
            { label: this.i18n.t('profile.withdrawalsucceed'), value: 11 },
            { label: this.i18n.t('profile.withdrawalunfreeze'), value: 12 },
            { label: this.i18n.t('profile.registeredincome'), value: 30 },
            { label: this.i18n.t('profile.rewardincome'), value: 31 },
            { label: this.i18n.t('profile.laborincome'), value: 32 },
            { label: this.i18n.t('profile.laborexpenditure'), value: 50 },
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
    // 处理时间
    timeHandle(time) {
      return time2MinuteOrHour(time);
    },
    getList(type) {
      const dateArr = this.date.split('-');
      const days = new Date(dateArr[0], dateArr[1], 0).getDate();
      // change_type 10提现冻结，11提现成功，12提现解冻，30注册收入，31打赏收入，32人工收入，50人工支出
      const params = {
        include: ['user', 'order.user', 'order.thread', 'order.thread.firstPost'],
        'filter[user]': this.userId,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[start_time]': `${this.date}-01-00-00-00 `,
        'filter[end_time]': `${this.date}-${days}-00-00-00 `,
      };
      if (type && type === 'filter') {
        params.pageNum = 1;
        this.dataList = [];
      }
      if (this.filterSelected.value) {
        params['filter[change_type]'] = this.filterSelected.value;
      }
      status
        .run(() => this.$store.dispatch('jv/get', ['wallet/log', { params }]))
        .then(res => {
          if (res._jv) {
            delete res._jv;
          }
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          this.dataList = [...this.dataList, ...res];
        });
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.walletlist {
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  /deep/ .cell-item {
    padding-right: 40rpx;
  }
  /deep/ .cell-item__body {
    height: auto;
    padding: 35rpx 0;
  }
  .walletlist-items .cell-item__body {
    align-items: flex-start;
  }
  /deep/ .cell-item__body__right-text {
    font-weight: bold;
  }
  /deep/ .icon-screen {
    margin-left: 20rpx;
  }
}
/deep/ .cell-item.fail .cell-item__body__right-text {
  color: --color(--qui-RED);
}
/deep/ .cell-item.success .cell-item__body__right-text {
  color: #189a00;
}
.walletlist-items {
  padding-left: 40rpx;
  margin-top: 30rpx;
  background: --color(--qui-BG-2);
}

.walletlist-head {
  padding-top: 40rpx;
  padding-left: 40rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
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
  font-size: $fg-f28;
  line-height: 78rpx;
}
.scroll-y {
  max-height: calc(100vh - 148rpx);
}
.cell-item__body__right {
  padding-left: 59rpx;
}
</style>
