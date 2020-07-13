<template>
  <qui-page :data-qui-theme="theme"></qui-page>
</template>
<script>
import user from '@/mixin/user';
import forums from '@/mixin/forums';
import appCommonH from '@/utils/commonHelper';
import loginAuth from '@/mixin/loginAuth-h5';

export default {
  mixins: [user, forums, appCommonH, loginAuth],
  data() {
    return {
      state: true,
    };
  },
  onLoad(params) {
    // #ifdef H5
    const paramsJson = params;
    uni.$on('inviteCode', data => {
      console.log(data);
      paramsJson.inviteCode = data;
    });
    const login = data => {
      this.$store
        .dispatch('session/noSenseh5Login', data)
        .then(res => {
          if (res && res.data && res.data.data && res.data.data.id) {
            console.log('登录成功', res);
            this.logind();
            uni.showToast({
              title: '登录成功',
              duration: 2000,
            });
          }
          const err = res.data;
          if (err.errors) {
            const { nickname } = err.errors[0].user;
            const wxtoken = err.errors[0].token;
            if (err.errors[0].code === 'no_bind_user') {
              this.login(nickname, wxtoken, paramsJson.inviteCode);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    };
    if (!this.$store.getters['session/get']('isLogin')) {
      login(paramsJson);
    }
    // #endif
  },
  onUnload() {
    // 移除监听事件
    uni.$off('inviteCode');
  },
};
</script>
