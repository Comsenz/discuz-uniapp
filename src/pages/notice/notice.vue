<template>
  <view class="notification-box">
    <!-- 导航栏 -->
    <uni-nav-bar status-bar fixed @clickLeft="clickNavBarLeft">
      <view slot="left" class="left-con">
        <qui-icon name="icon-back" class="left-arrow" size="34" color="#343434"></qui-icon>
        <text class="left-con-text">{{ title }}</text>
      </view>
    </uni-nav-bar>
    <!-- 通知信息 -->
    <qui-notification :list="allNotifications"></qui-notification>
  </view>
</template>

<script>
import { uniNavBar } from '@dcloudio/uni-ui';
import quiNotification from '@/components/qui-notification';
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  components: {
    uniNavBar,
    quiNotification,
  },

  data() {
    return {
      title: '', // 通知标题
      type: '', // 通知类型
    };
  },

  onLoad(params) {
    console.log('通知列表的params：', params);
    const { title, type, unReadNum } = params;
    if (unReadNum.toString() !== 'undefined' && unReadNum.toString() !== '0') {
      this.title = `${title}(${unReadNum}条)`;
    } else {
      this.title = title;
    }
    this.type = type;
    this.getNotifications(type);
  },

  computed: {
    // 获取通知列表
    allNotifications() {
      const list = [];
      const noticeList = this.$store.getters['jv/get']('notification');
      const keys = Object.keys(noticeList);
      if (noticeList && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          const value = noticeList[keys[i]];
          value.time = time2MorningOrAfternoon(value.created_at);
          value.money = `￥${value.amount}`;
          list.push(value);
        }
      }
      console.log('通知列表：', list);
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

    // 根据type的类型发送不同的通知请求
    getNotifications(type) {
      const params = {
        'filter[type]': type,
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'notification' } });
      this.$store.dispatch('jv/get', ['notification', { params }]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';

.notification-box {
  font-size: $fg-f28;
  background-color: #f9fafc;

  /deep/ .uni-navbar--border {
    border: none;
  }

  .left-con {
    min-width: 300rpx;
    color: #343434;

    .left-arrow {
      margin: 0rpx 18rpx 0rpx 0rpx;
    }

    .left-con-text {
      font-weight: bold;
    }
  }
}
</style>
