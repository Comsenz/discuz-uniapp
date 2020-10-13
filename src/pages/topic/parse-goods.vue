<template>
  <qui-page :data-qui-theme="theme" class="parse-goods">
    <view class="parse-goods-box">
      <view class="parse-goods-box-title">{{ i18n.t('topic.supportedLink') }}</view>
      <view class="parse-goods-box-image">
        <view class="box right">
          <image class="image" lazy-load src="@/static/jingdong.svg" />
          <text>{{ i18n.t('topic.jingdong') }}</text>
        </view>
        <view class="box right">
          <image class="image" lazy-load src="@/static/taobao.svg" />
          <text>{{ i18n.t('topic.taobao') }}</text>
        </view>
        <view class="box right">
          <image class="image" lazy-load src="@/static/tmall.svg" />
          <text>{{ i18n.t('topic.tmall') }}</text>
        </view>
        <view class="box">
          <image class="image" lazy-load src="@/static/pinduoduo.svg" />
          <text>{{ i18n.t('topic.pinduoduo') }}</text>
        </view>
      </view>
      <textarea
        class="parse-goods-box-con"
        maxlength="10000"
        :placeholder="i18n.t('topic.goodsLink')"
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
          title: this.i18n.t('topic.goodsLinkEmpty'),
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
                url: '/topic/post',
              });
              this.link = '';
            }
          })
          .catch(err => {
            console.log('查询商品信息：', err);
            if (err && err.data && err.data.errors) {
              uni.showToast({
                icon: 'none',
                title: err.data.errors[0].detail[0],
                duration: 2000,
              });
              this.link = '';
            }
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
  color: --color(--qui-FC-000);
  background-color: --color(--qui-BG-2);

  &-box {
    margin: 40rpx;

    &-title {
      color: --color(--qui-FC-000);
    }

    &-image {
      margin: 30rpx 0;
      font-size: $fg-f2;

      .box {
        display: inline-block;
      }

      .image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 20rpx;
        vertical-align: middle;
      }

      .right {
        margin-right: 50rpx;
      }
    }

    &-con {
      width: 95%;
      height: 400rpx;
      padding: 20rpx;
      font-size: $fg-f3;
      color: --color(--qui-FC-B5);
      background-color: --color(--qui-BG-1);
      border: 1rpx solid --color(--qui-FC-DDD);
      border-radius: 10rpx;
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
