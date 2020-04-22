<template>
  <view class="system-box">
    <view>系统通知</view>
    <view v-for="item in allSystemNotifications" :key="item.user_id">
      <view>用户名：{{ item.user_name }}</view>
      <view>帖子内容：{{ item.post_content }}</view>
      <view>created_at：{{ item.post_content }}</view>
      <view>read_at：{{ item.post_content }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad() {
    this.getSystemNotifications();
  },
  computed: {
    allSystemNotifications() {
      console.log('allSystemNotifications', this.$store.getters['jv/get']('notification'));
      return this.$store.getters['jv/get']('notification');
    },
  },
  methods: {
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
.system-box {
  background-color: #f9fafc;
}
</style>
