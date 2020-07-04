<template>
  <qui-page :data-qui-theme="theme"></qui-page>
</template>
<script>
import user from '@/mixin/user';

export default {
  mixins: [user],
  onLoad(params) {
    // #ifdef H5
    const login = data => {
      this.$store
        .dispatch('session/noSenseh5Login', data)
        .then(res => {
          console.log('登录成功', res);
          this.logind();
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
};
</script>
