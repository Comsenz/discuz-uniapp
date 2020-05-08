<template>
  <view class="manage-box">
    <!-- 导航栏 -->
    <uni-nav-bar left-icon="back" status-bar fixed @clickLeft="clickNavBarLeft">
      <view slot="left" class="left-text">{{ title }}</view>
    </uni-nav-bar>
    <!-- 列表 -->
    <uni-list>
      <uni-list-item
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :show-arrow="true"
        @click="clickUniListItem(item)"
      >
        <template v-slot:right="">
          <text style="color: #333;">{{ item.value }}</text>
        </template>
      </uni-list-item>
    </uni-list>
    <view class="line"></view>
  </view>
</template>

<script>
import { uniNavBar, uniList, uniListItem } from '@dcloudio/uni-ui';

export default {
  components: {
    uniNavBar,
    uniList,
    uniListItem,
  },

  data() {
    return {
      title: '站长管理',
      list: [
        { id: 1, title: '成员管理', type: 'users', value: '设置' },
        { id: 2, title: '邀请成员', type: 'invite', value: '' },
      ],
    };
  },

  methods: {
    // 回到上一个页面
    clickNavBarLeft() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // 跳转至 成员管理/邀请成员 页面
    clickUniListItem(item) {
      console.log(`跳转${item.title}页面`);
      uni.navigateTo({
        url: `../manage/${item.type}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.manage-box {
  height: 100%;
  font-size: $fg-f28;
  background-color: #f9fafc;

  .left-text {
    min-width: 250rpx;
    font-weight: bold;
    color: #343434;
  }

  .line {
    height: 0rpx;
    margin: 0 0 10rpx;
    border: 1px solid #ededed;
  }
}
</style>
