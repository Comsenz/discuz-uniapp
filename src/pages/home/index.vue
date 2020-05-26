<template>
  <view class="content">
    <view class="view-content">
      <qui-home ref="home" :style="{ display: show_index === 0 ? 'block' : 'none' }"></qui-home>
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
</template>

<script>
/* eslint-disable */
import quiMy from '@/pages/my/index';
import quiNotice from '@/pages/notice/index';

export default {
  components: {
    'qui-my': quiMy,
    'qui-notice': quiNotice,
  },
  data() {
    return {
      show_index: 0, // 控制显示那个组件
      isFirst: true, // 是否是第一次进入页面

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
  onShow() {
    if (this.isFirst) {
      this.isFirst = false;
    } else {
      this.$refs.quinotice.ontrueGetList();
    }
  },
  methods: {
    // 切换组件
    cut_index(e, type) {
      const _this = this;
      _this.show_index = type;
      if (_this.show_index === 0) {
        _this.$refs.home.ontrueGetList();
      } else if (_this.show_index === 1) {
        _this.$refs.quinotice.ontrueGetList();
      } else if (_this.show_index === 2) {
        _this.$refs.quimy.ontrueGetList();
      } else if (_this.show_index === 3) {
        _this.$refs.information.ontrueGetList();
      }
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
