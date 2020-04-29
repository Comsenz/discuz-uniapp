<template>
  <view class="rewarded-box">
    <!-- 支付我的 -->
    <qui-notification :list="allRewardedNotifications"></qui-notification>
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
    this.getRewardedNotifications();
  },

  computed: {
    // 获取支付我的列表
    allRewardedNotifications() {
      const list = [];
      const rewardedList = this.$store.getters['jv/get']('notification');
      const keys = Object.keys(rewardedList);
      if (rewardedList && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          rewardedList[keys[i]].time = time2MorningOrAfternoon(rewardedList[keys[i]].created_at);
          list.push(rewardedList[keys[i]]);
        }
      }
      console.log('支付我的列表：', list);
      return list;
    },
  },

  methods: {
    // 调用 支付我的 的接口
    getRewardedNotifications() {
      const params = {
        'filter[type]': 'rewarded',
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

.rewarded-box {
  font-size: $fg-f28;
  background-color: #f9fafc;
}
</style>
