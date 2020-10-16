<template>
  <qui-page :data-qui-theme="theme" :header="false"></qui-page>
</template>
<script>
import user from '@/mixin/user';
import forums from '@/mixin/forums';
import appCommonH from '@/utils/commonHelper';
import loginModule from '@/mixin/loginModule';
import { SITE_PAY } from '@/common/const';

export default {
  mixins: [user, forums, appCommonH, loginModule],
  data() {
    return {
      state: true,
    };
  },
  onLoad(params) {
    // #ifdef H5
    this.wxLogin(params);
    // #endif
  },
  methods: {
    wxLogin(data) {
      this.$store
        .dispatch('session/noSenseh5Login', data)
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
              this.forums &&
              this.forums.set_site &&
              this.forums.set_site.site_mode === SITE_PAY &&
              this.user &&
              !this.user.paid
            ) {
              uni.redirectTo({
                url: '/pages/site/info',
              });
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
          }
          if (res && res.data && res.data.errors) {
            if (res.data.errors[0].code === 'no_bind_user') {
              const userInfo = {
                token: res.data.errors[0].token,
                headimgurl: res.data.errors[0].user.headimgurl,
                username: res.data.errors[0].user.nickname,
              };
              console.log('userInfo：', userInfo);
              this.$store.dispatch('session/setUserInfo', userInfo);
              this.jump2RegisterBindPage();
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
            if (res.data.errors[0].code === 'account_has_been_bound') {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('core.account_has_been_bound'),
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
</script>
