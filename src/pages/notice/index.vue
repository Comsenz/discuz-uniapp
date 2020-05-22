<template>
  <qui-page :footer="true">
    <view class="notice-box">
      <!-- 通知类型列表 -->
      <view class="notice-box__list">
        <view v-for="item in list" :key="item.id" @click="clickUniListItem(item)">
          <qui-cell-item :title="item.title" :border="item.border" arrow slot-right>
            <qui-icon
              v-if="item.unReadNum && item.unReadNum > 0"
              name="icon-circle"
              class="red-circle"
              color="red"
              size="14"
            ></qui-icon>
          </qui-cell-item>
        </view>
      </view>
      <!-- 会话列表 -->
      <view class="dialog-box__main" v-if="allDialogList && allDialogList.length > 0">
        <scroll-view
          scroll-y="true"
          @scrolltolower="pullDown"
          show-scrollbar="false"
          show-icon="true"
          class="scroll-y"
        >
          <view
            class="dialog-box"
            v-for="dialog of allDialogList"
            :key="dialog._jv.id"
            @click="clickDialog(dialog)"
          >
            <view class="dialog-box__header">
              <view class="dialog-box__header__info">
                <image
                  class="dialog-box__header__info__user-avatar"
                  :src="dialog.avatar || '/static/noavatar.gif'"
                ></image>
                <view>
                  <view class="dialog-box__header__info__box">
                    <text class="dialog-box__header__info__username">
                      {{ dialog.name }}
                    </text>
                    <text
                      class="dialog-box__header__info__groupname"
                      v-for="item in dialog.groups"
                      :key="item.name"
                    >
                      <text v-if="item.name">（{{ item.name }}）</text>
                    </text>
                  </view>
                  <view class="dialog-box__header__info__time">{{ dialog.time }}</view>
                </view>
              </view>
              <view class="dialog-box__header__r">
                <qui-icon
                  name="icon-circle red-circle"
                  v-if="dialog.readAt === null"
                  color="red"
                  size="14"
                ></qui-icon>
                <qui-icon class="arrow" name="icon-folding-r" size="22" color="#ddd"></qui-icon>
              </view>
            </view>
            <view class="dialog-box__con">
              <rich-text
                :nodes="dialog.dialogMessage.message_text_html"
                style="word-break: break-all;"
              ></rich-text>
            </view>
          </view>
          <qui-load-more
            :status="loadingType"
            v-if="allDialogList && allDialogList.length > 0"
          ></qui-load-more>
        </scroll-view>
      </view>
    </view>
  </qui-page>
</template>

<script>
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  components: {},

  data() {
    return {
      currentLoginId: parseInt(uni.getStorageSync('user_id'), 10), // 当前用户id
      list: [
        { id: 1, title: '@我的', type: 'related', unReadNum: 0, border: true },
        { id: 2, title: '回复我的', type: 'replied', unReadNum: 0, border: true },
        { id: 3, title: '点赞我的', type: 'liked', unReadNum: 0, border: true },
        { id: 4, title: '支付我的', type: 'rewarded', unReadNum: 0, border: true },
        { id: 5, title: '系统通知', type: 'system', unReadNum: 0, border: false },
      ],
      loadingType: 'more', // 上拉加载状态
      isFirst: true, // 是否是第一次进入页面
      pageSize: 10, // 每页10条数据
      pageNum: 1, // 当前页数
    };
  },

  onLoad() {
    this.getDialogList();
    this.getUnreadNotificationNum();
  },

  onShow() {
    if (this.isFirst) {
      this.isFirst = false;
    } else {
      this.getDialogList();
      this.getUnreadNotificationNum();
    }
  },

  computed: {
    // 获取会话列表
    allDialogList() {
      const list = [];
      const dialogList = this.$store.getters['jv/get']('dialog');
      console.log('会话列表接口的响应：', dialogList);
      const keys = Object.keys(dialogList);
      if (dialogList && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          const value = dialogList[keys[i]];
          value.time = time2MorningOrAfternoon(value.created_at);
          if (value && value.recipient && value.recipient.id === this.currentLoginId) {
            value.name = value.sender.username;
            value.avatar = value.sender.avatarUrl;
            value.groupname = value.sender.groups;
            value.readAt = value.recipient_read_at;
          } else if (value && value.sender && value.sender.id === this.currentLoginId) {
            value.name = value.recipient.username;
            value.avatar = value.recipient.avatarUrl;
            value.groupname = value.recipient.groups;
            value.readAt = value.sender_read_at;
          }
          list.push(value);
        }
      }
      console.log('会话列表：', list);
      return list;
    },
  },

  methods: {
    // 调用 会话列表 的接口
    getDialogList() {
      const params = {
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        include: ['sender', 'recipient', 'sender.groups', 'recipient.groups', 'dialogMessage'],
      };
      this.$store.dispatch('jv/get', ['dialog', { params }]).then(res => {
        console.log('会话列表res', res);
        if (res) {
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        }
      });
    },

    // 调用 未读通知数 的接口
    getUnreadNotificationNum() {
      const params = {
        include: ['groups'],
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'users' } });
      this.$store.dispatch('jv/get', [`users/${this.currentLoginId}`, { params }]).then(res => {
        console.log('未读通知', res);
        if (res.typeUnreadNotifications) {
          this.list[0].unReadNum = res.typeUnreadNotifications.related;
          this.list[1].unReadNum = res.typeUnreadNotifications.replied;
          this.list[2].unReadNum = res.typeUnreadNotifications.liked;
          this.list[3].unReadNum = res.typeUnreadNotifications.rewarded;
          this.list[4].unReadNum = res.typeUnreadNotifications.system;
        }
      });
    },

    // 跳转至 @我的/回复我的/点赞我的/支付我的/系统通知 页面（传入标题，类型和未读通知条数）
    clickUniListItem(item) {
      uni.navigateTo({
        url: `../notice/notice?title=${item.title}&type=${item.type}&unReadNum=${item.unReadNum}`,
      });
      console.log(`跳转${item.title}页面`);
    },

    // 跳转至 聊天页面
    clickDialog(dialogInfo) {
      console.log('会话信息', dialogInfo);
      uni.navigateTo({
        url: `../notice/msglist?dialogId=${dialogInfo._jv.id}&username=${dialogInfo.name}`,
      });
    },

    // 上拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getDialogList();
      console.log('页码', this.pageNum);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.notice-box {
  width: 100%;
  min-height: 100vh;
  font-size: $fg-f28;

  .left-text {
    min-width: 250rpx;
    font-weight: bold;
    color: --color(--qui-FC-34);
  }

  .notice-box__list {
    padding-left: 40rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    transition: $switch-theme-time;

    /deep/ .cell-item {
      padding: 0rpx 40rpx 0rpx 0rpx;
    }

    /deep/ text {
      vertical-align: middle;
    }
  }

  .dialog-box__main {
    margin: 0rpx 0rpx 130rpx;
  }
}

.dialog-box {
  margin: 20rpx 0;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);

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
        margin: 20rpx 0rpx 10rpx;
      }

      &__username {
        margin-right: 6rpx;
        font-weight: bold;
        line-height: 37rpx;
        color: --color(--qui-FC-000);
      }

      &__groupname {
        font-weight: 400;
        line-height: 37rpx;
        color: --color(--qui-FC-AAA);
      }

      &__time {
        font-size: 24rpx;
        line-height: 31rpx;
        color: --color(--qui-FC-AAA);
      }
    }

    &__r {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0rpx 40rpx 0rpx 0rpx;

      .red-circle {
        margin: 0rpx 20rpx 0rpx 0rpx;
        vertical-align: middle;
      }
    }
  }

  &__con {
    padding: 0rpx 40rpx 30rpx;
    font-weight: 400;
    color: --color(--qui-FC-333);
    opacity: 1;
  }
}
</style>
