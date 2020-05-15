import { status } from '@/library/jsonapi-vuex/index';
import { THEME_DEFAULT, SITE_PAY } from '@/common/const';

module.exports = {
  data() {
    return {};
  },
  onLoad(params) {
    // getRect挂载到$u上，因为这方法需要使用in(this)，所以无法把它独立成一个单独的文件导出
    this.$u.getRect = this.$uGetRect;

    const pages = getCurrentPages();
    const currentPage = pages[pages.length-1];
    if(!this.userIsPay() && currentPage.route !== 'pages/site/info') {
      uni.redirectTo({
        url: '/pages/site/info'
      });
    }

  },
  onReady() {
    const theme = this.$store.getters['theme/get']('currentTheme');
    uni.setNavigationBarColor({
      frontColor: theme === THEME_DEFAULT ? '#000000' : '#ffffff',
      backgroundColor: theme === THEME_DEFAULT ? '#ffffff' : '#2e2f30',
    });
  },
  computed: {
    jvStatus() {
      return status.status;
    },
    forums() {
      return this.$store.getters['jv/get']('forums/1');
    },
    user() {
      return this.$store.getters['jv/get'](`users/${this.userId}`);
    },
    userId() {
      return this.$store.getters['session/get']('userId');
    },
  },
  methods: {
    // 查询节点信息
    $uGetRect(selector, all) {
      return new Promise(resolve => {
        uni
          .createSelectorQuery()
          .in(this)
          [all ? 'selectAll' : 'select'](selector)
          .boundingClientRect(rect => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect);
            }
            if (!all && rect) {
              resolve(rect);
            }
          })
          .exec();
      });
    },
    userIsPay() {
      return this.paid && this.forums.set_site.site_mode === SITE_PAY;
    }
  },
  onReachBottom() {
    uni.$emit('uOnReachBottom');
  },
};
