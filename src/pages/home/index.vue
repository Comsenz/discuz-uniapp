<template>
  <qui-page :class="'home ' + scrolled">
    <uni-nav-bar
      v-if="navShow"
      left-icon="back"
      left-text="返回"
      right-text="菜单"
      title="导航栏组件"
      fixed="true"
      status-bar
    ></uni-nav-bar>
    <qui-header
      :head-img="forums.set_site.site_logo"
      :background-head-full-img="forums.set_site.site_background_image"
      :theme="theme"
      :theme-num="forums.other.count_users"
      :post="post"
      :post-num="forums.other.count_threads"
      :share="share"
      :share-btn="shareBtn"
      :color="color"
      @click="open"
    ></qui-header>
    <uni-popup ref="popupHead" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareHead(index)">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="36"
                  color="#777777"
                ></qui-icon>
              </view>
              <!-- <image :src="item.icon" class="content-image" mode="widthFix" /> -->
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <view class="nav">
      <view class="nav__box">
        <qui-icon
          class="nav__box__icon"
          name="icon-screen"
          size="28"
          color="#1878F3"
          @tap="showFilter"
        ></qui-icon>
      </view>
      <qui-filter-modal
        v-model="show"
        @confirm="confirm"
        @changeSelected="changeSelected"
        @change="changeType"
        :confirm-text="i18n.t('home.confirmText')"
        :if-need-confirm="ifNeedConfirm"
        :filter-list="filterList"
        :show-search="showSearch"
        ref="filter"
        top="100"
      ></qui-filter-modal>
      <u-tabs
        class="scroll-tab"
        :list="categories"
        :current="categoryId"
        @change="toggleTab"
        is-scroll="isScroll"
        active-color="#1878F3"
        :style="isTop == 1 ? 'position:fixed;background:#FFFFFF;z-index:9;top:0' : ''"
      ></u-tabs>
    </view>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      show-scrollbar="false"
      class="scroll-y"
      @scroll="scroll"
    >
      <view class="sticky">
        <view
          class="sticky__isSticky"
          v-for="(item, index) in sticky"
          :key="index"
          @click="stickyClick(item._jv.id)"
        >
          <view class="sticky__isSticky__box">{{ i18n.t('home.sticky') }}</view>
          <view class="sticky__isSticky__count">
            {{ item.type == 1 ? item.title : item.firstPost.contentHtml }}
          </view>
        </view>
      </view>
      <!-- </view> -->
      <view class="main" v-if="jvStatus[threadsStatusId]">
        <qui-content
          v-for="(item, index) in threads"
          :key="index"
          :user-name="item.user.username"
          :theme-image="item.user.avatarUrl"
          :theme-btn="item.canHide"
          :theme-reply-btn="item.canReply"
          :user-groups="item.user.groups"
          :theme-time="item.createdAt"
          :theme-content="item.type == 1 ? item.title : item.firstPost.contentHtml"
          :is-great="item.firstPost.isLiked"
          :theme-like="item.firstPost.likeCount"
          :theme-comment="item.firstPost.replyCount"
          :tags="item.category.name"
          :images-list="item.firstPost.images"
          :theme-essence="item.isEssence"
          @click="handleClickShare(index)"
          @handleIsGreat="
            handleIsGreat(
              item.firstPost._jv.id,
              item.firstPost.canLike,
              item.firstPost.isLiked,
              item.firstPost.likeCount,
            )
          "
          @commentClick="commentClick(item._jv.id)"
          @contentClick="contentClick(item._jv.id)"
          @headClick="headClick(item.user._jv.id)"
        ></qui-content>
        <qui-load-more :status="loadingType"></qui-load-more>
      </view>
    </scroll-view>
    <!-- </view> -->

    <!-- <qui-footer
      @click="footerOpen"
      :tabs="tabs"
      :post-img="postImg"
      :red-circle="redCircle"
    ></qui-footer> -->
    <uni-popup ref="popupContent" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareContent()">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="36"
                  color="#777777"
                ></qui-icon>
              </view>
              <!-- <image :src="item.icon" class="content-image" mode="widthFix" /> -->
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <uni-popup ref="auth" type="bottom">
      <qui-auth @login="login" @close="close"></qui-auth>
    </uni-popup>
  </qui-page>
</template>

<script>
/* eslint-disable */
import { status } from '@/library/jsonapi-vuex/index';
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  data() {
    return {
      scrolled: 'affix',
      categoryId: 0, // 主题分类 ID
      threadType: null, // 主题类型 0普通 1长文 2视频 3图片（null 不筛选）
      threadEssence: '', // 筛选精华 '' 不筛选 yes 精华 no 非精华
      threadFollow: 0, // 关注的主题 传当前用户 ID
      show: false,
      ifNeedConfirm: true,
      top: 500,
      filterSelected: { label: this.i18n.t('topic.whole'), value: '' }, // 筛选类型
      loadingType: 'more', //上拉加载状态
      hasMore: false, // 是否有更多
      pageSize: 10, // 每页10条数据
      pageNum: 1, // 当前页数
      isLiked: false, // 主题点赞状态
      showSearch: true, // 筛选显示搜索
      redCircle: false, // 消息通知红点
      navShow: false, // 是否显示头部
      filterList: [
        {
          title: this.i18n.t('home.filterPlate'),
          data: [],
        },
        {
          title: this.i18n.t('home.filterType'),
          data: [
            { label: this.i18n.t('home.all'), value: '', selected: true },
            { label: this.i18n.t('home.text'), value: '0', selected: false },
            { label: this.i18n.t('home.invitation'), value: '1', selected: false },
            { label: this.i18n.t('home.video'), value: '2', selected: false },
            { label: this.i18n.t('home.picture'), value: '3', selected: false },
          ],
        },
        {
          title: this.i18n.t('home.confirmText'),
          data: [
            { label: this.i18n.t('home.all'), value: '', selected: true },
            { label: this.i18n.t('home.essence'), value: '1', selected: false },
            { label: this.i18n.t('home.followed'), value: '2', selected: false },
          ],
        },
      ],
      isTop: 0,
      threads: [],
      sticky: {}, // 置顶帖子内容
      shareBtn: 'icon-share1',
      tabIndex: 0 /* 选中标签栏的序列,默认显示第一个 */,
      isResetList: false, // 是否重置列表
      bottomData: [],
      tabs: [
        {
          tabsName: this.i18n.t('home.tabsCircle'),
          tabsIcon: 'icon-home',
          id: 1,
          url: '../home/index',
        },
        {
          tabsName: this.i18n.t('home.tabsNews'),
          tabsIcon: 'icon-message',
          id: 2,
          url: '../notice/index',
        },
        {
          tabsName: this.i18n.t('home.tabsMy'),
          tabsIcon: 'icon-mine',
          id: 3,
          url: '../my/index',
        },
      ],
      postImg: '../assets.publish.svg',
      threadsStatusId: 0,
      categories: []
    };
  },
  computed: {
    forums() {
      return this.$store.getters['jv/get']('forums/1');
    },
  },
  onLoad() {
    // 获取用户信息
    this.getUserInfo();
    // 首页导航栏分类列表
    this.loadCategories();
    // 首页主题置顶列表
    this.loadThreadsSticky();
    // 首页主题内容列表
    this.loadThreads();
  },
  // 唤起小程序原声分享
  onShareAppMessage(res) {
    // if (res.from === 'button') {// 来自页面内分享按钮
    //   console.log(res.target)
    // }
    return {
      title: '自定义分享标题',
      path: '/pages/test/test?id=123'
    }
  },
 onShareAppMessage(res) {
    if (res.from === 'button') {// 来自页面内分享按钮
      console.log(res.target)
    }
    return {
      title: '自定义分享标题',
      path: '/pages/test/test?id=123'
    }
  },
  mounted() {
    const query = uni
      .createSelectorQuery()
      .in(this)
      // .select('.scroll-tab');
    query
      .select('.scroll-tab')
      .boundingClientRect(data => {
        console.log(`得到布局位置信息${JSON.stringify(data)}`);
        console.log(`节点离页面顶部的距离为${data.top}`);
        this.myScroll = data.top;
      })
      .exec();
  },
  onPageScroll(e) {
    if (e.scrollTop > 100) {
      this.navShow = true;
    }
    if (e.scrollTop > this.myScroll) {
      this.isTop = 1;
    } else {
      this.isTop = 0;
    }
  },
  methods: {
    scroll(event) {
      if (event.target.scrollTop > 0) {
        this.scrolled = 'scrolled';
      } else {
        this.scrolled = 'affix';
      }
    },
    // 切换选项卡
    toggleTab(index) {
      // console.log(index)
      // 重置列表
      this.isResetList = true;
      this.categoryId = index;
      this.loadThreadsSticky();
      this.loadThreads();
    },
    // 点击置顶跳转到详情页
    stickyClick(id) {
      uni.navigateTo({
        url:`/pages/topic/index?id=${id}`
      })
    },
    // 点击筛选下拉框里的按钮
    changeSelected(item, dataIndex, filterIndex) {
      // console.log(item, dataIndex, filterIndex);
    },
    // 内容部分点击评论跳到详情页
    commentClick(id) {
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 内容部分点击跳转到详情页
    contentClick(id) {
      console.log(id);
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 点击头像调转到个人主页
    headClick(id) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
    // 首页头部分享按钮弹窗
    open() {
      this.$refs.popupHead.open();
      this.bottomData = [
        {
          text: this.i18n.t('home.generatePoster'),
          icon: 'icon-poster',
          name: 'wx',
          id: 1,
        },
        {
          text: this.i18n.t('home.wxShare'),
          icon: 'icon-wx-friends',
          name: 'wx',
          id: 2,
        },
      ];
    },
    // 头部分享海报
    shareHead(index) {
      if(index === 0){
      this.$store.dispatch('session/setAuth', this.$refs.auth);
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$refs.auth.open();
        return
      }
      uni.navigateTo({
        url: '/pages/share/site',
      });  
      }
    },
    // 取消按钮
    cancel() {
      this.$refs.popup.close();
      this.$refs.popupContent.close();
      this.$refs.popupHead.close();
    },
    // 点赞调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
    // 筛选选中确定按钮
    confirm(e) {
      // 重置列表
      this.isResetList = true;
      const filterSelected = { ...e };

      this.categoryId = filterSelected[0].data.value;
      this.threadType = filterSelected[1].data.value;

      switch (filterSelected[2].data.value) {
        // 筛选精华帖
        case '1':
          this.threadEssence = 'yes';
          this.threadFollow = 0;
          break;
        // 筛选关注帖
        case '2':
          this.threadEssence = '';
          this.threadFollow = 1; // TODO 当前用户 ID
          break;
        // 不筛选
        default:
          this.threadEssence = '';
          this.threadFollow = 0;
          break;
      }
      this.loadThreadsSticky();
      this.loadThreads();
    },
    // 筛选框
    changeType(e) {
      this.filterList = e;
    },
    // 首页导航栏筛选按钮
    showFilter() {
      this.show = true;
      this.$refs.filter.setData();
      this.navShow = true;
    },
    // 首页内容部分分享按钮弹窗
    handleClickShare() {
      this.$refs.popupContent.open();
      this.bottomData = [
        {
          text: this.i18n.t('home.generatePoster'),
          icon: 'icon-poster',
          name: 'wx',
        },
        {
          text: this.i18n.t('home.wxShare'),
          icon: 'icon-wx-friends',
          name: 'wx',
        },
      ];
    },
   // 内容部分分享海报,跳到分享海报页面 
    shareContent(index) {
      if(index === 0){
      uni.navigateTo({
        url: '/pages/share/site',
      });
      }
      
    },
    // 首页导航栏分类列表数据
    loadCategories() {
      this.$store.dispatch('jv/get', 'categories').then(data => {
        delete data._jv;
        this.categories = [
          {
            _jv: {
              id: 0,
            },
            name: this.i18n.t('home.all'),
          }
        ].concat(data);
        const categoryFilterList = [{ label: this.i18n.t('home.all'), value: '0', selected: true }];

        data.map(item => {
          item.label = item.name,
          item.value = item._jv.id,
          item.selected = false,
          categoryFilterList.push(item);
        });

        this.filterList[0].data = categoryFilterList;
      });
    },
    // 首页置顶列表数据
    loadThreadsSticky() {
      this.sticky = {};
      const params = {
        'filter[isSticky]': 'yes',
        'filter[isDeleted]': 'no',
        'filter[categoryId]': this.categoryId,
        include: ['firstPost'],
      };
      this.$store.dispatch('jv/get', ['threads', { params }]).then(data => {
        delete data._jv;
        this.sticky = data;
      });
    },
    // 首页内容部分数据请求
    loadThreads() {
      // if (this.isResetList) {
      //   this.threads = {};
      // }
      const params = {
        'filter[isSticky]': 'no',
        'filter[isDeleted]': 'no',
        'filter[categoryId]': this.categoryId,
        'filter[type]': this.threadType,
        'filter[isEssence]': this.threadEssence,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
      };
      if (this.threadType !== null) {
        params['filter[type]'] = this.threadType;
      }
      params['filter[fromUserId]'] = this.threadFollow;

      const threadsAction = status.run(() => this.$store.dispatch('jv/get', ['threads', { params }]));

      this.threadsStatusId = threadsAction._statusID;

      threadsAction.then(res => {
        this.hasMore = !!res._jv.json.links.next;
        this.loadingType = this.hasMore ? 'more' : 'nomore';
        delete res._jv;
        this.threads = res;
      })

    },
    // 内容部分点赞按钮点击事件
    handleIsGreat(id, canLike, isLiked, likeCount) {
      this.$store.dispatch('session/setAuth', this.$refs.auth);
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$refs.auth.open();
      }
      if (!canLike) {
        console.log('没有点赞权限');
      }
      const params = {
        _jv: {
          type: 'posts',
          id: id,
        },
        isLiked: isLiked === true ? false : true,
      };
      this.$store.dispatch('jv/patch', params).then(data => {
        // if (isLiked) {
        //   data.likeCount = data.likeCount - 1;
        // } else {
        //   data.likeCount = data.likeCount + 1;
        // }
      });
    },

    // 调用 未读通知数 的接口
    getUserInfo() {
      console.log(this.tabs[1].idRemind,'111')
      const id = 1;
      const params = {
        include: ['groups'],
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'users' } });
      this.$store.dispatch('jv/get', [`users/${id}`, { params }]).then(res => {
        if(res.unreadNotifications === 0){
         this.redCircle = false;
        }else{
          this.redCircle = true;
        };
        console.log('未读通知', res.unreadNotifications);
      });
    },

    // 下拉加载
    pullDown() {
      console.log('下拉加载呢');
      if (this.hasMore) {
        this.pageNum += 1;
        this.loadThreads();
        console.log(this.pageNum, '页码');
      } else {
        this.loadingType = 'nomore';
      }
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.home {
  min-height: 100vh;
  color: --color(--qui-FC-333);
  background-color: #f9fafc;
}
.nav {
  position: relative;
  z-index: 1;
  background: --color(--qui-BG-2);
  transition: box-shadow 0.2s, -webkit-transform 0.2s;

  &__box {
    position: absolute;
    right: 2rpx;
    z-index: 2;
    display: block;
    float: right;
    width: 80rpx;
    height: 100rpx;
    background: --color(--qui-BG-2);
    &__icon {
      margin-left: 24rpx;
      line-height: 100rpx;
    }
  }
}

.scrolled .nav {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}

.sticky {
  margin-top: 30rpx;
}

.sticky__isSticky {
  display: flex;
  width: 710rpx;
  height: 80rpx;
  margin: 30rpx auto;
  font-size: $fg-f26;
  line-height: 80rpx;
  color: --color(--qui-FC-777);
  background: --color(--qui-BG-2);
  border-radius: 6rpx;
  box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.05);
  &__box {
    // display: block;
    height: 35rpx;
    min-width: 62rpx;
    margin-top: 27rpx;
    margin-left: 20rpx;
    line-height: 35rpx;
    text-align: center;
    background: --color(--qui-BOR-ED);
    border-radius: 6rpx;
  }
  &__count {
    margin-left: 21rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.horizonal-tab .active {
  color: --color(--qui-BG-HIGH-LIGHT);
}
.scroll-tab {
  height: 100rpx;
  text-align: center;
  white-space: nowrap;
  border-bottom: 1rpx solid #eee;
}
.scroll-tab-item {
  z-index: 1;
  display: inline-block;
  margin: 20rpx 30rpx;
  font-size: $fg-f26;
  line-height: 77rpx;
  color: --color(--qui-FC-777);
}
.active .scroll-tab-line {
  color: --color(--qui-BG-HIGH-LIGHT);
  border-bottom: 4rpx solid --color(--qui-BG-HIGH-LIGHT);
  // border-radius: 20rpx;
}
.uni-tab-bar .active {
  font-size: $fg-f28;
  font-weight: bold;
  color: --color(--qui-BG-HIGH-LIGHT);
}
.main {
  margin-bottom: 130rpx;
}
.scroll-y {
  // max-height: calc(100vh - 497rpx);
  // max-height: calc(100vh - 475rpx);
}
.nav .filter-modal {
  position: absolute;
  z-index: 1000;
  width: 100%;
}
</style>
