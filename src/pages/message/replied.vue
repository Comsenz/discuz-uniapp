<template>
  <view class="replied-box">
    <!-- 回复我的 -->
    <qui-notification :list="allRepliedNotifications"></qui-notification>
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
    this.getRepliedNotifications();
  },

  computed: {
    // 获取回复我的列表
    allRepliedNotifications() {
      const list = [];
      const repliedList = this.$store.getters['jv/get']('notification');
      const keys = Object.keys(repliedList);
      if (repliedList && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          repliedList[keys[i]].time = time2MorningOrAfternoon(repliedList[keys[i]].created_at);
          list.push(repliedList[keys[i]]);
        }
      }
      console.log('回复我的列表：', list);
      return list;
    },
  },

  methods: {
    // 调用 回复我的 的接口
    getRepliedNotifications() {
      const params = {
        'filter[type]': 'replied',
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

.replied-box {
  font-size: $fg-f28;
  background-color: #f9fafc;
}
</style>
