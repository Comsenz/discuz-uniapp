// import { SITE_PAY } from '@/common/const';

module.exports = {
  computed: {
    forums() {
      const siteInfo = this.$store.getters['jv/get']('forums/1');
      //   const pages = getCurrentPages();
      //   const currentPage = pages[pages.length - 1];

      //   if (siteInfo && siteInfo.set_site && siteInfo.set_site.site_mode === SITE_PAY) {
      //     if (!this.user.paid && currentPage.route !== 'pages/site/info') {
      //       uni.redirectTo({
      //         url: '/pages/site/info',
      //       });
      //     }
      //   }
      return siteInfo;
    },
  },
};
