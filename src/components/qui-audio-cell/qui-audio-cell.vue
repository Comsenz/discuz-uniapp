<template>
  <view class="qui-audio">
    <view class="qui-audio__btn" @click="operation(previewStatus)">
      <qui-icon name="icon-jiazaizhong" size="36" v-if="loading" color="#ddd"></qui-icon>
      <qui-icon
        :name="paused ? 'icon-play' : 'icon-pause'"
        size="60"
        color="#fff"
        v-else
      ></qui-icon>
    </view>
    <view class="qui-audio__wrapper">
      <view :class="durationTime ? 'qui-audio__wrapper__name' : 'qui-audio__wrapper__name-normal'">
        {{ name }}
      </view>
      <view v-if="durationTime">
        <text class="qui-audio__wrapper__number">{{ `${currentTime} / ${duration}` }}</text>
        <slider
          block-size="14"
          :active-color="color"
          :value="current"
          :max="durationTime"
          @changing="(seek = true), (current = $event.detail.value)"
          @change="change"
          class="qui-audio__slider"
        ></slider>
      </view>
    </view>
    <view class="qui-audio__operate">
      <view class="qui-audio__operate__delete">
        <qui-icon
          name="icon-delete"
          size="32"
          color="#777"
          class="icon-delete"
          v-if="isDelete"
          @tap="deleteItem(audioId)"
        ></qui-icon>
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
    fileSize: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#1878f3',
    },
    // 是否自动播放
    isDelete: {
      type: Boolean,
      default: false,
    },
    // 是否可预览
    previewStatus: {
      type: Boolean,
      default: true,
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
  computed: {
    audioSize() {
      const audiosize = `${(this.fileSize / (1024 * 1024)).toFixed(1)}MB`;
      return audiosize;
    },
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
      this.duration = this.format(this.audio.duration);
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
    operation(previewStatus) {
      if (previewStatus) {
        if (!this.audio) this.initAudio();
        if (this.paused) {
          this.audio.play();
          this.loading = false;
          this.$emit('audioPlayer', this.audioId);
        } else {
          this.audio.pause();
        }
      } else {
        this.$emit('previewAudio');
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
      if (Number.isFinite(this.audio.duration)) {
        this.duration = this.format(this.audio.duration);
        this.durationTime = this.audio.duration;
      }
    },
    // 删除语音
    deleteItem() {
      this.$emit('deleteItem');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.qui-audio {
  position: relative;
  height: 116rpx;
  padding: 0 80rpx 0 135rpx;
  margin-bottom: 20rpx;
  background: #f4f5f6;
  border-radius: 2rpx;
  &__btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 116rpx;
    height: 116rpx;
    line-height: 116rpx;
    text-align: center;
    background: #fa5151;
  }
  &__wrapper {
    height: 116rpx;
    padding-top: 10rpx;
    box-sizing: border-box;

    &__name {
      overflow: hidden;
      font-size: $fg-f2;
      line-height: 44rpx;
      color: --color(--qui-FC-000);
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
    }

    &__name-normal {
      font-size: $fg-f3;
      line-height: 50rpx;
      color: --color(--qui-FC-000);
    }

    &__number {
      font-size: $fg-f0;
      color: --color(--qui-FC-B5);
    }
  }
  &__slider {
    padding-top: 0rpx;
    margin: 0rpx;
  }
  &__operate {
    position: absolute;
    top: 0;
    right: 20rpx;
    padding-top: 20rpx;
    text-align: right;
    &__delete {
      float: right;
      width: 40rpx;
      height: 44rpx;
    }
  }
  &__size {
    font-size: $fg-f0;
    color: --color(--qui-FC-B5);
  }
}
</style>
