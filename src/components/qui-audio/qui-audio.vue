<template>
  <view class="qui-audio">
    <view class="qui-audio__btn" @click="operation">
      <qui-icon name="icon-jiazaizhong" size="36" v-if="loading" color="#ddd"></qui-icon>
      <qui-icon
        :name="paused ? 'icon-play' : 'icon-pause'"
        size="36"
        color="#ddd"
        v-else
      ></qui-icon>
    </view>
    <view class="qui-audio__wrapper">
      <text v-if="!durationTime" class="qui-audio__wrapper__name">
        {{ name }}
      </text>
      <view v-else>
        <slider
          block-size="14"
          :active-color="color"
          :value="current"
          :max="durationTime"
          @changing="(seek = true), (current = $event.detail.value)"
          @change="change"
        ></slider>
        <text class="qui-audio__wrapper__number">{{ `${currentTime} / ${duration}` }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 音频链接
    src: {
      type: String,
      default: '',
    },
    audioId: {
      type: String,
      default: '',
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      default: false,
    },
    // 文件名称
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#1878f3',
    },
  },
  data() {
    return {
      audio: null,
      currentTime: '00 : 00', // 当前播放时间
      duration: '00 : 00', // 总时长（格式00:00，用于显示）
      durationTime: 0, // 总时长（格式秒，用于控制slide）
      current: '', // slider当前进度
      loading: false, // 是否处于读取状态
      paused: true, // 是否处于暂停状态
      seek: false, // 是否处于拖动状态
    };
  },
  watch: {
    // 监听当前进度改变
    current(e) {
      if (e) {
        this.currentTime = this.format(e);
      }
    },
  },
  mounted() {},
  destroyed() {
    if (this.audio) this.audio.destroy();
  },
  methods: {
    initAudio() {
      this.audio = uni.createInnerAudioContext();
      this.audio.src = this.src;
      this.loading = true;
      // 音频进度更新事件
      this.audio.onTimeUpdate(() => {
        if (!this.durationTime) this.setDuration();
        if (!this.seek) {
          this.current = this.audio.currentTime;
        }
      });
      // 音频播放事件
      this.audio.onPlay(() => {
        this.paused = false;
      });
      // 音频暂停事件
      this.audio.onPause(() => {
        this.paused = true;
      });
      // 音频结束事件
      this.audio.onEnded(() => {
        this.paused = true;
        this.current = 0;
        this.currentTime = '00 : 00';
      });
      // 音频完成更改进度事件
      this.audio.onSeeked(() => {
        this.seek = false;
      });
    },
    // 播放/暂停操作
    operation() {
      if (!this.audio) this.initAudio();
      if (this.paused) {
        this.audio.play();
        this.$emit('audioPlay', this.audioId);
      } else {
        this.audio.pause();
      }
    },
    audioPause() {
      if (!this.paused || this.loading) {
        this.audio.pause();
      }
    },
    // 格式化时长
    format(num) {
      if (!num) {
        return;
      }
      return `${'0'.repeat(2 - String(Math.floor(num / 60)).length) +
        Math.floor(num / 60)}:${'0'.repeat(2 - String(Math.floor(num % 60)).length)}${Math.floor(
        num % 60,
      )}`;
    },
    // 完成拖动事件
    change(e) {
      this.audio.seek(e.detail.value);
    },
    setDuration() {
      this.duration = this.format(this.audio.duration);
      this.durationTime = this.audio.duration;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.qui-audio {
  position: relative;
  padding: 0 150rpx 0 30rpx;
  &__btn {
    position: absolute;
    top: 0;
    left: 0;
    height: 60rpx;
  }
  &__wrapper__number {
    position: absolute;
    top: 0;
    right: 0;
    height: 60rpx;
  }
  &__wrapper__name {
    position: absolute;
    top: 0;
    left: 50rpx;
  }
}
</style>
