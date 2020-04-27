<template>
  <view class="related-box">
    <!-- @我的 -->
    <qui-notification :list="allRelatedNotifications"></qui-notification>
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
    this.getRelatedNotifications();
  },

  computed: {
    // 获取@我的列表
    allRelatedNotifications() {
      const list = [];
      const likedList = this.$store.getters['jv/get']('notification');
      const keys = Object.keys(likedList);
      if (likedList && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          likedList[keys[i]].time = time2MorningOrAfternoon(likedList[keys[i]].created_at);
          list.push(likedList[keys[i]]);
        }
      }
      console.log('@我的列表：', list);
      return list;
    },
  },

  methods: {
    // 调用 @我的 的接口
    getRelatedNotifications() {
      const params = {
        'filter[type]': 'related',
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

.related-box {
  font-size: $fg-f28;
  background-color: #f9fafc;
}
</style>
