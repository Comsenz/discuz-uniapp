<template>
  <view class="replied-box">
    <view>回复我的</view>
    <view v-for="item in allRepliedNotifications" :key="item.user_id">
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
    this.getRepliedNotifications();
  },
  computed: {
    allRepliedNotifications() {
      console.log('allRepliedNotifications', this.$store.getters['jv/get']('notification'));
      return this.$store.getters['jv/get']('notification');
    },
  },
  methods: {
    getRepliedNotifications() {
      const params = {
        'filter[type]': 'replied',
      };
      this.$store.dispatch('jv/get', ['notification', { params }]);
    },
  },
};
</script>

<style lang="scss" scoped>
.replied-box {
  background-color: #f9fafc;
}
</style>
