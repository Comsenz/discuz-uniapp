<template>
  <view class="manage-invite-box">
    <!-- 导航栏 -->
    <uni-nav-bar left-icon="back" status-bar fixed @clickLeft="clickNavBarLeft">
      <view slot="left" class="left-text">{{ title }}</view>
    </uni-nav-bar>
    <!-- 标签栏 -->
    <scroll-view
      scroll-x
      class="scroll-row"
      style="display: flex; height: 150rpx; text-align: center; background-color: #fff; border-bottom: 2px solid #ededed;"
    >
      <view
        class="scroll-row-item"
        style="flex: 0 0 33.33%; height: 150rpx; line-height: 150rpx;"
        v-for="tabItem in tabList"
        :key="tabItem.id"
      >
        <text class="text">{{ tabItem.tabName }}</text>
      </view>
    </scroll-view>
    <!-- 内容 -->
    <view class=""></view>
    <!-- 邀请链接按钮 -->
    <view class="button">
      <button type="default" class="btn" @click="generateUrl">生成邀请链接</button>
    </view>
  </view>
</template>

<script>
import { uniNavBar } from '@dcloudio/uni-ui';

export default {
  components: {
    uniNavBar,
  },

  data() {
    return {
      title: '邀请成员',
      tabList: [
        { id: 1, tabName: '未使用' },
        { id: 2, tabName: '已使用' },
        { id: 3, tabName: '已失效' },
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
    // 生成邀请链接
    generateUrl() {},
    // 获取当前滑块的index
    bindchange(e) {
      this.currentData = e.detail.current;
    },
    // 点击切换，滑块index赋值
    checkCurrent(e) {
      if (this.currentData === e.target.dataset.current) {
        return false;
      }
      this.currentData = e.target.dataset.current;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.manage-invite-box {
  height: 100%;
  font-size: $fg-f28;
  background-color: #f9fafc;

  .left-text {
    min-width: 250rpx;
    font-weight: bold;
    color: #343434;
  }

  .scroll-row {
    width: 100%;
    white-space: nowrap;

    &-item {
      display: inline-block;
    }

    .text {
      font-weight: bold;
      color: #333;
    }
  }

  .button {
    position: relative;
    bottom: 40rpx;
    // left: 50%;
    width: 670rpx;
    height: 90rpx;
    margin: 0 auto;
    // margin-left: -50px;
  }

  .btn {
    background-color: #fff;
  }
}
</style>
