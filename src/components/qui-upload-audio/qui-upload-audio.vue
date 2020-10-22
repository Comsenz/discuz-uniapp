<template>
  <view class="qui-uploader-box">
    <view v-if="fileList.length > 0">
      <view class="qui-uploader-box__item" v-for="(item, index) in fileList" :key="index">
        <qui-audio-cell
          :src="item.url"
          :name="item.fileName"
          :audio-id="item.id"
          :ref="'audio' + item.id"
          @audioPlayer="audioPlayer"
          @deleteItem="deleteItem"
          :is-delete="true"
        ></qui-audio-cell>
      </view>
    </view>
    <view v-else>
      <view class="qui-uploader-box__record" v-if="!showAdd">
        <view class="qui-uploader-box__record__box">
          <view class="qui-uploader-box__record__inProgress">
            <view class="qui-uploader-box__record__circle"></view>
            <text>录制中</text>
          </view>
          <view class="qui-uploader-box__record__time">{{ duration }}</view>
          <view class="qui-uploader-box__record__finish" @tap="stop">
            <text style="margin-right: 25rpx;">完成</text>
            <qui-icon name="icon-tingzhi" size="50" color="#231815"></qui-icon>
          </view>
        </view>
      </view>
      <view class="qui-uploader-box__add" @tap="start" v-if="showAdd">
        <qui-icon name="icon-luyin" color="#FA5151" size="60"></qui-icon>
      </view>
    </view>
    <qui-toast ref="toast"></qui-toast>
    <view class="qui-loading-content" v-if="uploadLoading">
      <qui-loading
        name="icon-jiazaizhong"
        class="qui-loading-box"
        size="60"
        color="#ffffff"
        text-color="#ffffff"
        text-size="15"
        vertical
      >
        上传中...
      </qui-loading>
    </view>
  </view>
</template>

<script>
import Record from '@/utils/record-sdk';
// #ifdef H5
import TcVod from 'vod-js-sdk-v6';
// #endif
// #ifdef MP-WEIXIN
import VodUploader from '@/common/cos-wx-sdk-v5.1';
// 录音管理
const recorderManager = wx.getRecorderManager();
// #endif

export default {
  props: {
    audioBeforeList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      fileList: [],
      showAdd: true,
      duration: '00:00:00', // 总时长（格式00:00，用于显示）
      durationTime: 0, // 总时长（格式秒，用于计时）
      timer: null, // 计时器
      recorder: new Record(),
      isUpLoad: true,
      uploadLoading: false,
    };
  },
  computed: {
    userId() {
      return this.$store.getters['session/get']('userId');
    },
  },
  watch: {
    // 监听得到的数据
    audioBeforeList: {
      handler(newVal) {
        this.fileList = newVal;
        this.$emit('change', this.fileList);
      },
      deep: true,
      immediate: true,
    },
    durationTime: {
      handler(newVal) {
        if (newVal === 60) {
          this.stop();
        }
      },
      deep: true,
    },
  },
  methods: {
    // 开始录音的时候
    start() {
      // #ifdef MP-WEIXIN
      const options = {
        // duration: 10000, // 指定录音的时长，单位 ms
        sampleRate: 16000, // 采样率
        numberOfChannels: 1, // 录音通道数
        encodeBitRate: 96000, // 编码码率
        format: 'mp3', // 音频格式，有效值 aac/mp3
        frameSize: 50, // 指定帧大小，单位 KB
      };
      // 开始录音
      recorderManager.start(options);
      recorderManager.onStart(() => {
        this.showAdd = false;
        this.chronoscope();
      });
      // 错误回调
      recorderManager.onError(res => {
        console.log(res);
      });
      // #endif

      // #ifdef H5
      this.recorder.startRecord({
        success: () => {
          this.showAdd = false;
          this.chronoscope();
        },
        error: () => {
          this.$refs.toast.show({ message: this.i18n.t('discuzq.post.notRecordAudio') });
        },
      });
      // #endif
    },
    // 停止录音
    stop() {
      if (this.durationTime > 1) {
        clearInterval(this.timer);
        if (this.isUpLoad) {
          this.uploadLoading = true;
          this.isUpLoad = false;
          const audioName = `${this.userId}_${this.getCurrentTime()}.mp3`;
          // #ifdef MP-WEIXIN
          recorderManager.stop();
          recorderManager.onStop(res => {
            this.uploadAudio(res, audioName);
          });
          // #endif
          // #ifdef H5
          this.recorder.stopRecord({
            success: res => {
              // 此处可以获取音频源文件(res)，用于上传等操作
              const file = this.blobToFile(res, audioName);
              this.uploadAudio(file, audioName);
            },
            error: () => {
              console.log('stop record failed.');
            },
          });
          // #endif
        }
      }
    },
    // 录音上传
    uploadAudio(audioFile, name) {
      const _this = this;
      // #ifdef MP-WEIXIN
      VodUploader.start({
        mediaFile: audioFile,
        getSignature: _this.getSignature,
        mediaName: name,
        success() {},
        error() {
          _this.$refs.toast.show({ message: _this.i18n.t('uploader.uploadFailed') });
        },
        progress() {},
        finish(result) {
          _this.postVideo(result.fileId, 1, result.videoUrl, name);
        },
      });
      // #endif
      // #ifndef MP-WEIXIN
      _this.getSignature(getSignature => {
        new TcVod({
          getSignature,
        })
          .upload({
            mediaFile: audioFile,
          })
          .done()
          .then(doneResult => {
            _this.postVideo(doneResult.fileId, 1, doneResult.video.url, name);
          });
      });
      // #endif
    },
    // 获取签名
    getSignature(callBack) {
      this.$store.dispatch('jv/get', ['signature', {}]).then(res => {
        // #ifndef MP-WEIXIN
        callBack(() => res.signature);
        // #endif
        // #ifdef MP-WEIXIN
        callBack(res.signature);
        // #endif
      });
    },
    // 封装一个处理单位数字的函数
    showNum(num) {
      if (num < 10) {
        return `0${num}`;
      }
      return num;
    },
    // 获取当前年月日时分秒
    getCurrentTime() {
      const myDate = new Date();
      const years = myDate.getFullYear();
      const months = this.showNum(myDate.getMonth() + 1);
      const datas = this.showNum(myDate.getDate());
      const hours = this.showNum(myDate.getHours());
      const minutes = this.showNum(myDate.getMinutes());
      const seconds = this.showNum(myDate.getSeconds());
      return `${years}${months}${datas}${hours}${minutes}${seconds}`;
    },
    // 计时器
    chronoscope() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.durationTime += 1;
        const hours = this.showNum(parseInt(this.durationTime / 60 / 60, 10));
        const minute = this.showNum(parseInt(this.durationTime / 60, 10) % 60);
        const second = this.showNum(this.durationTime % 60);
        this.duration = `${hours}:${minute}:${second}`;
      }, 1000);
    },
    // 删除
    deleteItem() {
      this.$emit('audioDel');
    },
    // 将blob转换为file
    blobToFile(theBlob, fileName) {
      // eslint-disable-next-line no-param-reassign
      theBlob.lastModifiedDate = new Date();
      // eslint-disable-next-line no-param-reassign
      theBlob.name = fileName;
      return theBlob;
    },
    // 播放语音
    audioPlayer() {
      const that = this;
      this.fileList.forEach(item => {
        that.$refs[`audio${item.id}`][0].audioPause();
      });
    },
    postVideo(fileId, type, url, name) {
      const params = {
        _jv: {
          type: 'thread/video',
        },
        file_id: fileId,
        media_url: url,
        type,
      };
      this.$store.dispatch('jv/post', params).then(res => {
        this.duration = '00:00:00';
        this.durationTime = 0;
        this.timer = null;
        this.uploadLoading = false;
        this.isUpLoad = true;
        this.fileList.push({
          fileName: name,
          url: res.media_url,
          id: res.file_id,
        });
        this.showAdd = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.qui-loading {
  &-content {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2222222222222;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  &-box {
    padding: 80rpx 90rpx 76rpx;
    background: #000;
    border-radius: 10rpx;
  }
}
.qui-uploader-box {
  padding: 40rpx 0;

  &__record {
    &__box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 40rpx 0;
      overflow: hidden;
      color: var(--qui-FC-777);
    }
    &__inProgress {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    &__circle {
      width: 35rpx;
      height: 35rpx;
      margin-right: 25rpx;
      background: #fa5151;
      border-radius: 50%;
    }
    &__finish {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  &__add {
    width: 120rpx;
    height: 120rpx;
    margin: 0 auto;
    line-height: 120rpx;
    text-align: center;
    background-color: #f7f7f7;
    border: 1px solid #ededed;
    border-radius: 50%;
  }

  &__item {
    margin-bottom: 20rpx;
  }
}
</style>
