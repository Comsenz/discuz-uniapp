<template>
  <view class="chat-box">
    <view class="chat-box__con">
      <!-- <image class="logo" src="https://discuz.chat/static/images/logo.png"></image> -->
      <view class="dialog-box">你好~</view>
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

.chat-box__con {
  display: flex;
}

.dialog-box {
  position: relative;
  width: 540rpx;
  height: 80rpx;
  padding: 20rpx;
  margin: 20rpx;
  background: rgba(255, 255, 255, 1);
  border: 1rpx solid rgba(229, 229, 229, 1);
  opacity: 1;
}

// .dialog-box:before {
//   position: absolute;
//   top: 34rpx;
//   left: -10rpx;
//   border-top: 6px solid transparent;
//   border-right: 10px solid #ccc;
//   border-bottom: 6px solid transparent;
//   content: '';
// }

.dialog-box:after {
  position: absolute;
  top: 10px;
  left: -8px;
  border-top: 6px solid transparent;
  border-right: 10px solid #fff;
  border-bottom: 6px solid transparent;
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
  width: 100%;
  height: 80rpx;
  padding: 20rpx 20rpx 40rpx;
  line-height: 80rpx;
  background-color: #f8f8f8;
}

.uni-input {
  flex-direction: row;
  justify-content: flex-start;
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
