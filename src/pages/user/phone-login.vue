<template>
  <qui-page :data-qui-theme="theme" class="phone-login-box">
    <view class="new" @click.stop="toggleBox">
      <view class="phone-login-box-h">
        {{ isLogin ? i18n.t('user.phoneNumberLogin') : i18n.t('user.phoneNumberRegister') }}
      </view>
      <view class="new-phon">
        <view class="new-phon-test">{{ i18n.t('user.phoneNumber') }}</view>
        <view class="new-phon-number">
          <input
            class="new-phon-num"
            type="number"
            v-model="phoneNumber"
            @input="changeinput"
            maxlength="11"
          />
          <button
            class="new-phon-send"
            @click="sendVerificationCode"
            id="TencentCaptcha"
            :data-appid="(forum && forum.qcloud && forum.qcloud.qcloud_captcha_app_id) || ''"
            :disabled="disabled"
          >
            {{ btnContent }}
          </button>
        </view>
      </view>
      <view class="newphon-erro" v-if="formeerro">{{ formeerro }}</view>
      <!-- 验证码 -->
      <view class="new-input" @click.stop="fourse">
        <view class="new-input-test">{{ i18n.t('modify.placeentercode') }}</view>
        <qui-input-code
          @getdata="btndata"
          :title="tit"
          :text="test"
          :show="inshow"
          :isiphonex="inisIphone"
          ref="quiinput"
        ></qui-input-code>
      </view>
      <view class="phone-login-box-btn" @click="login">
        {{ isLogin ? i18n.t('user.login') : i18n.t('user.register') }}
      </view>
      <view class="phone-login-box-ft">
        <view class="phone-login-box-ft-title">
          {{ isLogin ? i18n.t('user.otherLoginMode') : i18n.t('user.otherRegisterMode') }}
        </view>
        <view class="phone-login-box-ft-con">
          <!-- #ifdef MP-WEIXIN -->
          <image
            v-if="forum && forum.passport && forum.passport.miniprogram_close && !isLogin"
            :class="[
              forum && forum.passport && forum.passport.miniprogram_close && !isLogin
                ? 'phone-login-box-ft-con-image phone-login-box-ft-con-right'
                : 'phone-login-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/weixin.svg"
            @click="mpAuthClick"
          />
          <image
            :class="[
              forum && forum.passport && forum.passport.miniprogram_close && !isLogin
                ? 'phone-login-box-ft-con-image'
                : 'phone-login-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/zhanghao.svg"
            @click="jump2Login"
          />
          <image
            v-if="forum && forum.ucenter && forum.ucenter.ucenter"
            :class="[
              forum && forum.ucenter && forum.ucenter.ucenter
                ? 'phone-login-box-ft-con-image phone-login-box-ft-con-left'
                : 'phone-login-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/UC.svg"
            @click="jump3Login"
          />
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <image
            v-if="forum && forum.passport && forum.passport.offiaccount_close && isWeixin"
            :class="[
              forum && forum.passport && forum.passport.offiaccount_close && isWeixin
                ? 'phone-login-box-ft-con-image phone-login-box-ft-con-right'
                : 'phone-login-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/weixin.svg"
            @click="jump2WeChat"
          />
          <image
            :class="[
              forum && forum.passport && forum.passport.offiaccount_close && isWeixin
                ? 'phone-login-box-ft-con-image'
                : 'phone-login-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/zhanghao.svg"
            @click="jump2Login"
          />
          <image
            v-if="forum && forum.ucenter && forum.ucenter.ucenter"
            :class="[
              forum && forum.ucenter && forum.ucenter.ucenter
                ? 'phone-login-box-ft-con-image phone-login-box-ft-con-left'
                : 'phone-login-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/UC.svg"
            @click="jump3Login"
          />
          <!-- #endif -->
        </view>
        <view v-if="isLogin">
          <!-- 开启注册功能才显示 -->
          <text
            class="phone-login-box-ft-btn"
            v-if="forum && forum.set_reg && forum.set_reg.register_close"
            @click="switchState"
          >
            {{ i18n.t('user.registerUser') }}
          </text>
          <text
            class="phone-login-box-ft-line"
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
            class="phone-login-box-ft-text"
            v-if="forum && forum.qcloud && forum.qcloud.qcloud_sms"
            @click="jump2findpwd"
          >
            {{ i18n.t('user.forgetPassword') }}
          </text>
        </view>
        <view class="" v-else>
          <text class="phone-login-box-ft-btn" @click="switchState">
            {{ i18n.t('user.login') }}
          </text>
        </view>
      </view>
      <qui-registration-agreement></qui-registration-agreement>
    </view>
  </qui-page>
</template>

<script>
import user from '@/mixin/user';
import loginModule from '@/mixin/loginModule';
import { SITE_PAY } from '@/common/const';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
import tcaptchs from '@/utils/tcaptcha';
import { setCookie } from '@/utils/setCookie';
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
      tit: false,
      test: '',
      inshow: false,
      inisIphone: false,
      formeerro: '',
      btnContent: this.i18n.t('modify.sendverificode'),
      time: 0, // 倒计时
      timer: '', // 定时器
      disabled: true, // 发送验证码按钮的状态
      phoneNumber: '', // 手机号
      verificationCode: '', // 验证码
      isPaid: false, // 默认未付费
      captcha: null, // 腾讯云验证码实例
      captcha_ticket: '', // 腾讯云验证码返回票据
      captcha_rand_str: '', // 腾讯云验证码返回随机字符串
      captchaResult: {},
      isLogin: true, // 默认是登录
      forum: {}, // 配置
      // #ifdef H5
      isWeixin: false, // 默认不是微信浏览器
      // #endif
    };
  },
  onLoad() {
    this.getForum();

    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif

    // 接受验证码captchaResult
    this.$u.event.$on('captchaResult', result => {
      console.log(result, '手机登录页');
      this.ticket = result.ticket;
      this.randstr = result.randstr;
      this.time = 60;
      this.countdown();
      this.sendSMS();
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
    changeinput() {
      setTimeout(() => {
        this.phoneNumber = this.phoneNumber.replace(/[^\d]/g, '');
      }, 30);
      if (this.phoneNumber.length === 11) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    fourse() {
      this.inshow = true;
    },
    btndata(num) {
      this.verificationCode = num;
    },
    // 发送验证码
    sendVerificationCode() {
      if (this.forum && this.forum.qcloud && this.forum.qcloud.qcloud_captcha) {
        if (!this.ticket || !this.randstr) {
          this.toTCaptcha();
          return false;
        }
      } else {
        this.time = 60;
        this.countdown();
        this.sendSMS();
      }
    },
    // 发送验证码按钮的验证
    toTCaptcha() {
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
          // 验证通过后发布
          this.time = 60;
          this.countdown();
          this.sendSMS();
        }
        if (res.ret === 2) {
          this.postLoading = false;
          uni.hideLoading();
        }
      });
      // 显示验证码
      this.captcha.show();
      // #endif
    },
    // 60s倒计时
    countdown() {
      if (this.time > 1) {
        this.time -= 1;
        this.btnContent = `${this.time}${this.i18n.t('modify.retransmission')}`;
        this.disabled = true;
        this.timer = setTimeout(this.countdown, 1000);
        this.isGray = true;
      } else if (this.time === 1) {
        this.btnContent = this.i18n.t('modify.sendverificode');
        clearTimeout(this.timer);
        this.disabled = false;
        this.isGray = false;
      }
    },
    // 发送短信
    sendSMS() {
      const params = {
        _jv: {
          type: 'sms/send',
        },
        mobile: this.phoneNumber,
        type: 'login',
        captcha_ticket: this.ticket,
        captcha_rand_str: this.randstr,
      };
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          if (res) {
            this.ticket = '';
            this.randstr = '';
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    login() {
      if (this.phoneNumber === '') {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.phonenumberEmpty'),
          duration: 2000,
        });
      } else if (this.verificationCode === '') {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.verificationCodeEmpty'),
          duration: 2000,
        });
      } else {
        this.verifyPhoneNumber();
      }
    },
    // 验证手机号
    verifyPhoneNumber() {
      const params = {
        data: {
          attributes: {
            mobile: this.phoneNumber,
            code: this.verificationCode,
            type: 'login',
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
        params.data.attributes.inviteCode = data.data.attributes.code;
      }
      // #endif
      // #ifdef H5
      const token = this.$store.getters['session/get']('token');
      if (token && token !== '') {
        params.data.attributes.token = token;
      }
      // #endif
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
        .dispatch('session/verificationCodeh5Login', params)
        .then(res => {
          if (res && res.access_token) {
            // #ifdef H5
            setCookie('token', res.access_token, 30);
            // #endif
            console.log('手机号登录成功：', res);
            this.logind();
            if (this.forum && this.forum.set_site && this.forum.set_site.site_mode !== SITE_PAY) {
              uni.getStorage({
                key: 'page',
                success(resData) {
                  uni.redirectTo({
                    url: resData.data,
                  });
                },
              });
            }
            if (
              this.forum &&
              this.forum.set_site &&
              this.forum.set_site.site_mode === SITE_PAY &&
              this.user &&
              !this.user.paid
            ) {
              uni.redirectTo({
                url: '/pages/site/info',
              });
            }
            uni.showToast({
              title: this.i18n.t('user.loginSuccess'),
              duration: 2000,
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toggleBox() {
      this.inshow = false;
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
    switchState() {
      this.isLogin = !this.isLogin;
      this.phoneNumber = '';
      this.$refs.quiinput.deleat();
    },
    jump2Login() {
      this.jump2LoginPage();
    },
    jump3Login() {
      uni.navigateTo({
        url: '/pages/user/uc-login',
      });
    },
    jump2findpwd() {
      this.jump2findpwdPage();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
page {
  overflow: scroll;
  overflow-x: hidden;
}
.phone-login-box {
  background-color: --color(--qui-BG-2);
}

.phone-login-box-h {
  padding-top: 20px;
  margin: 0 0rpx 80rpx 40rpx;
  font-size: 50rpx;
  font-weight: bold;
  color: --color(--qui-FC-333);
}
.new {
  width: 100vw;
  padding-bottom: 40px;
  background-color: --color(--qui-BG-2);
  box-sizing: border-box;
}
.new-phon {
  width: 710rpx;
  margin-left: 40rpx;
  font-size: $fg-f7;
  font-weight: bold;
  line-height: 100rpx;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  box-sizing: border-box;
}
.new-phon-test {
  font-size: $fg-f4;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
}
.new-phon-number {
  display: flex;
}
.new-phon-num {
  width: 399rpx;
  height: 100rpx;
  font-size: $fg-f7;
  font-weight: bold;
  line-height: 100rpx;
  color: --color(--qui-FC-333);
}
.newphon-erro {
  margin: 20rpx 0 0 40rpx;
  font-size: $fg-f2;
  font-weight: 400;
  color: --color(--qui-RED);
}
.new-phon-send {
  display: block;
  height: 70rpx;
  min-width: 180rpx;
  margin: 15rpx 0 0 91rpx;
  font-size: $fg-f4;
  font-weight: 400;
  line-height: 70rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background: --color(--qui-BG-HIGH-LIGHT);
  border-radius: 5rpx;
}
.new-input {
  width: 710rpx;
  margin: 0 0 0 40rpx;
}
.new-input-test {
  font-size: $fg-f4;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
  opacity: 1;
}
.new-vftion-input {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.new-button {
  margin: 52rpx 40rpx 0;
}
.phone-login-box-btn {
  width: 670rpx;
  height: 90rpx;
  margin: 50rpx auto 0rpx;
  line-height: 90rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background-color: --color(--qui-MAIN);
  border-radius: 5rpx;
}
.phone-login-box-pwdlogin {
  margin: 20rpx 0rpx 0rpx 40rpx;
  font-size: $fg-f4;
  color: --color(--qui-LINK);
}

.phone-login-box-ft {
  margin: 160rpx 0 50rpx;
  text-align: center;

  &-title {
    color: rgba(221, 221, 221, 1);
  }

  &-con {
    display: flex;
    justify-content: center;
    margin: 30rpx 0 100rpx;
    &-image {
      display: block;
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
/deep/ .registration-agreement {
  margin-top: 50px;
}
</style>
