<template>
  <view
    class="emoji-box"
    :style="{
      position: position,
      top: top,
      left: left,
      right: right,
      bottom: bottom,
      'border-radius': borderRadius,
    }"
  >
    <swiper indicator-dots="true">
      <swiper-item v-for="index of getSwiperItem" :key="index">
        <view class="emoji-box__item">
          <view
            class="emoji-box__item__view"
            v-for="j of 35"
            :key="j"
            @click="getEmojiClick(index * 35 + j + 1)"
          >
            <image class="emoji" :src="data[index * 35 + j + 1].url"></image>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'QuiEmoji',
  props: {
    list: {
      default: Object,
      type: Object,
    },
    position: {
      default: 'absolute',
      type: String,
    },
    top: {
      default: '20rpx',
      type: String,
    },
    left: {
      default: '',
      type: String,
    },
    right: {
      default: '',
      type: String,
    },
    bottom: {
      default: '',
      type: String,
    },
    borderRadius: {
      default: '0rpx',
      type: String,
    },
  },
  computed: {
    getSwiperItem() {
      return Math.ceil(Object.keys(this.list).nv_length / 35);
    },
  },
  methods: {
    getEmojiClick(num) {
      this.$emit('click', num);
    },
  },
};
</script>

<style lang="scss" scoped>
.emoji-box {
  z-index: 1500;
  width: 100%;
  padding: 10rpx 0;
  background-color: #fff;
  border: 1rpx solid #ddd;

  &__item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &__view {
      display: flex;
      justify-content: center;
      width: 14%;
      height: 24%;
    }
    .emoji {
      width: 58rpx;
      height: 58rpx;
    }
  }
}
</style>
