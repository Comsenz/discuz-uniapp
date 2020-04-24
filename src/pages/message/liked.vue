<template>
  <view class="liked-box">
    <view class="dialog-list-box" v-for="item in allLikedNotifications" :key="item.user_id">
      <view class="dialog-header">
        <image class="logo" :src="item.user_avatar"></image>
        <view class="text">
          <text class="black-text">{{ item.user_name }}</text>
          <text class="gray-text" v-if="item.role">（{{ item.role }}）</text>
          <text class="gray-text">@了我</text>
          <!-- <text class="gray-text">回复了我</text>
          <text class="gray-text">点赞了我</text>
          <text class="gray-text">打赏了我</text> -->
          <view>
            <text class="time">{{ item.post_content }}</text>
          </view>
        </view>
        <view class="dialog-right">
          <uni-icons :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
        </view>
      </view>
      <view class="dialog-content">{{ item.word }}</view>
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
