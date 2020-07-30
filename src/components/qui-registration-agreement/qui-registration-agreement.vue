<template>
  <view
    class="registration-agreement"
    v-if="
      (forums.set_reg && forums.set_reg.register === 1) ||
        (forums.set_reg && forums.set_reg.privacy === 1)
    "
  >
    <view class="registration-agreement__content">
      <text>{{ i18n.t('user.agreement') }}</text>
      <text
        class="registration-agreement__content__register"
        @tap="open('register')"
        v-if="forums.set_reg && forums.set_reg.register === 1"
      >
        {{ `《${i18n.t('user.agreementRegister')}》` }}
      </text>
      <text
        class="registration-agreement__content__privacy"
        @tap="open('privacy')"
        v-if="forums.set_reg && forums.set_reg.privacy === 1"
      >
        {{ `《${i18n.t('user.agreementPrivacy')}》` }}
      </text>
    </view>
    <uni-popup ref="popupMessage" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <view class="popup-content__title">{{ popTitle }}</view>
          <view class="popup-content__detail">{{ popDetail }}</view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  props: {
    tips: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      popTitle: '',
      popDetail: '',
    };
  },
  methods: {
    open(type) {
      this.$refs.popupMessage.open();
      if (type === 'register') {
        this.popTitle = this.i18n.t('user.agreementRegister');
        this.popDetail = this.forums.set_reg.register_content;
      } else {
        this.popTitle = this.i18n.t('user.agreementPrivacy');
        this.popDetail = this.forums.set_reg.register_content;
      }
    },
    cancel() {
      this.$refs.popupMessage.close();
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
/deep/ .uni-popup__wrapper-box {
  min-height: 100vh;
  background: --color(--qui-BG-2);
}
.popup-share-content {
  min-height: calc(100vh - 60px);
}
</style>
