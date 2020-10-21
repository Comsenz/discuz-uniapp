<template>
  <view>
    <view
      class="ft"
      :style="{
        paddingBottom: bottom + 'rpx',
      }"
    >
      <view
        :class="['ft-box', { active: index === footerIndex }, `ft-box${item.id}`]"
        v-for="(item, index) in tabs"
        :key="index"
        @click="select(item, index)"
      >
        <qui-icon
          class="ft-box-icon"
          :name="item.tabsIcon"
          :size="item.tabsIcon === 'icon-faxian' ? 38 : 36"
          :class="redCircle && item.id === 3 ? 'message' : ''"
        ></qui-icon>
        <view class="ft-box-content">
          {{ item.tabsName }}
        </view>
      </view>

      <view class="ft-box-spacal">
        <image class="ft-box-spacal-icon" src="@/static/published.svg" @click="footerOpen"></image>
      </view>
    </view>
    <uni-popup ref="popup" type="bottom">
      <view class="popup-share">
        <view
          class="popup-share-content"
          :class="bottomDataLength > 4 ? 'popup-share-content-inner' : ''"
        >
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="handleClick(item)">
                <qui-icon class="content-image" :name="item.icon" size="56" color="#777"></qui-icon>
              </view>
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <uni-popup ref="surePopup" type="center">
      <uni-popup-dialog
        type="warn"
        :content="sureTip"
        :before-close="true"
        @close="handleClickCancel"
        @confirm="handleClickOk"
      ></uni-popup-dialog>
    </uni-popup>
    <qui-toast ref="toast"></qui-toast>
    <!-- #ifdef MP-WEIXIN -->
    <uni-popup ref="authPhone" type="bottom">
      <qui-auth-phone @closeDialog="closeDialog"></qui-auth-phone>
    </uni-popup>
    <!-- #endif -->
    <view v-show="false">
      <qui-uploader
        :url="`${url}api/attachments`"
        :form-data="formData"
        name="file"
        :async-clear="true"
        ref="upload"
        :count="1"
        :choose-type="0"
        @uploadClick="uploadClick"
      ></qui-uploader>
      <qui-upload-video
        ref="uploadVideo"
        :url="url"
        @uploadVideo="uploadVideo"
        :choose-type="0"
      ></qui-upload-video>
    </view>
  </view>
</template>
<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import { mapState, mapMutations } from 'vuex';
import loginModule from '@/mixin/loginModule';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  components: { uniPopupDialog },
  mixins: [
    forums,
    user,
    loginModule,
    // #ifdef H5
    appCommonH,
    // #endif
  ],
  props: {
    bottom: {
      type: Number,
      default: 0,
    },
  },
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
          tabsName: 'home.find',
          tabsIcon: 'icon-faxian',
          id: 2,
          url: '/pages/find/index',
        },
        {
          tabsName: 'home.tabsNews',
          tabsIcon: 'icon-message',
          id: 3,
          url: '/pages/notice/index',
          // routePath: 'pages/notice/index', // 仅用作标识不用来跳转
        },
        {
          tabsName: 'home.tabsMy',
          tabsIcon: 'icon-mine',
          id: 4,
          url: '/pages/my/index',
          // routePath: 'pages/my/index', // 仅用作标识不用来跳转
        },
      ],
      bottomData: [],
      bottomDataLength: 0,
      isTabBar: [0], // 禁止页面第二次加载
      sureType: '', // 二次确认类型
      sureTip: '', // 二次确认提示

      url: '', // 视频url
      formData: {}, // 图片请求data
      uploadStatus: true,
      isWeixin: '', // 是否是微信浏览器内
      isiOS: '',
    };
  },
  computed: {
    ...mapState({
      getCategoryId: state => state.session.categoryId,
      getCategoryIndex: state => state.session.categoryIndex,
      footerIndex: state =>
        state.footerTab.footerIndex ? parseInt(state.footerTab.footerIndex, 10) : 0,
    }),
    redCircle() {
      return this.user.unreadNotifications;
    },
  },
  created() {
    const len = getCurrentPages().length;
    if (len > 0) {
      // #ifdef MP-WEIXIN
      const currentRout = getCurrentPages()[len - 1].is;
      const str = currentRout && currentRout.split('pages/')[1];
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
      // #endif
      // #ifdef H5
      const currentRouts = getCurrentPages()[len - 1].route;
      const strs = currentRouts && currentRouts.split('pages/')[1];
      if (strs) {
        this.tabs = this.tabs.map(tab => {
          const tabsName = this.i18n.t(tab.tabsName);
          if (tab.url && tab.url.includes(strs)) {
            this.sel = tab.id;
          }
          const newTab = { ...tab, tabsName };
          return newTab;
        });
      }
      this.isWeixin = appCommonH.isWeixin().isWeixin;
      this.isiOS = appCommonH.isWeixin().isiOS;
      // #endif
    }
    // 上传图片
    this.url = DISCUZ_REQUEST_HOST;
    this.formData = {
      type: 1,
    };
  },
  methods: {
    select(item, index) {
      if (this.$store.getters['session/get']('isLogin')) {
        this.setFooterIndex(parseInt(index, 10));
      }
      this.$emit('click', item, index, this.isTabBar);
      this.sel = item.id;
    },
    ...mapMutations({
      setFooterIndex: 'footerTab/SET_FOOTERINDEX',
    }),
    // 首页底部发帖按钮弹窗
    footerOpen() {
      if (!this.$store.getters['session/get']('isLogin')) {
        uni.setStorage({
          key: 'page',
          data: '/pages/home/index',
        });
        // #ifdef MP-WEIXIN
        this.mpLoginMode();
        // #endif
        // #ifdef H5
        this.h5LoginMode();
        // #endif
      }
      if (this.forums.other.publish_need_real_name) {
        this.sureTip = this.i18n.t('home.needRealname');
        this.$refs.surePopup.open();
        this.sureType = '0';
        return;
      }
      if (this.forums.other.publish_need_bind_phone) {
        this.sureTip = this.i18n.t('home.needPhone');
        this.$refs.surePopup.open();
        this.sureType = '1';
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
        !this.forums.other.can_create_thread_image &&
        !this.forums.other.can_create_thread_question &&
        !this.forums.other.can_create_thread_audio &&
        !this.forums.other.can_create_thread_goods
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
      if (this.forums.other.can_create_thread_image) {
        this.bottomData.push({
          text: this.i18n.t('home.picture'),
          icon: 'icon-img',
          name: 'image',
          type: 3,
        });
      }
      if (this.forums.other.can_create_thread_audio) {
        this.bottomData.push({
          text: this.i18n.t('home.audio'),
          icon: 'icon-record',
          name: 'audio',
          type: 4,
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
      if (this.forums.other.can_create_thread_goods) {
        this.bottomData.push({
          text: this.i18n.t('home.good'),
          icon: 'icon-good',
          name: 'good',
          type: 6,
        });
      }
      if (this.forums.other.can_create_thread_question) {
        this.bottomData.push({
          text: this.i18n.t('home.questions'),
          icon: 'icon-question',
          name: 'questions',
          type: 5,
        });
      }

      this.bottomDataLength = this.bottomData.length;

      this.$refs.popup.open();
    },
    // 首页底部发帖点击事件跳转
    handleClick(item) {
      let url;
      if (item.type === 6) {
        uni.navigateTo({
          url: `/pages/topic/parse-goods?type=${item.type}`,
        });
        return;
      }

      if (this.isWeixin && this.isiOS && item.type === 4) {
        this.$refs.toast.show({ message: this.i18n.t('discuzq.post.IOSWxNotRecordAudio') });
        return;
      }
      if (item.type === 5) {
        uni.navigateTo({
          url: `/pages/user/at-member?name=select&categoryId=${this.getCategoryId}&categoryIndex=${this.getCategoryIndex}`,
        });
        return;
      }
      if (this.footerIndex === 0) {
        url = `/topic/post?type=${item.type}&categoryId=${this.getCategoryId}&categoryIndex=${this.getCategoryIndex}`;
      }
      if (item.type === 3) {
        // 当选择图片帖时
        this.$nextTick(() => {
          this.$refs.upload.uploadClick();
        });
        uni.$on('uploadOver', data => {
          if (this.footerIndex === 0) {
            url = `/topic/post?type=${item.type}&categoryId=${this.getCategoryId}&categoryIndex=${this.getCategoryIndex}`;
          } else {
            url = `/topic/post?type=${item.type}`;
          }
          uni.navigateTo({
            url,
            success: res => {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', { data });
            },
          });
          this.cancel();
        });
      } else if (item.type === 2) {
        // 当选择视屏帖时
        this.$nextTick(() => {
          this.$refs.uploadVideo.uploadVideo();
        });
        uni.$on('uploadVideoOver', data => {
          if (this.footerIndex === 0) {
            url = `/topic/post?type=${item.type}&categoryId=${this.getCategoryId}&categoryIndex=${this.getCategoryIndex}`;
          } else {
            url = `/topic/post?type=${item.type}`;
          }
          uni.navigateTo({
            url,
            success: res => {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', {
                data,
              });
            },
          });
          this.cancel();
        });
      } else {
        if (this.footerIndex === 0) {
          url = `/topic/post?type=${item.type}&categoryId=${this.getCategoryId}&categoryIndex=${this.getCategoryIndex}`;
        } else {
          url = `/topic/post?type=${item.type}`;
        }
        uni.navigateTo({
          url,
        });
        this.cancel();
      }
    },
    // 取消按钮
    cancel() {
      this.$refs.popup.close();
    },
    close() {
      this.$refs.auth.close();
    },
    handleClickOk() {
      this.$refs.surePopup.close();
      if (this.sureType === '0') {
        uni.navigateTo({
          url: `/pages/modify/realname?id=${this.user.id}`,
        });
      } else if (this.sureType === '1') {
        // #ifdef MP-WEIXIN
        if (this.user && this.user.mobile === '') {
          this.$refs.authPhone.open();
        }
        // #endif
        // #ifdef H5
        // 删除类型为主题评论
        uni.navigateTo({
          url: `/pages/modify/setphon?id=${this.user.id}`,
        });
        // #endif
      }
    },
    handleClickCancel() {
      this.$refs.surePopup.close();
    },
    // #ifdef MP-WEIXIN
    closeDialog() {
      this.$refs.authPhone.close();
    },
    // #endif
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
/* #ifdef H5 */
$top: -6rpx;
/* #endif */

/* #ifdef MP-WEIXIN */
$top: -9rpx;
/* #endif */
.ft {
  // position: absolute;
  position: fixed;
  bottom: 0;
  z-index: 100;
  display: flex;
  width: 100%;
  height: 100rpx;
  background-color: --color(--qui-BG-2);
  box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.05);
}
.ft-box {
  position: relative;
  width: 20%;
  height: 100rpx;
  padding-top: 15rpx;
  font-size: $fg-f3;
  text-align: center;
  box-sizing: border-box;
}
.ft-box3 {
  margin-left: 150rpx;
}
.ft-box-content {
  color: --color(--qui-FC-777);
}
.ft-box-spacal {
  position: absolute;
  top: -5rpx;
  left: 50%;
  width: 105rpx;
  height: 105rpx;
  margin-left: -52rpx;
  border-radius: 50%;
  box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.05);
}
.ft-box-spacal-icon {
  position: relative;
  width: 89rpx;
  height: 89rpx;
  margin: 8rpx 0 0 8rpx;
}
.ft-box.active,
.ft-box.active .ft-box-content {
  font-weight: bold;
  color: --color(--qui-TAB);
}
.message {
  position: relative;
}
.message:after {
  position: absolute;
  top: $top;
  right: -6rpx;
  width: 10rpx;
  height: 10rpx;
  background: --color(--qui-RED);
  border-radius: 50%;
  content: '';
}
.popup-share-content-inner {
  height: auto;
  overflow: hidden;
  justify-content: flex-start;
}
.popup-share-content-inner .popup-share-content-box {
  margin-bottom: 40rpx;
  flex: 0 0 25%;
}
</style>
