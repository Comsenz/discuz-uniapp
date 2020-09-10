<template>
  <view class="qui-uploader-box">
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
      ></image>
    </view>
    <view class="qui-uploader-box__uploader-file__del" @click="uploadClick">
      <qui-icon class="icon-add" name="icon-add" color="#fff" size="17"></qui-icon>
    </view>
  </view>
</template>

<script>
// import { i18n } from '@/locale';

export default {
  name: 'QuiUploader',
  data() {
    return {
      uploadBeforeList: [],
    };
  },
  methods: {
    // 上传图片到本地
    uploadClick() {
      const _this = this;
      // 上传图片到本地
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          console.log(res);
          _this.uploadBeforeList = res.tempFiles;
        },
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
        font-size: $fg-f4;
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
      width: 200rpx;
      height: 200rpx;
      background: #ccd;
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
.icon-add {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.van-uploader__input {
  width: 200rpx;
  height: 200rpx;
  background: burlywood;
}
</style>
