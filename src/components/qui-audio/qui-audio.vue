<template>
  <view class="qui-audio">
    <view class="qui-audio__wrapper">
      <view class="qui-audio__wrapper__btn" @click="operation">
        <qui-icon :name="paused ? 'icon-video' : 'icon-img'" size="26" color="#ddd"></qui-icon>
      </view>
      <view class="qui-audio__wrapper__info">
        <text class="qui-audio__wrapper__info-name">{{ name }}</text>
        <qui-icon name="icon-load" size="26" color="#ddd"></qui-icon>
      </view>
    </view>
  </view>
</template>

<script>
const audio = uni.createInnerAudioContext(); // 创建音频
export default {
  props: {
    // 音频链接
    src: {
      type: String,
      default: '',
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      default: false,
    },
    // 总时长（单位：s）
    duration: {
      type: Number,
      default: 0,
    },
    // 文件名称
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      paused: true, // 是否处于暂停状态
    };
  },
  watch: {
    // 监听音频地址更改
    src(e) {
      audio.src = e;
      audio.play();
    },
  },
  created() {
    audio.src = this.src;
    audio.autoplay = this.autoplay;
    // 音频播放事件
    audio.onPlay(() => {
      this.paused = false;
    });
    // 音频暂停事件
    audio.onPause(() => {
      this.paused = true;
    });
  },
  methods: {
    // 播放/暂停操作
    operation() {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.qui-audio {
  position: relative;
  padding: 0 30rpx 0 35rpx;
  &__wrapper__btn {
    position: absolute;
    left: 0;
  }
}
</style>
