<template>
  <qui-page :data-qui-theme="theme" class="attachment">
    <img class="attachment-image" :src="src" @click="previewPic" />
    <view class="attachment-page">
      <view class="attachment-page-text attachment-page-previous" v-if="page !== 1">上一页</view>
      <view class="attachment-page-num">{{ page }} / {{ totalPage }}</view>
      <view class="attachment-page-text attachment-page-next" v-if="page !== totalPage">
        下一页
      </view>
    </view>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      src: '',
      page: 1,
      totalPage: 2,
    };
  },
  onLoad() {
    this.preview();
  },
  methods: {
    preview(page = 1) {
      const attachment = this.$store.getters['session/get']('attachment');
      console.log('attachment', attachment);
      if (attachment) {
        this.src = `${attachment.url}&page=${page}`;
      }
    },
    previewPic() {
      uni.previewImage({
        current: this.page,
        urls: this.src,
        indicator: 'default',
      });
    },
    clickPreviousPage() {
      this.page -= 1;
      this.preview(this.page);
    },
    clickNextPage() {
      this.page += 1;
      this.preview(this.page);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.attachment {
  font-size: $fg-f3;
  background-color: --color(--qui-BG-2);

  &-image {
    width: 100%;
    height: 100%;
  }

  &-page {
    text-align: center;

    &-text {
      display: inline-block;
      width: 140rpx;
      height: 60rpx;
      line-height: 60rpx;
      color: #1878f3;
      text-align: center;
      background-color: #fff;
      border: 1rpx solid #1878f3;
      border-radius: 5rpx;
    }

    &-previous {
      position: absolute;
      bottom: 30rpx;
      left: 30rpx;
    }

    &-next {
      position: absolute;
      right: 30rpx;
      bottom: 30rpx;
    }

    &-num {
      position: absolute;
      bottom: 40rpx;
      display: inline-block;
      width: 78rpx;
      margin: 0 0 0 -39rpx;
      font-weight: bold;
      color: #333;
      opacity: 0.5;
    }
  }
}
</style>
