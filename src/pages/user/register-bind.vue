<template>
  <qui-page :data-qui-theme="theme" class="register-bind-box">
    <view>
      <view class="register-bind-box-h">{{ i18n.t('user.registerBind') }}</view>
      <view class="register-bind-box-con">
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
        <input
          v-if="forum && forum.set_reg && forum.set_reg.register_validate"
          class="input"
          maxlength="50"
          :placeholder="i18n.t('user.reason')"
          placeholder-style="color: #ddd"
          v-model="reason"
        />
      </view>
      <view class="register-bind-box-btn" id="TencentCaptcha" @click="handleRegister">
        {{ type ? i18n.t('user.registerBindId') : i18n.t('user.registerBindUc') }}
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <view class="register-bind-box-ft">
        <view
          class="register-bind-box-ft-title"
          v-if="
            (forum && forum.passport && forum.passport.miniprogram_close) ||
              (forum && forum.qcloud && forum.qcloud.qcloud_sms)
          "
        >
          {{ i18n.t('user.otherRegisterMode') }}
        </view>
        <view class="register-bind-box-ft-con">
          <image
            v-if="forum && forum.passport && forum.passport.miniprogram_close"
            :class="[
              forum &&
              forum.passport &&
              forum.passport.miniprogram_close &&
              forum.qcloud &&
              forum.qcloud.qcloud_sms
                ? 'register-bind-box-ft-con-image register-bind-box-ft-con-right'
                : 'register-bind-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/weixin.svg"
            @click="mpAuthClick"
          />
          <image
            v-if="forum && forum.qcloud && forum.qcloud.qcloud_sms"
            :class="[
              forum &&
              forum.passport &&
              forum.passport.miniprogram_close &&
              forum.qcloud &&
              forum.qcloud.qcloud_sms
                ? 'register-bind-box-ft-con-image register-bind-box-ft-con-left'
                : 'register-bind-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/shouji.svg"
            @click="jump2PhoneLogin"
          />
        </view>
        <view class="register-bind-box-ft-btn" @click="jump2Login">
          {{ i18n.t('user.login') }}
        </view>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="register-bind-box-ft">
        <view
          class="register-bind-box-ft-title"
          v-if="
            (forum && forum.passport && forum.passport.offiaccount_close && isWeixin) ||
              (forum && forum.qcloud && forum.qcloud.qcloud_sms)
          "
        >
          {{ i18n.t('user.otherRegisterMode') }}
        </view>
        <view class="register-bind-box-ft-con">
          <image
            v-if="forum && forum.passport && forum.passport.offiaccount_close && isWeixin"
            :class="[
              forum &&
              forum.passport &&
              forum.passport.offiaccount_close &&
              forum.qcloud &&
              forum.qcloud.qcloud_sms &&
              isWeixin
                ? 'register-bind-box-ft-con-image register-bind-box-ft-con-right'
                : 'register-bind-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/weixin.svg"
            @click="jump2WeChat"
          />
          <image
            v-if="forum && forum.qcloud && forum.qcloud.qcloud_sms"
            :class="[
              forum &&
              forum.passport &&
              forum.passport.offiaccount_close &&
              forum.qcloud &&
              forum.qcloud.qcloud_sms &&
              isWeixin
                ? 'register-bind-box-ft-con-image register-bind-box-ft-con-left'
                : 'register-bind-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/shouji.svg"
            @click="jump2PhoneLogin"
          />
        </view>
        <view class="register-bind-box-ft-btn" @click="jump2Login">
          {{ i18n.t('user.login') }}
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
import tcaptchs from '@/utils/tcaptcha';
// #endif

export default {
  mixins: [
    user,
    loginModule,
    // #ifdef H5
    appCommonH,
    tcaptchs,
    // #endif
  ],
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      reason: '', // 注册原因
      site_mode: '', // 站点模式
      forum: {}, // 配置
      isPaid: false, // 默认未付费
      captcha: null, // 腾讯云验证码实例
      captcha_ticket: '', // 腾讯云验证码返回票据
      captcha_rand_str: '', // 腾讯云验证码返回随机字符串
      ticket: '',
      randstr: '',
      captchaResult: {},
      // #ifdef H5
      isWeixin: false, // 默认不是微信浏览器
      // #endif
      type: true,
    };
  },
  onLoad() {
    const pages = getCurrentPages();
    if (pages[1].route === 'pages/user/uc-login') {
      this.type = false;
    }
    this.getForum();

    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif

    // 接受验证码captchaResult
    this.$u.event.$on('captchaResult', result => {
      console.log(result, '注册绑定页面');
      this.ticket = result.ticket;
      this.randstr = result.randstr;
    });
    this.$u.event.$on('closeChaReault', () => {
      uni.hideLoading();
    });
  },
  onUnload() {
    this.$u.event.$off('captchaResult');
    this.$u.event.$off('closeChaReault');
    // 隐藏验证码
    if (this.captcha) {
      this.captcha.destroy();
    }
  },
  methods: {
    handleRegister() {
      const params = {
        data: {
          attributes: {
            username: this.username,
            password: this.password,
          },
        },
      };
      this.getRegisterParams(params, this.i18n.t('user.registerBindSuccess'));
    },
    // 验证码
    toTCaptcha(param, resultDialog) {
      // #ifdef MP-WEIXIN
      wx.navigateToMiniProgram({
        appId: 'wx5a3a7366fd07e119',
        path: '/pages/captcha/index',
        envVersion: 'release',
        extraData: {
          appId: this.forum.qcloud.qcloud_captcha_app_id, // 您申请的验证码的 appId
        },
        success() {
          console.log('验证码成功打开');
        },
        fail() {
          uni.hideLoading();
        },
      });
      // #endif
      // #ifdef H5
      // eslint-disable-next-line no-undef
      this.captcha = new TencentCaptcha(this.forum.qcloud.qcloud_captcha_app_id, res => {
        if (res.ret === 0) {
          this.ticket = res.ticket;
          this.randstr = res.randstr;
          this.addRegisterParams(param, resultDialog);
        }
        if (res.ret === 2) {
          uni.hideLoading();
        }
      });
      // 显示验证码
      this.captcha.show();
      // #endif
    },
    // #ifdef MP-WEIXIN
    mpAuthClick() {
      this.getmpRegisterParams();
    },
    // #endif
    // #ifdef H5
    jump2WeChat() {
      this.wxh5Login();
    },
    // #endif
    jump2PhoneLogin() {
      this.jump2PhoneLoginPage();
    },
    jump2Login() {
      this.jump2LoginBindPage();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.register-bind-box {
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
  }
}
</style>
