<template>
  <qui-page class="search">
    <view class="search-box">
      <view class="search-box__content">
        <qui-icon class="icon-content-search" name="icon-search" size="30" color="#bbb"></qui-icon>
        <input
          type="text"
          class="search-box__content-input"
          placeholder-class="input-placeholder"
          placeholder="搜索关键字"
          @input="searchInput"
          :value="searchValue"
        />
        <view class="search-box__content-delete" @click="clearSearch" v-if="searchValue">
          <qui-icon class="icon-close" name="icon-close" size="34" color="#fff"></qui-icon>
        </view>
      </view>
    </view>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      @scrolltoupper="refresh"
      show-scrollbar="false"
      class="scroll-y search-item"
    >
      <view
        class="search-item__users"
        v-for="(item, index) in data"
        :key="index"
        @tap="toProfile(item.id)"
      >
        <image
          class="search-item__users__avatar"
          :src="item.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'"
          alt="avatarUrl"
        ></image>
        <qui-cell-item
          :title="item.username"
          arrow
          :addon="item.groups ? Object.values(item.groups)[0].name : ''"
        ></qui-cell-item>
      </view>
      <qui-load-more :status="loadingType"></qui-load-more>
    </scroll-view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  data() {
    return {
      searchValue: '',
      loadingType: 'more',
      data: {},
      totalData: 0, // 总数
      pageSize: 20,
      pageNum: 1, // 当前页数
    };
  },
  onLoad(params) {
    this.searchValue = params.value;
    this.getUserList(params.value);
  },
  methods: {
    searchInput(e) {
      this.searchValue = e.target.value;
      this.data = {};
      this.getUserList(e.target.value);
    },
    // 获取用户列表
    getUserList(key) {
      const params = {
        include: 'groups',
        sort: 'createdAt',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[username]': `*${key}*`,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['users', { params }]))
        .then(res => {
          this.totalData = res._jv.json.meta.total;
          delete res._jv;
          this.loadingType = Object.keys(res).length === this.pageSize ? 'more' : 'nomore';
          this.data = { ...this.data, ...res };
        });
    },
    clearSearch() {
      this.searchValue = '';
      this.getUserList('');
    },
    back() {
      uni.navigateBack();
    },
    // 点击头像到个人主页
    toProfile(userId) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${userId}`,
      });
    },
    // 下拉加载
    pullDown() {
      if (this.pageNum * this.pageSize < this.totalData) {
        this.pageNum += 1;
        this.getUserList(this.searchValue);
      } else {
        this.loadingType = 'nomore';
      }
    },
    refresh() {
      this.pageNum = 1;
      this.data = [];
      this.getUserList(this.searchValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.search-item {
  padding-left: 40rpx;
  margin-bottom: 30rpx;
  border-bottom: 2rpx solid #ededed;
}
// 用户
/deep/ .cell-item {
  padding-right: 40rpx;
}
/deep/ .cell-item__body__right {
  padding-right: 40rpx;
  font-size: 28rpx;
  color: #aaa;
}
.search-item__users__avatar {
  position: absolute;
  top: 16rpx;
  left: 0;
  width: 70rpx;
  height: 70rpx;
  background: #a8a8a8;
  border-radius: 50%;
}
.search-item__users {
  position: relative;
  padding-left: 90rpx;
}
.scroll-y {
  max-height: calc(100vh - 115rpx);
}
</style>
