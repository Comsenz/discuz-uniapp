<template>
  <view class="qui-uploader-box">
    <view class="qui-uploader-box__item" v-for="(item, index) in fileList" :key="index">
      <view class="qui-uploader-box__item__fonts">
        <view class="qui-uploader-box__item__fonts-detail">{{ item.attributes.fileName }}</view>
      </view>
      <view class="qui-uploader-box__item__delete" @tap="deleteItem(index, item.id)">
        <qui-icon class="icon-delete" name="icon-delete" color="#fff" size="17"></qui-icon>
      </view>
    </view>
    <view
      class="qui-uploader-box__add"
      @tap="uploadBtn"
      v-if="fileList.length < maxLength && showAdd"
    >
      <view>
        <qui-icon name="icon-fujian" color="#aaa" size="40"></qui-icon>
      </view>
      <view class="qui-uploader-box__add__fonts">上传附件</view>
    </view>
    <view ref="input" class="input"></view>
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>

<script>
import forums from '@/mixin/forums';

export default {
  name: 'QuiUploader',
  mixins: [forums],
  props: {
    url: {
      default: '',
      type: String,
    },
    fileFormat: {
      default: '',
      type: String,
    },
    fileSize: {
      default: '',
      type: String,
    },
    maxLength: {
      default: 3,
      type: Number,
    },
    showAdd: {
      default: true,
      type: Boolean,
    },
    attachmentList: {
      type: Array,
      default() {
        return [];
      },
    },
    header: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      fileList: [],
    };
  },
  watch: {
    // 监听得到的数据
    fileFormat: {
      handler(newVal) {
        this.fileFormat = newVal;
      },
      deep: true,
      immediate: true,
    },
    fileSize: {
      handler(newVal) {
        this.fileList = newVal;
      },
      deep: true,
      immediate: true,
    },
    attachmentList: {
      handler(newVal) {
        const list = [];
        newVal.forEach(v => {
          list.push({ attributes: { fileName: v.fileName }, id: v._jv.id });
        });
        this.fileList = list;
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    const input = document.createElement('input');
    input.style.display = 'none';
    input.type = 'file';
    input.id = 'file';
    input.onchange = event => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const fileName = file.name;
      const fileFormat = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (this.fileFormat && this.fileFormat.indexOf(fileFormat) === -1) {
        this.$refs.toast.show({ message: `请选择${this.fileFormat}格式的文件` });
        return;
      }
      if (this.fileSize && (file.size / 1024).toFixed(0) > parseInt(this.fileSize, 10) * 1000) {
        this.$refs.toast.show({ message: `文件大小不能超过${this.fileSize}M` });
        return;
      }
      // 上传前的其他校验
      this.$emit('verificate');
      this.uploadFile(file);
      // 处理同一个文件第二次点击不了的问题
      input.value = '';
    };
    this.$refs.input.$el.appendChild(input);
  },
  methods: {
    // 上传附件按钮 绑定file的点击事件
    uploadBtn() {
      document.getElementById('file').click();
    },
    deleteItem(index, id) {
      this.fileList.splice(index, 1);
      this.$emit('deleteItem', id);
    },
    getValue() {
      return this.fileList;
    },
    setValue(v) {
      this.fileList = v;
    },
    uploadFile(path) {
      uni.showLoading();
      const fData = new FormData();
      fData.append('file', path);
      fData.append('type', 0);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.url, true);
      xhr.setRequestHeader('authorization', this.header.authorization);
      xhr.onload = res => {
        const { status } = res.target;
        const data = JSON.parse(res.target.response);
        if (status >= 200 && status < 300) {
          this.fileList.push({
            attributes: { fileName: data.data.attributes.fileName },
            id: data.data.id,
          });
        } else {
          this.$refs.toast.show({ message: data.errors[0].detail[0] });
        }
        uni.hideLoading();
      };
      xhr.timeout = 30000; // 超时时间，单位是毫秒
      // xhr.ontimeout = res => {
      //   // XMLHttpRequest 超时。在此做某事。
      //   console.log(res);
      // };
      xhr.onerror = res => {
        uni.hideLoading();
        this.$refs.toast.show({ message: res });
      };
      // xhr.upload.onprogress = res => {
      //   console.log(res);
      // };
      xhr.send(fData);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

.qui-uploader-box {
  margin-bottom: 30rpx;
  &__add {
    display: inline-block;
    width: 215rpx;
    height: 215rpx;
    padding-top: 54rpx;
    text-align: center;
    vertical-align: middle;
    background-color: --color(--qui-BG-2);
    border: 1px solid --color(--qui-BOR-ED);
    border-radius: 5rpx;
    box-sizing: border-box;
  }
  &__add__fonts {
    margin-top: 4rpx;
    font-size: $fg-f28;
    color: --color(--qui-FC-AAA);
    box-sizing: border-box;
  }
  &__item {
    display: inline-block;
    width: 215rpx;
    height: 215rpx;
    margin-right: 13rpx;
    text-align: center;
    vertical-align: middle;
    background-color: --color(--qui-BG-2);
    border: 1px solid --color(--qui-BOR-ED);
    border-radius: 5rpx;
    box-sizing: border-box;
  }
  &__item:nth-child(3) {
    margin-right: 0;
  }
  &__item__fonts {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 165rpx;
    padding: 15rpx;
    overflow: hidden;
    font-size: $fg-f28;
    color: --color(--qui-FC-333);
    box-sizing: border-box;
  }
  &__item__fonts-detail {
    word-break: break-all;
  }
  &__item__delete {
    height: 48rpx;
    line-height: 48rpx;
    background: --color(--qui-RED);
    opacity: 0.5;
  }
}
</style>
