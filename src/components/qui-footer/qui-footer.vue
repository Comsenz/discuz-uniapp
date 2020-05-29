<template>
  <view>
    <view class="ft">
      <view
        class="ft-box "
        :class="{ select: true, active: item.id === sel }"
        v-for="(item, index) in tabs"
        :key="index"
        @click="select(item, index)"
      >
        <qui-icon
          class="ft-box-icon"
          :name="item.tabsIcon"
          size="48"
          :class="{ select: true, active: item.id === sel }"
        ></qui-icon>
        <text class="ft-box-content" :class="{ select: true, active: item.id === sel }">
          {{ item.tabsName }}
        </text>
      </view>

      <view class="ft-box-spacal">
        <image class="ft-box-spacal-icon" src="@/static/publish.svg" @click="footerOpen"></image>
      </view>
      <qui-icon
        v-if="redCircle"
        name="icon-circle"
        class="red-circle"
        color="red"
        size="14"
      ></qui-icon>
    </view>
    <uni-popup ref="popup" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="handleClick(item)">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="56"
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
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>
<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import { mapState } from 'vuex';

export default {
  mixins: [forums, user],
  data: () => {
    return {
      sel: 1,
      type: '',
      tabs: [
        {
          tabsName: 'home.tabsCircle',
          tabsIcon: 'icon-home',
          id: 1,
          url: '/pages/home/index',
          // routePath: 'pages/home/index', // 仅用作标识不用来跳转
        },
        {
          tabsName: 'home.tabsNews',
          tabsIcon: 'icon-message',
          id: 2,
          url: '/pages/notice/index',
          // routePath: 'pages/notice/index', // 仅用作标识不用来跳转
        },
        {
          tabsName: 'home.tabsMy',
          tabsIcon: 'icon-mine',
          id: 3,
          url: '/pages/my/index',
          // routePath: 'pages/my/index', // 仅用作标识不用来跳转
        },
      ],
      bottomData: [],
      isTabBar: [0], // 禁止页面第二次加载
    };
  },
  computed: {
    ...mapState({
      getCategoryId: state => state.session.categoryId,
      getCategoryIndex: state => state.session.categoryIndex,
    }),
    redCircle() {
      return this.user.unreadNotifications;
    },
  },
  created() {
    const len = getCurrentPages().length;
    if (len > 0) {
      const currentRout = getCurrentPages()[len - 1].is;
      const str = currentRout.split('pages/')[1];
      if (str) {
        this.tabs = this.tabs.map(tab => {
          const tabsName = this.i18n.t(tab.tabsName);
          if (tab.url && tab.url.includes(str)) {
            this.sel = tab.id;
          }
          const newTab = { ...tab, tabsName };
          return newTab;
        });
      }
    }
  },
  methods: {
    select(item, index) {
      this.$emit('click', item, index, this.isTabBar);
      this.sel = item.id;
      if (!item.url) {
        return;
      }
      const currentPage = getCurrentPages();
      if (
        item.tabsName === this.i18n.t('home.tabsCircle') &&
        currentPage[0].route === 'pages/home/index'
      ) {
        const len = currentPage.length;
        uni.navigateBack({
          delta: len,
        });
      }
    },
    // 首页底部发帖按钮弹窗
    footerOpen() {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }

      if (!this.forums.other.can_create_thread_in_category) {
        this.$refs.toast.show({ message: this.i18n.t('home.noPostingPermission') });
        return;
      }

      if (this.getCategoryId) {
        const category = this.$store.getters['jv/get'](`categories/${this.getCategoryId}`);
        if (!category.canCreateThread) {
          this.$refs.toast.show({ message: this.i18n.t('home.noPostingPermission') });
        }
      }

      if (
        !this.forums.other.can_create_thread &&
        !this.forums.other.can_create_thread_long &&
        !this.forums.other.can_create_thread_video &&
        !this.forums.other.can_create_thread_image
      ) {
        this.$refs.toast.show({ message: this.i18n.t('home.noPostingPermission') });
        return;
      }
      this.bottomData = [];
      if (this.forums.other.can_create_thread) {
        this.bottomData.push({
          text: this.i18n.t('home.word'),
          icon: 'icon-word',
          name: 'text',
          type: 0,
        });
      }
      if (this.forums.other.can_create_thread_long) {
        this.bottomData.push({
          text: this.i18n.t('home.invitation'),
          icon: 'icon-post',
          name: 'post',
          type: 1,
        });
      }
      if (this.forums.other.can_create_thread_video) {
        this.bottomData.push({
          text: this.i18n.t('home.video'),
          icon: 'icon-video',
          name: 'video',
          type: 2,
        });
      }
      if (this.forums.other.can_create_thread_image) {
        this.bottomData.push({
          text: this.i18n.t('home.picture'),
          icon: 'icon-img',
          name: 'image',
          type: 3,
        });
      }
      this.$refs.popup.open();
    },
    // 首页底部发帖点击事件跳转
    handleClick(item) {
      console.log(item.type);
      uni.navigateTo({
        url: `/pages/topic/post?type=${item.type}&categoryId=${this.getCategoryId}&categoryIndex=${this.getCategoryIndex}`,
      });
      this.cancel();
    },
    // 取消按钮
    cancel() {
      this.$refs.popup.close();
    },
    close() {
      this.$refs.auth.close();
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.ft {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 119rpx;
  background-color: --color(--qui-BG-2);
  box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.05);
  justify-content: space-around;
}
.ft-box {
  display: flex;
  width: 20%;
  height: 72rpx;
  margin-top: 20rpx;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
.ft-box-icon {
  display: flex;
  height: 46rpx;
  justify-content: center;
  // background: #c33;
}
.ft-box-content {
  padding-top: 3rpx;
  font-size: 20rpx;
  line-height: 26rpx;
  color: --color(--qui-FC-777);
  text-align: center;
}
.ft-box-spacal {
  position: relative;
  top: -20rpx;
  width: 125rpx;
  height: 125rpx;
  border-radius: 50%;
  box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.05);
}
.ft-box-spacal-icon {
  position: relative;
  width: 125rpx;
  height: 125rpx;
}
.active {
  color: #1878f3;
}
.red-circle {
  position: absolute;
  top: -3rpx;
  left: 302rpx;
}
</style>
