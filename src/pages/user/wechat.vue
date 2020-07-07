<template>
  <qui-page :data-qui-theme="theme"></qui-page>
</template>
<script>
import user from '@/mixin/user';
import forums from '@/mixin/forums';
import appCommonH from '@/utils/commonHelper';
import loginAuth from '@/mixin/loginAuth-h5';
import { getRandomChars } from '@/utils/getRandomChars';

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
            const { nickname } = err.errors[0].user;
            const wxtoken = err.errors[0].token;
            if (err.errors[0].code === 'no_bind_user') {
              this.login(nickname, wxtoken);
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
    noSenseh5Register(wxtoken, nickname) {
      let username = '';
      if (this.state) {
        username = nickname;
      } else {
        username = `${nickname}${getRandomChars(6)}`;
      }
      this.$store
        .dispatch('session/h5Register', {
          data: {
            attributes: {
              username,
              password: '',
              token: wxtoken,
            },
          },
        })
        .then(result => {
          if (result.data.statusCode === 200) {
            this.state = true;
            console.log('注册成功', result);
            this.logind();
            uni.showToast({
              title: '注册成功',
              duration: 2000,
            });
          }
          if (
            result &&
            result.data &&
            result.data.errors &&
            result.data.errors[0].code === 'validation_error'
          ) {
            this.state = false;
            this.noSenseh5Register(wxtoken, nickname);
          }
        })
        .catch(registerErr => {
          console.log(registerErr);
        });
    },
  },
};
</script>
