<template>
  <qui-page :data-qui-theme="theme" class="login-box">
    <view>
      <view class="login-box-h">{{ i18n.t('user.login') }}</view>
      <view class="login-box-con">
        <input
          class="input"
          maxlength="15"
          :placeholder="i18n.t('user.username')"
          placeholder-style="color: #ddd"
          v-model="username"
        />
        <input
          class="input"
          type="password"
          maxlength="50"
          :placeholder="i18n.t('user.password')"
          placeholder-style="color: #ddd"
          v-model="password"
        />
      </view>
      <view class="login-box-btn" @click="handleLogin">
        {{ i18n.t('user.login') }}
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <view class="login-box-ft">
        <view
          class="login-box-ft-title"
          v-if="
            (forum && forum.passport && forum.passport.miniprogram_close) ||
              (forum && forum.qcloud && forum.qcloud.qcloud_sms) ||
              (forum && forum.ucenter && forum.ucenter.ucenter && isShow)
          "
        >
          {{ i18n.t('user.otherLoginMode') }}
        </view>
        <view class="login-box-ft-con">
          <image
            v-if="forum && forum.passport && forum.passport.miniprogram_close"
            :class="[
              (forum && forum.qcloud && forum.qcloud.qcloud_sms) ||
              (forum && forum.ucenter && forum.ucenter.ucenter && isShow)
                ? 'right'
                : '',
              'login-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/weixin.svg"
            @click="jump2WechatLogin"
          />
          <!-- 开启短信功能才显示 -->
          <image
            v-if="forum && forum.qcloud && forum.qcloud.qcloud_sms"
            :class="[
              forum && forum.passport && forum.passport.miniprogram_close ? 'left' : '',
              forum && forum.ucenter && forum.ucenter.ucenter && isShow ? 'right' : '',
              'login-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/shouji.svg"
            @click="jump2PhoneLogin"
          />
          <image
            v-if="forum && forum.ucenter && forum.ucenter.ucenter && isShow"
            :class="[
              (forum && forum.passport && forum.passport.miniprogram_close) ||
              (forum && forum.qcloud && forum.qcloud.qcloud_sms)
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
          <!-- 开启注册功能才显示 -->
          <text
            class="login-box-ft-btn"
            v-if="forum && forum.set_reg && forum.set_reg.register_close"
            @click="jump2Register"
          >
            {{ i18n.t('user.registerUser') }}
          </text>
          <text
            class="login-box-ft-line"
            v-if="
              forum &&
                forum.set_reg &&
                forum.set_reg.register_close &&
                forum.qcloud &&
                forum.qcloud.qcloud_sms
            "
          ></text>
          <!-- 开启短信功能才显示 -->
          <text
            class="login-box-ft-text"
            v-if="forum && forum.qcloud && forum.qcloud.qcloud_sms"
            @click="jump2findpwd"
          >
            {{ i18n.t('user.forgetPassword') }}
          </text>
        </view>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="login-box-ft">
        <view
          class="login-box-ft-title"
          v-if="
            (forum && forum.passport && forum.passport.offiaccount_close) ||
              (forum && forum.qcloud && forum.qcloud.qcloud_sms) ||
              (forum && forum.ucenter && forum.ucenter.ucenter && isShow)
          "
        >
          {{ i18n.t('user.otherLoginMode') }}
        </view>
        <view class="login-box-ft-con">
          <image
            v-if="forum && forum.passport && forum.passport.offiaccount_close"
            :class="[
              (forum && forum.qcloud && forum.qcloud.qcloud_sms) ||
              (forum && forum.ucenter && forum.ucenter.ucenter && isShow)
                ? 'right'
                : '',
              'login-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/weixin.svg"
            @click="jump2WechatLogin"
          />
          <!-- 开启短信功能才显示 -->
          <image
            v-if="forum && forum.qcloud && forum.qcloud.qcloud_sms"
            :class="[
              forum && forum.passport && forum.passport.offiaccount_close ? 'left' : '',
              forum && forum.ucenter && forum.ucenter.ucenter && isShow ? 'right' : '',
              'login-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/shouji.svg"
            @click="jump2PhoneLogin"
          />
          <image
            v-if="forum && forum.ucenter && forum.ucenter.ucenter && isShow"
            :class="[
              (forum && forum.passport && forum.passport.offiaccount_close) ||
              (forum && forum.qcloud && forum.qcloud.qcloud_sms)
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
          <!-- 开启注册功能才显示 -->
          <text
            class="login-box-ft-btn"
            v-if="forum && forum.set_reg && forum.set_reg.register_close"
            @click="jump2Register"
          >
            {{ i18n.t('user.registerUser') }}
          </text>
          <text
            class="login-box-ft-line"
            v-if="
              forum &&
                forum.set_reg &&
                forum.set_reg.register_close &&
                forum.qcloud &&
                forum.qcloud.qcloud_sms
            "
          ></text>
          <!-- 开启短信功能才显示 -->
          <text
            class="login-box-ft-text"
            v-if="forum && forum.qcloud && forum.qcloud.qcloud_sms"
            @click="jump2findpwd"
          >
            {{ i18n.t('user.forgetPassword') }}
          </text>
        </view>
      </view>
      <!-- #endif -->
    </view>
    <qui-registration-agreement></qui-registration-agreement>
  </qui-page>
</template>

<script>
import user from '@/mixin/user';
import loginModule from '@/mixin/loginModule';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  mixins: [
    user,
    loginModule,
    // #ifdef H5
    appCommonH,
    // #endif
  ],
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      isPaid: false, // 默认未付费
      forum: {}, // 配置
      isShow: false,
      // #ifdef H5
      isWeixin: false, // 默认不是微信浏览器
      // #endif
    };
  },
  onLoad() {
    this.$store.dispatch('forum/setError', {
      code: 'user_login',
      status: 200,
    });
    this.getForum();
    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif
  },
  methods: {
    handleLogin() {
      const params = {
        data: {
          attributes: {
            username: this.username,
            password: this.password,
          },
        },
      };
      this.getLoginParams(params, this.i18n.t('user.loginSuccess'));
    },
    jump2WechatLogin() {
      // #ifdef MP-WEIXIN
      this.mpLogin();
      // #endif
      // #ifdef H5
      if (this.isWeixin) {
        this.wxh5Login(0, 0);
      } else {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.unLogin'),
          duration: 2000,
        });
      }
      // #endif
    },
    jump2PhoneLogin() {
      if (this.forum && this.forum.set_reg && this.forum.set_reg.register_type === 0) {
        this.jump2PhoneLoginPage();
      } else {
        this.jump2PhoneLoginRegisterPage();
      }
    },
    jump2Register() {
      this.jump2RegisterPage();
    },
    jump2findpwd() {
      this.jump2findpwdPage();
    },
    jump2UcLogin() {
      uni.navigateTo({
        url: '/pages/user/uc-login',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.login-box {
  padding-bottom: 40px;
  font-size: $fg-f4;
  background-color: --color(--qui-BG-2);

  &-h {
    padding: 60rpx 0rpx 80rpx 40rpx;
    font-size: 50rpx;
    font-weight: bold;
    color: --color(--qui-FC-333);
  }

  &-con {
    margin: 0rpx 40rpx;

    .input {
      width: 100%;
      height: 100rpx;
      padding: 0rpx 0rpx 0rpx 20rpx;
      font-size: $fg-f5;
      line-height: 100rpx;
      text-align: left;
      border-bottom: 2rpx solid --color(--qui-BOR-ED);
    }
  }

  &-btn {
    width: 670rpx;
    height: 90rpx;
    margin: 50rpx auto 0rpx;
    line-height: 90rpx;
    color: --color(--qui-FC-FFF);
    text-align: center;
    background-color: --color(--qui-MAIN);
    border-radius: 5rpx;
  }

  &-ft {
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
}

.right {
  margin-right: 20rpx;
}

.left {
  margin-left: 20rpx;
}
</style>
