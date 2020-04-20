<template>
  <qui-page>
    <qui-header
      :head-img="defaultHeadImg"
      :background-head-full-img="backgroundHeadFullImg"
    ></qui-header>
    <view class="nav">
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
      <view class="isSticky">
        <view class="isSticky-box">置顶</view>
        <view class="isSticky-count">取消目前的板块，改成标签（话题）形式，每篇 ...</view>
      </view>
      <!-- <view class="isSticky">取消目前的板块，改成标签（话题）形式，每篇 ...</view> -->
    </view>

    <view class="main">
      <qui-content
        v-for="(item, index) in data"
        :key="index"
        :user-name="item.userName"
        :theme-types="item.themeTypes"
        :theme-time="item.themeTime"
        :theme-content="item.themeContent"
        :theme-like="item.themeLike"
        :theme-comment="item.themeComment"
        :tags="item.tags"
      ></qui-content>
    </view>
    <qui-footer></qui-footer>
  </qui-page>
</template>

<script>
import quiPage from '@/components/qui-page';
import quiHeader from '@/components/qui-index/qui-header';
import quiContent from '@/components/qui-index/qui-content';
import quiFooter from '@/components/qui-index/qui-footer';

export default {
  components: {
    quiPage,
    quiHeader,
    quiContent,
    quiFooter,
  },
  data: () => {
    return {
      defaultHeadImg: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg',
      backgroundHeadFullImg: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg',
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
    };
  },
  computed: {},
  onLoad() {},

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
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.nav {
  margin-bottom: 30rpx;
  background: --color(--qui-BG-2);
}
.isSticky {
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
}
.isSticky-box {
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
.isSticky-count {
  margin-left: 21rpx;
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
</style>
