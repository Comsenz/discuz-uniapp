<template>
  <view class="notification-box">
    <!-- 导航栏 -->
    <uni-nav-bar left-icon="back" status-bar fixed @clickLeft="clickNavBarLeft">
      <view slot="left" class="left-text">{{ title }}</view>
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
    if (unReadNum.toString() === '0') {
      this.title = title;
    } else {
      this.title = `${title}(${unReadNum}条)`;
    }
    this.type = type;
    this.getNotifications(type);
  },

  computed: {
    // 获取通知列表
    allNotifications() {
      const list = [];
      const likedList = this.$store.getters['jv/get']('notification');
      const keys = Object.keys(likedList);
      if (likedList && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          likedList[keys[i]].time = time2MorningOrAfternoon(likedList[keys[i]].created_at);
          list.push(likedList[keys[i]]);
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
@import '@/styles/base/reset.scss';

.notification-box {
  font-size: $fg-f28;
  background-color: #f9fafc;

  .left-text {
    min-width: 250rpx;
    font-weight: bold;
    color: #343434;
  }
}
</style>
