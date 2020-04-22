<template>
  <view class="liked-box">
    <view class="" v-for="item in allLikedNotifications" :key="item.user_id">
      <view>用户名：{{ item.user_name }}</view>
      <view>用户头像：{{ item.user_avatar }}</view>
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
    this.getLikedNotifications();
  },
  computed: {
    allLikedNotifications() {
      console.log('allLikedNotifications', this.$store.getters['jv/get']('notification'));
      return this.$store.getters['jv/get']('notification');
    },
  },
  methods: {
    getLikedNotifications() {
      const params = {
        'filter[type]': 'liked',
      };
      this.$store.dispatch('jv/get', ['notification', { params }]);
    },
  },
};
</script>

<style lang="scss" scoped>
.liked-box {
  background-color: #f9fafc;
}
</style>
