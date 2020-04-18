<template>
  <view>
    <view
      class="select-box"
      v-if="show"
      :style="{ position: posiVal, top: top + 'rpx', right: right + 'rpx', left: left + 'rpx' }"
    >
      <view v-for="(child, index) in list" :key="index" @click="handleClick">{{ child }}</view>
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
    posiVal: {
      type: String,
      default: '',
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
  },
  data() {
    return {};
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';

.select-box {
  padding: 10rpx;
}
</style>
