<template>
  <view class="related-box">
    <view v-for="item in allRelatedNotifications" :key="item.user_id">
      <view class="info">
        <image class="logo" :src="item.user_avatar"></image>
      </view>
      <view class="user-word-box">
        <view class="content">
          <text class="user-name">{{ item.user_name }}：</text>
          <text class="gray-text" v-if="item.role">（{{ item.role }}）</text>
          <text class="words">{{ item.post_content }}</text>
        </view>
        <view class="time">
          {{ item.created_at }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad() {
    this.getRelatedNotifications();
  },
  computed: {
    allRelatedNotifications() {
      console.log('allRelatedNotifications', this.$store.getters['jv/get']('notification'));
      return this.$store.getters['jv/get']('notification');
    },
  },
  methods: {
    getRelatedNotifications() {
      const params = {
        'filter[type]': 'liked',
      };
      this.$store.dispatch('jv/get', ['notification', { params }]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.related-box {
  background-color: #f9fafc;
}
.user-word-box {
  width: 670rpx;
  height: 145rpx;
  margin: 40rpx 40rpx 30rpx;
  font-weight: normal;
  background: rgba(237, 237, 237, 1);
  border-radius: 10rpx;
  opacity: 1;
}
.logo {
  width: 80rpx;
  height: 80rpx;
  margin: 20rpx 20rpx 20rpx 40rpx;
}
.content {
  height: 66rpx;
  padding: 23rpx 16rpx 10rpx 20rpx;
  font-size: $fg-f24;
  line-height: 35rpx;
  color: rgba(51, 51, 51, 1);
}
.user-name {
  font-weight: bold;
}
.words {
  // display: -webkit-box; //作为弹性伸缩盒子模型显示。
  // overflow: hidden; //超出隐藏
  // text-overflow: ellipsis; //溢出显示用省略号
  // -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式 从上到下垂直排列
  // -webkit-line-clamp: 2; //显示的行数
}
.time {
  height: 26rpx;
  padding: 10rpx 0 20rpx 20rpx;
  font-size: $fg-f20;
  line-height: 26rpx;
  color: rgba(170, 170, 170, 1);
}
</style>
