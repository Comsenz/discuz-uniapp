<template>
  <qui-page :data-qui-theme="theme" class="register-bind-box">
    <view>
      <view class="register-bind-box-h">
        {{ type ? i18n.t('user.registerBindId') : i18n.t('user.registerBindUcenter') }}
      </view>
      <view class="register-bind-box-info">
        <view class="register-bind-box-info-h">
          <text>{{ i18n.t('user.dear') }}</text>
          <img class="register-bind-box-info-image" :src="userInfo.headimgurl" />
          <text class="register-bind-box-info-bold">{{ userInfo.username }}</text>
        </view>
        <view class="register-bind-box-info-ft">
          {{ isBind ? i18n.t('user.registerBindText') : i18n.t('user.changeRegisterBindText') }}
        </view>
      </view>
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
        {{ type ? i18n.t('user.registerBind') : i18n.t('user.registerBindUc') }}
      </view>
      <view class="register-bind-box-ft">
        <view class="register-bind-box-ft-btn" @click="jump2Login">
          {{ i18n.t('user.login') }}
        </view>
      </view>
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
    const url = pages[pages.length - 1].route;
    if (url === 'pages/user/uc-login') {
      this.type = false;
    }
    this.getForum();

    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif

    // 接受验证码captchaResult
    this.$u.event.$on('captchaResult', result => {
      this.ticket = result.ticket;
      this.randstr = result.randstr;
      this.addRegisterParams();
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
  computed: {
    userInfo() {
      const data = uni.getStorageSync('userInfo');
      return data;
    },
    isBind() {
      const data = uni.getStorageSync('isBind');
      return data;
    },
  },
  methods: {
    handleRegister() {
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
        this.addRegisterParams();
      }
    },
    addRegisterParams() {
      const params = {
        data: {
          attributes: {
            username: this.username,
            password: this.password,
          },
        },
      };
      if (!this.isBind) {
        params.data.attributes.rebind = 1;
      }
      // #ifdef MP-WEIXIN
      // 小程序注册必传参数
      const data = this.$store.getters['session/get']('params');
      if (data && data.data && data.data.attributes) {
        params.data.attributes.js_code = data.data.attributes.js_code;
        params.data.attributes.iv = data.data.attributes.iv;
        params.data.attributes.encryptedData = data.data.attributes.encryptedData;
      }
      if (!this.type) {
        const token = uni.getStorageSync('token');
        if (token !== '') {
          params.data.attributes.token = token;
        }
      }
      // #endif
      // #ifdef H5
      // 微信内置浏览器注册必传参数
      const token = uni.getStorageSync('token');
      if (token !== '') {
        params.data.attributes.token = token;
      }
      // #endif
      if (this.forum && this.forum.set_reg && this.forum.set_reg.register_captcha) {
        // 开启腾讯云验证码必传参数
        params.data.attributes.captcha_ticket = this.ticket;
        params.data.attributes.captcha_rand_str = this.randstr;
      }
      // 开启注册审核必传注册原因参数
      if (
        this.forum &&
        this.forum.set_reg &&
        this.forum.set_reg.register_validate &&
        this.reason !== ''
      ) {
        params.data.attributes.register_reason = this.reason;
      }
      const inviteCode = uni.getStorageSync('inviteCode');
      if (inviteCode !== '') {
        params.data.attributes.code = inviteCode;
      }
      this.register(params, this.i18n.t('user.registerBindSuccess'));
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
    register(params, resultDialog) {
      this.$store
        .dispatch('session/h5Register', params)
        .then(res => {
          if (res && res.data && res.data.data && res.data.data.id) {
            // #ifdef MP-WEIXIN
            this.refreshmpParams();
            // #endif
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
              title: resultDialog,
              duration: 2000,
            });
          }
          if (res && res.data && res.data.errors) {
            // #ifdef MP-WEIXIN
            this.refreshmpParams();
            // #endif
            if (res.data.errors[0].status === '422') {
              uni.showToast({
                icon: 'none',
                title: res.data.errors[0].detail[0],
                duration: 2000,
              });
            }
            if (res.data.errors[0].code === 'register_close') {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('core.register_close'),
                duration: 2000,
              });
            }
            if (res.data.errors[0].code === 'register_validate') {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('core.register_validate'),
                duration: 2000,
              });
            }
            if (res.data.errors[0].code === 'setting_fill_register_reason') {
              uni.showToast({
                icon: 'none',
                title: res.data.errors[0].detail[0],
                duration: 2000,
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    padding: 60rpx 40rpx 80rpx;
    font-size: 50rpx;
    font-weight: bold;
    color: --color(--qui-FC-333);
  }

  &-info {
    padding: 0rpx 40rpx 50rpx;
    font-size: 40rpx;

    &-h {
      margin-bottom: 20rpx;
    }

    &-image {
      width: 50rpx;
      height: 50rpx;
      margin-right: 20rpx;
      vertical-align: middle;
      border-radius: 100rpx;
    }

    &-bold {
      font-weight: bold;
    }

    &-ft {
      font-size: 34rpx;
    }
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

    &-btn {
      color: rgba(24, 120, 243, 1);
    }
  }
}
</style>
