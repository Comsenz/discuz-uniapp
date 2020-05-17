<template>
  <view class="notification-box">
    <!-- 通知信息 -->
    <qui-notification :list="allNotifications"></qui-notification>
  </view>
</template>

<script>
import quiNotification from '@/components/qui-notification';
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  components: {
    quiNotification,
  },

  data() {
    return {};
  },

  onLoad(params) {
    console.log('通知列表的params：', params);
    const { title, type, unReadNum } = params;
    let navTitle = title;
    if (parseInt(unReadNum, 10) > 0) {
      navTitle = `${title}(${unReadNum}条)`;
    }
    uni.setNavigationBarTitle({
      title: navTitle,
    });
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
}
</style>
