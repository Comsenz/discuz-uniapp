<template>
  <qui-page :data-qui-theme="theme" class="find">
    <view class="find-item">
      <navigator url="/pages/site/search" hover-class="none">
        <qui-cell-item :title="i18n.t('profile.search')" arrow></qui-cell-item>
      </navigator>
      <navigator url="/pages/topic/list" hover-class="none">
        <qui-cell-item :title="i18n.t('topic.topic')" arrow :border="false"></qui-cell-item>
      </navigator>
    </view>
    <view class="find-item">
      <navigator url="/pages/topic/list" hover-class="none">
        <qui-cell-item
          :title="i18n.t('topic.permissionPurchase')"
          arrow
          :border="false"
        ></qui-cell-item>
      </navigator>
    </view>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      searchValue: '',
    };
  },
  methods: {
    ontrueGetList() {
      //
    },
    toSearch() {
      uni.navigateTo({
        url: '/pages/site/search',
      });
    },
    clearSearch() {
      this.searchValue = '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.find /deep/ {
  .cell-item {
    padding-right: 40rpx;
  }
}
.find-item {
  padding-left: 40rpx;
  margin-top: 30rpx;
  background-color: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
</style>
