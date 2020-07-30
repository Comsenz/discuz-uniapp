<template>
  <view class="registration-agreement">
    <view class="registration-agreement__content">
      <text>{{ i18n.t('user.agreement') }}</text>
      <text class="registration-agreement__content__register">
        {{ i18n.t('user.agreementRegister') }}
      </text>
      <text class="registration-agreement__content__privacy">
        {{ i18n.t('user.agreementPrivacy') }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    tips: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.registration-agreement {
  position: absolute;
  bottom: 40px;
  width: 100%;
  padding: 0 27px;
  box-sizing: border-box;
  &__content {
    font-size: $fg-f24;
    color: --color(--qui-FC-AAA);
    text-align: center;
  }
  &__content__register,
  &__content__privacy {
    margin-left: 5px;
    font-weight: bold;
  }
}
</style>
