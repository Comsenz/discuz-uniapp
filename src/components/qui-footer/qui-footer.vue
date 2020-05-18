<template>
  <view>
    <view class="ft">
      <view
        class="ft-box "
        :class="{ select: true, active: item.id === sel }"
        @click="select(item)"
        v-for="(item, index) in tabs"
        :key="index"
      >
        <qui-icon
          class="ft-box-icon"
          :name="item.tabsIcon"
          size="40"
          :class="{ select: true, active: item.id === sel }"
          @click="select(item)"
        ></qui-icon>
        <text class="ft-box-content" :class="{ select: true, active: item.id === sel }">
          {{ item.tabsName }}
        </text>
      </view>

      <view class="ft-box-spacal">
        <image class="ft-box-spacal-icon" src="@/static/publish.svg" @click="footerOpen"></image>
      </view>
      <uni-icons
        class="red-circle"
        type="smallcircle-filled"
        size="7"
        color="red"
        v-if="redCircle"
      ></uni-icons>
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
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>
<script>
import { uniIcons } from '@dcloudio/uni-ui';
// import { status } from '@/library/jsonapi-vuex/index';

export default {
  components: {
    uniIcons,
  },
  // props: {
  //   tabs: {
  //     type: Array,
  //     default: () => {
  //       return [];
  //     },
  //   },
  //   postImg: {
  //     type: String,
  //     default: '',
  //   },
  //   redCircle: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  data: () => {
    return {
      sel: 1,
      type: '',
      tabs: [
        {
          tabsName: '首页',
          tabsIcon: 'icon-home',
          id: 1,
          url: '../home/index',
        },
        {
          tabsName: '消息',
          tabsIcon: 'icon-message',
          id: 2,
          url: '../notice/index',
        },
        {
          tabsName: '我的',
          tabsIcon: 'icon-mine',
          id: 3,
          url: '../my/index',
        },
      ],
      bottomData: [],
    };
  },
  computed: {
    forums() {
      return this.$store.getters['jv/get']('forums/1');
    },
  },
  created() {
    const len = getCurrentPages().length;
    if (len > 0) {
      const currentRout = getCurrentPages()[len - 1].is;
      const str = currentRout.split('pages/')[1];
      if (str) {
        this.tabs.forEach(v => {
          if (v.url && v.url.includes(str)) {
            this.sel = v.id;
          }
        });
      }
    }
  },
  methods: {
    select(item) {
      // this.sel = item.id;
      if (!item.url) {
        return;
      }

      this.$store.dispatch('session/setAuth', this.$refs.auth);
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$refs.auth.open();
        return;
      }

      const currentPage = getCurrentPages();
      if (item.tabsName === '首页' && currentPage[0].route === 'pages/home/index') {
        const len = currentPage.length;
        uni.navigateBack({
          delta: len,
        });
        return;
      }

      uni.navigateTo({
        url: item.url,
      });
    },
    // 首页底部发帖按钮弹窗
    footerOpen() {
      this.$store.dispatch('session/setAuth', this.$refs.auth);
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$refs.auth.open();
      }
      // console.log(this.forums, '9999');
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
        url: `/pages/topic/post?type=${item.type}`,
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
  height: 72rpx;
  margin-top: 20rpx;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
}
.ft-box-icon {
  height: 46rpx;
  // background: #c33;
}
.ft-box-content {
  padding-top: 2px;
  font-size: 20rpx;
  color: --color(--qui-FC-777);
  text-align: center;
}
.ft-box-spacal {
  position: relative;
  width: 125rpx;
  height: 125rpx;
}
.ft-box-spacal-icon {
  position: relative;
  top: -20rpx;
  width: 125rpx;
  height: 125rpx;
}
.active {
  color: #1878f3;
}
.red-circle {
  position: absolute;
  top: -3rpx;
  left: 267rpx;
}
</style>
