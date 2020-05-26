<script>
import { SITE_PAY } from '@/common/const';

export default {
  async onLaunch() {
    try {
      const forums = await this.$store.dispatch('jv/get', [
        'forum',
        {
          params: {
            include: 'users',
          },
        },
      ]);
      const userId = this.$store.getters['session/get']('userId');
      let user = {};
      if (userId) {
        const params = {
          include: 'groups,wechat',
        };
        user = await this.$store.dispatch('jv/get', [`users/${userId}`, { params }]);
      }

      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];

      if (forums.set_site.site_mode === SITE_PAY) {
        if (!user.paid && currentPage.route !== 'pages/site/info') {
          uni.redirectTo({
            url: '/pages/site/info',
          });
        }
      }
    } catch (errs) {
      if (errs) {
        const status = errs.statusCode;
        if (status.toString === '401' && errs.data && errs.data.errors) {
          this.$store.dispatch('forum/setError', errs.data.errors[0]);
        }
      }
    }
  },
  onShow() {},
  onHide() {},
};
</script>

<style lang="scss">
/* 每个页面公共css */
@import '@/styles/base/reset.scss';
</style>
