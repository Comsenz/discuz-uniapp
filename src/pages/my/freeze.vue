<template>
  <view class="freeze">
    <view class="freeze-head">
      <view class="freeze-head__num">
        <text>共有</text>
        <text class="freeze-head__num__detail">{{ totalData }}</text>
        <text>条记录</text>
      </view>
      <view class="freeze-head__money">
        <text>涉及金额</text>
        <text class="freeze-head__money__detail">¥{{ totalamount }}</text>
      </view>
    </view>
    <view class="freeze-items">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDown"
        @scrolltoupper="refresh"
        show-scrollbar="false"
        class="scroll-y"
      >
        <qui-cell-item
          v-for="(freezeItem, index) in freezelist"
          :key="index"
          :title="freezeItem.change_desc"
          :brief="'ID:' + freezeItem.id"
          :addon="'¥' + freezeItem.change_freeze_amount"
          :brief-right="freezeItem.created_at"
        ></qui-cell-item>
        <qui-load-more :status="loadingType"></qui-load-more>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  components: {
    //
  },
  onLoad(params) {
    this.totalamount = params.totalamount || 0;
    this.getFreezelist();
  },
  data() {
    return {
      loadingType: 'more',
      totalData: 0, // 总数
      pageSize: 20,
      pageNum: 1, // 当前页数
      freezelist: [],
      totalamount: 0,
    };
  },
  methods: {
    // 获取冻结金额列表数据
    getFreezelist() {
      const params = {
        'filter[user]': 1,
        'filter[change_type]': 10,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
      };
      this.$store.dispatch('jv/get', ['wallet/log', { params }]).then(res => {
        this.totalData = res._jv.json.meta.total;
        delete res._jv;
        this.loadingType = Object.keys(res).length === this.pageSize ? 'more' : 'nomore';
        this.freezelist = { ...this.freezelist, ...res };
      });
    },
    // 下拉加载
    pullDown() {
      if (this.pageNum * this.pageSize < this.totalData) {
        this.pageNum += 1;
        this.freezelist();
      } else {
        this.loadingType = 'nomore';
      }
    },
    refresh() {
      this.pageNum = 1;
      this.freezelist = [];
      this.getFreezelist();
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
.scroll-y {
  max-height: calc(100vh - 148rpx);
}
</style>
