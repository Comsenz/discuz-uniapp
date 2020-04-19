<template>
  <view class="msg-box">
    <uni-list>
      <uni-list-item
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :show-arrow="true"
        @click="clickItem"
      >
        <template v-slot:right="">
          <uni-icons class="red-circle" type="smallcircle-filled" color="red" size="7"></uni-icons>
        </template>
      </uni-list-item>
    </uni-list>
    <view class="line"></view>
    <view class="content">
      <view class="info">
        <image class="logo" src="https://discuz.chat/static/images/logo.png"></image>
      </view>
      <view class="text">
        <text class="black-text">我是唯希</text>
        <text class="gray-text">（管理员）</text>
        <uni-icons :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
        <view class="">
          <text class="time">2020-12-13 上午 07:22</text>
        </view>
      </view>
    </view>
    <view class="">
      世界各地的友好城市，为湖北打气！
    </view>
  </view>
</template>

<script>
import { uniList, uniListItem, uniIcons } from '@dcloudio/uni-ui';

export default {
  components: {
    uniList,
    uniListItem,
    uniIcons,
  },
  data() {
    return {
      list: [
        { id: 1, title: '@我的' },
        { id: 2, title: '回复我的' },
        { id: 3, title: '点赞我的' },
        { id: 4, title: '支付我的' },
        { id: 5, title: '系统通知' },
      ],
    };
  },
  methods: {
    clickItem() {
      uni.navigateTo({
        url: '../topic/index',
      });
      console.log(uni);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.msg-box {
  width: 100%;
  height: 100%;
  background-color: #fafafa;
}

.line {
  height: 0rpx;
  border: 1px solid rgba(237, 237, 237, 1);
  opacity: 1;
}

.content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 30rpx 0 20rpx;
  background-color: #fff;
}
.logo {
  width: 80rpx;
  height: 80rpx;
  margin: 20rpx 20rpx 20rpx 40rpx;
  background-color: blue;
}
.text {
  align-items: center;
  margin: 20rpx 0;
}
.black-text {
  font-size: 28rpx;
  font-weight: bold;
  line-height: 37rpx;
  color: rgba(0, 0, 0, 1);
  opacity: 1;
}

.gray-text {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 37rpx;
  color: rgba(170, 170, 170, 1);
  opacity: 1;
}

.time {
  font-size: 24rpx;
  line-height: 31rpx;
  color: rgba(170, 170, 170, 1);
  opacity: 1;
}

.red-circle {
  display: table;
}
.uni-icons {
  display: table-cell;
  vertical-align: middle;
}
</style>
