<template>
  <view class="popup-share">
    <view class="popup-share-content">
      <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
        <view class="popup-share-content-image">
          <view class="popup-share-box" @click="shareClick()">
            <qui-icon
              class="content-image"
              :name="item.icon"
              size="36"
              color="#777777"
              @click="handleClick"
            ></qui-icon>
          </view>
          <!-- <image :src="item.icon" class="content-image" mode="widthFix" /> -->
        </view>
        <text class="popup-share-content-text">{{ item.text }}</text>
      </view>
    </view>
    <view class="popup-share-content-space"></view>
    <text class="popup-share-btn" @click="cancel('share')">取消</text>
  </view>
</template>
<script>
export default {
  props: {
    bottomData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  // data: () => {},
  methods: {
    cancel() {
      this.$emit('close');
      this.$refs.popup.close();
    },
    shareClick() {
      this.$emit('shareClick');
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.popup-share {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  background: --color(--qui-BG-2);
}
.popup-share-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 250rpx;
  padding-top: 40rpx;
  padding-right: 97rpx;
  padding-left: 98rpx;
  background: --color(--qui-BG-BTN-GRAY-1);

  // padding: 15px;
}
.popup-share-box {
  // width: 120rpx;
  height: 120rpx;
  line-height: 120rpx;
  background: --color(--qui-BG-2);
  border-radius: 10px;
}
.popup-share-content-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  width: 120rpx;
  height: 157rpx;
  // background: --color(--qui-BG-2);
}
.popup-share-content-image {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 120rpx;
  height: 120rpx;
  overflow: hidden;
  border-radius: 10rpx;
}
.content-image {
  width: 60rpx;
  height: 60rpx;
  margin: 35rpx;
  line-height: 60rpx;
}
.popup-share-content-text {
  padding-top: 5px;
  padding-bottom: 10px;
  font-size: $fg-f26;
  color: #333;
}
.popup-share-btn {
  height: 100rpx;
  font-size: $fg-f28;
  line-height: 90rpx;
  color: #666;
  text-align: center;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}
.popup-share-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-FC-DDD);
}
</style>
