<template>
  <qui-page :data-qui-theme="theme" class="parse-goods">
    <view class="parse-goods-box">
      <view class="parse-goods-box-title">现以支持以下商品链接</view>
      <view class="parse-goods-box-image">
        <image class="image" lazy-load src="@/static/jingdong.svg" />
        <image class="image left right" lazy-load src="@/static/taobao.svg" />
        <image class="image right" lazy-load src="@/static/tmall.svg" />
        <image class="image" lazy-load src="@/static/pinduoduo.svg" />
      </view>
      <textarea
        class="parse-goods-box-con"
        maxlength="10000"
        placeholder="请粘贴 \ 输入商品链接"
        v-model="link"
      />
      <qui-button class="parse-goods-box-btn" @click="handleNext">下一步</qui-button>
    </view>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      link: '',
    };
  },
  methods: {
    handleNext() {
      console.log('link', this.link);
      if (this.link === '') {
        uni.showToast({
          icon: 'none',
          title: '请输入商品链接',
          duration: 2000,
        });
      } else {
        const params = {
          _jv: {
            type: 'analysis/goods',
          },
          type: 'analysis',
          address: this.link,
        };
        console.log('商品参数：', params);
        this.$store
          .dispatch('jv/post', params)
          .then(res => {
            console.log('查询商品信息：', res);
            if (res && res._jv) {
              this.$store.dispatch('session/setGood', res);
              uni.navigateTo({
                url: '/pages/topic/goods-post',
              });
              this.link = '';
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.parse-goods {
  font-size: $fg-f3;
  color: #000;
  background-color: --color(--qui-BG-2);

  &-box {
    margin: 40rpx;

    &-title {
      color: --color(--qui-FC-000);
    }

    &-image {
      margin: 30rpx 0;

      .image {
        width: 80rpx;
        height: 80rpx;
      }

      .left {
        margin-left: 14rpx;
      }

      .right {
        margin-right: 14rpx;
      }
    }

    &-con {
      height: 400rpx;
      padding: 20rpx;
      font-size: $fg-f3;
      color: --color(--qui-FC-B5);
      background-color: --color(--qui-BG-1);
      border: 1px solid --color(--qui-FC-DDD);
      border-radius: 10px;
    }

    &-btn {
      position: absolute;
      bottom: 40rpx;
      width: 670rpx;
      height: 90rpx;
      color: --color(--qui-BG-2);
      background-color: --color(--qui-MAIN);
      border-radius: 5rpx;
    }
  }
}
</style>
