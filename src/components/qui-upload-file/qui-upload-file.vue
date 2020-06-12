<template>
  <view class="qui-uploader-box">
    <view class="qui-uploader-box__add" @tap="uploadBtn">
      <view>
        <qui-icon name="icon-fujian" color="#aaa" size="40"></qui-icon>
      </view>
      <view class="qui-uploader-box__add__fonts">上传附件</view>
    </view>
    <view ref="input" class="input"></view>
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
  },
  data() {
    return {
      uploadList: [],
    };
  },
  mounted() {
    const input = document.createElement('input');
    input.style.display = 'none';
    input.type = 'file';
    input.id = 'file';
    input.onchange = event => {
      const file = event.target.files[0];
      this.uploadApi(file);
    };
    this.$refs.input.$el.appendChild(input);
  },
  methods: {
    // 上传附件按钮 绑定file的点击事件
    uploadBtn() {
      document.getElementById('file').click();
    },
    // uploadApi(file) {
    // },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

.qui-uploader-box {
  &__add {
    width: 160rpx;
    height: 160rpx;
    padding-top: 32rpx;
    text-align: center;
    background-color: --color(--qui-BG-2);
    border: 1px solid --color(--qui-BOR-ED);
    border-radius: 5rpx;
    box-sizing: border-box;
  }
  &__add__fonts {
    margin-top: 4rpx;
    font-size: 20rpx;
    color: --color(--qui-FC-AAA);
  }
}
</style>
