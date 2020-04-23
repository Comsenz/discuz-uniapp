<template>
  <scroll-view class="like" scroll-y scroll-x="false">
    <view class="like-items" v-for="(item, index) in newsList" :key="index">
      <text>{{ item }}</text>
    </view>
    <load-more :status="loadingType"></load-more>
  </scroll-view>
</template>

<script>
import loadMore from '@/components/qui-load-more';

export default {
  components: {
    loadMore,
  },
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      newsList: [],
      page: 1,
      source: 0,
      loadingType: 'more',
    };
  },
  onLoad(option) {
    this.source = option.source;
    this.getList();
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.page = 1;
    this.newsList = [];
    this.getList('refresh');
  },
  // 加载更多
  onReachBottom() {
    this.page += this.page;
    this.getList();
  },
  methods: {
    // async getList(type) {
    //   await this.$get(`接口地址`, {
    //     page: this.page,
    //   })
    //     .then(r => {
    //       if (type === 'refresh') {
    //         uni.stopPullDownRefresh();
    //       }
    //       this.loadingType = r.data.length === 10 ? 'more' : 'nomore';
    //       this.newsList = [...this.newsList, ...r.data];
    //     })
    //     .catch(() => {
    //       if (type === 'refresh') {
    //         uni.stopPullDownRefresh();
    //       }
    //     });
    // },
  },
};
</script>

<style lang="scss" scope>
.like {
  height: calc(100vh - 400rpx);
}
.like-items {
  height: 454rpx;
  margin-bottom: 20rpx;
  background: #fff;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}
</style>
