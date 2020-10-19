<template>
  <!--作者向您发起了提问部分-->
  <view class="theme__que">
    <view class="theme__que__btn" @click="queClick()">
      <qui-button size="medium" type="ask" class="watch-btn">
        <img src="/static/ask.svg" class="theme__que__btn__img" />
        {{ i18n.t('topic.questionAnswering') }}
      </qui-button>
    </view>
    <view class="theme__que__txt" v-if="showTxt">
      {{ `${i18n.t('topic.getTheAnswer')}${date}元;${i18n.t('topic.surrounded')}${beDate}元` }}
    </view>
  </view>
</template>
<script>
export default {
  props: {
    // 回答即可获得
    date: {
      type: [Number, String],
      default: 0,
    },
    // 每次回答可获得
    beDate: {
      type: [Number, String],
      default: 0,
    },
    // 是否显示文案
    showTxt: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      // date: '555',
      // beDate: '666',
    };
  },
  methods: {
    // 点击回答问题跳转到发布回答页
    queClick() {
      this.$emit('queClick');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.theme__que {
  width: 100%;
  text-align: center;
  &__btn {
    padding-bottom: 30rpx;
    &__img {
      width: 37rpx;
      height: 37rpx;
      margin-right: 11rpx;
    }
  }
  &__txt {
    padding: 30rpx 0 110rpx;
    font-size: $fg-f3;
    color: --color(--qui-FC-TAG);
  }
}
</style>
