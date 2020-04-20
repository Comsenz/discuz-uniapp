<template>
  <view class="following-page">
    <view class="follow-content">
      <view class="items">
        <text class="avatar"></text>
        <cell-item title="白展堂" slot-right brief="圈主">
          <view class="operate-item">
            <text>互相关注</text>
            <text class="quiicons icon-each-follow"></text>
          </view>
        </cell-item>
      </view>
      <view class="items">
        <text class="avatar"></text>
        <cell-item title="白展堂" slot-right brief="圈主">
          <view class="operate-item">
            <text>关注</text>
            <text class="quiicons icon-follow"></text>
          </view>
        </cell-item>
      </view>
      <view class="items">
        <text class="avatar"></text>
        <cell-item title="白展堂" slot-right brief="圈主">
          <view class="operate-item">
            <text>取消关注</text>
            <text class="quiicons icon-cancel-follow"></text>
          </view>
        </cell-item>
      </view>
    </view>
  </view>
</template>

<script>
import cellItem from '@/components/qui-cell-item';

export default {
  components: {
    cellItem,
  },
};
</script>

<style lang="scss">
.following-page {
  font-size: 28rpx;
  .follow-content {
    padding: 20rpx 0;
    background: #fff;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  }
  .items {
    position: relative;
    padding-left: 110rpx;
  }
  .items:last-child .qui-cell-item {
    border: 0;
  }
  .qui-cell-item {
    padding-right: 20rpx;
  }
  .qui-cell-item-right {
    font-size: 28rpx;
    color: #333;
  }
  .quiicons {
    margin-right: 0;
    margin-left: 14rpx;
  }
  .avatar {
    position: absolute;
    top: 16rpx;
    left: 20rpx;
    width: 70rpx;
    height: 70rpx;
    background: #a8a8a8;
    border-radius: 50%;
  }
}
</style>
