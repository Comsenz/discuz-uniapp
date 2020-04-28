<template>
  <view class="system-box">
    <!-- 系统通知 -->
    <qui-notification :list="allSystemNotifications"></qui-notification>
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

  onLoad() {
    this.getSystemNotifications();
  },

  computed: {
    // 获取系统通知的列表
    allSystemNotifications() {
      const list = [];
      const rewardedList = this.$store.getters['jv/get']('notification');
      const keys = Object.keys(rewardedList);
      if (rewardedList && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          rewardedList[keys[i]].time = time2MorningOrAfternoon(rewardedList[keys[i]].created_at);
          list.push(rewardedList[keys[i]]);
        }
      }
      console.log('系统通知的列表：', list);
      return list;
    },
  },

  methods: {
    // 调用 系统通知 的接口
    getSystemNotifications() {
      const params = {
        'filter[type]': 'system',
      };
      this.$store.dispatch('jv/get', ['notification', { params }]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.system-box {
  font-size: $fg-f28;
  background-color: #f9fafc;
}
</style>
