<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back title="" :is-show-more="false"></qui-header-back>
    <!-- #endif -->
    <view class="register-bind-box">
      <view class="register-bind-box-h">{{ i18n.t('user.registerBind') }}</view>
      <view class="register-bind-box-con">
        <input
          class="input"
          :placeholder="i18n.t('user.username')"
          placeholder-style="color: #ddd"
          v-model="username"
        />
        <input
          class="input"
          type="password"
          :placeholder="i18n.t('user.password')"
          placeholder-style="color: #ddd"
          v-model="password"
        />
        <input
          v-if="validate"
          class="input"
          :placeholder="i18n.t('user.reason')"
          placeholder-style="color: #ddd"
          v-model="reason"
        />
      </view>
      <view class="register-bind-box-btn" @click="register">
        {{ i18n.t('user.registerBindId') }}
      </view>
      <view class="register-bind-box-login" @click="jump2LoginBind">
        {{ i18n.t('user.loginBindId') }}
      </view>
    </view>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';

export default {
  mixins: [forums, user],
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      reason: '', // 注册原因
      url: '', // 上一个页面的路径
      validate: false, // 开启注册审核
    };
  },
  onLoad(params) {
    console.log('params', params);
    this.url = params.url;
    this.validate = params.validate;
  },
  methods: {
    register() {
      if (this.username === '') {
        this.showDialog('用户名不能为空');
      } else if (this.password === '') {
        this.showDialog('密码不能为空');
      } else if (this.forums && this.forums.set_reg && this.forums.set_reg.register_captcha) {
        // 调用校验码
        this.registerBind();
      } else {
        this.registerBind();
      }
    },
    registerBind() {
      let params = {};
      if (this.validate) {
        params = {
          data: {
            attributes: {
              username: this.username,
              password: this.password,
              register_reason: this.reason,
            },
          },
        };
      } else {
        params = {
          data: {
            attributes: {
              username: this.username,
              password: this.password,
            },
          },
        };
      }
      this.$store
        .dispatch('session/h5Register', params)
        .then(res => {
          console.log('注册绑定成功', res);
          this.logind();
          uni.navigateTo({
            url: this.url,
          });
        })
        .catch(err => {
          console.log(err);
        });
      this.clear();
    },
    clear() {
      this.username = '';
      this.password = '';
      if (this.validate) {
        this.reason = '';
      }
    },
    showDialog(title) {
      uni.showToast({
        icon: 'none',
        title,
        duration: 2000,
      });
    },
    jump2LoginBind() {
      console.log('登录并绑定页');
      uni.navigateTo({
        url: `/pages/user/login-bind?url=${this.url}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.register-bind-box {
  height: 100vh;
  /* #ifdef H5 */
  margin: 44px 0rpx 0rpx;
  /* #endif */
  font-size: $fg-f28;
  background-color: --color(--qui-BG-2);

  &-h {
    padding: 60rpx 0rpx 80rpx 40rpx;
    font-size: 50rpx;
    font-weight: bold;
    color: #333;
  }

  &-con {
    margin: 0rpx 0rpx 0rpx 40rpx;

    .input {
      width: 100%;
      height: 100rpx;
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
    color: #fff;
    text-align: center;
    background-color: #1878f3;
    border-radius: 5rpx;
  }

  &-login {
    margin: 20rpx 0rpx 0rpx 40rpx;
    font-size: $fg-f28;
    color: --color(--qui-LINK);
  }
}
</style>
