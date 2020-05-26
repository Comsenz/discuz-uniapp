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
/* eslint-disable */
import quiMy from '@/pages/my/index';
import quiNotice from '@/pages/notice/index';
import forums from '@/mixin/forums';
import user from '@/mixin/user';

export default {
  mixins: [forums, user],
  components: {
    'qui-my': quiMy,
    'qui-notice': quiNotice,
  },
  data() {
    return {
      show_index: 0, // 控制显示那个组件
      nowThreadId: 0, // 点击主题ID
    };
  },
  onLoad() {
    const _this = this;
    // this.is_lhp = this.$is_bang;
    this.$nextTick(function() {
      // 一定要等视图更新完再调用方法   -----------++++++++++++++++重要
      setTimeout(function() {
        // uni.setNavigationBarColor({
        //   frontColor: '#ffffff',
        //   backgroundColor: '#6739b6',
        // });
        _this.$refs.home.ontrueGetList(); // 初次加载第一个页面的请求数据
      }, 100);
    });
    // console.log('是否为刘海屏', this.is_lhp);
  },
  // 唤起小程序原声分享
  onShareAppMessage(res, id) {
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
    cut_index(e, type) {
      const _this = this;
      _this.show_index = type;
      switch (_this.show_index) {
        case 0:
          _this.$refs.home.ontrueGetList();
          break;
        case 1:
          _this.$refs.quinotice.ontrueGetList();
          break;
        case 2:
          _this.$refs.quimy.ontrueGetList();
          break;
        case 3:
          _this.$refs.information.ontrueGetList();
          break;
      }
    },
    // 点击分享事件
    handleClickShare(e) {
      this.nowThreadId = e;
    },
    // onPullDownRefresh() {
    //   uni.showToast({
    //     title: `第${this.show_index + 1}个页面的刷新`,
    //   });
    //   setTimeout(function() {
    //     uni.stopPullDownRefresh();
    //   }, 2000);
    //   console.log(
    //     '下拉刷新四个组件公用的下拉刷新方法,根据在哪个页面下拉执行哪个页面的刷新方方法即可',
    //   );
    //   console.log('如果想要自定义刷新的话，插件市场就有一个   非常好用也非常容易入手');
    // },
  },
};
</script>

<style lang="scss" scoped>
.view-content {
  width: 100vw;
  height: calc(100vh - 98rpx);
}
</style>
