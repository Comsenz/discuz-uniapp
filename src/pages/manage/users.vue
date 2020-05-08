<template>
  <view class="manage-users-box">
    <!-- 导航栏 -->
    <uni-nav-bar left-icon="back" status-bar fixed @clickLeft="clickNavBarLeft">
      <view slot="left" class="left-text">{{ title }}</view>
    </uni-nav-bar>
    <!-- 搜索成员 -->
    <uni-search-bar
      placeholder="搜索成员"
      :cancel-button="none"
      bg-color="#f6f6f6"
      @confirm="search"
      style="color: #c6c6c6;"
    ></uni-search-bar>
    <!-- 成员信息 -->
    <uni-list>
      <uni-list-item
        title="标题文字"
        :show-extra-icon="true"
        :extra-icon="{ color: '#4cd964', size: '70', type: 'contact' }"
      ></uni-list-item>
    </uni-list>
  </view>
</template>

<script>
import { uniNavBar, uniSearchBar, uniList, uniListItem } from '@dcloudio/uni-ui';
// import { QuiAvatarCell } from '@/components/qui-avatar-cell/qui-avatar-cell';

export default {
  components: {
    uniNavBar,
    uniSearchBar,
    uniList,
    uniListItem,
    // QuiAvatarCell,
  },

  data() {
    return {
      title: '成员管理',
    };
  },

  methods: {
    // 回到上一个页面
    clickNavBarLeft() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.manage-users-box {
  height: 100%;
  font-size: $fg-f28;
  background-color: #f9fafc;

  .left-text {
    min-width: 250rpx;
    font-weight: bold;
    color: #343434;
  }
}
</style>
