import { THEME_DEFAULT } from '@/common/const';

module.exports = {
  onLoad() {
    // getRect挂载到$u上，因为这方法需要使用in(this)，所以无法把它独立成一个单独的文件导出
    this.$u.getRect = this.$uGetRect;

    // 设置主题
    const theme = this.$store.getters['theme/get']('currentTheme');
    uni.setNavigationBarColor({
      frontColor: theme === THEME_DEFAULT ? '#000000' : '#ffffff',
      backgroundColor: theme === THEME_DEFAULT ? '#ffffff' : '#2e2f30',
    });
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
  },
  onReachBottom() {
    uni.$emit('uOnReachBottom');
  },
};
