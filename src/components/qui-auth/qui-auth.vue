<template>
  <view class="auth">
    <view class="auth__header">
      <qui-icon @tap="close" class="auth__header__close" name="icon-close" size="36"></qui-icon>
    </view>
    <view class="auth__content">
      <image
        class="auth__content__image"
        mode="aspectFit"
        :src="(forums && forums.set_site && forums.set_site.site_logo) || '/static/logo.png'"
      ></image>

      <qui-button
        type="primary"
        open-type="getUserInfo"
        @getuserinfo="handleGetUserInfo"
        lang="zh_CN"
        size="medium"
      >
        {{ t.userinfo }}
      </qui-button>
    </view>
  </view>
</template>

<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import { SITE_PAY } from '@/common/const';
import { getCurUrl } from '@/utils/getCurUrl';
import loginModule from '@/mixin/loginModule';

export default {
  mixins: [forums, user, loginModule],
  computed: {
    t() {
      return this.i18n.t('auth');
    },
  },
  methods: {
    handleGetUserInfo(res) {
      if (res.detail.errMsg === 'getUserInfo:ok') {
        let register = 0;
        uni.getStorage({
          key: 'register',
          success(resData) {
            console.log('resData', resData);
            console.log('resData.data', resData.data);
            register = resData.data;
          },
        });
        this.getmpParams(register);
      } else {
        this.$emit('login');
      }
    },
    getmpParams(register = 0) {
      return new Promise((resolve, reject) => {
        uni.login({
          success: loginRes => {
            if (loginRes.errMsg === 'login:ok') {
              const { code } = loginRes;
              uni.getUserInfo({
                success: res => {
                  const params = {
                    data: {
                      attributes: {
                        js_code: code,
                        iv: res.iv,
                        encryptedData: res.encryptedData,
                        register,
                      },
                    },
                  };
                  console.log('params------', params);
                  this.$store.dispatch('session/setParams', params);
                  this.refreshmpParams();
                  this.getParams();
                },
                fail: error => {
                  console.log(error);
                  reject(error);
                },
              });
            }
          },
          fail: error => {
            console.log(error);
            reject(error);
          },
        });
      });
    },
    /**
     * 获取参数
     */
    getParams() {
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
        params.data.attributes.register = data.data.attributes.register;
      }
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
      console.log('获取参数:params', params);
      this.noSenseLogin(params);
    },
    /**
     * 无感登录
     */
    noSenseLogin(params) {
      console.log('无感登录:params', params);
      const routes = getCurrentPages();
      const curRoute = routes[routes.length - 1].route;
      console.log('getCurrentPages()', getCurrentPages());
      if (
        curRoute === 'pages/site/partner-invite' ||
        curRoute === 'pages/user/login' ||
        curRoute === 'pages/user/phone-login'
      ) {
        uni.setStorage({
          key: 'page',
          data: '/pages/home/index',
        });
      } else {
        uni.setStorage({
          key: 'page',
          data: getCurUrl(),
        });
      }
      this.$store
        .dispatch('session/noSenseMPLogin', params)
        .then(res => {
          console.log('noSenseMPLogin的res', res);
          if (res && res.data) {
            this.$emit('login');
            if (res.data.data && res.data.data.id) {
              this.logind();
              if (
                this.forums &&
                this.forums.set_site &&
                this.forums.set_site.site_mode !== SITE_PAY
              ) {
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
                this.forums &&
                this.forums.set_site &&
                this.forums.set_site.site_mode === SITE_PAY &&
                this.user &&
                !this.user.paid
              ) {
                uni.redirectTo({
                  url: '/pages/site/info',
                });
              }
              uni.getStorage({
                key: 'isBind',
                success(resData) {
                  if (resData.data) {
                    uni.showToast({
                      title: '绑定成功',
                      duration: 2000,
                    });
                  } else {
                    uni.showToast({
                      title: '登录成功',
                      duration: 2000,
                    });
                  }
                },
              });
            }
            if (
              res.data.errors &&
              (res.data.errors[0].code === 'no_bind_user' ||
                res.data.errors[0].code === 'register_close')
            ) {
              const userInfo = {
                token: res.data.errors[0].token,
                headimgurl: res.data.errors[0].user.headimgurl,
                username: res.data.errors[0].user.username,
              };
              console.log('userInfo：', userInfo);
              this.$store.dispatch('session/setUserInfo', userInfo);
              const data = this.$store.getters['session/get']('userInfo');
              console.log('取出来data：', data);
              this.jump2RegisterBindPage();
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.auth {
  height: 400rpx;
  background: --color(--qui-BG-2);
  &__header {
    padding: 30rpx 32rpx;
    text-align: right;
    &__close {
      justify-content: flex-end;
      color: --color(--qui-FC-AAA);
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &__image {
      max-height: 65rpx;
      margin: 10rpx 0 57rpx;
    }
  }
}
</style>
