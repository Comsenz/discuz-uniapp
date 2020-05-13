<template>
  <view class="notice-box">
    <!-- 通知类型列表 -->
    <view class="notice-box__list">
      <view v-for="item in list" :key="item.id" @click="clickUniListItem(item)">
        <qui-cell-item :title="item.title" :border="item.border" arrow slot-right>
          <qui-icon name="icon-circle" color="red" size="14"></qui-icon>
        </qui-cell-item>
      </view>
    </view>
    <!-- 会话列表 -->
    <view class="dialog-box__main">
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
                :src="
                  dialog.recipient.avatarUrl
                    ? dialog.recipient.avatarUrl
                    : 'https://discuz.chat/static/images/noavatar.gif'
                "
              ></image>
              <view>
                <view class="dialog-box__header__info__box">
                  <text class="dialog-box__header__info__username">
                    {{ dialog.recipient.username }}
                  </text>
                  <text
                    class="dialog-box__header__info__groupname"
                    v-for="item in dialog.recipient.groups"
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
                v-if="dialog.recipient_read_at === null"
                color="red"
                size="14"
              ></qui-icon>
              <qui-icon class="arrow" name="icon-folding-r" size="22" color="#ddd"></qui-icon>
            </view>
          </view>
          <view class="dialog-box__con">{{ dialog.dialogMessage.message_text }}</view>
        </view>
        <uni-load-more :status="loadingType"></uni-load-more>
      </scroll-view>
    </view>
    <qui-footer @click="footerOpen" :tabs="tabs" :post-img="postImg"></qui-footer>
  </view>
</template>

<script>
import { uniLoadMore } from '@dcloudio/uni-ui';
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  components: {
    uniLoadMore,
  },
  data() {
    return {
      title: '消息',
      list: [
        { id: 1, title: '@我的', type: 'related', unReadNum: 0, border: true },
        { id: 2, title: '回复我的', type: 'replied', unReadNum: 0, border: true },
        { id: 3, title: '点赞我的', type: 'liked', unReadNum: 0, border: true },
        { id: 4, title: '支付我的', type: 'rewarded', unReadNum: 0, border: true },
        { id: 5, title: '系统通知', type: 'system', unReadNum: 0, border: false },
      ],
      loadingType: 'more',
      tabs: [
        {
          tabsName: '圈子',
          tabsIcon: 'icon-home',
          id: 1,
        },
        {
          tabsName: '消息',
          tabsIcon: 'icon-message',
          id: 2,
          url: '../notice/index',
        },
        {
          tabsName: '我',
          tabsIcon: 'icon-mine',
          id: 3,
          url: '../my/index',
        },
      ],
      postImg: '../assets.publish.svg',
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
      console.log('会话列表接口的响应：', dialogList);
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
  },
  methods: {
    // 回到上一个页面
    clickNavBarLeft() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // 调用 会话列表 的接口
    getDialogList() {
      const params = {
        include: ['sender', 'recipient', 'sender.groups', 'recipient.groups', 'dialogMessage'],
      };
      this.$store.dispatch('jv/get', ['dialog', { params }]);
    },

    // 调用 未读通知数 的接口
    getUnreadNotificationNum() {
      const id = 1;
      const params = {
        include: ['groups'],
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'users' } });
      this.$store.dispatch('jv/get', [`users/${id}`, { params }]).then(res => {
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
        url: `../notice/msglist?dialogId=${dialogInfo._jv.id}&username=${dialogInfo.recipient.username}`,
      });
    },

    // 滚动加载更多
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

.notice-box {
  width: 100%;
  min-height: 100vh;
  font-size: $fg-f28;
  background-color: #fafafa;

  .left-text {
    min-width: 250rpx;
    font-weight: bold;
    color: #343434;
  }

  .notice-box__list {
    padding-left: 40rpx;
    background: #fff;
    border-bottom: 1rpx solid #ededed;

    .cell-item {
      padding-right: 40rpx;
    }
  }

  .dialog-box__main {
    margin-bottom: 130rpx;
  }
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
        margin: 20rpx 0rpx 0rpx;
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
      margin-right: 40rpx;

      .red-circle {
        margin-right: 20rpx;
      }
    }
  }

  &__con {
    padding: 0rpx 40rpx 30rpx;
    font-weight: 400;
    color: #333;
    opacity: 1;
  }
}
</style>
