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
    </view>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      @scrolltoupper="refresh"
      show-scrollbar="false"
      class="scroll-y search-item"
    >
      <qui-content
        v-for="(item, index) in data"
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
      data: [],
      pageSize: 20,
      pageNum: 1, // 当前页数
    };
  },
  onLoad(params) {
    this.searchValue = params.value;
    this.getThemeList(params.value);
  },
  methods: {
    searchInput(e) {
      this.searchValue = e.target.value;
      this.data = [];
      this.getThemeList(e.target.value);
    },
    // 获取主题列表
    getThemeList(key) {
      const params = {
        include: ['user', 'firstPost', 'threadVideo'],
        'filter[isDeleted]': 'no',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[q]': key,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads', { params }]))
        .then(res => {
          if (res._jv) {
            delete res._jv;
          }
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          this.data = [...this.data, ...res];
        });
    },
    clearSearch() {
      this.searchValue = '';
      this.getThemeList('');
    },
    // 内容部分点击跳转到详情页
    contentClick(id) {
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getThemeList('');
    },
    refresh() {
      this.pageNum = 1;
      this.data = [];
      this.getThemeList(this.searchValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

.search-item {
  margin-bottom: 30rpx;
  background-color: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
// 主题
.search /deep/ .themeCount {
  padding-left: 40rpx;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  box-shadow: none;
}
/deep/ .themeCount .themeItem {
  padding-right: 40rpx;
  padding-left: 0;
  margin: 0;
}
/deep/ .themeCount .themeItem__footer {
  display: none;
}
.search-item__theme {
  position: relative;
  padding-left: 130rpx;
}
.search .search-box {
  padding: 30rpx 40rpx 0;
  background: --color(--qui-BG-2);
}
.scroll-y {
  max-height: calc(100vh - 110rpx);
}
</style>
