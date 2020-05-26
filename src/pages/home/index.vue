<template>
  <qui-page>
    <view class="content">
      <view class="view-content">
        <qui-home
          ref="home"
          :style="{ display: show_index === 0 ? 'block' : 'none' }"
          @handleClickShare="handleClickShare"
        ></qui-home>
        <qui-notice
          ref="quinotice"
          :style="{ display: show_index === 1 ? 'block' : 'none' }"
        ></qui-notice>
        <qui-my ref="quimy" :style="{ display: show_index === 2 ? 'block' : 'none' }"></qui-my>
      </view>

      <view class="tabBar">
        <qui-footer @click="cut_index"></qui-footer>
      </view>
    </view>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
      show_index: 0, // 控制显示那个组件
      nowThreadId: 0, // 点击主题ID
    };
  },
  onLoad() {
    this.$nextTick(() => {
      // 一定要等视图更新完再调用方法
      this.$refs.home.ontrueGetList();
    });
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
  methods: {
    // 切换组件
    cut_index(e, type, isTabBar) {
      const tabs = ['home', 'quinotice', 'quimy', 'information'];
      const currentTab = tabs[type];
      this.show_index = type;
      if (isTabBar.indexOf(type) === -1) {
        this.$refs[currentTab].ontrueGetList();
        isTabBar.push(type);
      }
    },
    // 点击分享事件
    handleClickShare(e) {
      this.nowThreadId = e;
    },
  },
};
</script>

<style lang="scss" scoped>
.view-content {
  width: 100vw;
  height: calc(100vh - 98rpx);
}
</style>
