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
      <view class="login-box-btn" @click="login">
        {{ i18n.t('user.login') }}
      </view>
      <view class="login-box-ft">
        <view class="login-box-ft-title" v-if="forum && forum.qcloud && forum.qcloud.qcloud_sms">
          {{ i18n.t('user.otherLoginMode') }}
        </view>
        <view class="login-box-ft-con">
          <image
            v-if="forum && forum.qcloud && forum.qcloud.qcloud_sms"
            class="login-box-ft-con-image"
            lazy-load
            src="@/static/shouji.svg"
            @click="jump2PhoneLogin"
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
            @click="jump2findPassword"
          >
            {{ i18n.t('user.forgetPassword') }}
          </text>
        </view>
      </view>
    </view>
    <qui-registration-agreement></qui-registration-agreement>
  </qui-page>
</template>

<script>
import user from '@/mixin/user';
import { SITE_PAY } from '@/common/const';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  mixins: [
    user,
    // #ifdef H5
    appCommonH,
    // #endif
  ],
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      url: '', // 上一个页面的路径
      site_mode: '', // 站点模式
      code: '', // 注册邀请码
      isPaid: false, // 默认未付费
      forum: {}, // 配置
      // #ifdef H5
      isWeixin: false, // 默认不是微信浏览器
      // #endif
    };
  },
  onLoad(params) {
    this.$store.dispatch('forum/setError', {
      code: 'user_login',
      status: 200,
    });
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
    login() {
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
        // #endif
        console.log('params', params);
        this.$store
          .dispatch('session/h5Login', params)
          .then(res => {
            console.log(res);
            this.logind();
            uni.showToast({
              title: this.i18n.t('user.loginSuccess'),
              duration: 2000,
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    jump2PhoneLogin() {
      uni.navigateTo({
        url: `/pages/user/phone-login?url=${this.url}&code=${this.code}`,
      });
    },
    jump2Register() {
      uni.navigateTo({
        url: `/pages/user/register?url=${this.url}&code=${this.code}`,
      });
    },
    jump2findPassword() {
      uni.navigateTo({
        url: `/pages/modify/findpwd?pas=reset_pwd`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.login-box {
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
</style>
