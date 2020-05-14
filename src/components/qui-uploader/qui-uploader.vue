<template>
  <view class="qui-uploader-box">
    <block>
      <view
        class="qui-uploader-box__uploader-file"
        v-for="(item, index) in uploadBeforeList"
        :key="index"
      >
        <image
          class="qui-uploader-box__uploader-file--image"
          v-if="uploadBeforeList.length > 0"
          :src="item.path"
          @click="previewPicture(index)"
        ></image>
        <view class="qui-uploader-box__uploader-file--load" v-if="item.uploadPercent < 100">
          <view class="qui-uploader-box__uploader-file--load__mask"></view>
          <text class="qui-uploader-box__uploader-file--load__text">
            {{ i18n.t('discuzq.image.imageUploading') }}
          </text>
          <progress
            :percent="item.uploadPercent"
            active
            stroke-width="3"
            activeColor="#25A9F6"
            backgroundColor="#b5b5b5"
          />
        </view>
        <view class="qui-uploader-box__uploader-file__dele" v-else @click="uploadDelete(index)">
          <qui-icon class="icon-delete" name="icon-delete" color="#fff" size="17"></qui-icon>
        </view>
      </view>
    </block>
    <view class="qui-uploader-box__add" @click="uploadClick" v-if="uploadBeforeList.length < count">
      <qui-icon name="icon-add" color="#B5B5B5" size="40"></qui-icon>
    </view>
  </view>
</template>

<script>
export default {
  name: 'QuiUploader',
  props: {
    url: {
      default: '',
      type: String,
    },
    header: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      default: 'image',
      type: String,
    },
    formData: {
      default: Object,
      type: Object,
    },
    count: {
      default: 9,
      type: [Number, String],
    },
    asyncClear: {
      default: false,
      type: Boolean,
    },
    filePreview: {
      type: Array,
      default: () => {
        return [];
      },
    },
    delayTime: {
      default: 500,
      type: Number,
    },
  },
  data() {
    return {
      uploadBeforeList: [],
      uploadList: [],
      uploadIndex: '',
    };
  },
  async created() {
    setTimeout(() => {
      this.uploadBeforeList = this.uploadBeforeList.concat(this.filePreview);
      this.uploadList = this.uploadList.concat(this.filePreview);
    }, this.delayTime);
  },
  methods: {
    uploadDelete(index) {
      const beforeUpload = this.uploadList[index];
      if (!this.asyncClear) {
        this.uploadBeforeList.splice(index, 1);
        this.uploadList.splice(index, 1);
        this.$emit('clear', this.uploadList, beforeUpload);
      } else {
        // 开启异步删除图片后，返回删除图片的数据和下标，调用clear()需要把下标传进去
        this.$emit('clear', beforeUpload, index);
      }
    },
    clear(index) {
      const beforeUpload = this.uploadList[index];
      this.uploadBeforeList.splice(index, 1);
      this.uploadList.splice(index, 1);
      return beforeUpload;
    },
    previewPicture(index) {
      const _this = this;
      const preview = [];
      for (let i = 0, len = _this.uploadBeforeList.length; i < len; i += 1) {
        preview.push(_this.uploadBeforeList[i].path);
      }
      uni.previewImage({
        current: index,
        urls: preview,
        indicator: 'default',
      });
    },
    uploadClick() {
      const _this = this;
      // 获取上一次上传图片的长度，用于比较这次上传长度。
      const beforeUploadFile = _this.uploadBeforeList.length;

      uni.chooseImage({
        count: _this.count - _this.uploadBeforeList.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const promise = res.tempFiles.map((item, index) => {
            return new Promise((resolve, reject) => {
              res.tempFiles[index].uploadPercent = 0;
              res.tempFiles[index].uploadStatus = false;
              _this.uploadBeforeList.push(res.tempFiles[index]);
              _this.upload(
                res.tempFiles[index],
                res.tempFilePaths[index],
                _this.uploadBeforeList.length - 1,
                beforeUploadFile,
                resolve,
                reject,
              );
            });
          });

          Promise.allSettled(promise).then(() => {
            _this.$emit('change', _this.uploadList);
          });
        },
      });
    },
    upload(file, pathUrl, index, length, resolve, reject) {
      const _this = this;

      const uploadTask = uni.uploadFile({
        url: _this.url,
        fileType: _this.type,
        files: file,
        filePath: pathUrl,
        header: _this.header,
        name: 'file',
        formData: _this.formData,
        success(res) {
          if (res.statusCode === 201) {
            _this.uploadBeforeList[index].uploadPercent = 100;
            _this.uploadList.push(JSON.parse(res.data));
          } else {
            _this.uploadBeforeList.splice(index, 1);
            _this.uploadList.splice(index, 1);
          }
          return resolve(_this.uploadList);
        },
        fail(res) {
          console.log(res);
          _this.uploadBeforeList.splice(index, 1);
          _this.uploadList.splice(index, 1);
          return reject(res);
        },
      });

      uploadTask.onProgressUpdate(async res => {
        const progress = await res.progress;
        for (let i = length; i < _this.uploadBeforeList.length; i += 1) {
          if (progress < 100) {
            _this.uploadBeforeList[i].uploadPercent = progress;
          } else if (progress === 100) {
            _this.uploadBeforeList[i].uploadPercent = 90;
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.qui-uploader-box {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-height: 160rpx;
  padding: 30rpx 0;

  &__uploader-file {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    margin-right: 14rpx;
    margin-bottom: 14rpx;
    box-sizing: border-box;
    &--image {
      z-index: 100;
      width: 100%;
      height: 100%;
      border: 1px solid #ededed;
      border-radius: 5rpx;
    }
    &--load {
      position: absolute;
      top: 0;
      z-index: 200;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      text-align: center;
      border: 1px solid #ededed;
      border-radius: 5rpx;
      &__mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #ededed;
        border: 1px solid #ededed;
        border-radius: 5rpx;
        opacity: 0.7;
      }

      &__text {
        position: relative;
        z-index: 222;
        font-size: 20rpx;
        line-height: 160rpx;
        color: #343434;
      }

      progress {
        position: absolute;
        bottom: 9.5rpx;
        z-index: 233;
        width: 87.5%;
      }
    }
    &__dele {
      position: absolute;
      bottom: 0;
      z-index: 222;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 30rpx;
      background: #000;
      border-radius: 0 0 5rpx 5rpx;
      opacity: 0.5;
      .icon-delete {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
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
</style>
