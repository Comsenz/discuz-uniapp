<template>
  <view class="chat-box">
    <view class="chat-box__con">
      <!-- <image class="logo" src="https://discuz.chat/static/images/logo.png"></image> -->
      <view class="dialog-box-other">你好，我是新佑卫门~</view>
      <view class="dialog-box-me">你好，我是一休哥~</view>
    </view>
    <view class="chat-box__footer">
      <input class="uni-input" @input="onKeyInput" placeholder="回复..." />
      <uni-icons :size="20" class="uni-icon" color="#7D7979" type="circle" />
      <button class="btn" type="primary">发送</button>
    </view>
  </view>
</template>

<script>
import { uniIcons } from '@dcloudio/uni-ui';

export default {
  components: {
    uniIcons,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.chat-box {
  background-color: #ededed;
}

.dialog-box-other {
  position: relative;
  width: 540rpx;
  max-height: 80rpx;
  padding: 20rpx;
  margin: 20rpx;
  background: #fff;
  border: 1rpx solid #e5e5e5;
  border-radius: 10rpx;
  opacity: 1;
}

.dialog-box-other:before {
  position: absolute;
  top: 30%;
  left: -8rpx;
  border-top: 12rpx solid transparent;
  border-right: 20rpx solid #e5e5e5;
  border-bottom: 12rpx solid transparent;
  content: '';
}

.dialog-box-other:after {
  position: absolute;
  top: 30%;
  left: -8rpx;
  border-top: 12rpx solid transparent;
  border-right: 20rpx solid #fff;
  border-bottom: 12rpx solid transparent;
  content: '';
}

.dialog-box-me {
  position: relative;
  width: 540rpx;
  max-height: 80rpx;
  padding: 20rpx;
  margin: 20rpx;
  background: #d1e0ff;
  border: 1rpx solid #a3caff;
  border-radius: 10rpx;
  opacity: 1;
}

.dialog-box-me:after {
  position: absolute;
  top: 30%;
  right: -9rpx;
  border-top: 12rpx solid transparent;
  border-bottom: 12rpx solid transparent;
  border-left: 20rpx solid #d1e0ff;
  content: '';
}

.dialog-box-me:before {
  position: absolute;
  top: 30%;
  right: -9rpx;
  border-top: 12rpx solid transparent;
  border-bottom: 12rpx solid transparent;
  border-left: 20rpx solid #a3caff;
  content: '';
}

.logo {
  width: 75rpx;
  height: 80rpx;
}

.chat-box__footer {
  position: absolute;
  bottom: 0rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 80rpx;
  padding: 20rpx 20rpx 40rpx;
  line-height: 80rpx;
  background-color: #f8f8f8;
}

.uni-input {
  width: 65%;
  height: 80rpx;
  padding-left: 20rpx;
  line-height: 80rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 5rpx;
  opacity: 1;
}
.uni-icon {
  margin: 0 10rpx 0 20rpx;
}

.btn {
  margin: 0 20rpx 0 10rpx;
  font-size: $fg-f28;
  background-color: rgba(24, 120, 243, 1);
}
</style>
