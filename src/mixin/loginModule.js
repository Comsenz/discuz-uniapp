import { SITE_PAY } from '@/common/const';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
// #endif

module.exports = {
  // #ifdef H5
  mixins: [appCommonH],
  // #endif
  methods: {
    /**
     * 获取配置信息
     */
    getForum() {
      this.$store.dispatch('jv/get', ['forum', { params: { include: 'users' } }]).then(res => {
        console.log('forum配置信息：', res);
        if (res) {
          this.forum = res;
        }
      });
    },
    /**
     * 跳转到手机号码登录页面
     */
    jump2PhoneLoginPage() {
      const url = '/pages/user/phone-login';
      uni.redirectTo({
        url,
      });
    },
    /**
     * 跳转到登录页面
     */
    jump2LoginPage() {
      const url = '/pages/user/login';
      uni.redirectTo({
        url,
      });
    },
    /**
     * 跳转到注册页面
     */
    jump2RegisterPage() {
      const url = '/pages/user/register';
      uni.redirectTo({
        url,
      });
    },
    /**
     * 跳转到登录绑定页面
     */
    jump2LoginBindPage() {
      const url = '/pages/user/login-bind';
      uni.redirectTo({
        url,
      });
    },
    /**
     * 跳转到注册绑定页面
     */
    jump2RegisterBindPage() {
      const url = '/pages/user/register-bind';
      uni.redirectTo({
        url,
      });
    },
    /**
     * 跳转到找回密码页面
     */
    jump2findpwdPage() {
      const url = `/pages/modify/findpwd?pas=reset_pwd`;
      uni.redirectTo({
        url,
      });
    },
    /**
     * 小程序登录方式
     */
    mpLoginMode() {
      if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
        // 用户名模式
        this.jump2LoginPage();
      }
      if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
        // 手机号模式
        this.jump2PhoneLoginPage();
      }
      if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
        // 无感模式
        this.$store.getters['session/get']('auth').open();
      }
    },
    /**
     * h5登录方式
     */
    h5LoginMode() {
      const { isWeixin } = appCommonH.isWeixin();
      if (isWeixin) {
        // 微信内
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
          // 微信内-用户名模式
          this.jump2LoginPage();
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 微信内-手机号模式
          this.jump2PhoneLoginPage();
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          // 微信内-无感模式
          this.$store.dispatch('session/wxh5Login');
        }
      } else {
        // 微信外
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
          // 微信外-用户名模式
          this.jump2LoginPage();
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 微信外-手机号模式
          this.jump2PhoneLoginPage();
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          // 微信外-无感模式
          if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
            // 微信外-手机号模式
            this.jump2PhoneLoginPage();
          } else {
            // 微信外-用户名模式
            this.jump2LoginPage();
          }
        }
      }
    },
    /**
     * 更新小程序必传的参数
     */
    refreshParams() {
      uni.login({
        success: loginRes => {
          if (loginRes.errMsg === 'login:ok') {
            console.log('loginRes', loginRes);
            const { code } = loginRes;
            uni.getUserInfo({
              success: res => {
                const params = {
                  data: {
                    attributes: {
                      js_code: code,
                      iv: res.iv,
                      encryptedData: res.encryptedData,
                    },
                  },
                };
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
                this.$store.dispatch('session/setParams', params);
              },
              fail: error => {
                console.log(error);
              },
            });
          }
        },
        fail: error => {
          console.log(error);
        },
      });
    },
    /**
     * 获取小程序登录登录需要的参数
     * @param {Object} param 小程序必传的几个参数
     */
    getmpLoginParams() {
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
        params.data.attributes.register = 0;
      }
      if (data && data.data && data.data.attributes && data.data.attributes.code !== '') {
        params.data.attributes.code = data.data.attributes.code;
      }
      this.mpLogin(params);
    },
    /**
     * 小程序登录
     */
    mpLogin(params) {
      this.$store
        .dispatch('session/noSenseMPLogin', params)
        .then(res => {
          if (res && res.data && res.data.data && res.data.data.id) {
            console.log('小程序登录成功：', res);
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
              title: this.i18n.t('user.registerSuccess'),
              duration: 2000,
            });
          }
          if (
            res.data.errors &&
            (res.data.errors[0].code === 'no_bind_user' ||
              res.data.errors[0].code === 'register_close')
          ) {
            this.refreshParams();
            this.jump2RegisterBindPage();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 微信h5登录
     */
    wxh5Login() {
      uni.setStorage({
        key: 'register',
        data: 0,
      });
      this.$store
        .dispatch('session/noSenseh5Login')
        .then(res => {
          if (res && res.data && res.data.data && res.data.data.id) {
            console.log('登录成功：', res);
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
          }
          if (res && res.data && res.data.errors) {
            if (res.data.errors[0].code === 'no_bind_user') {
              this.$store.dispatch('session/setToken', res.data.errors[0].token);
              this.login();
            }
            if (res.data.errors[0].code === 'permission_denied') {
              this.login();
            }
            if (res.data.errors[0].code === 'register_validate') {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('core.register_validate'),
                duration: 2000,
              });
            }
            if (res.data.errors[0].code === 'validate_reject') {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('core.validate_reject'),
                duration: 2000,
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 获取登录需要的参数
     * @param {Object} param 包含用户名和密码的对象
     * @param {*} resultDialog 登录成功展示的对话框信息
     */
    getLoginParams(param, resultDialog) {
      const params = param;
      if (param.data.attributes.username === '') {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.usernameEmpty'),
          duration: 2000,
        });
      } else if (param.data.attributes.password === '') {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.passwordEmpty'),
          duration: 2000,
        });
      } else {
        // #ifdef MP-WEIXIN
        // 小程序登录必传参数
        const data = this.$store.getters['session/get']('params');
        if (data && data.data && data.data.attributes) {
          params.data.attributes.js_code = data.data.attributes.js_code;
          params.data.attributes.iv = data.data.attributes.iv;
          params.data.attributes.encryptedData = data.data.attributes.encryptedData;
        }
        // #endif
        // #ifdef H5
        // 微信内置浏览器登录必传参数
        const token = this.$store.getters['session/get']('token');
        if (token && token !== '') {
          params.data.attributes.token = token;
        }
        // #endif
        this.login(params, resultDialog);
      }
    },
    /**
     * 发送登录请求
     */
    login(params, resultDialog) {
      console.log('登录参数：', params);
      this.$store
        .dispatch('session/h5Login', params)
        .then(res => {
          if (res && res.data && res.data.data && res.data.data.id) {
            console.log('登录成功：', res);
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
            console.log('登录失败：', res);
            // #ifdef MP-WEIXIN
            this.refreshParams();
            // #endif
            if (res.data.errors[0].status === '403') {
              uni.showToast({
                icon: 'none',
                title: res.data.errors[0].detail[0],
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
            if (res.data.errors[0].code === 'validate_reject') {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('core.validate_reject'),
                duration: 2000,
              });
            }
          }
        })
        .catch(err => console.log(err));
    },
  },
};
