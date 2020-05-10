<template>
  <view class="manage-invite-box">
    <!-- 导航栏 -->
    <!-- <uni-nav-bar left-icon="back" status-bar fixed @clickLeft="clickNavBarLeft">
      <view slot="left" class="left-text">{{ title }}</view>
    </uni-nav-bar> -->
    <!-- 标签栏 -->
    <view class="">
      <qui-tabs :current="current" :values="tabList"></qui-tabs>
    </view>
    <view class="texts">
      <text>
        共有
        <text class="count">{{ count }}</text>
        条记录
      </text>
    </view>
    <view class="content">
      <qui-cell title="邀请成员" brief="成员" slot-left slot-right>
        <template v-slot:left>
          <image class="user-avatar" src="https://discuz.chat/static/images/noavatar.gif"></image>
        </template>
        <template v-slot:right>
          <view class="nouse" @click="nouse">设为无效</view>
          <view class="line"></view>
          <view class="share" @click="share">
            分享
            <qui-icon name="icon-share1" class="qui-icon"></qui-icon>
          </view>
        </template>
      </qui-cell>
    </view>
    <!-- 邀请链接按钮 -->
    <view class="button">
      <button type="default" class="btn" @click="generateUrl">生成邀请链接</button>
    </view>
    <!-- 邀请链接弹窗 -->
    <uni-popup ref="popup" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <view class="popup-text">邀请链接</view>
          <view class="popup-line"></view>
          <view class="popup-text">邀请链接</view>
          <view class="popup-line"></view>
          <view class="popup-text">邀请链接</view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">取消</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
// import { uniNavBar } from '@dcloudio/uni-ui';
import quiCell from '@/components/qui-cell';

export default {
  components: {
    // uniNavBar,
    quiCell,
  },

  data() {
    return {
      title: '邀请成员',
      current: 0,
      count: ' 3 ',
      tabList: [
        { id: 1, title: '未使用' },
        { id: 2, title: '已使用' },
        { id: 3, title: '已失效' },
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
    nouse() {
      console.log('无效');
    },
    share() {
      console.log('分享');
      this.$refs.popup.open();
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

page {
  background-color: #f9fafc;
}

.manage-invite-box {
  height: 100%;
  font-size: $fg-f28;

  .left-text {
    min-width: 250rpx;
    font-weight: bold;
    color: #343434;
  }

  .texts {
    margin: 40rpx 0 20rpx 20rpx;
    font-size: $fg-f24;
    color: #7d7979;
  }

  .user-avatar {
    width: 70rpx;
    height: 70rpx;
    margin: 15rpx 20rpx;
    border-radius: 50%;
  }

  .count {
    font-weight: 400;
  }

  .content {
    width: 710rpx;
    height: 440rpx;
    margin: 20rpx 20rpx 0;
    background: #fff;
    border-radius: 6rpx;
    box-shadow: 0rpx 4rpx 8rpx rgba(0, 0, 0, 0.05);
  }

  .nouse {
    display: inline-block;
    margin-right: 29rpx;
  }

  .line {
    display: inline-block;
    width: 0rpx;
    height: 26rpx;
    border: 2rpx solid #ededed;
    opacity: 1;
  }

  .share {
    display: inline-block;
    margin: 0 20rpx 0 25rpx;
  }

  .qui-icon {
    margin-left: 8rpx;
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

  .popup {
    width: 100%;
    height: 100rpx;
    font-size: $fg-f34;
    font-weight: 400;
    line-height: 100rpx;
    color: #333;
    text-align: center;
    background-color: #fff;
    border-radius: 10rpx 10rpx 0rpx 0rpx;
  }

  .popup-share-btn {
    height: 100rpx;
    font-size: $fg-f28;
    line-height: 90rpx;
    color: #666;
    text-align: center;
    border-top-color: #f5f5f5;
    border-top-style: solid;
    border-top-width: 1px;
  }

  .button {
    position: fixed;
    right: 0;
    bottom: 40rpx;
    left: 0;
    width: 670rpx;
    height: 90rpx;
    margin: auto;
  }

  .btn {
    background-color: #fff;
  }

  .popup-share {
    display: flex;
    flex-direction: column;
    background: --color(--qui-BG-2);
  }

  .popup-share-content {
    background: --color(--qui-BG-BTN-GRAY-1);
  }

  .popup-text {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
  }

  .popup-line {
    border: 2rpx solid #ededed;
  }

  .popup-share-content-space {
    width: 100%;
    height: 9rpx;
    background: --color(--qui-FC-DDD);
  }
}
</style>
