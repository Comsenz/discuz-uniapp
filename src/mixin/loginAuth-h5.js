import forums from '@/mixin/forums';
import user from '@/mixin/user';
import appCommonH from '@/utils/commonHelper';

module.exports = {
  mixins: [forums, user, appCommonH],
  methods: {
    handleLogin() {
      const { isWeixin } = appCommonH.isWeixin();
      if (isWeixin) {
        this.$store.dispatch('session/wxh5Login');
      } else {
        this.login();
      }
      return false;
    },
    login(nickname, wxtoken) {
      const { isWeixin } = appCommonH.isWeixin();
      const url = '/pages/home/index';
      if (isWeixin) {
        // 微信内
        if (this.forums && this.forums.passport && this.forums.passport.offiaccount_close) {
          // 开启微信公众号
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
            // 用户名模式 跳转到注册并绑定页
            uni.navigateTo({
              url: `/pages/user/register-bind?url=${url}&validate=${this.forums.set_reg.register_validate}&token=${wxtoken}`,
            });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
            // 手机号模式 跳转到手机号+验证码登陆页
            uni.navigateTo({
              url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}&token=${wxtoken}`,
            });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
            // 无感模式
            this.noSenseh5Register(wxtoken, nickname);
          }
        } else {
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
            // 用户名模式
            console.log('用户名模式跳转到登录页');
            uni.navigateTo({
              url: `/pages/user/login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
            });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
            // 手机号模式
            console.log('手机号模式跳转到手机号+验证码登陆页');
            uni.navigateTo({
              url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
            });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
            if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
              // 手机号模式
              console.log('手机号模式跳转到手机号+验证码登陆页');
              uni.navigateTo({
                url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
              });
            } else {
              // 用户名模式
              console.log('用户名模式跳转到登录页');
              uni.navigateTo({
                url: `/pages/user/login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
              });
            }
          }
        }
      } else {
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
          // 用户名模式
          console.log('用户名模式跳转到登录页');
          uni.navigateTo({
            url: `/pages/user/login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 手机号模式
          console.log('手机号模式跳转到手机号+验证码登陆页');
          uni.navigateTo({
            url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
            // 手机号模式
            console.log('手机号模式跳转到手机号+验证码登陆页');
            uni.navigateTo({
              url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
            });
          } else {
            // 用户名模式
            console.log('用户名模式跳转到登录页');
            uni.navigateTo({
              url: `/pages/user/login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
            });
          }
        }
      }
    },
  },
};
