<template>
  <view class="rewarded-box">
    <view>支付我的</view>
    <view v-for="item in allRewardedNotifications" :key="item.id">
      <view>用户名：{{ item.user_name }}</view>
      <view>用户头像：{{ item.user_avatar }}</view>
      <view>打赏金额：{{ item.amount }}</view>
      <view>created_at：{{ item.created_at }}</view>
      <view>read_at：{{ item.read_at }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad() {
    this.getRewardedNotifications();
  },
  computed: {
    allRewardedNotifications() {
      console.log('allRewardedNotifications', this.$store.getters['jv/get']('notification'));
      return this.$store.getters['jv/get']('notification');
    },
  },
  methods: {
    getRewardedNotifications() {
      const params = {
        'filter[type]': 'rewarded',
      };
      this.$store.dispatch('jv/get', ['notification', { params }]);
    },
  },
};
</script>

<style lang="scss" scoped>
.rewarded-box {
  background-color: #f9fafc;
}
</style>
