<template>
  <qui-page>
    <view class="chat-box">
      <!-- 消息内容 -->
      <scroll-view style="height: 1200rpx;" scroll-y="true" :scroll-top="scrollTop">
        <view class="chat-box__con" v-for="item in allChatRecord" :key="item.id">
          <view class="chat-box__con__time">{{ item.time }}</view>
          <view
            :class="[
              item.user_id === currentLoginId
                ? 'chat-box__con__msg__mine'
                : 'chat-box__con__msg__other',
            ]"
          >
            <image
              v-if="item.user_id === currentLoginId"
              class="chat-box__con__msg__mine__img"
              :src="userInfo.avatarUrl"
            ></image>
            <image
              v-if="item.user_id !== currentLoginId"
              class="chat-box__con__msg__other__img"
              :src="item.user.avatarUrl || '/static/noavatar.gif'"
            ></image>
            <view
              :class="[
                item.user_id === currentLoginId
                  ? 'chat-box__con__msg__mine__box'
                  : 'chat-box__con__msg__other__box',
              ]"
            >
              <rich-text :nodes="item.message_text_html" style="word-break: break-all;"></rich-text>
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- 底部 -->
      <view class="chat-box__footer">
        <view class="chat-box__footer__msg">
          <input class="uni-input" v-model="msg" @blur="contBlur" />
          <qui-icon
            name="icon-expression chat-box__footer__msg__icon"
            size="40"
            :color="emojiShow ? '#1878F3' : '#7D7979'"
            @click="popEmoji"
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
  </qui-page>
</template>

<script>
import quiEmoji from '@/components/qui-emoji/qui-emoji';
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  components: {
    quiEmoji,
  },

  data() {
    return {
      scrollTop: 400,
      msg: '', // 输入框内容
      emojiShow: false, // 表情
      dialogId: 0, // 会话id
      height: 0,
      currentLoginId: parseInt(uni.getStorageSync('user_id'), 10), // 当前用户id
      currentTheme: uni.getStorageSync('theme'), // 当前主题的模式
    };
  },

  onLoad(params) {
    console.log('params', params);
    const { username, dialogId } = params;
    console.log('currentTheme', this.currentTheme);
    uni.setNavigationBarTitle({
      title: username,
    });
    this.dialogId = dialogId;
    this.getChatRecord(dialogId);
    if (Object.keys(this.allEmoji).length < 1) {
      this.getEmoji();
    }
    uni.onKeyboardHeightChange(res => {
      console.log(res.height);
      if (res.height > 0) {
        // 键盘弹出（滚动条位置增加键盘高度）
        this.scrollTop += res.height;
      } else {
        // 键盘收起（滚动条位置减少键盘高度）
        this.scrollTop -= res.height;
      }
    });
    // setTimeout(() => {
    //   uni
    //     .createSelectorQuery()
    //     .selectAll('.chat-box__con')
    //     .boundingClientRect()
    //     .exec(data => {
    //       data[0].forEach(item => {
    //         this.height += item.height;
    //       });
    //       if (this.height > 600) {
    //         this.scrollTop = this.height - 600;
    //       }
    //       console.log('信息', data);
    //       console.log('height', this.height);
    //     });
    // }, 0);
  },

  onReady() {
    if (this.currentTheme === 'dark') {
      uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#3f4243',
      });
    } else {
      uni.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ededed',
      });
    }
  },

  onPullDownRefresh() {
    console.log('refresh');
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
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

    // 获取用户信息
    userInfo() {
      return this.$store.getters['jv/get'](`users/${this.currentLoginId}`);
    },
  },

  watch: {
    allChatRecord() {
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .selectAll('.chat-box__con')
          .boundingClientRect()
          .exec(data => {
            data[0].forEach(item => {
              this.height += item.height;
            });
            if (this.height > 600) {
              this.scrollTop = this.height - 600;
            }
            console.log('信息', data);
            console.log('scrollTop', this.scrollTop);
            console.log('height', this.height);
          });
      });
    },
  },

  methods: {
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

    contBlur(e) {
      this.cursor = e.detail.cursor;
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
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.emojiShow = false;
      this.msg = '';
    },

    // 弹出表情组件
    popEmoji() {
      this.emojiShow = !this.emojiShow;
    },

    // 获取表情
    getEmojiClick(key) {
      let text = '';
      text = `${this.msg.slice(0, this.cursor) +
        this.allEmoji[key].code +
        this.msg.slice(this.cursor)}`;
      this.msg = text;
      console.log('表情', this.allEmoji[key]);
      console.log('msg', this.msg);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.chat-box {
  height: 100%;
  margin: 0rpx 0rpx 140rpx;
  background: --color(--qui-BG-ED);

  &__con {
    font-size: $fg-f24;

    &__time {
      padding: 30rpx 0;
      font-size: $fg-f20;
      font-weight: 400;
      color: --color(--qui-JT-B5);
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
        max-width: 550rpx;
        padding: 25rpx 20rpx;
        margin-right: 20rpx;
        background: --color(--qui-BG-D1E0FF);
        border: 1rpx solid --colot(--qui-BG-A3CAFF);
        border-radius: 10rpx;
      }

      &__box:before {
        position: absolute;
        top: 30rpx;
        right: -20px;
        z-index: 12;
        width: 0rpx;
        height: 0rpx;
        border-top: 11px solid transparent;
        border-right: 11px solid transparent;
        border-bottom: 11px solid transparent;
        border-left: 11px solid --color(--qui-BOR-D1E0FF);
        content: '';
      }

      &__box:after {
        position: absolute;
        top: 30rpx;
        right: -21px;
        z-index: 10;
        width: 0rpx;
        height: 0rpx;
        padding: 0;
        border-top: 11px solid transparent;
        border-right: 11px solid transparent;
        border-bottom: 11px solid transparent;
        border-left: 11px solid --color(--qui-BOR-A3CAFF);
        content: '';
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
        max-width: 550rpx;
        padding: 25rpx 20rpx;
        margin: 0rpx 0rpx 0rpx 20rpx;
        background: --color(--qui-BG-2);
        border: 1rpx solid --color(--qui-BOR-E5);
        border-radius: 10rpx;
      }

      &__box:before {
        position: absolute;
        top: 30rpx;
        left: -21px;
        z-index: 12;
        width: 0rpx;
        height: 0rpx;
        border-top: 11px solid transparent;
        border-right: 11px solid --color(--qui-BOR-FFF);
        border-bottom: 11px solid transparent;
        border-left: 11px solid transparent;
        content: '';
      }

      &__box:after {
        position: absolute;
        top: 30rpx;
        left: -22px;
        z-index: 10;
        width: 0rpx;
        height: 0rpx;
        padding: 0;
        border-top: 11px solid transparent;
        border-right: 11px solid --color(--qui-BOR-CCC);
        border-bottom: 11px solid transparent;
        border-left: 11px solid transparent;
        content: '';
      }
    }
  }

  &__footer {
    position: fixed;
    bottom: 0rpx;
    z-index: 99;
    width: 100%;
    min-height: 140rpx;
    background: --color(--qui-BG-BTN-GRAY-1);

    &__msg {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      padding: 20rpx 20rpx 40rpx;
      background: --color(--qui-BG-BTN-GRAY-1);

      &__icon {
        margin: 0rpx 20rpx 0rpx 0rpx;
      }
    }

    .uni-input {
      width: 65%;
      height: 80rpx;
      padding: 0rpx 0rpx 0rpx 20rpx;
      line-height: 80rpx;
      background: --color(--qui-BG-2);
      border-radius: 5rpx;
    }

    &__btn {
      margin: 0 20rpx 0 10rpx;
      font-size: $fg-f28;
      background: --color(--qui-BG-BTN);
    }
  }
}
</style>
