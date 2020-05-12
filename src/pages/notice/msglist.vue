<template>
  <view class="chat-box">
    <!-- 导航栏 -->
    <uni-nav-bar left-icon="back" status-bar fixed @clickLeft="clickNavBarLeft">
      <view slot="left" class="left-text">{{ username }}</view>
    </uni-nav-bar>
    <!-- 消息内容 -->
    <view class="chat-box__con" v-for="item in allChatRecord" :key="item.id">
      <view class="chat-box__con__time">{{ item.time }}</view>
      <view
        :class="[item.user_id === 1 ? 'chat-box__con__msg__mine' : 'chat-box__con__msg__other']"
      >
        <image
          :class="[
            item.user_id === 1 ? 'chat-box__con__msg__mine__img' : 'chat-box__con__msg__other__img',
          ]"
          :src="
            item.user.avatarUrl === ''
              ? 'https://discuz.chat/static/images/noavatar.gif'
              : item.user.avatarUrl
          "
        ></image>
        <view
          :class="[
            item.user_id === 1 ? 'chat-box__con__msg__mine__box' : 'chat-box__con__msg__other__box',
          ]"
          v-html="item.message_text_html"
        ></view>
      </view>
    </view>
    <!-- 底部 -->
    <view class="chat-box__footer">
      <view class="chat-box__footer__msg">
        <input class="uni-input" focus v-model="msg" placeholder="回复..." />
        <qui-icon
          name="icon-expression chat-box__footer__msg__icon"
          size="40"
          color="#7D7979"
          @click="click"
        ></qui-icon>
        <button class="chat-box__footer__btn" type="primary" @click="send">发送</button>
      </view>
      <qui-emoji
        :list="allEmoji"
        position="relative"
        top="0rpx"
        v-if="emojiShow"
        @click="getEmojiClick"
      ></qui-emoji>
    </view>
  </view>
</template>

<script>
import { uniNavBar } from '@dcloudio/uni-ui';
import quiEmoji from '@/components/qui-emoji/qui-emoji';
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  components: {
    uniNavBar,
    quiEmoji,
  },
  data() {
    return {
      msg: '', // 输入框内容
      emojiShow: false, // 表情
      username: '', // 导航栏标题
      dialogId: 0, // 会话id
    };
  },
  onLoad(params) {
    console.log('params', params);
    const { username, dialogId } = params;
    this.username = username;
    this.dialogId = dialogId;
    this.getChatRecord(dialogId);
    this.getEmoji();
  },
  computed: {
    // 获取会话消息列表
    allChatRecord() {
      const list = [];
      const recordList = this.$store.getters['jv/get']('dialog_message');
      const keys = Object.keys(recordList);
      if (recordList && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          if (recordList[keys[i]].dialog_id.toString() === this.dialogId) {
            recordList[keys[i]].time = time2MorningOrAfternoon(recordList[keys[i]].created_at);
            list.push(recordList[keys[i]]);
          }
        }
      }
      console.log('recordList', recordList);
      console.log('聊天记录：', list);
      return list;
    },
    // 获取所有表情
    allEmoji() {
      return this.$store.getters['jv/get']('emoji');
    },
  },
  methods: {
    // 回到上一个页面
    clickNavBarLeft() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // 调用 会话消息列表 的接口
    getChatRecord(dialogId) {
      const params = {
        'filter[dialog_id]': dialogId || this.dialogId,
        include: ['user', 'user.groups'],
        'page[number]': 1,
        'page[limit]': 100,
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'dialog/message' } });
      this.$store
        .dispatch('jv/get', ['dialog/message', { params }])
        .then(res => {
          console.log('会话消息列表res：', res);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 调用 表情 的接口
    getEmoji() {
      this.$store.dispatch('jv/get', ['emoji', {}]);
    },

    // 发送消息
    send() {
      const params = {
        _jv: {
          type: 'dialog/message',
        },
        dialog_id: this.dialogId,
        message_text: this.msg,
      };
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          if (res) {
            console.log('发送消息res：', res);
            this.emojiShow = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.msg = '';
    },

    // 弹出表情组件
    click() {
      this.emojiShow = true;
    },

    // 获取表情
    getEmojiClick(key) {
      this.msg += this.allEmoji[key].code;
      console.log('表情', this.allEmoji[key]);
      console.log('msg', this.msg);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.chat-box {
  height: 100%;
  margin-bottom: 130rpx;
  background-color: #ededed;

  .left-text {
    min-width: 250rpx;
    font-weight: bold;
    color: #343434;
  }

  &__con {
    &__time {
      padding-top: 20rpx;
      font-size: $fg-f20;
      font-weight: 400;
      color: rgba(181, 181, 181, 1);
      text-align: center;
    }

    &__msg__mine {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      align-items: center;

      &__img {
        width: 80rpx;
        height: 80rpx;
        margin: 0 20rpx 0 10rpx;
        border-radius: 100rpx;
      }

      &__box {
        position: relative;
        min-height: 40rpx;
        padding: 20rpx;
        margin: 20rpx;
        background: #d1e0ff;
        border: 1rpx solid #a3caff;
        border-radius: 10rpx;
      }

      &__box:before {
        position: absolute;
        top: 31%;
        right: -30rpx;
        z-index: 12;
        display: block;
        width: 0rpx;
        height: 0rpx;
        border-top: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 8px solid #d1e0ff;
        content: '';
        box-sizing: content-box;
      }

      &__box:after {
        position: absolute;
        top: 29%;
        right: -35rpx;
        z-index: 10;
        display: block;
        width: 0rpx;
        height: 0rpx;
        padding: 0;
        border-top: 9px solid transparent;
        border-right: 9px solid transparent;
        border-bottom: 9px solid transparent;
        border-left: 9px solid #a3caff;
        content: '';
        box-sizing: content-box;
      }
    }

    &__msg__other {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      &__img {
        width: 80rpx;
        height: 80rpx;
        margin: 0 10rpx 0 20rpx;
        border-radius: 100rpx;
      }

      &__box {
        position: relative;
        min-height: 40rpx;
        padding: 20rpx;
        margin: 20rpx;
        background: #fff;
        border: 1rpx solid #e5e5e5;
        border-radius: 10rpx;
      }

      &__box:before {
        position: absolute;
        top: 31%;
        left: -31rpx;
        z-index: 12;
        display: block;
        width: 0rpx;
        height: 0rpx;
        border-top: 8px solid transparent;
        border-right: 8px solid #fff;
        border-bottom: 8px solid transparent;
        border-left: 8px solid transparent;
        content: '';
        box-sizing: content-box;
      }

      &__box:after {
        position: absolute;
        top: 29%;
        left: -35rpx;
        z-index: 10;
        display: block;
        width: 0rpx;
        height: 0rpx;
        padding: 0;
        border-top: 9px solid transparent;
        border-right: 9px solid #ccc;
        border-bottom: 9px solid transparent;
        border-left: 9px solid transparent;
        content: '';
        box-sizing: content-box;
      }
    }
  }

  &__footer {
    position: fixed;
    bottom: 0rpx;
    z-index: 99;
    width: 100%;
    min-height: 80rpx;

    &__msg {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      padding: 20rpx 20rpx 40rpx;
      background-color: #f8f8f8;

      &__icon {
        margin-right: 20rpx;
      }
    }

    .uni-input {
      width: 65%;
      height: 80rpx;
      padding-left: 20rpx;
      line-height: 80rpx;
      background: rgba(255, 255, 255, 1);
      border-radius: 5rpx;
    }
    &__btn {
      margin: 0 20rpx 0 10rpx;
      font-size: $fg-f28;
      background-color: rgba(24, 120, 243, 1);
    }
  }
}
</style>
