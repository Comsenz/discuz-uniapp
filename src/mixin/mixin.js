import { THEME_DEFAULT } from '@/common/const';

// #ifdef H5
const whitelistPage = [
  'pages/home/index',
  'pages/topic/index',
  'pages/topic/comment',
  'pages/profile/index',
];
// #endif

module.exports = {
  data() {
    return {
      theme: this.$u.currentTheme,
      loaded: false,
    };
  },
  onLoad() {
    const app = getApp();
    this.themeChanged(this.$u.currentTheme);
    app.globalData.watchThemeChange(this.themeChanged);

    // getRect挂载到$u上，因为这方法需要使用in(this)，所以无法把它独立成一个单独的文件导出
    this.$u.getRect = this.$uGetRect;

    // #ifdef H5
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const isLogin = this.$store.getters['session/get']('isLogin');
    console.log(whitelistPage.indexOf(currentPage.route), !isLogin);
    if (whitelistPage.indexOf(currentPage.route) === -1 && !isLogin) {
      let homePageIndex;
      try {
        pages.forEach((page, index) => {
          if (page.route === 'pages/home/index') {
            throw new Error(pages.length - index);
          }
        });
      } catch (e) {
        homePageIndex = e;
      }

      if (homePageIndex) {
        uni.navigateBack({
          delta: homePageIndex,
        });
      } else {
        uni.navigateTo({
          url: '/pages/home/index',
        });
      }
      // eslint-disable-next-line no-useless-return
      return;
    }
    // #endif
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

    // 更改主题
    themeChanged(theme) {
      if (this.theme !== theme) {
        this.theme = theme;
      }
      uni.setNavigationBarColor({
        frontColor: theme === THEME_DEFAULT ? '#000000' : '#ffffff',
        backgroundColor: theme === THEME_DEFAULT ? '#ffffff' : '#2e2f30',
      });
    },
  },
  onUnload() {
    getApp().globalData.unWatchThemeChange(this.themeChanged);
  },
};
