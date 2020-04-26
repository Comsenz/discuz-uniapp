<template>
  <view class="min-popup" v-if="show" :class="[isShow ? 'min-show' : 'min-hide']">
    <view class="min-overlay" @click="close"></view>
    <view :class="size ? 'min-content-' + size : 'min-content'">
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },
    size: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShow: Boolean,
    };
  },
  watch: {
    show() {
      this.isShow = this.show;
      if (!this.show) {
        this.close();
      }
    },
  },
  created() {
    this.isShow = this.show;
  },
  methods: {
    close() {
      this.isShow = false;
      setTimeout(() => {
        this.$emit('close');
      }, 200);
    },
  },
};
</script>

<style lang="scss" scoped>
.min-popup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  &.min-hide {
    .min-content {
      animation: hide 0.5s linear forwards;
    }
    .min-overlay {
      opacity: 0;
    }
  }
  &.min-show {
    .min-content {
      animation: show 0.5s linear forwards;
    }
    .min-overlay {
      opacity: 1;
    }
  }
  .min-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    transition: 0.5s;
  }
  .min-content {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    height: 800rpx;
    overflow: hidden;
    background: #fff;
  }
  .min-content-height {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    height: 600rpx;
    overflow: hidden;
    background: #fff;
  }
  @keyframes hide {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(100%);
    }
  }
  @keyframes show {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }
}
</style>
