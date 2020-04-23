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

      <scroll-view scroll-x="true" scroll-with-animation class="scroll-tab">
        <block v-for="(item, index) in tabBars" :key="index">
          <view
            class="scroll-tab-item"
            :class="{ active: tabIndex == index }"
            @tap="toggleTab(index)"
          >
            {{ item.name }}
            <view class="scroll-tab-line"></view>
          </view>
        </block>
      </scroll-view>
    </view>
    <view class="sticky">
      <view class="sticky__isSticky">
        <view class="sticky__isSticky__box">置顶</view>
        <view class="sticky__isSticky__count">取消目前的板块，改成标签（话题）形式，每篇 ...</view>
      </view>

      <!-- <view class="isSticky">取消目前的板块，改成标签（话题）形式，每篇 ...</view> -->
    </view>

    <view class="main">
      <qui-content
        v-for="(item, index) in data"
        :key="index"
        :user-name="item.userName"
        :theme-image="item.themeImage"
        :theme-status="item.themeStatus"
        :theme-btn="item.themeBtn"
        :theme-reward="item.themeReward"
        :theme-reply-btn="item.themeReplyBtn"
        :theme-delete-btn="item.themeDeleteBtn"
        :theme-types="item.themeTypes"
        :theme-time="item.themeTime"
        :theme-content="item.themeContent"
        :theme-like="item.themeLike"
        :theme-comment="item.themeComment"
        :tags="item.tags"
        @click="handleClickShare"
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
import quiPage from '@/components/qui-page';
import { status } from 'jsonapi-vuex';

export default {
  components: {
    quiPage,
  },
  data: () => {
    return {
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
      tabBars: [
        {
          name: '所有',
          id: 'guanzhu',
        },
        {
          name: '程序员',
          id: 'tuijian',
        },
        {
          name: '产品经理',
          id: 'redian',
        },
        {
          name: '策划文案',
          id: 'tiyu',
        },
        {
          name: '前端程序',
          id: 'caijing',
        },
        {
          name: '设计师',
          id: 'yule',
        },
        {
          name: '测试文字',
          id: 'yule',
        },
        {
          name: '狗子',
          id: 'yule',
        },
      ],
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
    thread() {
      return this.$store.getters['jv/get']('threads/13');
    },
    // forum() {
    //   return this.$store.getters['jv/get']('forum');
    // }
  },
  onLoad() {
    this.loadThreads();
    // const forums = this.$store.getters['jv/get']('forums/1');
    // const { site_name } = forums.set_site;
    // console.log(forums, 'namename');
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
    loadThreads() {
      const params = {
        'filter[isDeleted]': 'no',
        include: [
          'posts.replyUser',
          'user.groups',
          'user',
          'posts',
          'posts.user',
          'posts.likedUsers',
          'posts.images',
          'firstPost',
          'firstPost.likedUsers',
          'firstPost.images',
          'firstPost.attachments',
          'rewardedUsers',
          'category',
          'threadVideo',
        ],
      };
      this.loadStatus = status.run(() => {
        this.$store.dispatch('jv/get', ['threads/11', { params }]).then(data => {
          console.log(data, 99999);
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
}
.active .scroll-tab-line {
  width: 70rpx;
  // border-top: 2rpx solid #1878f3;
  border-bottom: 2rpx solid --color(--qui-BG-HIGH-LIGHT);
  border-radius: 20rpx;
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
