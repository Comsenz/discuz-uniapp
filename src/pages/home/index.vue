<template>
  <qui-page :data-qui-theme="theme" @pageLoaded="handlePageLoaded">
    <view class="content">
      <view class="view-content">
        <qui-page-home
          v-if="showHome"
          ref="home"
          :nav-theme="theme"
          :tag-id="tagId"
          :style="{ display: show_index === 0 ? 'block' : 'none' }"
          @handleClickShare="handleClickShare"
        ></qui-page-home>
        <qui-page-notice
          :nav-theme="theme"
          ref="quinotice"
          :style="{ display: show_index === 1 ? 'block' : 'none' }"
        ></qui-page-notice>
        <qui-page-my
          ref="quimy"
          :style="{ display: show_index === 2 ? 'block' : 'none' }"
        ></qui-page-my>
      </view>

      <view class="tabBar">
        <qui-footer @click="cut_index"></qui-footer>
      </view>
    </view>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';

export default {
  mixins: [forums, user],
  data() {
    return {
      show_index: 0, // 控制显示那个组件
      nowThreadId: 0, // 点击主题ID
      showHome: false,
      tagId: 0, // 标签ID
      currentTab: 'home',
    };
  },
  onLoad() {
<<<<<<< HEAD
    if (!this.showHome) {
=======
    if (this.showHome) {
>>>>>>> 12ee994ee318aed638d9792e1706139777a91ab1
      this.handlePageLoaded();
    }
  },

  // 唤起小程序原声分享
  onShareAppMessage(res) {
    // 来自页面内分享按钮
    if (res.from === 'button' && res.target.id !== 'top') {
      const threadShare = this.$store.getters['jv/get'](`/threads/${this.nowThreadId}`);
      return {
        title: threadShare.type === 1 ? threadShare.title : threadShare.firstPost.summary,
      };
    }
    return {
      title: this.forums.set_site.site_name,
    };
  },
  onShow() {
    if (this.currentTab === 'quinotice') {
      this.$nextTick(() => {
        this.$refs[this.currentTab].getUnreadNoticeNum();
      });
    }
  },
  methods: {
    // 切换组件
    cut_index(e, type, isTabBar) {
      const tabs = ['home', 'quinotice', 'quimy'];
      this.currentTab = tabs[type];

      if (this.currentTab === 'quinotice') {
        this.getUserInfo();
      }
      if (
        !this.$store.getters['session/get']('isLogin') &&
        ['quinotice', 'quimy'].indexOf(this.currentTab) >= 0
      ) {
        this.$store.getters['session/get']('auth').open();
        return;
      }

      this.show_index = type;
      if (isTabBar.indexOf(type) === -1) {
        this.$refs[this.currentTab].ontrueGetList();
        isTabBar.push(type);
      }
    },
    // 点击分享事件
    handleClickShare(e) {
      this.nowThreadId = e;
    },
    handlePageLoaded() {
      this.showHome = true;
      this.$nextTick(() => {
        // 一定要等视图更新完再调用方法
        this.$refs.home.ontrueGetList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.view-content {
  width: 100vw;
  height: calc(100vh - 98rpx);
}
// my页面和notice页面样式渗透不进去的问题
/deep/ .my .cell-item,
/deep/ .notice-box .cell-item {
  padding-right: 40rpx;
}
/deep/ .no-border .cell-item {
  border: 0;
}
/deep/ .my-info__box__detail .cell-item__body {
  height: 80rpx;
  align-items: flex-start;
}
/deep/ .my-tabs .qui-tabs__item--active {
  border: 0;
}
/deep/ .my .qui-tabs__item__title {
  font-weight: normal;
  color: --color(--qui-FC-AAA);
}
/deep/ .my .qui-tabs__item__brief {
  font-weight: bold;
}
/deep/ .my-info__box__detail .cell-item__body__content-title {
  font-weight: bold;
}
</style>
