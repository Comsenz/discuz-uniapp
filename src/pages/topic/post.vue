<template>
  <view class="post-box">
    <view class="post-box__hd">
      <view class="post-box__hd-l">
        <qui-icon
          class="post-box__hd-l__icon"
          name="icon-expression"
          size="40"
          color="#777"
        ></qui-icon>
        <qui-icon class="post-box__hd-l__icon" name="icon-call" size="40" color="#777"></qui-icon>
      </view>
      <text class="post-box__hd-r">
        还能输入450个字
      </text>
    </view>
    <textarea
      class="post-box__con-text"
      placeholder="您想说的.."
      placeholder-class="textarea-placeholder"
    ></textarea>
    <view class="post-box__ft">
      <text class="post-box__ft-tit">选择分类</text>
      <view class="post-box__ft-categories">
        <qui-button type="primary" plain>产品经理</qui-button>
      </view>
      <qui-button type="primary" size="large" @click="postClick">按钮</qui-button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Post',
  methods: {
    getCategories() {
      console.log(3454);
      this.$store.dispatch('jv/get', ['categories', {}]).then(res => {
        console.log(res);
      });
    },
    postClick() {
      console.log(9090);
      // this.getCategories();
    },
  },
  onLoad() {
    console.log(123);
    this.getCategories();
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.post-box {
  width: 100vw;
  padding: 40rpx;
  box-sizing: border-box;
  &__hd {
    display: flex;
    justify-content: space-between;
    &-l {
      &__icon {
        margin-right: 54rpx;
      }
    }
    &-r {
      font-size: $fg-f24;
      color: --color(--qui-FC-777);
    }
  }
  &__con-text {
    width: 100%;
    min-height: 400rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    background-color: --color(--qui-BG-1);
    border: 1rpx solid #ddd;
    border-radius: 10rpx;
    box-sizing: border-box;
  }
  &__ft {
    &-tit {
      display: block;
      margin: 30rpx 0 40rpx;
      font-size: $fg-f28;
      color: --color(--qui-FC-7D7979);
    }
    &-categories {
      margin-bottom: 50rpx;
    }
  }
}
/deep/ textarea .textarea-placeholder {
  font-size: $fg-f28;
  color: --color(--qui-FC-B5);
}
</style>
