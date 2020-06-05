<template>
  <qui-page :data-qui-theme="theme">
    <view class="login-bind-box">
      <view class="login-bind-box-h">{{ i18n.t('user.loginBind') }}</view>
      <view class="login-bind-box-con">
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
      </view>
      <view class="login-bind-box-btn" @click="login">
        {{ i18n.t('user.loginBindId') }}
      </view>
    </view>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
    };
  },
  methods: {
    login() {
      if (this.username === '') {
        this.showDialog('用户名不能为空');
      } else if (this.password === '') {
        this.showDialog('密码不能为空');
      } else {
        this.clear();
        console.log('登录绑定成功');
      }
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
.login-bind-box {
  height: 100vh;
  font-size: $fg-f28;
  background-color: --color(--qui-BG-2);

  &-h {
    margin: 60rpx 0rpx 80rpx 40rpx;
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
}
</style>
