import forums from '@/mixin/forums';
import user from '@/mixin/user';
import appCommonH from '@/utils/commonHelper';

module.exports = {
  mixins: [forums, user, appCommonH],
  methods: {
    handleLogin() {
      const { isWeixin } = appCommonH.isWeixin();
      if (
        isWeixin &&
        this.forums &&
        this.forums.passport &&
        this.forums.passport.offiaccount_close
      ) {
        this.$store.dispatch('session/wxh5Login');
      } else {
        this.login();
      }
      return false;
    },
    login() {
      const { isWeixin } = appCommonH.isWeixin();
      if (isWeixin) {
        // 微信内
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
          // 用户名模式 跳转到登录并绑定页
          uni.navigateTo({
            url: '/pages/user/login-bind',
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 手机号模式 跳转到手机号码登录页
          uni.navigateTo({
            url: '/pages/user/phone-login',
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          // 无感模式
          this.$store.dispatch('session/wxh5Login');
        }
      } else {
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
          // 用户名模式
          uni.navigateTo({
            url: '/pages/user/login',
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 手机号模式
          uni.navigateTo({
            url: '/pages/user/phone-login',
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
            // 手机号模式
            uni.navigateTo({
              url: '/pages/user/phone-login',
            });
          } else {
            // 用户名模式
            uni.navigateTo({
              url: '/pages/user/login',
            });
          }
        }
      }
    },
  },
};
