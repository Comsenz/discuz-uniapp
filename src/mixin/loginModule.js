// #ifdef H5
import { setCookie } from '@/utils/setCookie';
// #endif
import { SITE_PAY } from '@/common/const';

module.exports = {
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
      uni.navigateTo({
        url,
      });
    },
    /**
     * 跳转到登录页面
     */
    jump2LoginPage() {
      const url = '/pages/user/login';
      uni.navigateTo({
        url,
      });
    },
    /**
     * 跳转到注册页面
     */
    jump2RegisterPage() {
      const url = '/pages/user/register';
      uni.navigateTo({
        url,
      });
    },
    /**
     * 跳转到登录绑定页面
     */
    jump2LoginBindPage() {
      const url = '/pages/user/login-bind';
      uni.navigateTo({
        url,
      });
    },
    /**
     * 跳转到注册绑定页面
     */
    jump2RegisterBindPage() {
      const url = '/pages/user/register-bind';
      uni.navigateTo({
        url,
      });
    },
    MPLogin() {},
    /**
     * 跳转到找回密码页面
     */
    jump2findpwdPage() {
      const url = `/pages/modify/findpwd?pas=reset_pwd`;
      uni.navigateTo({
        url,
      });
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
     * 获取小程序无感注册需要的参数
     * @param {Object} param 小程序必传的几个参数
     */
    getmpRegisterParams() {
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
        params.data.attributes.register = 1;
      }
      if (data && data.data && data.data.attributes && data.data.attributes.code !== '') {
        params.data.attributes.code = data.data.attributes.code;
      }
      this.mpLogin(params);
    },
    /**
     * 小程序无感注册
     */
    mpLogin(params) {
      this.$store
        .dispatch('session/noSenseMPLogin', params)
        .then(res => {
          if (res && res.data && res.data.data && res.data.data.id) {
            console.log('小程序无感注册成功：', res);
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
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 微信h5无感注册
     */
    wxh5Login() {
      if (
        this.isWeixin &&
        this.forum &&
        this.forum.passport &&
        this.forum.passport.offiaccount_close
      ) {
        uni.setStorage({
          key: 'register',
          data: 1,
        });
        this.$store.dispatch('session/wxh5Login');
      }
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
            // #ifdef H5
            setCookie('token', res.data.data.attributes.access_token, 30);
            // #endif
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
    /**
     * 获取注册需要的参数
     * @param {Object} param 包含用户名和密码的对象
     * @param {*} resultDialog 登录成功展示的对话框信息
     */
    getRegisterParams(param, resultDialog) {
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
      } else if (this.forum && this.forum.set_reg && this.forum.set_reg.register_captcha) {
        this.toTCaptcha(param, resultDialog);
      } else {
        this.addRegisterParams(params, resultDialog);
      }
    },
    /**
     * 增加注册需要的参数
     * @param {Object} param 包含用户名和密码的对象
     * @param {*} resultDialog 登录成功展示的对话框信息
     */
    addRegisterParams(param, resultDialog) {
      const params = param;
      // #ifdef MP-WEIXIN
      // 小程序注册必传参数
      const data = this.$store.getters['session/get']('params');
      if (data && data.data && data.data.attributes) {
        params.data.attributes.js_code = data.data.attributes.js_code;
        params.data.attributes.iv = data.data.attributes.iv;
        params.data.attributes.encryptedData = data.data.attributes.encryptedData;
      }
      if (data && data.data && data.data.attributes && data.data.attributes.code !== '') {
        params.data.attributes.code = data.data.attributes.code;
      }
      // #endif
      // #ifdef H5
      // 微信内置浏览器注册必传参数
      const token = this.$store.getters['session/get']('token');
      if (token && token !== '') {
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
      console.log('params', params);
      this.register(params, resultDialog);
    },
    /**
     * 发送注册请求
     */
    register(params, resultDialog) {
      this.$store
        .dispatch('session/h5Register', params)
        .then(res => {
          if (res && res.data && res.data.data && res.data.data.id) {
            // #ifdef H5
            setCookie('token', res.data.data.attributes.access_token, 30);
            // #endif
            console.log('注册成功：', res);
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
  },
};
