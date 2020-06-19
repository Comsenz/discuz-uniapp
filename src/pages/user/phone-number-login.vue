<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back title="" :is-show-more="false"></qui-header-back>
    <!-- #endif -->
    <view class="new">
      <view class="phone-number-login-box-h">{{ i18n.t('user.phoneNumberLogin') }}</view>
      <view class="new-phon">
        <view class="new-phon-test">
          {{ i18n.t('user.phoneNumber') }}
        </view>
        <view class="new-phon-number">
          <input
            class="new-phon-num"
            type="number"
            v-model="username"
            :focus="true"
            :cursor="1"
            maxlength="11"
          />
        </view>
      </view>
      <view class="new-phon">
        <view class="new-phon-test">
          {{ i18n.t('user.pwd') }}
        </view>
        <view class="new-phon-number">
          <input class="new-phon-num" type="password" v-model="password" />
        </view>
      </view>
      <view class="phone-number-login-box-btn" @click="login">
        {{ i18n.t('user.login') }}
      </view>
      <view class="phone-number-login-box-ft">
        <view @click="jump2VerificationCodeLogin">
          {{ i18n.t('user.verificationCodeLogin') }}
        </view>
        <view @click="jump2findPassword">
          {{ i18n.t('user.forgetPassword') }}
        </view>
      </view>
    </view>
  </qui-page>
</template>

<script>
import user from '@/mixin/user';

export default {
  mixins: [user],
  data() {
    return {
      username: '', // 手机号
      password: '', // 密码
      url: '', // 上一个页面的路径
    };
  },
  onLoad(params) {
    console.log('params', params);
    this.url = params.url;
  },
  methods: {
    login() {
      if (this.username === '') {
        this.showDialog('手机号码不能为空');
      } else if (this.password === '') {
        this.showDialog('密码不能为空');
      } else {
        const params = {
          data: {
            attributes: {
              username: this.username,
              password: this.password,
            },
          },
        };
        this.$store
          .dispatch('session/h5Login', params)
          .then(res => {
            console.log('手机号密码登录绑定成功', res);
            this.logind();
            uni.navigateTo({
              url: this.url,
            });
          })
          .catch(err => {
            console.log(err);
          });
        this.clear();
      }
    },
    jump2VerificationCodeLogin() {
      this.clear();
      console.log('跳转到验证码登录页面');
      uni.navigateTo({
        url: `/pages/user/verification-code-login?url=${this.url}`,
      });
    },
    jump2findPassword() {
      this.clear();
      console.log('跳转到找回密码页面');
      uni.navigateTo({
        url: `/pages/modify/findpwd?pas=reset_pwd`,
      });
    },
    clear() {
      this.username = '';
      this.password = '';
    },
    showDialog(title) {
      uni.showToast({
        icon: 'none',
        title,
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.phone-number-login-box-h {
  margin: 60rpx 0rpx 80rpx 40rpx;
  font-size: 50rpx;
  font-weight: bold;
  color: #333;
}
.new {
  width: 100vw;
  height: 100vh;
  /* #ifdef H5 */
  padding: 44px 0rpx 0rpx;
  /* #endif */
  background-color: --color(--qui-BG-2);
  box-sizing: border-box;
}
.new-phon {
  width: 710rpx;
  margin-left: 40rpx;
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 100rpx;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  box-sizing: border-box;
}
.new-phon-test {
  font-size: $fg-f28;
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
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 100rpx;
  color: --color(--qui-FC-333);
}
.newphon-erro {
  margin: 20rpx 0 0 40rpx;
  font-size: $fg-f24;
  font-weight: 400;
  color: --color(--qui-RED);
}
.new-vftion-input {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.new-button {
  margin: 52rpx 40rpx 0;
}

.phone-number-login-box-btn {
  width: 670rpx;
  height: 90rpx;
  margin: 50rpx auto 0rpx;
  line-height: 90rpx;
  color: #fff;
  text-align: center;
  background-color: #1878f3;
  border-radius: 5rpx;
}

.phone-number-login-box-ft {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20rpx 40rpx 0rpx;
  font-size: $fg-f28;
  color: --color(--qui-LINK);
}
</style>
