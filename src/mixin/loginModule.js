import user from '@/mixin/user';
import { SITE_PAY } from '@/common/const';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
// #endif

module.exports = {
  mixins: [
    user,
    // #ifdef H5
    appCommonH,
    // #endif
  ],
  methods: {
    /**
     * 获取配置信息
     */
    getForum() {
      this.$store.dispatch('jv/get', ['forum', { params: { include: 'users' } }]).then(res => {
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
     * 跳转到手机号码登录/注册页面
     */
    jump2PhoneLoginRegisterPage() {
      const url = '/pages/user/phone-login-register';
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
     * 跳转到登录并绑定微信号页面
     */
    jump2LoginBindPage() {
      const url = '/pages/user/login-bind';
      uni.redirectTo({
        url,
      });
    },
    /**
     * 跳转到注册并绑定微信号页面
     */
    jump2RegisterBindPage() {
      const url = '/pages/user/register-bind';
      uni.redirectTo({
        url,
      });
    },
    /**
     * 跳转到登录并绑定手机号页面
     */
    jump2LoginBindPhonePage() {
      const url = '/pages/user/login-bind-phone';
      uni.redirectTo({
        url,
      });
    },
    /**
     * 跳转到注册并绑定手机号页面
     */
    jump2RegisterBindPhonePage() {
      const url = '/pages/user/register-bind-phone';
      uni.redirectTo({
        url,
      });
    },
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
     * 小程序登录方式
     */
    mpLoginMode() {
      if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
        // 用户名模式
        this.jump2LoginPage();
      }
      if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
        // 手机号模式
        this.jump2PhoneLoginRegisterPage();
      }
      if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
        // 无感模式
        uni.setStorageSync('register', 1);
        uni.setStorageSync('isSend', true);
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
          uni.navigateTo({
            url: '/pages/user/login',
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 微信内-手机号模式
          this.jump2PhoneLoginRegisterPage();
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          uni.setStorageSync('register', 1);
          // 微信内-无感模式
          this.$store.dispatch('session/wxh5Login');
        }
      } else {
        // 微信外
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
          // 微信外-用户名模式
          uni.navigateTo({
            url: '/pages/user/login',
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 微信外-手机号模式
          this.jump2PhoneLoginRegisterPage();
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          // 微信外-无感模式
          if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
            // 微信外-手机号模式
            this.jump2PhoneLoginRegisterPage();
          } else {
            // 微信外-用户名模式
            uni.navigateTo({
              url: '/pages/user/login',
            });
          }
        }
      }
    },
    /**
     * 更新小程序参数
     */
    refreshmpParams() {
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
                    },
                  },
                };
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
     * 小程序登录/注册
     */
    mpLogin(register = 0) {
      uni.setStorageSync('register', register);
      uni.setStorageSync('isSend', true);
      uni.setStorageSync('isBind', false);
      this.$store.getters['session/get']('auth').open();
    },
    /**
     * 微信h5登录/注册
     */
    wxh5Login(register = 0, rebind = 0) {
      uni.setStorageSync('register', register);
      uni.setStorageSync('rebind', rebind);
      this.$store.dispatch('session/wxh5Login');
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
        const token = uni.getStorageSync('token');
        if (token !== '') {
          params.data.attributes.token = token;
        }
        this.login(params, resultDialog);
      }
    },
    /**
     * 获取登录需要的参数
     * @param {Object} param 包含用户名和密码的对象
     * @param {*} resultDialog 登录成功展示的对话框信息
     * @param {num} rebind 换绑为1，不换绑为0
     */
    getLoginBindParams(param, resultDialog, rebind = 0) {
      this.refreshmpParams();
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
        if (rebind === 1) {
          params.data.attributes.rebind = 1;
        }
        const token = uni.getStorageSync('token');
        if (token !== '') {
          params.data.attributes.token = token;
        }
        this.login(params, resultDialog);
      }
    },
    /**
     * 发送登录请求
     */
    login(params, resultDialog) {
      this.$store
        .dispatch('session/h5Login', params)
        .then(res => {
          if (res && res.data && res.data.data && res.data.data.id) {
            // #ifdef MP-WEIXIN
            this.refreshmpParams();
            // #endif
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
            // #ifdef MP-WEIXIN
            this.refreshmpParams();
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
