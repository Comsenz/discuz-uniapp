<template>
  <view>
    <view class="dialog-list-box" v-for="user in userList" :key="user.id">
      <view class="dialog-header">
        <image class="logo" src="https://discuz.chat/static/images/logo.png"></image>
        <view class="text">
          <text class="black-text">{{ user.userName }}</text>
          <text class="gray-text" v-if="user.role === '管理员'">（{{ user.role }}）</text>
          <view>
            <text class="time">{{ user.time }}</text>
          </view>
        </view>
        <view class="dialog-right">
          <uni-icons class="red-circle" type="smallcircle-filled" color="red" size="7"></uni-icons>
          <uni-icons :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
        </view>
      </view>
      <view class="dialog-content">{{ user.word }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userList: [
        {
          id: 1,
          userName: '新佑卫门',
          role: '管理员',
          time: '2020-12-13 上午 07:22',
          word: '世界各地的友好城市，为湖北打气！',
        },
        {
          id: 2,
          userName: '一休哥',
          role: '访问者',
          time: '2020-12-13 上午 07:22',
          word:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）美国知名商业杂志福布斯》发布2019美国最具创',
        },
        {
          id: 3,
          userName: '刘辉开',
          role: '访问者',
          time: '2020-12-13 上午 07:22',
          word: '回家吃饭啦',
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.dialog-list-box {
  margin: 20rpx 0;
  background-color: #fff;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
}

.logo {
  width: 80rpx;
  height: 80rpx;
  margin: 20rpx 20rpx 20rpx 40rpx;
}

.text {
  width: 100%;
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
  display: flex;
}

.dialog-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 30rpx;
}

.dialog-content {
  padding: 10rpx 40rpx 30rpx;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  opacity: 1;
}
</style>
