<template>
  <view class="qui-video">
    <video
      controls
      :duration="duration"
      :src="src"
      @play="playVideo"
      :id="'myVideo' + videoId"
      :ref="'myVideo' + videoId"
      :direction="0"
      @loadedmetadata="loadedmetadata"
      @fullscreenchange="fullscreenchange"
    ></video>
  </view>
</template>

<script>
export default {
  props: {
    // 视频链接
    src: {
      type: String,
      default: '',
    },
    poster: {
      type: String,
      default: '',
    },
    videoId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      videoContext: null,
      loading: false, // 是否处于读取状态
      duration: '',
    };
  },
  created() {
    this.videoContext = uni.createVideoContext(`myVideo${this.$props.videoId}`, this);
  },
  destroyed() {
    if (this.videoContext) this.videoContext = null;
  },
  methods: {
    // 点击直接全屏播放
    fullscreenPlay() {
      this.videoContext.play();
      this.videoContext.requestFullScreen();
    },
    playVideo() {
      //
    },
    fullscreenchange(e) {
      if (!e.detail.fullScreen) {
        this.videoContext.pause();
      }
    },
    loadedmetadata(e) {
      if (!this.duration) {
        this.duration = e.detail.duration;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.qui-video {
  position: relative;
}
</style>
