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
    <view class="msg-con" v-for="user in userList" :key="user.id">
      <view>
        <image class="logo" src="https://discuz.chat/static/images/logo.png"></image>
      </view>
      <view class="text">
        <text class="black-text">{{ user.userName }}</text>
        <text class="gray-text" v-if="user.role === '管理员'">（{{ user.role }}）</text>
        <uni-icons class="red-circle" type="smallcircle-filled" color="red" size="7"></uni-icons>
        <uni-icons :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
        <view>
          <text class="time">{{ user.time }}</text>
        </view>
      </view>
      <view class="word">{{ user.word }}</view>
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

.msg-con {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 30rpx 0 0;
  background-color: #fff;
}
.logo {
  width: 80rpx;
  height: 80rpx;
  margin: 20rpx 20rpx 20rpx 40rpx;
  background-color: blue;
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
.uni-icons {
  flex-direction: row;
  align-items: center;
}
</style>
