<template>
  <view class="other-mode">
    <view class="other-mode-title" v-if="isNoSense || isPhone || (isUser && canSend)">
      {{ isLogin ? '其他登录方式' : '其他注册方式' }}
    </view>
    <view class="other-mode-con">
      <image
        v-if="isNoSense"
        lazy-load
        :class="[isNoSense ? 'other-mode-con-image other-mode-con-right' : 'other-mode-con-image']"
        src="@/static/weixin.svg"
        @click="jump2WeChat"
      />
      <image
        v-if="isPhone"
        lazy-load
        :class="[
          isNoSense && isPhone
            ? 'other-mode-con-image other-mode-con-left'
            : 'other-mode-con-image',
        ]"
        src="@/static/zhanghao.svg"
        @click="jump2Login"
      />
      <image
        v-if="isUser && canSend"
        lazy-load
        :class="[
          isNoSense && canSend
            ? 'other-mode-con-image other-mode-con-left'
            : 'other-mode-con-image',
        ]"
        src="@/static/shouji.svg"
        @click="jump2VCLogin"
      />
    </view>
    <text class="other-mode-btn" v-if="!isLogin" @click="login">登录</text>
    <view v-else>
      <text class="other-mode-btn" v-if="canRegister" @click="register">
        注册用户
      </text>
      <text class="other-mode-line" v-if="canRegister && canSend"></text>
      <text class="other-mode-text" v-if="canSend" @click="forgetPassword">
        忘记密码？
      </text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    isLogin: {
      // 登录
      type: Boolean,
      default: false,
    },
    isNoSense: {
      // 无感模式
      type: Boolean,
      default: false,
    },
    isUser: {
      // 用户名登录/注册页面
      type: Boolean,
      default: false,
    },
    isPhone: {
      // 手机号登录/注册页面
      type: Boolean,
      default: false,
    },
    canRegister: {
      // 允许用户注册
      type: Boolean,
      default: false,
    },
    canSend: {
      // 开启短信功能
      type: Boolean,
      default: false,
    },
  },
  methods: {
    jump2WeChat() {
      this.$emit('jump2NoSenseLogin');
    },
    jump2Login() {
      this.$emit('jump2Login');
    },
    jump2VCLogin() {
      this.$emit('jump2VCLogin');
    },
    login() {
      this.$emit('login');
    },
    register() {
      this.$emit('jump2Register');
    },
    forgetPassword() {
      this.$emit('jump2ForgetPassword');
    },
  },
};
</script>

<style lang="scss" scoped>
.other-mode {
  margin: 80rpx 0 50rpx;
  text-align: center;

  &-title {
    color: rgba(221, 221, 221, 1);
  }

  &-con {
    margin: 30rpx 0 50rpx;

    &-image {
      width: 100rpx;
      height: 100rpx;
    }

    &-right {
      margin-right: 20rpx;
    }

    &-left {
      margin-left: 20rpx;
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
</style>
