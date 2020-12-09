<template>
  <view>
    <view class="login-box-ft">
      <view class="login-box-ft-title" v-if="showWxIcon || showPhoneIcon || showUcIcon">
        {{ i18n.t('user.otherLoginMode') }}
      </view>
      <view class="login-box-ft-con">
        <image
          v-if="showWxIcon"
          :class="[
            (!isWeixin && isNoSenseMode && showPhoneIcon) ||
            (isWeixin && showPhoneIcon) ||
            showUcIcon
              ? 'right'
              : '',
            'login-box-ft-con-image',
          ]"
          lazy-load
          src="@/static/weixin.svg"
          @click="jump2WechatLogin"
        />
        <image
          v-if="(!isWeixin && isNoSenseMode && showPhoneIcon) || (isWeixin && showPhoneIcon)"
          :class="[showWxIcon ? 'left' : '', showUcIcon ? 'right' : '', 'login-box-ft-con-image']"
          lazy-load
          src="@/static/shouji.svg"
          @click="jump2PhoneLogin"
        />
        <image
          v-if="showUcIcon"
          :class="[
            showWxIcon ||
            (!isWeixin && isNoSenseMode && forum.qcloud.qcloud_sms) ||
            (isWeixin && showPhoneIcon)
              ? 'left'
              : '',
            'login-box-ft-con-image',
          ]"
          lazy-load
          src="@/static/UC.svg"
          @click="jump2UcLogin"
        />
      </view>
      <view>
        <text class="login-box-ft-btn" v-if="showRegisterBtn" @click="jump2Register">
          {{ i18n.t('user.registerUser') }}
        </text>
        <text class="login-box-ft-line" v-if="showRegisterBtn && showPhoneIcon"></text>
        <!-- 开启短信功能才显示 -->
        <text class="login-box-ft-text" v-if="showPhoneIcon" @click="jump2findpwd">
          {{ i18n.t('user.forgetPassword') }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    showMpIcon: {
      type: Boolean,
      default: false,
    },
    showWxIcon: {
      type: Boolean,
      default: false,
    },
    showPhoneIcon: {
      type: Boolean,
      default: false,
    },
    showUcIcon: {
      type: Boolean,
      default: false,
    },
    showRegisterBtn: {
      type: Boolean,
      default: false,
    },
    isNoSenseMode: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    jump2WechatLogin() {
      this.$emit('jump2WechatLogin');
    },
    jump2PhoneLogin() {
      this.$emit('jump2PhoneLogin');
    },
    jump2UcLogin() {
      this.$emit('jump2UcLogin');
    },
    jump2Register() {
      this.$emit('jump2Register');
    },
    jump2findpwd() {
      this.$emit('jump2findpwd');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.login-box-ft {
  margin: 160rpx 0 50rpx;
  text-align: center;

  &-title {
    color: rgba(221, 221, 221, 1);
  }

  &-con {
    margin: 30rpx 0 100rpx;

    &-image {
      width: 100rpx;
      height: 100rpx;
    }
  }

  &-btn {
    color: rgba(24, 120, 243, 1);
  }

  &-text {
    color: rgba(170, 170, 170, 1);
  }

  &-line {
    width: 0rpx;
    height: 32rpx;
    margin: 0 50rpx;
    border: 2rpx solid rgba(221, 221, 221, 1);
  }
}

.right {
  margin-right: 20rpx;
}

.left {
  margin-left: 20rpx;
}
</style>
