<template>
  <view class="search">
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
        <view @tap="clearSearch" v-if="searchValue" class="search-box__content-delete">
          <qui-icon name="icon-close" size="34" color="#fff"></qui-icon>
        </view>
      </view>
      <view class="search-box__cancel" v-if="searchValue" @tap="clearSearch">
        <text>取消</text>
      </view>
    </view>
    <view class="search-item" v-if="searchValue">
      <view class="search-item__head">
        <view class="search-item__head-title">用户</view>
        <view
          class="search-item__head-more"
          @tap="searchUser"
          v-if="Object.keys(userList).length > 0"
        >
          搜索更多用户
        </view>
      </view>
      <view
        class="search-item__users"
        v-for="(item, index) in userList"
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
      <qui-no-data tips="没有找到相关用户" v-if="userTotal == 0"></qui-no-data>
    </view>
    <view class="search-item search-item--themes" v-if="searchValue">
      <view class="search-item__head">
        <view class="search-item__head-title">主题</view>
        <view
          class="search-item__head-more"
          @tap="searchTheme"
          v-if="Object.keys(themeList).length > 0"
        >
          搜索更多主题
        </view>
      </view>
      <qui-content
        v-for="(item, index) in themeList"
        :key="index"
        :user-name="item.user.username"
        :theme-image="item.user.avatarUrl"
        :theme-btn="item.canHide"
        :user-groups="item.user.groups"
        :theme-time="item.createdAt"
        :theme-content="item.type == 1 ? item.title : item.firstPost.contentHtml"
        :tags="item.category.name"
        :images-list="item.firstPost.images"
        :theme-essence="item.isEssence"
        @contentClick="contentClick(item._jv.id)"
      ></qui-content>
      <qui-no-data tips="没有找到相关主题" v-if="themeTotal == 0"></qui-no-data>
    </view>
  </view>
</template>

<script>
import { status } from 'jsonapi-vuex';

export default {
  data() {
    return {
      searchValue: '',
      userList: {},
      themeList: {},
      userTotal: '',
      themeTotal: '',
      pageSize: 3,
      pageNum: 1, // 当前页数
    };
  },
  methods: {
    searchInput(e) {
      this.searchValue = e.target.value;
      this.getUserList(e.target.value);
      this.getThemeList(e.target.value);
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
          this.userTotal = res._jv.json.meta.total;
          delete res._jv;
          this.userList = res;
        });
    },
    // 获取主题列表
    getThemeList(key) {
      const params = {
        include: ['user', 'firstPost', 'threadVideo'],
        'filter[isDeleted]': 'no',
        'page[number]': this.pageNum,
        'page[limit]': 2,
        'filter[q]': key,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads', { params }]))
        .then(res => {
          this.themeTotal = res._jv.json.meta.threadCount;
          delete res._jv;
          this.themeList = res;
        });
    },
    clearSearch() {
      this.searchValue = '';
      this.userList = [];
      this.themeList = [];
    },
    // 内容部分点击跳转到详情页
    contentClick(id) {
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 点击头像到个人主页
    toProfile(userId) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${userId}`,
      });
    },
    searchTheme() {
      uni.navigateTo({
        url: `/pages/site/search-theme?value=${this.searchValue}`,
      });
    },
    searchUser() {
      uni.navigateTo({
        url: `/pages/site/search-user?value=${this.searchValue}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';
page {
  background-color: #f9fafc;
}
.search {
  .search-item,
  .search-box {
    background-color: #fff;
  }
}
.search-item {
  padding-left: 40rpx;
  margin-bottom: 30rpx;
  border-bottom: 2rpx solid #ededed;
}
.search-item__head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx 20rpx 0;
}
.search-item__head-title {
  font-size: $fg-f28;
  font-weight: bold;
}
.search-item__head-more {
  font-size: $fg-f24;
  color: #00479b;
}
// 用户
.cell-item {
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
.search-item__users:nth-child(2) {
  border: 0;
}
/deep/ .themeItem :nth-child(2) {
  border: 0;
}
// 主题
.search /deep/ .themeCount {
  border-bottom: 2rpx solid #ededed;
  box-shadow: none;
}
/deep/ .themeCount .themeItem {
  padding-left: 0;
  margin: 0;
}
/deep/ .themeCount .themeItem__footer {
  display: none;
}
</style>
