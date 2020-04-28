<template>
  <view class="msg-box">
    <uni-list>
      <uni-list-item
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :show-arrow="true"
        @click="clickUniListItem(item)"
      >
        <template v-slot:right="">
          <uni-icons class="red-circle" type="smallcircle-filled" color="red" size="7"></uni-icons>
        </template>
      </uni-list-item>
    </uni-list>
    <view class="line"></view>
    <!-- 会话列表 -->
    <scroll-view
      scroll-y="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      show-icon="true"
      class="scroll-Y"
    >
      <view
        class="dialog-box"
        v-for="dialog of allDialogList"
        :key="dialog.id"
        @click="clickDialog(dialog)"
      >
        <view class="dialog-box__header">
          <view class="dialog-box__header__info">
            <image
              class="dialog-box__header__info__user-avatar"
              :src="
                dialog.sender.avatarUrl
                  ? dialog.sender.avatarUrl
                  : 'https://discuz.chat/static/images/noavatar.gif'
              "
            ></image>
            <view>
              <view class="dialog-box__header__info__box">
                <text class="dialog-box__header__info__username">{{ dialog.sender.username }}</text>
                <text
                  class="dialog-box__header__info__groupname"
                  v-for="item in dialog.sender.groups"
                  :key="item.name"
                >
                  <text v-if="item.name">（{{ item.name }}）</text>
                </text>
              </view>
              <view class="dialog-box__header__info__time">{{ dialog.time }}</view>
            </view>
          </view>
          <view class="dialog-box__header__r">
            <uni-icons
              class="red-circle"
              v-if="dialog.recipient_read_at === null"
              type="smallcircle-filled"
              size="7"
              color="red"
            ></uni-icons>
            <uni-icons class="uni-icon-wrapper" type="arrowright" :size="20" color="#bbb" />
          </view>
        </view>
        <view class="dialog-box__con">{{ dialog.dialogMessage.message_text }}</view>
      </view>
    </scroll-view>
    <uni-load-more :status="loadingType"></uni-load-more>
  </view>
</template>

<script>
import { uniList, uniListItem, uniIcons, uniLoadMore } from '@dcloudio/uni-ui';
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  components: {
    uniList,
    uniListItem,
    uniIcons,
    uniLoadMore,
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
      loadingType: 'more',
    };
  },
  onLoad() {
    this.getDialogList();
    this.getUnreadNotificationNum();
  },
  computed: {
    // 获取会话列表
    allDialogList() {
      // const id = 2;
      const list = [];
      const dialogList = this.$store.getters['jv/get']('dialog');
      console.log('请求会话列表返回的结果：', dialogList);
      const keys = Object.keys(dialogList);
      if (dialogList && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          const value = dialogList[keys[i]];
          dialogList[keys[i]].time = time2MorningOrAfternoon(dialogList[keys[i]].created_at);
          // if (value && value.recipient && value.recipient.id === id) {
          list.push(value);
          // }
        }
      }
      console.log('处理之后的数据', list);
      return list;
    },
    // 获取未读通知
    allUnreadNotificationNum() {
      const num = this.$store.getters['jv/get']('users');
      console.log('请求未读通知条数返回的结果：', num);
      return num;
    },
  },
  methods: {
    // 调用 会话列表 的接口
    getDialogList() {
      const params = {
        include: ['sender', 'recipient', 'sender.groups', 'recipient.groups', 'dialogMessage'],
      };
      this.$store.dispatch('jv/get', ['dialog', { params }]);
    },

    // 调用 未读通知数 的接口
    getUnreadNotificationNum() {
      const id = 3;
      const params = {
        include: ['groups'],
      };
      this.$store.dispatch('jv/get', [`users/${id}`, { params }]);
    },

    // 跳转至 @我的/回复我的/点赞我的/支付我的/系统通知 页面
    clickUniListItem(item) {
      uni.navigateTo({
        url: `../message/${item.type}`,
      });
      console.log(`跳转${item.title}页面`);
    },

    // 跳转至 聊天页面
    clickDialog(item) {
      console.log('聊天信息', item);
      uni.navigateTo({
        url: '../message/chat',
      });
    },
    pullDown(e) {
      console.log(e);
      this.loadingType = 'loading';
      this.getDialogList();
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.msg-box {
  width: 100%;
  min-height: 100vh;
  font-size: $fg-f28;
  background-color: #fafafa;
}

.line {
  height: 0rpx;
  margin: 0 0 10rpx;
  border: 1px solid #ededed;
}

.red-circle {
  display: flex;
}

.dialog-box {
  margin: 20rpx 0;
  background-color: #fff;

  &__header {
    display: flex;
    justify-content: space-between;

    &__info {
      display: flex;
      justify-content: space-between;

      &__user-avatar {
        width: 80rpx;
        height: 80rpx;
        margin: 20rpx 20rpx 20rpx 40rpx;
        border-radius: 100rpx;
      }

      &__box {
        width: 100%;
        align-items: center;
        margin: 20rpx 0 10rpx;
      }

      &__username {
        margin-right: 6rpx;
        font-weight: bold;
        line-height: 37rpx;
        color: #000;
      }

      &__groupname {
        font-weight: 400;
        line-height: 37rpx;
        color: #aaa;
      }

      &__time {
        font-size: 24rpx;
        line-height: 31rpx;
        color: #aaa;
      }
    }

    &__r {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 30rpx;
    }
  }

  &__con {
    padding: 10rpx 40rpx 30rpx;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    opacity: 1;
  }
}
</style>
