<template>
  <qui-page :data-qui-theme="theme"></qui-page>
</template>
<script>
import user from '@/mixin/user';
import forums from '@/mixin/forums';
import appCommonH from '@/utils/commonHelper';
import { getRandomChars } from '@/utils/getRandomChars';

export default {
  mixins: [user, forums, appCommonH],
  onLoad(params) {
    // #ifdef H5
    const login = data => {
      this.$store
        .dispatch('session/noSenseh5Login', data)
        .then(res => {
          if (res.statusCode === 200) {
            console.log('登录成功', res);
            this.logind();
            return;
          }
          if (!res || !res.data) {
            return;
          }
          const err = res.data;
          if (err.errors) {
            const wxtoken = err.errors[0].token;
            if (err.errors[0].code === 'no_bind_user') {
              const { isWeixin } = appCommonH.isWeixin();
              const url = '/pages/home/index';
              if (isWeixin) {
                // 微信内
                if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
                  // 用户名模式 跳转到注册并绑定页
                  uni.navigateTo({
                    url: `/pages/user/register-bind?url=${url}&validate=${this.forums.set_reg.register_validate}`,
                  });
                  return;
                }
                if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
                  // 手机号模式 跳转到手机号+验证码登陆页
                  uni.navigateTo({
                    url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
                  });
                  return;
                }
                if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
                  // 无感模式
                  this.noSenseh5Register(wxtoken);
                }
              } else {
                if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
                  if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
                    // 手机号模式
                    console.log('手机号模式跳转到手机号+验证码登陆页');
                    uni.navigateTo({
                      url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
                    });
                    return;
                  }
                  if (this.forums && this.forums.qcloud && !this.forums.qcloud.qcloud_sms) {
                    // 用户名模式
                    console.log('用户名模式跳转到登录页');
                    uni.navigateTo({
                      url: `/pages/user/login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
                    });
                    return;
                  }
                }
                if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
                  // 用户名模式
                  console.log('用户名模式跳转到登录页');
                  uni.navigateTo({
                    url: `/pages/user/login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
                  });
                  return;
                }
                if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
                  // 手机号模式
                  console.log('手机号模式跳转到手机号+验证码登陆页');
                  uni.navigateTo({
                    url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}`,
                  });
                }
              }
            }
          }
        })
        .catch(err => {
          console.log('shiabai');
          console.log('shibai', err);
        });
    };
    if (!this.$store.getters['session/get']('isLogin')) {
      login(params);
    }
    // #endif
  },
  methods: {
    noSenseh5Register(wxtoken) {
      this.$store
        .dispatch('session/h5Register', {
          data: {
            attributes: {
              username: `网友${getRandomChars(6)}`,
              password: '',
              token: wxtoken,
            },
          },
        })
        .then(success => {
          console.log('注册成功', success);
          this.logind();
          uni.showToast({
            title: '注册成功',
            duration: 2000,
          });
        })
        .catch(registerErr => {
          if (!registerErr || !registerErr.data) {
            return;
          }
          const err = registerErr.data;
          if (err.errors && err.errors[0].code === 'validation_error') {
            this.noSenseh5Register(wxtoken);
          }
          console.log(registerErr);
        });
    },
  },
};
</script>
