<template>
  <qui-page :data-qui-theme="theme" class="parse-goods">
    <view class="parse-goods-box">
      <view class="parse-goods-box-title">{{ i18n.t('topic.supportedLink') }}</view>
      <view class="parse-goods-box-image">
        <view class="box">
          <image class="image" lazy-load src="@/static/jingdong.svg" />
          <text>{{ i18n.t('topic.jingdong') }}</text>
        </view>
        <view class="box">
          <image class="image" lazy-load src="@/static/taobao.svg" />
          <text>{{ i18n.t('topic.taobao') }}</text>
        </view>
        <view class="box">
          <image class="image" lazy-load src="@/static/tmall.svg" />
          <text>{{ i18n.t('topic.tmall') }}</text>
        </view>
        <view class="box">
          <image class="image" lazy-load src="@/static/pinduoduo.svg" />
          <text>{{ i18n.t('topic.pinduoduo') }}</text>
        </view>
        <view class="box">
          <image class="image" lazy-load src="@/static/youzan.svg" />
          <text>{{ i18n.t('topic.youzan') }}</text>
        </view>
      </view>
      <textarea
        class="parse-goods-box-con"
        maxlength="10000"
        :placeholder="i18n.t('topic.goodsLink')"
        v-model="link"
      />
      <qui-button class="parse-goods-box-btn" type="primary" size="large" @click="handleNext">
        下一步
      </qui-button>
    </view>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      link: '',
      type: '',
      operating: '',
      threadId: '',
    };
  },
  onLoad(option) {
    this.type = option.type;
    this.operating = option.operating;
    this.threadId = option.threadId;
  },
  methods: {
    handleNext() {
      if (this.link === '') {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('topic.goodsLinkEmpty'),
          duration: 2000,
        });
      } else {
        const params = {
          _jv: {
            type: 'goods/analysis',
          },
          type: 'analysis',
          address: this.link,
        };
        this.$store
          .dispatch('jv/post', params)
          .then(res => {
            if (res && res._jv) {
              this.$store.dispatch('session/setGood', res);
              if (this.operating === 'edit' && this.threadId !== '') {
                // 编辑时上传
                uni.redirectTo({
                  url: `/topic/post?type=${this.type}&goodsId=${res._jv.id}&threadId=${this.threadId}&operating=edit`,
                });
              } else {
                // 发布时上传
                uni.redirectTo({
                  url: `/topic/post?type=${this.type}&goodsId=${res._jv.id}`,
                });
              }

              this.link = '';
            }
          })
          .catch(err => {
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
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-content: flex-start;
      flex-wrap: wrap;
      margin: 30rpx 0 14rpx;
      font-size: $fg-f2;

      .box {
        width: 25%;
        margin-bottom: 16rpx;
      }

      .image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 20rpx;
        vertical-align: middle;
      }
    }

    &-con {
      width: 100%;
      height: 400rpx;
      padding: 20rpx;
      font-size: $fg-f3;
      color: --color(--qui-FC-B5);
      background-color: --color(--qui-BG-1);
      border: 1rpx solid --color(--qui-FC-DDD);
      border-radius: 10rpx;
      box-sizing: border-box;
    }

    &-btn {
      position: absolute;
      bottom: 40rpx;
    }
  }
}
</style>
