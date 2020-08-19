<template>
  <view class="qui-audio">
    <view class="qui-audio__wrapper">
      <view class="qui-audio__wrapper__btn" @click="operation">
        <qui-icon :name="paused ? 'icon-play' : 'icon-pause'" size="36" color="#ddd"></qui-icon>
      </view>
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
    // 监听音频地址更改
    src(e) {
      audio.src = e;
      this.current = 0;
      audio.play();
      this.loading = true;
    },
    // 监听当前进度改变
    current(e) {
      if (e) {
        this.currentTime = this.format(e);
      }
    },
  },
  created() {
    audio.src = this.src;
    this.current = 0;
    audio.autoplay = this.autoplay;
    // 音频进度更新事件
    audio.onTimeUpdate(() => {
      if (!this.seek) {
        this.current = audio.currentTime;
      }
    });
    // 音频进入可以播放状态
    audio.onCanplay(() => {
      this.duration = this.format(audio.duration);
      this.durationTime = audio.duration;
    });
    // 音频播放事件
    audio.onPlay(() => {
      this.paused = false;
      this.loading = false;
    });
    // 音频暂停事件
    audio.onPause(() => {
      this.paused = true;
    });
    // 音频结束事件
    audio.onEnded(() => {
      if (this.continue) {
        this.next();
      } else {
        this.paused = true;
        this.current = 0;
      }
    });
    // 音频完成更改进度事件
    audio.onSeeked(() => {
      this.seek = false;
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
      audio.seek(e.detail.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.qui-audio {
  position: relative;
  padding: 0 150rpx 0 30rpx;
  &__wrapper__btn {
    position: absolute;
    top: -10rpx;
    left: 0;
  }
  &__wrapper__number {
    position: absolute;
    top: -8rpx;
    right: 0;
    height: 60rpx;
  }
}
</style>
