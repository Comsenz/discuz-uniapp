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
          mode="aspectFill"
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
        <view class="qui-uploader-box__uploader-file__del" v-else @click="uploadDelete(index)">
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
    name: {
      default: 'file',
      type: String,
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
      formDataAppend: {},
    };
  },
  watch: {
    // 监听得到的数据
    formData: {
      handler(newVal) {
        this.formData = newVal;
        console.log(this.formData, '这是监听');
        this.uploadStatus = true;
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    setTimeout(() => {
      this.uploadBeforeList = this.uploadBeforeList.concat(this.filePreview);
      this.uploadList = this.uploadList.concat(this.filePreview);
    }, this.delayTime);
    console.log(this.uploadBeforeList, '这是初始化');
  },
  methods: {
    uploadDelete(index) {
      const beforeUpload = this.uploadList[index];
      if (!this.asyncClear) {
        this.uploadBeforeList.splice(index, 1);
        this.uploadList.splice(index, 1);
        this.$emit('clear', this.uploadList, beforeUpload);
        console.log(this.uploadBeforeList, '这是删除时返回的1111');
      } else {
        // 开启异步删除图片后，返回删除图片的数据和下标，调用clear()需要把下标传进去
        this.$emit('clear', beforeUpload, index);
        console.log(this.uploadBeforeList, '这是删除时返回的2222');
      }
    },
    clear(index) {
      const beforeUpload = this.uploadList[index];
      this.uploadBeforeList.splice(index, 1);
      this.uploadList.splice(index, 1);
      return beforeUpload;
    },

    // 图片预览
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

    // 上传图片到本地
    uploadClick() {
      const _this = this;
      // 获取上一次上传图片的长度，用于比较这次上传长度。
      const beforeUploadFile = _this.uploadBeforeList.length;
      if (_this.uploadList.length < _this.count) {
        // 上传图片到本地
        uni.chooseImage({
          count: _this.count - _this.uploadBeforeList.length,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            // 上传图片后返回false状态
            _this.$emit('uploadClick', false);
            // 自定义开始上传的效果和回调
            _this.$emit('chooseSuccess');
            const promise = res.tempFiles.map((item, index) => {
              return new Promise((resolve, reject) => {
                res.tempFiles[index].uploadPercent = 0;
                res.tempFiles[index].uploadStatus = false;
                _this.uploadBeforeList.push(res.tempFiles[index]);
                const imgOrder =
                  _this.uploadBeforeList[_this.uploadBeforeList.length - 1].order + 1;
                console.log(_this.uploadBeforeList, imgOrder, '这是上传完成之前');
                _this.upload(
                  res.tempFilePaths[index],
                  _this.uploadBeforeList.length - 1,
                  beforeUploadFile,
                  imgOrder,
                  resolve,
                  reject,
                );
              });
            });

            Promise.allSettled(promise).then(() => {
              // 返回上传成功列表和成功状态值
              _this.$emit('change', _this.uploadList, true);
            });
          },
        });
      }
    },

    // 上传图片到服务器
    upload(pathUrl, index, length, imgOrder, resolve, reject) {
      console.log(index, '这是上传的index');
      const _this = this;
      _this.formDataAppend = {
        order: imgOrder,
      };
      const formdataObj = Object.assign(_this.formData, _this.formDataAppend);
      const uploadTask = uni.uploadFile({
        url: _this.url,
        fileType: _this.type,
        filePath: pathUrl,
        header: _this.header,
        name: _this.name,
        formData: formdataObj,
        success(res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            _this.uploadBeforeList[index].uploadPercent = 100;
            _this.uploadList.push(JSON.parse(res.data));
          } else {
            _this.uploadBeforeList.splice(_this.uploadBeforeList.length - 1, 1);
          }
          // 抛出接口信息
          _this.$emit('uploadSuccess', res, _this.uploadList);
          console.log(_this.uploadList, '这是请求接口之后');
          // const arr = [];
          // _this.uploadList.map(item => {
          //   // arr.push(item.data.attributes.order);
          //   console.log(arr, '~~~~');
          //   return arr;
          // });

          // _this.uploadBeforeList.map((item, key) => {
          //   const ite = item;
          //   ite.order = arr[key];
          //   return ite;
          // });
          // console.log(_this.uploadBeforeList, '这是请求接口合并之后');
          return resolve(_this.uploadList);
        },
        fail(res) {
          console.log(res);
          _this.uploadBeforeList.splice(index, 1);
          _this.uploadList.splice(index, 1);
          // 上传失败回调
          _this.$emit('uploadFail', res, _this.uploadList);
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
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

.qui-uploader-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 13rpx;
  width: 100%;
  min-height: 160rpx;
  padding: 30rpx 0;

  &__uploader-file {
    position: relative;
    width: 100%;
    height: calc((100vw - 80rpx) / 3);
    box-sizing: border-box;

    &__box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 10rpx;
    }

    &--image {
      z-index: 0;
      width: 100%;
      height: 100%;
      border: 1px solid --color(--qui-BOR-ED);
      border-radius: 5rpx;
    }
    &--load {
      position: absolute;
      top: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      text-align: center;
      border: 1px solid --color(--qui-BOR-ED);
      border-radius: 5rpx;
      &__mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: --color(--qui-BG-ED);
        border: 1px solid --color(--qui-BOR-ED);
        border-radius: 5rpx;
        opacity: 0.7;
      }

      &__text {
        position: relative;
        z-index: 2;
        font-size: $fg-f28;
        line-height: 160rpx;
        color: --color(--qui-FC-34);
      }

      progress {
        position: absolute;
        bottom: 9.5rpx;
        z-index: 3;
        width: 87.5%;
      }
    }
    &__del {
      position: absolute;
      bottom: 0;
      left: 1px;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 30rpx;
      background: --color(--qui-BG-00);
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc((100vw - 80rpx) / 3);
    background-color: --color(--qui-FC-f7);
    border: 1px solid --color(--qui-BOR-ED);
    border-radius: 5rpx;
  }
}
</style>
