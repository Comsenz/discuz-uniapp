<template>
  <view class="msg-box">
    <uni-list>
      <uni-list-item
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :show-arrow="true"
        @click="clickItem(item)"
      >
        <template v-slot:right="">
          <uni-icons class="red-circle" type="smallcircle-filled" color="red" size="7"></uni-icons>
        </template>
      </uni-list-item>
    </uni-list>
    <view class="line"></view>
    <!-- 会话列表 -->
    <view
      class="dialog-list-box"
      v-for="dialog of allDialogList"
      :key="dialog.id"
      @click="clickDialog(dialog)"
    >
      <view class="dialog-header">
        <image class="logo" :src="dialog.sender.avatarUrl"></image>
        <view class="text">
          <text class="black-text">{{ dialog.sender.username }}</text>
          <text class="gray-text" v-if="dialog.role">（{{ dialog.role }}）</text>
          <text class="gray-text">@了我</text>
          <!-- <text class="gray-text">回复了我</text>
          <text class="gray-text">点赞了我</text>
          <text class="gray-text">打赏了我</text> -->
          <view>
            <text class="time">{{ dialog.time }}</text>
          </view>
          <view class="deleteBtn" @click="deleteBtn">
            <uni-icons :size="20" class="uni-icon-wrapper" color="#bbb" type="trash" />
            删除
          </view>
        </view>
        <view class="dialog-right">
          <uni-icons
            v-if="dialog.recipient_read_at === null"
            class="red-circle"
            type="smallcircle-filled"
            color="red"
            size="7"
          ></uni-icons>
          <uni-icons :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
        </view>
      </view>
      <view class="dialog-content">{{ dialog.word }}</view>
    </view>
  </view>
</template>

<script>
import { uniList, uniListItem, uniIcons } from '@dcloudio/uni-ui';
import { time2MinuteOrHour } from '@/utils/time2MinuteOrHour';
import { time2MorningOrAfternoon } from '@/utils/time2MorningOrAfternoon';

export default {
  components: {
    uniList,
    uniListItem,
    uniIcons,
  },
  data() {
    return {
      list: [
        { id: 1, title: '@我的', type: 'related' },
        { id: 2, title: '回复我的', type: 'replied' },
        { id: 3, title: '点赞我的', type: 'liked' },
        { id: 4, title: '支付我的', type: 'rewarded' },
        { id: 5, title: '系统通知', type: 'system' },
      ],
    };
  },
  onLoad() {
    this.getDialogList();
  },
  computed: {
    allDialogList() {
      const id = 2;
      const list = [];
      const dialogList = this.$store.getters['jv/get']('dialog');
      console.log('请求会话列表返回的结果', dialogList);
      const keys = Object.keys(dialogList);
      if (dialogList && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          const value = dialogList[keys[i]];
          if (value && value.recipient && value.recipient.id === id) {
            list.push(value);
          }
        }
      }
      console.log('处理之后的数据', list);
      return list;
    },
  },
  methods: {
    clickItem(item) {
      uni.navigateTo({
        url: `../message/${item.type}`,
      });
      console.log('消息首页点击跳转', item.title);
    },
    clickDialog(item) {
      const time = item.updated_at;
      console.log('time', time);
      console.log('time2MorningOrAfternoon(time)', time2MorningOrAfternoon(time));
      console.log('time2MinuteOrHour(time)', time2MinuteOrHour(time));
      console.log('小时', time2MinuteOrHour('2020-04-26T00:00:24+08:00'));
      console.log('小时2', time2MinuteOrHour('2020-04-25T15:27:24+08:00'));
      console.log('小时3', time2MinuteOrHour('2020-04-25T00:27:24+08:00'));
      uni.navigateTo({
        url: '../message/chat',
      });
    },
    getDialogList() {
      const params = {
        include: ['sender', 'recipient', 'sender.groups', 'recipient.groups', 'dialogMessage'],
      };
      this.$store.dispatch('jv/get', ['dialog', { params }]);
    },
    deleteBtn() {
      console.log('点击删除');
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.msg-box {
  width: 100%;
  min-height: 100%;
  background-color: #fafafa;
}

.line {
  height: 0rpx;
  margin: 0 0 10rpx;
  border: 1px solid rgba(237, 237, 237, 1);
  opacity: 1;
}

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
  margin-right: 6rpx;
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

.deleteBtn {
  float: ritht;
  margin: 20rpx 40rpx 40rpx;
}
</style>
