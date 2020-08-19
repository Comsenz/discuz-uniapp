<template>
  <qui-page :data-qui-theme="theme" class="register-box">
    <view>
      <view class="register-box-h">{{ i18n.t('user.register') }}</view>
      <view class="register-box-con">
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
      <view class="register-box-btn" id="TencentCaptcha" @click="register">
        {{ i18n.t('user.register') }}
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <view class="register-box-ft">
        <view
          class="register-box-ft-title"
          v-if="
            (forum && forum.passport && forum.passport.miniprogram_close) ||
              (forum && forum.qcloud && forum.qcloud.qcloud_sms)
          "
        >
          {{ i18n.t('user.otherRegisterMode') }}
        </view>
        <view class="register-box-ft-con">
          <image
            v-if="forum && forum.passport && forum.passport.miniprogram_close"
            :class="[
              forum &&
              forum.passport &&
              forum.passport.miniprogram_close &&
              forum.qcloud &&
              forum.qcloud.qcloud_sms
                ? 'register-box-ft-con-image register-box-ft-con-right'
                : 'register-box-ft-con-image',
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
                ? 'register-box-ft-con-image register-box-ft-con-left'
                : 'register-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/shouji.svg"
            @click="jump2PhoneLogin"
          />
        </view>
        <view class="register-box-ft-btn" @click="jump2Login">{{ i18n.t('user.login') }}</view>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="register-box-ft">
        <view
          class="register-box-ft-title"
          v-if="
            (forum && forum.passport && forum.passport.offiaccount_close && isWeixin) ||
              (forum && forum.qcloud && forum.qcloud.qcloud_sms)
          "
        >
          {{ i18n.t('user.otherRegisterMode') }}
        </view>
        <view class="register-box-ft-con">
          <image
            v-if="forum && forum.passport && forum.passport.offiaccount_close && isWeixin"
            :class="[
              forum &&
              forum.passport &&
              forum.passport.offiaccount_close &&
              forum.qcloud &&
              forum.qcloud.qcloud_sms &&
              isWeixin
                ? 'register-box-ft-con-image register-box-ft-con-right'
                : 'register-box-ft-con-image',
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
                ? 'register-box-ft-con-image register-box-ft-con-left'
                : 'register-box-ft-con-image',
            ]"
            lazy-load
            src="@/static/shouji.svg"
            @click="jump2PhoneLogin"
          />
        </view>
        <view class="register-box-ft-btn" @click="jump2Login">{{ i18n.t('user.login') }}</view>
      </view>
      <!-- #endif -->
    </view>
    <qui-registration-agreement></qui-registration-agreement>
  </qui-page>
</template>

<script>
import user from '@/mixin/user';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
import tcaptchs from '@/utils/tcaptcha';
// #endif
import { SITE_PAY } from '@/common/const';

export default {
  mixins: [
    user,
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
      code: '', // 注册邀请码
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
    const { url, commentId, code } = params;
    if (url) {
      let pageUrl;
      if (url.substr(0, 1) !== '/') {
        pageUrl = `/${url}`;
      } else {
        pageUrl = url;
      }
      if (commentId) {
        this.url = `${pageUrl}&commentId=${commentId}`;
      } else {
        this.url = pageUrl;
      }
    }
    if (code !== 'undefined') {
      this.code = code;
    }

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
        uni.navigateTo({
          url: this.url,
        });
      }
      if (this.site_mode === SITE_PAY && !this.isPaid) {
        uni.navigateTo({
          url: '/pages/site/info',
        });
      }
    });
  },
  methods: {
    getForum() {
      this.$store.dispatch('jv/get', ['forum', { params: { include: 'users' } }]).then(res => {
        console.log('forum', res);
        if (res) {
          this.forum = res;
        }
      });
    },
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
        this.registerClick();
      }
    },
    // 验证码
    toTCaptcha() {
      // #ifdef H5
      if (this.forum && this.forum.qcloud && this.forum.qcloud.qcloud_captcha_app_id) {
        // eslint-disable-next-line no-undef
        this.captcha = new TencentCaptcha(this.forum.qcloud.qcloud_captcha_app_id, res => {
          if (res.ret === 0) {
            this.ticket = res.ticket;
            this.randstr = res.randstr;
            this.registerClick();
          }
          if (res.ret === 2) {
            uni.hideLoading();
          }
        });
        // 显示验证码
        this.captcha.show();
      }
      // #endif
    },
    registerClick() {
      if (this.forum && this.forum.set_reg && !this.forum.set_reg.register_close) {
        this.$store
          .dispatch('forum/setError', {
            code: 'register_close',
            status: 500,
          })
          .then(res => {
            console.log(res);
            uni.navigateTo({
              url: '/pages/home/index',
            });
          });
      } else {
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
        if (this.code !== '') {
          params.data.attributes.code = this.code;
        }
        console.log('params', params);
        this.$store
          .dispatch('session/h5Register', params)
          .then(result => {
            if (result && result.data && result.data.data && result.data.data.id) {
              this.logind();
              uni.showToast({
                title: this.i18n.t('user.registerSuccess'),
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
            if (
              result &&
              result.data &&
              result.data.errors &&
              result.data.errors[0].code === 'register_validate'
            ) {
              this.$store
                .dispatch('forum/setError', {
                  code: 'register_validate',
                  status: 500,
                })
                .then(res => {
                  console.log(res);
                  uni.navigateTo({
                    url: '/pages/home/index',
                  });
                });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // #ifdef MP-WEIXIN
    mpAuthClick() {
      const params = {
        data: {
          attributes: {},
        },
      };
      const data = this.$store.getters['session/get']('params');
      if (data && data.data && data.data.attributes) {
        params.data.attributes.js_code = data.data.attributes.js_code;
        params.data.attributes.iv = data.data.attributes.iv;
        params.data.attributes.encryptedData = data.data.attributes.encryptedData;
        params.data.attributes.register = 1;
      }
      if (data && data.data && data.data.attributes && data.data.attributes.code !== '') {
        params.data.attributes.code = data.data.attributes.code;
      }
      this.$store
        .dispatch('session/noSenseMPLogin', params)
        .then(res => {
          if (res && res.data && res.data.data && res.data.data.id) {
            this.logind();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // #endif
    // #ifdef H5
    jump2WeChat() {
      if (
        this.isWeixin &&
        this.forum &&
        this.forum.passport &&
        this.forum.passport.offiaccount_close
      ) {
        this.$store.dispatch('session/noSenseh5Register');
      }
    },
    // #endif
    jump2PhoneLogin() {
      uni.navigateTo({
        url: `/pages/user/phone-login?url=${this.url}&code=${this.code}`,
      });
    },
    jump2Login() {
      uni.navigateTo({
        url: `/pages/user/login?url=${this.url}&code=${this.code}`,
      });
    },
    jump2findPassword() {
      uni.navigateTo({
        url: `/pages/modify/findpwd?pas=reset_pwd`,
      });
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
.register-box {
  padding-bottom: 40px;
  font-size: $fg-f28;
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
      font-size: $fg-f34;
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
