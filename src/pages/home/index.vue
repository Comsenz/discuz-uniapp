<template>
  <qui-page>
    <qui-header
      :head-img="defaultHeadImg"
      :background-head-full-img="backgroundHeadFullImg"
      :theme="theme"
      :theme-num="themeNum"
      :post="post"
      :post-num="postNum"
      :share="share"
      :icon-share="iconShare"
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
          @click="handleClick"
        ></qui-icon>
      </view>
      <view class="uni-tab-bar">
        <scroll-view
          scroll-x="true"
          scroll-with-animation
          class="scroll-tab"
          :style="isTop == 1 ? 'position:fixed;z-index:9;top:0' : ''"
        >
          <view class="scroll-tab-item" :class="{ active: tabIndex == 0 }" @tap="toggleTab(0)">
            所有
          </view>
          <block v-for="(item, index) in categories" :key="index">
            <view
              class="scroll-tab-item"
              :class="{ active: tabIndex == item._jv.id }"
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
      <qui-content
        v-for="(item, index) in threads"
        :key="index"
        :user-name="item.user.username"
        :theme-image="item.user.avatarUrl"
        :theme-btn="item.canHide"
        :theme-reply-btn="item.canReply"
        :theme-types="item.user.showGroups"
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
          handleIsGreat(item.firstPost._jv.id, item.firstPost.canLike, item.firstPost.isLiked)
        "
      ></qui-content>
    </view>
    <qui-footer @click="footerOpen" :tabs="tabs" :post-img="postImg"></qui-footer>

    <uni-popup ref="popup" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="36"
                  color="#777777"
                  @click="handleClick"
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
  </qui-page>
</template>

<script>
/* eslint-disable */
import { status } from 'jsonapi-vuex';

export default {
  data: () => {
    return {
      loadStatus: {},
      isTop: 0,
      threads: '',
      sticky: '',
      defaultHeadImg: 'https://discuz.chat/static/images/logo.png',
      backgroundHeadFullImg: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg',
      theme: '主题',
      themeNum: 234,
      post: '帖子',
      postNum: 3498,
      share: '分享',
      iconShare: 'icon-share1',
      color: 'red',
      tabIndex: 0 /* 选中标签栏的序列,默认显示第一个 */,
      data: [
        {
          userName: '佟掌柜',
          themeImage: 'https://discuz.chat/static/images/noavatar.gif',
          themeTypes: '(管理员)',
          themeStatus: '打赏了我',
          // themeBtn: 'icon-delete',
          // themeReward: '1150.50',
          themeDeleteBtn: '删除',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          themeReplyBtn: 'icon-delete',
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
        {
          userName: '佟掌柜',
          themeImage: 'https://discuz.chat/static/images/noavatar.gif',
          themeTypes: '(管理员)',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
        {
          userName: '佟掌柜',
          themeImage: 'https://discuz.chat/static/images/noavatar.gif',
          themeTypes: '(管理员)',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
        {
          userName: '佟掌柜',
          themeImage: 'https://discuz.chat/static/images/noavatar.gif',
          themeTypes: '(管理员)',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
      ],
      bottomData: [
        {
          text: '文字',
          icon: 'icon-word',
          name: 'wx',
        },
        {
          text: '图片',
          icon: 'icon-img',
          name: 'wx',
        },
        {
          text: '视频',
          icon: 'icon-video',
          name: 'qq',
        },
        {
          text: '帖子',
          icon: 'icon-post',
          name: 'sina',
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
        },
        {
          tabsName: '我',
          tabsIcon: 'icon-mine',
          id: 3,
        },
      ],
      postImg: '../assets.publish.svg',
    };
  },
  computed: {
    categories() {
      return this.$store.getters['jv/get']('categories');
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
    const query = uni.createSelectorQuery().in(this);
    query
      .select('#scrollView')
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
      this.tabIndex = index;
    },
    // 滑动切换swiper
    tabChange(e) {
      console.log(e);
      this.tabIndex = e.detail.current;
    },
    // 内容部分点赞按钮点击事件
    handleIsGreat(id, canLike, isLiked) {
      if (!canLike) {
        console.log('没有点赞权限');
      }
      // console.log(id, canLike, isLiked);
      const params = {
        _jv: {
          type: 'posts',
          id: id,
        },
        isLiked: isLiked === true ? false : true,
      };
      const postLike = status.run(() => {
        this.$store.dispatch('jv/patch', params);
      });
      postLike
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log(err);
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
    cancel() {
      this.$refs.popup.close();
    },
    // 首页底部发帖按钮弹窗
    footerOpen() {
      console.log(this.$refs.popup.open);
      this.$refs.popup.open();
      this.bottomData = [
        {
          text: '文字',
          icon: 'icon-word',
          name: 'wx',
        },
        {
          text: '图片',
          icon: 'icon-img',
          name: 'wx',
        },
        {
          text: '视频',
          icon: 'icon-video',
          name: 'qq',
        },
        {
          text: '帖子',
          icon: 'icon-post',
          name: 'sina',
        },
      ];
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
      this.loadStatus = status.run(() => {
        this.$store.dispatch('jv/get', ['categories', {}]);
      });
    },
    // 首页置顶列表数据
    loadThreadsSticky() {
      const params = {
        'filter[isSticky]': 'yes',
        include: ['firstPost'],
      };
      this.loadStatus = status.run(() => {
        this.$store.dispatch('jv/get', ['threads', { params }]).then(data => {
          this.sticky = data;
        });
      });
    },
    // 首页内容部分数据请求
    loadThreads() {
      const params = {
        'filter[isDeleted]': 'no',
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
      };
      this.loadStatus = status.run(() => {
        this.$store.dispatch('jv/get', ['threads', { params }]).then(data => {
          // 循环帖子
          Object.getOwnPropertyNames(data).forEach(key => {
            // 如果是 _jv 跳过
            if (key === '_jv') {
              return true;
            }

            // 循环每篇帖子作者的用户组
            Object.getOwnPropertyNames(data[key].user.groups).forEach(k => {
              // 如果是 _jv 跳过
              if (key === '_jv') {
                return true;
              }

              // 是否显示用户组
              const group = data[key].user.groups[k];
              data[key].user.showGroups = group.isDisplay ? `(${group.name})` : '';
            });
          });

          delete data._jv;
          this.threads = data;
        });
      });
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.nav {
  position: relative;
  margin-bottom: 30rpx;
  background: --color(--qui-BG-2);

  &__box {
    position: absolute;
    right: 10rpx;
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
