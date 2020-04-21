<template>
  <view class="following">
    <view class="follow-content">
      <view class="follow-content__items">
        <text class="follow-content__items__avatar"></text>
        <cell-item title="白展堂" slot-right brief="圈主">
          <view class="follow-content__items__operate">
            <text>互相关注</text>
            <qui-icon class="text" name="icon-each-follow" size="16" color="#ff8888"></qui-icon>
          </view>
        </cell-item>
      </view>
      <view class="follow-content__items">
        <text class="follow-content__items__avatar"></text>
        <cell-item title="白展堂" slot-right brief="圈主">
          <view class="follow-content__items__operate">
            <text>关注</text>
            <qui-icon class="text" name="icon-follow" size="16" color="#777"></qui-icon>
          </view>
        </cell-item>
      </view>
      <view class="follow-content__items">
        <text class="follow-content__items__avatar"></text>
        <cell-item title="白展堂" slot-right brief="圈主">
          <view class="follow-content__items__operate">
            <text>取消关注</text>
            <qui-icon class="text" name="icon-cancel-follow" size="16" color="#ddd"></qui-icon>
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
.following {
  font-size: 28rpx;
  .cell-item {
    padding-right: 20rpx;
  }
  .cell-item__body__right {
    font-size: 28rpx;
    color: #333;
  }
  .qui-icon {
    margin-right: 0;
    margin-left: 14rpx;
  }
}
.follow-content {
  padding: 20rpx 0;
  background: #fff;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}
.follow-content__items {
  position: relative;
  padding-left: 110rpx;
}
.follow-content__items:last-child .cell-item {
  border: 0;
}
.follow-content__items__avatar {
  position: absolute;
  top: 16rpx;
  left: 20rpx;
  width: 70rpx;
  height: 70rpx;
  background: #a8a8a8;
  border-radius: 50%;
}
</style>
