<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back title="" :is-show-more="false"></qui-header-back>
    <!-- #endif -->
    <view class="register-box">
      <view class="register-box-h">{{ i18n.t('user.register') }}</view>
      <view class="register-box-con">
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
      <view class="register-box-btn" @click="register">
        {{ i18n.t('user.register') }}
      </view>
      <view class="register-box-exist" @click="jump2Login">
        {{ i18n.t('user.exist') }}
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
      url: '', // 上一个页面的路径
    };
  },
  onLoad(params) {
    console.log('params', params);
    this.url = params.url;
  },
  methods: {
    register() {
      if (this.username === '') {
        this.showDialog('用户名不能为空');
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
        // eslint-disable-next-line no-unused-vars
        this.$store
          .dispatch('session/h5Register', params)
          .then(res => {
            console.log('注册成功', res);
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
    jump2Login() {
      this.clear();
      console.log('跳转到登录页面');
      uni.navigateTo({
        url: `/pages/user/login?url=${this.url}`,
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
.register-box {
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

  &-exist {
    margin: 20rpx 0rpx 0rpx 40rpx;
    color: --color(--qui-LINK);
  }
}
</style>
