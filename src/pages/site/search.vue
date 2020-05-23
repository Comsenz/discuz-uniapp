<template>
  <qui-page class="search">
    <view class="search-box">
      <view class="search-box__content">
        <qui-icon class="icon-content-search" name="icon-search" size="30" color="#bbb"></qui-icon>
        <input
          type="text"
          class="search-box__content-input"
          placeholder-class="input-placeholder"
          :placeholder="i18n.t('search.searchkeywords')"
          @input="searchInput"
          :value="searchValue"
        />
        <view @tap="clearSearch" v-if="searchValue" class="search-box__content-delete">
          <qui-icon name="icon-close1" size="32" color="#ccc"></qui-icon>
        </view>
      </view>
      <view class="search-box__cancel" v-if="searchValue" @tap="clearSearch">
        <text>{{ i18n.t('search.cancel') }}</text>
      </view>
    </view>
    <view class="search-item" v-if="searchValue">
      <view class="search-item__head">
        <view class="search-item__head-title">{{ i18n.t('search.users') }}</view>
        <view
          class="search-item__head-more"
          @tap="searchUser"
          v-if="Object.keys(userList).length > 0"
        >
          {{ i18n.t('search.searchmoreusers') }}
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
          :src="item.avatarUrl || '/static/noavatar.gif'"
          alt="avatarUrl"
          :mode="modeVal"
        ></image>
        <qui-cell-item
          :title="item.username"
          arrow
          :border="index == 2 ? false : true"
          :addon="item.groups ? Object.values(item.groups)[0].name : ''"
        ></qui-cell-item>
      </view>
      <qui-no-data
        :tips="i18n.t('search.norelatedusersfound')"
        v-if="userTotal === 0"
      ></qui-no-data>
    </view>
    <view class="search-item search-item--themes" v-if="searchValue">
      <view class="search-item__head">
        <view class="search-item__head-title">{{ i18n.t('search.themes') }}</view>
        <view
          class="search-item__head-more"
          @tap="searchTheme"
          v-if="Object.keys(themeList).length > 0"
        >
          {{ i18n.t('search.searchmorethemes') }}
        </view>
      </view>
      <view
        v-for="(item, index) in themeList"
        :key="index"
        :class="index == 1 ? 'noBorder' : ''"
        class="search-item__content"
      >
        <qui-content
          :user-name="item.user.username"
          :theme-image="item.user.avatarUrl"
          :theme-btn="item.canHide"
          :user-groups="item.user.groups"
          :theme-time="item.createdAt"
          :theme-content="item.type == 1 ? item.title : item.firstPost.summary"
          :thread-type="item.type"
          :tags="[item.category]"
          :media-url="item.threadVideo.media_url"
          :images-list="item.firstPost.images"
          :theme-essence="item.isEssence"
          :video-width="item.threadVideo.width"
          :video-height="item.threadVideo.height"
          @contentClick="contentClick(item._jv.id)"
          @headClick="toProfile(item.user._jv.id)"
        ></qui-content>
        <qui-icon class="arrow" name="icon-folding-r" size="22" color="#ddd"></qui-icon>
      </view>
      <qui-no-data
        :tips="i18n.t('search.norelatedthemesfound')"
        v-if="themeTotal === 0"
      ></qui-no-data>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  data() {
    return {
      searchValue: '',
      userList: [],
      themeList: [],
      userTotal: '',
      themeTotal: '',
      pageNum: 1, // 当前页数
      // 图片裁剪、缩放的模式
      modeVal: {
        type: String,
        default: 'aspectFill',
      },
    };
  },
  methods: {
    searchInput(e) {
      this.searchValue = e.target.value;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getUserList(e.target.value);
        this.getThemeList(e.target.value);
      }, 250);
    },
    // 获取用户列表
    getUserList(key) {
      const params = {
        include: 'groups',
        sort: 'createdAt',
        'page[number]': this.pageNum,
        'page[limit]': 3,
        'filter[username]': `*${key}*`,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['users', { params }]))
        .then(res => {
          this.userTotal = res.length;
          this.userList = res;
        });
    },
    // 获取主题列表
    getThemeList(key) {
      const params = {
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
        'filter[isDeleted]': 'no',
        'page[number]': this.pageNum,
        'page[limit]': 2,
        'filter[q]': key,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads', { params }]))
        .then(res => {
          this.themeTotal = res.length;
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
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.search {
  .search-item,
  .search-box {
    background-color: --color(--qui-BG-2);
  }
}
.search-item {
  padding-left: 40rpx;
  margin-bottom: 30rpx;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
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
  color: --color(--qui-LINK);
}
// 用户
.cell-item {
  padding-right: 40rpx;
}
/deep/ .cell-item__body__right {
  padding-right: 40rpx;
  font-size: $fg-f28;
  color: --color(--qui-FC-AAA);
}
.search-item__users__avatar {
  position: absolute;
  top: 16rpx;
  left: 0;
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
}
.search-item__users {
  position: relative;
  padding-left: 90rpx;
}
// 主题
.search /deep/ .themeCount {
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  box-shadow: none;
}
/deep/ .themeCount .themeItem {
  padding-left: 0;
  margin: 0;
}
/deep/ .themeCount .themeItem__footer {
  display: none;
}
.noBorder /deep/ .themeCount {
  border: 0;
}
.search-item__content {
  position: relative;
}
.arrow {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
}
/deep/ .themeCount .addFine {
  display: none;
}
</style>
