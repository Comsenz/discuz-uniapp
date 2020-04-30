<template>
  <view class="home">
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
    <uni-popup ref="popup" type="bottom">
      <qui-drawer :bottom-data="bottomData"></qui-drawer>
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
        <filter-modal
          v-model="show"
          @confirm="confirm"
          @changeSelected="changeSelected"
          @change="changeType"
          :confirm-text="confirmText"
          :if-need-confirm="ifNeedConfirm"
          :filter-list="filterList"
          :top="top"
          ref="filter"
        ></filter-modal>
      </view>
      <view class="uni-tab-bar">
        <scroll-view
          scroll-x="true"
          scroll-with-animation
          id="scroll-tab-id"
          class="scroll-tab"
          :style="isTop == 1 ? 'position:fixed;z-index:9;top:0' : ''"
        >
          <view class="scroll-tab-item" :class="{ active: categoryId === 0 }" @tap="toggleTab(0)">
            所有
          </view>
          <block v-for="(item, index) in categories" :key="index">
            <view
              class="scroll-tab-item"
              :class="{ active: categoryId === item._jv.id }"
              @tap="toggleTab(item._jv.id)"
            >
              {{ item.name }}
              <view class="scroll-tab-line"></view>
            </view>
          </block>
        </scroll-view>
      </view>
    </view>
    <view class="sticky">
      <view class="sticky__isSticky" v-for="(item, index) in sticky" :key="index">
        <view class="sticky__isSticky__box">置顶</view>
        <view class="sticky__isSticky__count">
          {{ item.type == 1 ? item.title : item.firstPost.contentHtml }}
        </view>
      </view>
    </view>

    <view class="main">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDown"
        @scrolltoupper="refresh"
        show-scrollbar="false"
        class="scroll-y"
      >
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
          @click="handleClickShare"
          @handleIsGreat="
            handleIsGreat(
              item.firstPost._jv.id,
              item.firstPost.canLike,
              item.firstPost.isLiked,
              item.firstPost.likeCount,
            )
          "
          @commentClick="commentClick(item._jv.id)"
        ></qui-content>
        <qui-load-more :status="loadingType"></qui-load-more>
      </scroll-view>
    </view>
    <qui-footer @click="footerOpen" :tabs="tabs" :post-img="postImg"></qui-footer>

    <uni-popup ref="popup" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="handleClick">
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
        <text class="popup-share-btn" @click="cancel('share')">取消</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
/* eslint-disable */
import { status } from 'jsonapi-vuex';
import filterModal from '@/components/qui-filter-modal';
import quiLoadMore from '@/components/qui-load-more';

export default {
  components: {
    filterModal,
    quiLoadMore,
  },
  data: () => {
    return {
      categoryId: 0, // 主题分类 ID
      threadType: null, // 主题类型 0普通 1长文 2视频 3图片（null 不筛选）
      threadEssence: '', // 筛选精华 '' 不筛选 yes 精华 no 非精华
      threadFollow: 0, // 关注的主题 传当前用户 ID
      loadStatus: {},
      loadThreadsStatus: {},
      loadContentStatus: {},
      confirmText: '筛选',
      show: false,
      ifNeedConfirm: true,
      top: 500,
      filterSelected: { label: '全部', value: '' }, // 筛选类型
      loadingType: 'more', //上拉加载状态
      totalData: 0, // 总数
      pageSize: 10, // 每页10条数据
      pageNum: 1, // 当前页数
      isLiked: false, // 主题点赞状态
      filterList: [
        {
          title: '板块',
          data: [{ label: '所有', value: '0', selected: true }],
        },
        {
          title: '类型',
          data: [
            { label: '所有', value: '', selected: true },
            { label: '文本', value: '0', selected: false },
            { label: '帖子', value: '1', selected: false },
            { label: '视频', value: '2', selected: false },
            { label: '图片', value: '3', selected: false },
          ],
        },
        {
          title: '筛选',
          data: [
            { label: '所有', value: '', selected: true },
            { label: '精华', value: '1', selected: false },
            { label: '已关注', value: '2', selected: false },
          ],
        },
      ],
      isTop: 0,
      threads: {},
      sticky: '',
      theme: '成员',
      post: '内容',
      share: '分享',
      shareBtn: 'icon-share1',
      color: 'red',
      tabIndex: 0 /* 选中标签栏的序列,默认显示第一个 */,
      bottomData: [
        {
          text: '文字',
          icon: 'icon-word',
          name: 'wx',
          type: 0,
        },
        {
          text: '图片',
          icon: 'icon-img',
          name: 'wx',
          type: 3,
        },
        {
          text: '视频',
          icon: 'icon-video',
          name: 'qq',
          type: 2,
        },
        {
          text: '帖子',
          icon: 'icon-post',
          name: 'sina',
          type: 1,
        },
      ],
      tabs: [
        {
          tabsName: '圈子',
          tabsIcon: 'icon-home',
          id: 1,
        },
        {
          tabsName: '消息',
          tabsIcon: 'icon-message',
          id: 2,
          url: '../message/index',
        },
        {
          tabsName: '我',
          tabsIcon: 'icon-mine',
          id: 3,
          url: '../my/index',
        },
      ],
      postImg: '../assets.publish.svg',
    };
  },
  computed: {
    categories() {
      return this.$store.getters['jv/get']('categories');
    },
    forums() {
      return this.$store.getters['jv/get']('forums/1');
    },
    // 语言包
    t() {
      return this.i18n.t('topic');
    },
  },
  onLoad() {
    // 首页导航栏分类列表
    this.loadCategories();
    // 首页主题置顶列表
    this.loadThreadsSticky();
    // 首页主题内容列表
    this.loadThreads();
  },
  mounted() {
    const query = uni
      .createSelectorQuery()
      .in(this)
      .select('.scroll-tab');
    query
      // .select('.scroll-tab')
      .boundingClientRect(data => {
        console.log(`得到布局位置信息${JSON.stringify(data)}`);
        console.log(`节点离页面顶部的距离为${data.top}`);
        this.myScroll = data.top;
      })
      .exec();
  },
  onPageScroll(e) {
    if (e.scrollTop > this.myScroll) {
      this.isTop = 1;
    } else {
      this.isTop = 0;
    }
  },
  methods: {
    // 切换选项卡
    toggleTab(index) {
      this.categoryId = index;
      this.loadThreadsSticky();
      this.loadThreads();
    },
    // 滑动切换swiper
    tabChange(e) {
      this.categoryId = e.detail.current;
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
    // 首页头部分享按钮弹窗
    open() {
      this.$refs.popup.open();
      this.bottomData = [
        {
          text: '生成海报',
          icon: 'icon-word',
          name: 'wx',
        },
        {
          text: '微信分享',
          icon: 'icon-img',
          name: 'wx',
        },
      ];
    },
    // 取消按钮
    cancel() {
      this.$refs.popup.close();
    },
    // 筛选选中确定按钮
    confirm(e) {
      // this.filterSelected = { ...e };
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
    },
    // 首页底部发帖按钮弹窗
    footerOpen() {
      console.log(this.forums, '9999');
      if (
        !this.forums.other.can_create_thread &&
        !this.forums.other.can_create_thread_long &&
        !this.forums.other.can_create_thread_video &&
        !this.forums.other.can_create_thread_image
      ) {
        console.log('此处弹出提示无权限发帖');
        return;
      }
      this.bottomData = [];
      if (this.forums.other.can_create_thread) {
        this.bottomData.push({
          text: '文字',
          icon: 'icon-word',
          name: 'text',
        });
      }
      if (this.forums.other.can_create_thread_long) {
        this.bottomData.push({
          text: '帖子',
          icon: 'icon-post',
          name: 'post',
        });
      }
      if (this.forums.other.can_create_thread_video) {
        this.bottomData.push({
          text: '视频',
          icon: 'icon-video',
          name: 'video',
        });
      }
      if (this.forums.other.can_create_thread_image) {
        this.bottomData.push({
          text: '图片',
          icon: 'icon-img',
          name: 'image',
        });
      }
      this.$refs.popup.open();
    },
    // 首页底部发帖点击事件跳转
    handleClick() {
      uni.navigateTo({
        url: '/pages/topic/post',
      });
    },
    // 首页内容部分分享按钮弹窗
    handleClickShare() {
      this.$refs.popup.open();
      this.bottomData = [
        {
          text: '生成海报',
          icon: 'icon-word',
          name: 'wx',
        },
        {
          text: '微信分享',
          icon: 'icon-img',
          name: 'wx',
        },
      ];
    },
    // 首页导航栏分类列表数据
    loadCategories() {
      this.$store.dispatch('jv/get', ['categories', {}]).then(data => {
        delete data._jv;
        const categoryFilterList = [
          {
            label: '所有',
            value: 0,
            // selected: 0 === this.categoryId ? true : false,
            selected: true,
          },
        ];

        Object.getOwnPropertyNames(data).forEach(function(key) {
          categoryFilterList.push({
            label: data[key].name,
            value: data[key]._jv.id,
            // selected: data[key].id === this.categoryId ? true : false,
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
        'filter[categoryId]': this.categoryId,
        include: ['firstPost'],
      };
      console.log(params, '置顶');
      this.$store.dispatch('jv/get', ['threads', { params }]).then(data => {
        delete data._jv;
        this.sticky = data;
      });
    },
    // 首页内容部分数据请求
    loadThreads() {
      const params = {
        'filter[isDeleted]': 'no',
        'filter[categoryId]': this.categoryId,
        'filter[type]': this.threadType,
        'filter[isEssence]': this.threadEssence,
        'page[number]': 1,
        'page[limit]': 10,
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
      };
      console.log(params, '列表');
      if (this.threadType !== null) {
        params['filter[type]'] = this.threadType;
      }

      params['filter[fromUserId]'] = this.threadFollow;

      this.$store.dispatch('jv/get', ['threads', { params }]).then(res => {
        this.totalData = res._jv.json.meta.threadCount;
        console.log(this.totalData);
        const data = JSON.parse(JSON.stringify(res));
        delete data._jv;
        this.loadingType = data.length === 10 ? 'more' : 'nomore';
        console.log(this.threads, 'this.threads第一次');
        this.threads = Object.assign(this.threads, data);
        console.log(this.threads, 'this.threads第二次');
        // this.threads = res;
      });
    },
    // 内容部分点赞按钮点击事件
    handleIsGreat(id, canLike, isLiked, likeCount) {
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
        if (isLiked) {
          data.likeCount = data.likeCount - 1;
        } else {
          data.likeCount = data.likeCount + 1;
        }
      });
    },
    // 下拉加载
    pullDown() {
      console.log('下拉加载呢');
      if (this.pageNum * this.pageSize < this.totalData) {
        this.pageNum += 1;
        this.loadThreads();
      } else {
        this.loadMore = 'noMore';
      }
    },
    refresh() {
      this.pageNum = 1;
      this.data = [];
      this.loadThreads();
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
  margin-bottom: 30rpx;
  background: --color(--qui-BG-2);

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

.sticky__isSticky {
  display: flex;
  // justify-content: space-between;
  width: 710rpx;
  height: 80rpx;
  margin-bottom: 30rpx;
  margin-left: 20rpx;
  font-size: $fg-f26;
  line-height: 80rpx;
  color: --color(--qui-FC-777);
  background: --color(--qui-BG-2);
  border-radius: 6rpx;
  box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.05);
  &__box {
    display: block;
    width: 62rpx;
    height: 35rpx;
    margin-top: 27rpx;
    margin-left: 20rpx;
    line-height: 35rpx;
    text-align: center;
    background: --color(--qui-BOR-ED);
    border-radius: 6rpx;
  }
  &__count {
    margin-left: 21rpx;
  }
}
.horizonal-tab .active {
  color: --color(--qui-BG-HIGH-LIGHT);
}
.scroll-tab {
  text-align: center;
  white-space: nowrap;
  border-bottom: 1rpx solid #eee;
}
.scroll-tab-item {
  z-index: 1;
  display: inline-block;
  margin: 30rpx;
  font-size: $fg-f26;
  color: --color(--qui-FC-777);
}
.active .scroll-tab-line {
  width: 100%;
  // border-top: 2rpx solid #1878f3;
  color: --color(--qui-BG-HIGH-LIGHT);
  border-bottom: 2rpx solid --color(--qui-BG-HIGH-LIGHT);
  border-radius: 20rpx;
}
.uni-tab-bar .active {
  font-size: $fg-f28;
  font-weight: bold;
  color: --color(--qui-BG-HIGH-LIGHT);
}
.main {
  margin-bottom: 130rpx;
}
.popup-share {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  background: --color(--qui-BG-2);
}
.popup-share-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 250rpx;
  padding-top: 40rpx;
  padding-right: 97rpx;
  padding-left: 98rpx;
  background: --color(--qui-BG-BTN-GRAY-1);
  // padding: 15px;
}
.popup-share-box {
  // width: 120rpx;
  height: 120rpx;
  line-height: 120rpx;
  background: --color(--qui-BG-2);
  border-radius: 10px;
}
.popup-share-content-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  width: 120rpx;
  height: 157rpx;
  // background: --color(--qui-BG-2);
}
.popup-share-content-image {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 120rpx;
  height: 120rpx;
  overflow: hidden;
  border-radius: 10rpx;
}
.content-image {
  width: 60rpx;
  height: 60rpx;
  margin: 35rpx;
  line-height: 60rpx;
}
.popup-share-content-text {
  padding-top: 5px;
  padding-bottom: 10px;
  font-size: $fg-f26;
  color: #333;
}
.popup-share-btn {
  height: 100rpx;
  font-size: $fg-f28;
  line-height: 90rpx;
  color: #666;
  text-align: center;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}
.popup-share-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-FC-DDD);
}
</style>
