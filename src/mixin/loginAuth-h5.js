import forums from '@/mixin/forums';
import user from '@/mixin/user';
import appCommonH from '@/utils/commonHelper';

module.exports = {
  mixins: [forums, user, appCommonH],
  methods: {
    handleLogin() {
      this.$store.dispatch('session/wxh5Login');
      return false;
    },
  },
};
