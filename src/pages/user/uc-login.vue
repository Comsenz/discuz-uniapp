<template>
  <qui-page :data-qui-theme="theme" class="uc-login">
    <view>
      <view class="uc-login-h">{{ i18n.t('user.ucenterlogin') }}</view>
      <view class="uc-login-con">
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
        <view class="box">
          <view
            class="box-sun"
            v-for="(item, index) in problem"
            :key="index"
            v-show="sun === index || num"
            @click="loader(problem[index].key)"
          >
            {{ problem[index].value }}
          </view>
          <view class="box-min" @click="minBtn">
            <qui-icon name="icon-unfold" size="18" color="#ddd"></qui-icon>
          </view>
        </view>
        <input
          v-if="displays"
          class="input"
          type="text"
          maxlength="50"
          :placeholder="i18n.t('user.answers')"
          placeholder-style="color: #ddd"
          v-model="answer"
        />
      </view>
      <view class="uc-login-btn" @click="handleLogin">
        {{ i18n.t('user.login') }}
      </view>
    </view>
  </qui-page>
</template>

<script>
import user from '@/mixin/user';
import loginModule from '@/mixin/loginModule';
import { setCookie } from '@/utils/setCookie';

export default {
  mixins: [user, loginModule],
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      url: '', // 上一个页面的路径
      site_mode: '', // 站点模式
      isPaid: false, // 默认未付费
      forum: {}, // 配置
      answer: '',
      value: '',
      sun: 0,
      num: '',
      displays: false,
      problem: [
        {
          key: 0,
          value: this.i18n.t('user.safetyProblem'),
        },
        {
          key: 1,
          value: this.i18n.t('user.safetyProblem1'),
        },
        {
          key: 2,
          value: this.i18n.t('user.safetyProblem2'),
        },
        {
          key: 3,
          value: this.i18n.t('user.safetyProblem3'),
        },
        {
          key: 4,
          value: this.i18n.t('user.safetyProblem4'),
        },
        {
          key: 5,
          value: this.i18n.t('user.safetyProblem5'),
        },
        {
          key: 6,
          value: this.i18n.t('user.safetyProblem6'),
        },
        {
          key: 7,
          value: this.i18n.t('user.safetyProblem7'),
        },
      ],
    };
  },
  onLoad() {
    this.$store.dispatch('forum/setError', {
      code: 'user_login',
      status: 200,
    });
  },
  methods: {
    loader(index) {
      if (index === 0) {
        this.displays = false;
      } else {
        this.displays = true;
      }
      this.sun = index;
      this.num = false;
    },
    minBtn() {
      this.num = !this.num;
    },
    handleLogin() {
      if (!this.username) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.usernameEmpty'),
          duration: 2000,
        });
      } else if (!this.password) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.passwordEmpty'),
          duration: 2000,
        });
      } else {
        const params = {
          // _jv: {
          //   type: 'uc/login',
          // },
          data: {
            attributes: {
              username: this.username,
              password: this.password,
              questionid: this.sun,
              answer: this.answer,
            },
          },
        };
        this.$store
          .dispatch('session/ucLogin', params)
          .then(res => {
            if (res && res.data.data.attributes.access_token) {
              setCookie('token', res.access_token, 30);
              this.logind();
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/home/idnex',
                });
              }, 3000);
            }
          })
          .catch(err => {
            if (err.data.errors[0].status === 400 && err.data.errors[0].code === 'no_bind_user') {
              this.$store.dispatch('session/setToken', err.data.errors[0].token);
              uni.navigateTo({
                url: '/pages/user/register-bind',
              });
            }
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.uc-login {
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
  .phong-img {
    margin: 0 40rpx;
  }
  .questionid {
    border: 0;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .box {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100rpx;
    font-size: $fg-f5;
    line-height: 100rpx;
    text-align: left;
    background: brown;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    box-sizing: border-box;
    &-sun {
      width: 100%;
      height: 100rpx;
      font-size: $fg-f5;
      font-weight: 400;
      line-height: 100rpx;
      text-align: left;
      background: #fff;
      border-bottom: 2rpx solid --color(--qui-BOR-ED);
      box-sizing: border-box;
    }
    &-min {
      position: absolute;
      top: 0;
      right: 0;
      width: 100rpx;
      height: 100%;
      line-height: 50px;
      text-align: center;
      background: #fff;
    }
  }
}
</style>
