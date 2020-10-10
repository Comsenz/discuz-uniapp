<template>
  <view class="find">
    <!-- #ifdef MP-WEIXIN -->
    <uni-nav-bar
      :title="i18n.t('home.find')"
      fixed="true"
      :color="checked ? '#fff' : '#000'"
      :background-color="checked ? '#2e2f30' : '#fff'"
      status-bar
    ></uni-nav-bar>
    <!-- #endif -->
    <view class="find-item">
      <navigator url="/pages/site/search" hover-class="none">
        <qui-cell-item :title="i18n.t('profile.search')" arrow></qui-cell-item>
      </navigator>
      <navigator url="/pages/topic/list" hover-class="none">
        <qui-cell-item :title="i18n.t('topic.topic')" arrow :border="false"></qui-cell-item>
      </navigator>
    </view>
    <view
      class="find-item"
      v-if="forums.set_site && forums.set_site.site_pay_group_close === '1' ? true : false"
    >
      <navigator url="/pages/modify/right" hover-class="none">
        <qui-cell-item
          :title="i18n.t('topic.permissionPurchase')"
          arrow
          :border="false"
        ></qui-cell-item>
      </navigator>
    </view>
  </view>
</template>

<script>
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
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
  margin-bottom: 30rpx;
  background-color: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
</style>
