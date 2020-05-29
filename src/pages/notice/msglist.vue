<template>
  <qui-page :data-qui-theme="theme">
    <view class="chat-box">
      <!-- 消息内容 -->
      <scroll-view
        :style="{ height: scv + 'rpx' }"
        scroll-y="true"
        :scroll-top="scrollTop"
        @scroll="scroll"
        @scrolltoupper="toUpper"
      >
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
              @click="jumpUserPage(item.user_id)"
            ></image>
            <image
              v-if="item.user_id !== currentLoginId"
              class="chat-box__con__msg__other__img"
              :src="item.user.avatarUrl || '/static/noavatar.gif'"
              @click="jumpUserPage(item.user_id)"
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
          <input class="uni-input" :maxlength="451" v-model="msg" @blur="contBlur" />
          <qui-icon
            name="icon-expression chat-box__footer__msg__icon"
            size="40"
            :color="emojiShow ? '#1878F3' : '#7D7979'"
            @click="popEmoji"
          ></qui-icon>
          <button class="chat-box__footer__btn" type="primary" @click="send">
            {{ i18n.t('notice.send') }}
          </button>
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
      scrollTop: 0,
      old: {
        scrollTop: 0,
      },
      msg: '', // 输入框内容
      emojiShow: false, // 表情
      dialogId: 0, // 会话id
      height: 0,
      scv: 0,
      pageSize: 5, // 每页10条数据
      pageNum: 1, // 当前页数
      navbarHeight: 0,
    };
  },

  computed: {
    // 获取当前登录的id
    currentLoginId() {
      const userId = this.$store.getters['session/get']('userId');
      console.log('获取当前登录的id', userId);
      return parseInt(userId, 10);
    },
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
      this.scrollToBottom();
    },
  },
  created() {
    if (
      !(
        getApp() &&
        getApp().systemInfo &&
        getApp().systemInfo.screenWidth &&
        getApp().systemInfo.windowHeight
      )
    ) {
      try {
        getApp().systemInfo = uni.getSystemInfoSync();
        console.log('getApp().systemInfo.screenWidth', getApp().systemInfo.screenWidth);
        const screenK = getApp().systemInfo.screenWidth / 750;
        this.scv = getApp().systemInfo.windowHeight / screenK - 140;
        console.log('screenK', screenK);
        console.log('scv(rpx):', this.scv);
      } catch (e) {
        console.error(`Painter get system info failed, ${JSON.stringify(e)}`);
      }
    } else {
      console.log('getApp().systemInfo.screenWidth', getApp().systemInfo.screenWidth);
      const screenK = getApp().systemInfo.screenWidth / 750;
      this.scv = getApp().systemInfo.windowHeight / screenK - 140;
      console.log('screenK', screenK);
      console.log('scv(rpx):', this.scv);
    }
  },
  onLoad(params) {
    this.navbarHeight = uni.getSystemInfoSync().statusBarHeight + 44;
    console.log('-----navbarHeight-------', this.navbarHeight);
    console.log('params', params);
    const { username, dialogId } = params;
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
        this.$nextTick(() => {
          this.scrollTop += res.height;
        });
      } else {
        // 键盘收起（滚动条位置减少键盘高度）
        this.$nextTick(() => {
          this.scrollTop -= res.height;
        });
      }
    });
  },

  methods: {
    scrollToBottom() {
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
    toUpper() {
      uni.startPullDownRefresh();
      this.pageNum += 1;
      console.log('refresh');
      this.getChatRecord(this.dialogId);
    },
    scroll(e) {
      console.log('this.old.scrollTop', this.old.scrollTop);
      this.old.scrollTop = e.detail.scrollTop;
    },
    // 调用 会话消息列表 的接口
    getChatRecord(dialogId) {
      uni.showNavigationBarLoading();
      const params = {
        'filter[dialog_id]': dialogId || this.dialogId,
        include: ['user', 'user.groups'],
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        sort: '-createdAt',
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'dialog/message' } });
      this.$store
        .dispatch('jv/get', ['dialog/message', { params }])
        .then(res => {
          console.log('会话消息列表res：', res);
          if (res) {
            console.log('停止手动刷新');
            uni.hideNavigationBarLoading();
            uni.stopPullDownRefresh();
          }
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
      console.log('-----e----', e);
      if (e && e.detail) {
        this.cursor = e.detail.cursor;
        if (e.detail.value.length > 450) {
          uni.showToast({
            icon: 'none',
            title: this.i18n.t('notice.contentMaxLength'),
            duration: 2000,
          });
        }
      }
    },
    // 发送消息
    send() {
      if (this.msg === '') {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('notice.emptycontent'),
          duration: 2000,
        });
      } else if (this.msg.length > 450) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('notice.contentMaxLength'),
          duration: 2000,
        });
      } else {
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
              this.scrollToBottom();
            }
          })
          .catch(err => {
            console.log(err);
          });
        this.msg = '';
        this.emojiShow = false;
      }
    },
    // 弹出表情组件
    popEmoji() {
      if (this.emojiShow) {
        this.scrollTop = this.old.scrollTop;
        this.scrollToBottom();
        this.$nextTick(() => {
          this.scrollTop -= 185;
        });
      } else {
        this.scrollTop = this.old.scrollTop;
        this.scrollToBottom();
        this.$nextTick(() => {
          this.scrollTop += 185;
        });
      }
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
    jumpUserPage(id) {
      console.log('跳转到个人主页', id);
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
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

  &-wrap {
    position: absolute;
    top: 0rpx;
    right: 0rpx;
    bottom: 0rpx;
    left: 0rpx;
    margin: auto;
    overflow: auto;
  }

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
        border: 1rpx solid --color(--qui-BG-A3CAFF);
        border-radius: 10rpx;
      }

      &__box:before {
        position: absolute;
        top: 30rpx;
        right: -18.6rpx;
        z-index: 100;
        width: 0rpx;
        height: 0rpx;
        border-top: 10rpx solid transparent;
        border-right: 10rpx solid transparent;
        border-bottom: 10rpx solid transparent;
        border-left: 10rpx solid --color(--qui-BOR-D1E0FF);
        content: '';
      }

      &__box:after {
        position: absolute;
        top: 30rpx;
        right: -20rpx;
        z-index: 99;
        width: 0rpx;
        height: 0rpx;
        padding: 0;
        border-top: 10rpx solid transparent;
        border-right: 10rpx solid transparent;
        border-bottom: 10rpx solid transparent;
        border-left: 10rpx solid --color(--qui-BOR-A3CAFF);
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
        left: -18.6rpx;
        z-index: 100;
        width: 0rpx;
        height: 0rpx;
        border-top: 10rpx solid transparent;
        border-right: 10rpx solid --color(--qui-BOR-FFF);
        border-bottom: 10rpx solid transparent;
        border-left: 10rpx solid transparent;
        content: '';
      }

      &__box:after {
        position: absolute;
        top: 30rpx;
        left: -20rpx;
        z-index: 99;
        width: 0rpx;
        height: 0rpx;
        padding: 0;
        border-top: 10rpx solid transparent;
        border-right: 10rpx solid --color(--qui-BOR-CCC);
        border-bottom: 10rpx solid transparent;
        border-left: 10rpx solid transparent;
        content: '';
      }
    }
  }

  &__footer {
    position: fixed;
    bottom: 0rpx;
    z-index: 999;
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
