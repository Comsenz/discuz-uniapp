<template>
  <qui-page :class="'home ' + scrolled" :footer="true">
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      show-scrollbar="false"
      :scroll-top="scrollTopNum"
      class="scroll-y"
      @scroll="scroll"
      @scrolltolower="pullDown"
      @scrolltoupper="toUpper"
    >
      <uni-nav-bar
        v-if="navShow"
        :title="forums.set_site.site_name"
        fixed="true"
        status-bar
      ></uni-nav-bar>
      <qui-header
        v-if="isTop != 1"
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
      <view
        class="nav"
        id="navId"
        :style="isTop === 1 ? 'width:100%;position:fixed;z-index:9;' : ''"
      >
        <view class="nav__box">
          <qui-icon
            class="nav__box__icon"
            name="icon-screen"
            size="28"
            :color="show ? '#1878F3' : '#777'"
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
          @searchClick="searchClick"
          posi-type="absolute"
          top="102"
          ref="filter"
        ></qui-filter-modal>
        <u-tabs
          class="scroll-tab"
          :list="categories"
          :current="currentIndex"
          @change="toggleTab"
          is-scroll="isScroll"
          active-color="#1878F3"
        >
          <!-- :style="isTop == 1 ? 'position:fixed;z-index:9;top:44' : ''" -->
        </u-tabs>
      </view>
      <view class="sticky" :style="isTop == 1 ? 'margin-top:150rpx' : 'margin-top:30rpx'">
        <view
          class="sticky__isSticky"
          v-for="(item, index) in sticky"
          :key="index"
          @click="stickyClick(item._jv.id)"
        >
          <view class="sticky__isSticky__box">{{ i18n.t('home.sticky') }}</view>
          <view class="sticky__isSticky__count">
            <rich-text
              class="sticky__isSticky__text"
              :nodes="item.type == 1 ? item.title : item.firstPost.summary"
            ></rich-text>
            <!-- {{ item.type == 1 ? item.title : item.firstPost.summary }} -->
          </view>
        </view>
      </view>
      <!-- </view> -->
      <view class="main">
        <qui-content
          v-for="(item, index) in threads"
          :ref="'myVideo' + index"
          :key="index"
          :currentindex="index"
          :user-name="item.user.username"
          :theme-image="item.user.avatarUrl"
          :theme-btn="item.canHide"
          :theme-reply-btn="item.canReply"
          :user-groups="item.user.groups"
          :theme-time="item.createdAt"
          :theme-content="item.type == 1 ? item.title : item.firstPost.summary"
          :thread-type="item.type"
          :media-url="item.threadVideo.media_url"
          :is-great="item.firstPost.isLiked"
          :theme-like="item.firstPost.likeCount"
          :theme-comment="item.postCount - 1"
          :tags="[item.category]"
          :images-list="item.firstPost.images"
          :theme-essence="item.isEssence"
          :video-width="item.threadVideo.width"
          :video-height="item.threadVideo.height"
          :video-id="item.threadVideo._jv.id"
          @click="handleClickShare(item._jv.id)"
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
          @videoPlay="handleVideoPlay"
        ></qui-content>
        <qui-load-more :status="loadingType"></qui-load-more>
      </view>
    </scroll-view>
    <uni-popup ref="popupHead" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share" plain="true"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareHead(index)">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="46"
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
    <uni-popup ref="popupContent" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share" plain="true"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareContent(index)">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="46"
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
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import { mapMutations } from 'vuex';

export default {
  mixins: [forums, user],
  data() {
    return {
      scrolled: 'affix',
      suspended: false, // 是否吸顶状态
      checkoutTheme: false, // 切换主题  搭配是否吸顶使用
      scrollTopNum: 0,
      categoryId: 0, // 主题分类 ID
      currentIndex: 0,
      threadType: '', // 主题类型 0普通 1长文 2视频 3图片（'' 不筛选）
      threadEssence: '', // 筛选精华 '' 不筛选 yes 精华 no 非精华
      threadFollow: 0, // 关注的主题 传当前用户 ID
      show: false,
      ifNeedConfirm: true,
      top: 500,
      filterSelected: { label: this.i18n.t('topic.whole'), value: '' }, // 筛选类型
      loadingType: 'more', // 上拉加载状态
      hasMore: false, // 是否有更多
      pageSize: 20, // 每页10条数据
      pageNum: 1, // 当前页数
      isLiked: false, // 主题点赞状态
      showSearch: true, // 筛选显示搜索
      navShow: false, // 是否显示头部
      nowThreadId: '', // 当前点击主题ID
      filterTop: 450, // 筛选弹窗的位置
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
      tabIndex: 0, // 选中标签栏的序列,默认显示第一个
      isResetList: false, // 是否重置列表
      bottomData: [],
      threadsStatusId: 0,
      categories: [],
      playIndex: null,
    };
  },
  onLoad() {
    // 获取用户信息
    // this.getUserInfo();
    // 首页导航栏分类列表
    this.loadCategories();
    // 首页主题置顶列表
    this.loadThreadsSticky();
    // 首页主题内容列表
    this.loadThreads();
  },
  // 唤起小程序原声分享
  onShareAppMessage(res) {
    // 来自页面内分享按钮
    if (res.from === 'button') {
      const threadShare = this.$store.getters['jv/get'](`/threads/${this.nowThreadId}`);
      return {
        title: threadShare.type === 1 ? threadShare.title : threadShare.firstPost.summary,
      };
    }
    return {
      title: this.forums.set_site.site_name,
    };
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query
      .select('.nav')
      .boundingClientRect(data => {
        this.myScroll = data.top;
      })
      .exec();
  },
  methods: {
    ...mapMutations({
      setCategoryId: 'session/SET_CATEGORYID',
      setCategoryIndex: 'session/SET_CATEGORYINDEX',
    }),
    scroll(event) {
      // console.log(event, 'scroll');
      // if (this.checkoutTheme || this.isTop === 1) {
      //   return;
      // }
      if (event.detail.scrollTop > 100) {
        this.navShow = true;
      } else {
        this.navShow = false;
      }
      if (event.detail.scrollTop > this.myScroll) {
        this.isTop = 1;
      } else {
        this.isTop = 0;
      }

      if (event.target.scrollTop > 0) {
        this.scrolled = 'scrolled';
      } else {
        this.scrolled = 'affix';
      }
    },
    // 滑动到顶部
    toUpper() {
      if (this.isTop === 0) {
        return;
      }
      this.isTop = 0;
    },

    // 切换选项卡
    async toggleTab(dataInfo) {
      // 重置列表
      this.isResetList = true;
      this.pageNum = 1;
      this.checkoutTheme = true;
      this.categoryId = dataInfo.id;
      this.currentIndex = dataInfo.index;
      this.setCategoryId(this.categoryId);
      this.setCategoryIndex(this.currentIndex);
      // 切换筛选框选中分类
      // eslint-disable-next-line
      this.filterList[0].data.map(item => {
        // eslint-disable-next-line
        item.selected = false;
      });
      this.filterList[0].data[dataInfo.index].selected = true;

      this.loadThreadsSticky();
      this.threads = [];
      // this.scrollTopNum = 1;
      // this.$nextTick(() => {
      //   this.scrollTopNum = 0;
      //   this.navShow = false;
      // });
      // this.scrollTopNum = this.myScroll + 1;
      // this.$nextTick(() => {
      //   this.scrollTopNum = this.myScroll;
      // });
      await this.loadThreads();
      this.navShow = false;
      this.checkoutTheme = false;
    },
    // 筛选分类里的搜索
    searchClick() {
      uni.navigateTo({
        url: '/pages/site/search',
      });
    },
    // 点击置顶跳转到详情页
    stickyClick(id) {
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 点击筛选下拉框里的按钮
    changeSelected(item, dataIndex, filterIndex) {
      console.log(item, dataIndex, filterIndex);
    },
    // 内容部分点击评论跳到详情页
    commentClick(id) {
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 内容部分点击跳转到详情页
    contentClick(id) {
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
      if (index === 0) {
        this.$store.dispatch('session/setAuth', this.$refs.auth);
        if (!this.$store.getters['session/get']('isLogin')) {
          this.$refs.auth.open();
          return;
        }
        uni.navigateTo({
          url: '/pages/share/site',
        });
      }
      this.cancel();
    },
    // 取消按钮
    cancel() {
      this.$refs.popupContent.close();
      this.$refs.popupHead.close();
    },
    // 点赞调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
    // 筛选选中确定按钮
    confirm(e) {
      // console.log(this.user, '重置');
      // 重置列表
      this.isResetList = true;
      this.pageNum = 1;
      const filterSelected = { ...e };
      this.categoryId = filterSelected[0].data.value;
      this.currentIndex = filterSelected[0].data.index;
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
          this.threadFollow = this.user.id; // TODO 当前用户 ID
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
      this.show = !this.show;
      this.$refs.filter.setData();
      // this.navShow = true;
    },
    // 首页内容部分分享按钮弹窗
    handleClickShare(id) {
      this.nowThreadId = id;
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
      if (index === 0) {
        uni.navigateTo({
          url: `/pages/share/topic?id=${this.nowThreadId}`,
        });
      }
      this.cancel();
    },
    // 首页导航栏分类列表数据
    loadCategories() {
      this.$store.dispatch('jv/get', ['categories', {}]).then(data => {
        const resData = [...data] || [];
        this.categories = [
          {
            _jv: {
              id: 0,
            },
            name: this.i18n.t('home.all'),
          },
          ...resData,
        ];
        const categoryFilterList = [
          {
            label: this.i18n.t('home.all'),
            value: 0,
            selected: true,
          },
        ];
        resData.forEach(item => {
          categoryFilterList.push({
            label: item.name,
            value: item._jv.id,
            selected: false,
          });
        });

        this.filterList[0].data = categoryFilterList;
      });
    },
    // 首页置顶列表数据
    loadThreadsSticky() {
      const params = {
        'filter[isSticky]': 'yes',
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'filter[categoryId]': this.categoryId,
        include: ['firstPost'],
      };
      this.$store.dispatch('jv/get', ['threads', { params }]).then(data => {
        this.sticky = [...data];
      });
    },
    // 首页内容部分数据请求
    loadThreads() {
      const params = {
        'filter[isSticky]': 'no',
        'filter[isApproved]': 1,
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

      const threadsAction = status.run(() =>
        this.$store.dispatch('jv/get', ['threads', { params }]),
      );

      this.threadsStatusId = threadsAction._statusID;

      return threadsAction.then(res => {
        this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        delete res._jv;
        if (this.isResetList) {
          this.threads = res;
        } else {
          this.threads = [...this.threads, ...res];
        }
        this.isResetList = false;
        console.log(this.navShow, this.isTop, 'isTop navShow');
      });
    },
    // 内容部分点赞按钮点击事件
    handleIsGreat(id, canLike, isLiked) {
      this.$store.dispatch('session/setAuth', this.$refs.auth);
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$refs.auth.open();
      }
      // if (!canLike) {
      //   console.log('没有点赞权限');
      // }
      const params = {
        _jv: {
          type: 'posts',
          id,
        },
        isLiked: isLiked !== true,
      };
      this.$store.dispatch('jv/patch', params).then(data => {
        const likedPost = this.$store.getters['jv/get'](`/posts/${id}`);
        if (data.isLiked) {
          likedPost.likeCount += 1;
        } else {
          likedPost.likeCount -= 1;
        }
      });
    },
    // 上拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.loadThreads();
    },
    // 视频禁止同时播放
    handleVideoPlay(index) {
      if (this.playIndex !== index && this.playIndex !== null) {
        this.$refs[`myVideo${this.playIndex}`][0].pauseVideo();
      }
      this.playIndex = index;
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
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sticky {
  margin: 30rpx auto;
}

.sticky__isSticky {
  display: flex;
  width: 710rpx;
  height: 80rpx;
  margin: 10rpx auto;
  font-size: $fg-f26;
  line-height: 80rpx;
  background: --color(--qui-BG-2);
  border-radius: 6rpx;
  box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.05);
  &__box {
    // display: block;
    width: 62rpx;
    height: 35rpx;
    margin-top: 27rpx;
    margin-left: 20rpx;
    font-size: $fg-f20;
    line-height: 35rpx;
    color: --color(--qui-FC-777);
    text-align: center;
    background: --color(--qui-BOR-ED);
    border-radius: 6rpx;
    transition: $switch-theme-time;
  }
  &__count {
    width: 572rpx;
    height: 100%;
    margin-top: 27rpx;
    margin-left: 21rpx;
    overflow: hidden;
    line-height: 35rpx;
    color: #777;
    text-overflow: ellipsis;
    white-space: nowrap;
    &__text {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
.horizonal-tab .active {
  color: --color(--qui-BG-HIGH-LIGHT);
}
.scroll-tab {
  z-index: 100;
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
  // max-height: calc(100vh - 100rpx);
  height: 100vh;
}

.nav .filter-modal {
  position: absolute;
  z-index: 1000;
  width: 100%;
}
.sticky__isSticky__text {
  display: inline-block;
  width: 100%;
  height: 35rpx;
  line-height: 35rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
