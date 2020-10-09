<template>
  <view class="qui-uploader-box">
    <view class="post-box__video">
      <view class="post-box__video__play" v-for="(item, index) in videoBeforeList" :key="index">
        <video
          id="video"
          class="post-box__video__play__video"
          :src="item.path"
          :controls="controlsStatus"
          @fullscreenchange="fullscreenchange"
        ></video>
        <view class="post-box__video__play__load play-load" v-if="videoPercent * 100 < 100">
          <view class="post-box__video__play__load__mask"></view>
          <text class="post-box__video__play__load__text">
            {{ i18n.t('discuzq.video.videoUploading') }}
          </text>

          <progress
            :percent="videoPercent * 100"
            active
            stroke-width="3"
            activeColor="#fff"
            backgroundColor="#b5b5b5"
          />
        </view>

        <view class="post-box__video__play__icon-del">
          <qui-icon name="icon-close" class="" color="#fff" size="40" @click="videoDel"></qui-icon>
        </view>
        <view class="controls-play-icon" @click.stop="playVideo">
          <qui-icon name="icon-play" size="50" color="#fff"></qui-icon>
        </view>
      </view>
      <view class="post-box__video__add" @click="uploadVideo" v-if="videoBeforeList.length < 1">
        <qui-icon name="icon-add" color="#B5B5B5" size="40"></qui-icon>
      </view>
    </view>
  </view>
</template>

<script>
// import { i18n } from '@/locale';
// import { DISCUZ_REQUEST_HOST } from '@/common/const';
// #ifdef  H5
import TcVod from 'vod-js-sdk-v6';
// #endif
import VodUploader from '@/common/cos-wx-sdk-v5.1';

export default {
  name: 'QuiUploader',
  props: {
    // 上传类型 0是首页上传，1是默认上传
    chooseType: {
      default: 1,
      type: Number,
    },
    typeStatus: {
      default: '',
      type: String,
    },
    url: {
      default: '',
      type: String,
    },
    // 视频上传列表
    videoBeforeList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // videoProgress: {
    //   default: 0,
    //   type: Number,
    // },
  },
  data() {
    return {
      controlsStatus: false, // 是否显示默认播放控件
      // videoBeforeList: [], // 视频上传列表
      fullscreenStatus: false, // 视频全屏状态
      videoName: '', // 视频名称
      percent: 0, // 视频上传进度
      videoPercent: 0, // 视频上传进度，用来控制进度条
      fileId: '', // 视频ID
      // url: '', // 视频url
    };
  },
  watch: {
    // videoBeforeList: {
    //   handler(newVal) {
    //     this.videoBeforeList = newVal;
    //     if (this.videoBeforeList) {
    //       this.videoPercent = 1;
    //     }
    //     // this.$emit('change', this.uploadList, true);
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
  created() {
    if (this.typeStatus === 'edit') {
      this.videoPercent = 1;
    }
    // this.url = DISCUZ_REQUEST_HOST;
    this.videoContext = uni.createVideoContext('video');
    if (this.chooseType === 0) {
      this.videoPercent = 1;
      // console.log(this.videoPercent, '2222222');
    }
  },

  methods: {
    // video相关方法
    // 删除视频
    videoDel() {
      this.$emit('videoDel');
    },
    // 播放视频
    playVideo() {
      this.controlsStatus = true;
      this.videoContext.play();
      this.videoContext.requestFullScreen();
      this.$emit('playVideo');
    },
    // 全屏
    fullscreenchange(e) {
      this.fullscreenStatus = e.detail.fullScreen;
      if (!e.detail.fullScreen) {
        this.controlsStatus = false;
        this.videoContext.pause();
      }
      this.$emit('fullscreenchange');
    },
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
    uploadVideo() {
      const _this = this;
      uni.chooseVideo({
        count: 1,
        compressed: false,
        sourceType: ['camera', 'album'],
        success(res) {
          if (_this.chooseType === 0) {
            // 这是首页上传视频
            // uni.showLoading({
            //   title: _this.i18n.t('core.loading'),
            //   mask: true,
            // });
          }
          let uploadVideoRes = '';
          uploadVideoRes = res;
          // uni.showToast({
          //   title: _this.i18n.t('uploader.videoUploading'),
          //   icon: 'none',
          // });
          _this.videoName = res.name ? res.name : _this.i18n.t('discuzq.post.fromWeChatApplet');
          _this.videoBeforeList.push({
            path: res.tempFilePath,
          });
          // #ifdef MP-WEIXIN
          VodUploader.start({
            mediaFile: res,
            getSignature: _this.getSignature,

            mediaName: res.name,
            success(result) {
              console.log(result);
            },
            error(result) {
              console.log(result);
              _this.$refs.toast.show({ message: _this.i18n.t('uploader.uploadFailed') });
              _this.videoPercent = 0;
            },
            progress(result) {
              _this.percent = result.percent;

              if (result.percent === 1) {
                _this.videoPercent = 0.9;
                // _this.$refs.toast.hideLoading();
              }
              uni.showLoading({
                title: _this.i18n.t('core.loading'),
                mask: true,
              });
              _this.videoPercent = result.percent;
            },
            finish(result) {
              _this.fileId = result.fileId;
              // _this.postVideo(result.fileId);
              uni.$emit('uploadVideoOver', { result, uploadVideoRes });
              setTimeout(() => {
                uni.hideLoading();
              }, 500);
            },
          });
          // #endif
          // #ifndef  MP-WEIXIN
          _this.getSignature(getSignature => {
            new TcVod({
              getSignature,
            })
              .upload({
                mediaFile: res.tempFile,
              })
              .on('media_progress', info => {
                _this.percent = info.percent; // 进度处理
                // _this.videoPercent = info.percent;
                if (info.percent === 1) {
                  _this.videoPercent = 0.9;
                }
                uni.showLoading({
                  title: _this.i18n.t('core.loading'),
                  mask: true,
                });
                _this.videoPercent = info.percent;
              })
              .done()
              .then(doneResult => {
                // console.log('上传视频', doneResult);
                uni.$emit('uploadVideoOver', { doneResult, uploadVideoRes });
                _this.fileId = doneResult.fileId;
                setTimeout(() => {
                  uni.hideLoading();
                }, 500);
                // _this.postVideo(doneResult.fileId);
              });
          });
          // #endif
        },
      });
    },
  },
  // onReady() {
  //   console.log('走了');
  //   this.videoContext = uni.createVideoContext('video');
  // },
};
</script>

<style scoped lang="scss">
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

.post-box {
  &__video {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    min-height: 160rpx;
    padding: 30rpx 0;

    &__play {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160rpx;
      height: 160rpx;
      margin-right: 13rpx;

      &__video {
        z-index: 0;
        width: 100%;
        height: 100%;
        border: 1px solid #ededed;
        border-radius: 5rpx;
      }
      &__load {
        position: absolute;
        top: 0;
        z-index: 98;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        text-align: center;
        border: 1px solid --color(--qui-BOR-ED);
        border-radius: 5rpx;
      }
      &__icon-del {
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50rpx;
        height: 50rpx;
        background-color: #dd524d;
        border-radius: 50px;
      }
      .controls-play-icon {
        position: absolute;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(1, 1, 1, 0.5);
      }
    }

    &__add {
      width: 160rpx;
      height: 160rpx;
      line-height: 160rpx;
      text-align: center;
      background-color: #f7f7f7;
      border: 1px solid #ededed;
      border-radius: 5rpx;
    }
  }
}
</style>
