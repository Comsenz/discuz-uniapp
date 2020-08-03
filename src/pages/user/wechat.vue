<template>
  <qui-page :data-qui-theme="theme" :header="false"></qui-page>
</template>
<script>
import user from '@/mixin/user';
import forums from '@/mixin/forums';
import appCommonH from '@/utils/commonHelper';
import loginAuth from '@/mixin/loginAuth-h5';
import { SITE_PAY } from '@/common/const';

export default {
  mixins: [user, forums, appCommonH, loginAuth],
  data() {
    return {
      state: true,
    };
  },
  onLoad(params) {
    // #ifdef H5
    const login = data => {
      this.$store
        .dispatch('session/noSenseh5Login', data)
        .then(res => {
          const err = res.data;
          if (err.errors) {
            if (err.errors[0].code === 'no_bind_user') {
              const { nickname } = err.errors[0].user;
              const wxtoken = err.errors[0].token;
              let code = '';
              uni.getStorage({
                key: 'inviteCode',
                success(resData) {
                  code = resData.data || '';
                },
              });
              this.login(nickname, wxtoken, code);
            }
            if (err.errors[0].code === 'register_validate') {
              uni.showToast({
                icon: 'none',
                title: this.i18n.t('core.register_validate'),
                duration: 2000,
              });
            }
          } else if (res && res.data && res.data.data && res.data.data.id) {
            console.log('登录成功', res);
            this.logind();
            if (this.user && this.user.paid) {
              this.isPaid = this.user.paid;
            }
            if (this.site_mode !== SITE_PAY || this.isPaid) {
              const pages = getCurrentPages();
              const url = pages[pages.length - 1].route;
              uni.navigateTo({
                url,
              });
            }
            if (this.site_mode === SITE_PAY && !this.isPaid) {
              uni.navigateTo({
                url: '/pages/site/info',
              });
            }
            uni.showToast({
              title: this.i18n.t('user.loginSuccess'),
              duration: 2000,
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    };
    if (!this.$store.getters['session/get']('isLogin')) {
      login(params);
    }
    // #endif
  },
};
</script>
