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
      <view class="register-bind-box-btn" id="TencentCaptcha" @click="register">
        {{ i18n.t('user.registerBindId') }}
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
import { SITE_PAY } from '@/common/const';

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
      url: '', // 上一个页面的路径
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
    };
  },
  onLoad(params) {
    this.getForum();
    this.getPageParams(params);

    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif

    this.$u.event.$on('logind', () => {
      if (this.user) {
        this.isPaid = this.user.paid;
      }
      if (this.forum && this.forum.set_site) {
        this.site_mode = this.forum.set_site.site_mode;
      }
      if (this.site_mode !== SITE_PAY) {
        uni.redirectTo({
          url: this.url,
        });
      }
      if (this.site_mode === SITE_PAY && !this.isPaid) {
        uni.redirectTo({
          url: '/pages/site/info',
        });
      }
    });
  },
  methods: {
    register() {
      if (this.username === '') {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.usernameEmpty'),
          duration: 2000,
        });
      } else if (this.password === '') {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.passwordEmpty'),
          duration: 2000,
        });
      } else if (this.forum && this.forum.set_reg && this.forum.set_reg.register_captcha) {
        this.toTCaptcha();
      } else {
        this.registerBind();
      }
    },
    // 验证码
    toTCaptcha() {
      // #ifdef H5
      // eslint-disable-next-line no-undef
      this.captcha = new TencentCaptcha(this.forum.qcloud.qcloud_captcha_app_id, res => {
        if (res.ret === 0) {
          this.ticket = res.ticket;
          this.randstr = res.randstr;
          this.registerBind();
        }
        if (res.ret === 2) {
          uni.hideLoading();
        }
      });
      // 显示验证码
      this.captcha.show();
      // #endif
    },
    registerBind() {
      const params = {
        data: {
          attributes: {
            username: this.username,
            password: this.password,
          },
        },
      };
      // #ifdef MP-WEIXIN
      const data = this.$store.getters['session/get']('params');
      if (data && data.data && data.data.attributes) {
        params.data.attributes.js_code = data.data.attributes.js_code;
        params.data.attributes.iv = data.data.attributes.iv;
        params.data.attributes.encryptedData = data.data.attributes.encryptedData;
      }
      if (data && data.data && data.data.attributes && data.data.attributes.code !== '') {
        params.data.attributes.code = data.data.attributes.code;
      }
      // #endif
      // #ifdef H5
      const token = this.$store.getters['session/get']('token');
      if (token && token !== '') {
        params.data.attributes.token = token;
      }
      // #endif
      if (
        this.forum &&
        this.forum.set_reg &&
        this.forum.set_reg.register_captcha &&
        this.forum.set_reg.register_validate
      ) {
        params.data.attributes.register_reason = this.reason;
        params.data.attributes.captcha_ticket = this.ticket;
        params.data.attributes.captcha_rand_str = this.randstr;
      }
      if (this.forum && this.forum.set_reg && this.forum.set_reg.register_captcha) {
        params.data.attributes.captcha_ticket = this.ticket;
        params.data.attributes.captcha_rand_str = this.randstr;
      }
      if (this.forum.set_reg.register_validate) {
        params.data.attributes.register_reason = this.reason;
      }
      let inviteCode = '';
      uni.getStorage({
        key: 'inviteCode',
        success(resData) {
          inviteCode = resData.data || '';
        },
      });
      if (inviteCode !== '') {
        params.data.attributes.code = inviteCode;
      }
      console.log('params', params);
      this.$store
        .dispatch('session/h5Register', params)
        .then(result => {
          if (result && result.data && result.data.data && result.data.data.id) {
            this.logind();
            uni.showToast({
              title: this.i18n.t('user.registerBindSuccess'),
              duration: 2000,
            });
          }
          if (
            result &&
            result.data &&
            result.data.errors &&
            result.data.errors[0].status === '422'
          ) {
            uni.showToast({
              icon: 'none',
              title: result.data.errors[0].detail[0],
              duration: 2000,
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
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
  onUnload() {
    this.$u.event.$off('logind');
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
