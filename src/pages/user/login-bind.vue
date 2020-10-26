<template>
  <qui-page :data-qui-theme="theme" class="login-bind-box">
    <view>
      <view class="login-bind-box-h">{{ i18n.t('user.loginBindId') }}</view>
      <view class="login-bind-box-info">
        <view class="login-bind-box-info-h">
          <text>{{ i18n.t('user.dear') }}</text>
          <img class="login-bind-box-info-image" :src="userInfo.headimgurl" />
          <text class="login-bind-box-info-bold">{{ userInfo.username }}</text>
        </view>
        <view class="login-bind-box-info-ft">
          {{ isBind ? i18n.t('user.loginBindText') : i18n.t('user.changeLoginBindText') }}
        </view>
      </view>
      <view class="login-bind-box-con">
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
      <view class="login-bind-box-btn" @click="handleLogin">
        {{ i18n.t('user.loginBind') }}
      </view>
      <view class="login-bind-box-ft">
        <view v-if="isBind">
          <!-- 开启注册功能才显示 -->
          <text
            class="login-bind-box-ft-btn"
            v-if="forum && forum.set_reg && forum.set_reg.register_close"
            @click="jump2Register"
          >
            {{ i18n.t('user.registerUser') }}
          </text>
        </view>
        <view v-else>
          <!-- 开启注册功能才显示 -->
          <text
            class="login-bind-box-ft-btn"
            v-if="forum && forum.set_reg && forum.set_reg.register_close"
            @click="jump2Register"
          >
            {{ i18n.t('user.registerUser') }}
          </text>
          <text
            class="login-bind-box-ft-line"
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
            class="login-bind-box-ft-text"
            v-if="forum && forum.qcloud && forum.qcloud.qcloud_sms"
            @click="jump2findpwd"
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
import loginModule from '@/mixin/loginModule';

export default {
  mixins: [user, loginModule],
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      site_mode: '', // 站点模式
      forum: {}, // 配置
      isPaid: false, // 默认未付费
    };
  },
  onLoad() {
    this.getForum();
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
    handleLogin() {
      const params = {
        data: {
          attributes: {
            username: this.username,
            password: this.password,
          },
        },
      };
      if (this.isBind) {
        this.getLoginBindParams(params, '绑定成功');
      } else {
        this.getLoginBindParams(params, '绑定成功', 1);
      }
    },
    jump2Register() {
      this.jump2RegisterBindPage();
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
.login-bind-box {
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
