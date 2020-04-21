<template>
  <view>
    <view
      class="select-box"
      v-if="show"
      :style="{
        position: posival,
        top: top + 'rpx',
        right: right + 'rpx',
        left: left + 'rpx',
        width: width + 'rpx',
        background: bgColor,
      }"
    >
      <view class="select-content">
        <view class="jt-bg" :style="{ right: jtRight + 'rpx', background: bgColor }"></view>
        <view class="jt-con" :style="{ right: jtRight + 'rpx', background: bgColor }"></view>
        <view class="select-child" v-for="(child, index) in list" :key="index" @click="handleClick">
          {{ child.text }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'QuiDropDown',
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    list: {
      default: () => [],
      type: Array,
    },
    posival: {
      default: 'absolute',
      type: String,
    },
    top: {
      default: '',
      type: [Number, String],
    },
    right: {
      default: '',
      type: [Number, String],
    },
    left: {
      default: '',
      type: [Number, String],
    },
    width: {
      default: '180',
      type: [Number, String],
    },
    bgColor: {
      default: '#ffffff',
      type: String,
    },
    jtRight: {
      default: '25',
      type: [Number, String],
    },
  },
  data() {
    return {};
  },
  methods: {
    handleClick(param) {
      this.$emit('click', param);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';

.select-box {
  display: flex;
  flex-direction: column;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.16);
}
.select-content {
  position: relative;
  z-index: 11;
  padding: 10rpx;
  .jt-bg {
    position: absolute;
    top: -10rpx;
    width: 16rpx;
    height: 16rpx;
    transform: rotate(45deg);
  }
  .jt-con {
    position: absolute;
    top: -8rpx;
    width: 16rpx;
    height: 16rpx;
    transform: rotate(45deg);
  }
  .select-child {
    font-size: $fg-f28;
    line-height: 76rpx;
    color: #6d6d6d;
    text-align: center;
    border-bottom: 1px solid --color(--qui-BOR-ED);
    &:last-child {
      border-bottom: 1px solid transparent;
    }
  }
}
</style>
