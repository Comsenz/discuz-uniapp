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
      if (forums.set_site.site_mode === SITE_PAY) {
        let currentPage = {};
        if (pages.length > 0) {
          currentPage = pages[pages.length - 1];
          if (!user.paid && currentPage.route !== 'pages/site/info') {
            uni.redirectTo({
              url: '/pages/site/info',
            });
          }
        } else if (!user.paid) {
          uni.redirectTo({
            url: '/pages/site/info',
          });
        }
      }

      this.$store.dispatch('forum/setError', { loading: false });

      if (getApp().globalData.init) {
        getApp().globalData.init();
      }
    } catch (errs) {
      if (errs && errs.data && errs.data.errors) {
        this.$store.dispatch('forum/setError', {
          loading: false,
          ...errs.data.errors[0],
        });
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
