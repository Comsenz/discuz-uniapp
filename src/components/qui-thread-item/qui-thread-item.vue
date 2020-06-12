<template>
  <view class="home">
    <qui-content
      :ref="'thread-' + currentindex"
      :currentindex="currentindex"
      :pay-status="(thread.price > 0 && thread.paid) || thread.price == 0"
      :user-name="thread.user.username"
      :theme-image="thread.user.avatarUrl"
      :theme-btn="thread.canHide || ''"
      :theme-reply-btn="thread.canReply || ''"
      :user-groups="thread.user && thread.user.groups"
      :theme-time="thread.createdAt"
      :theme-content="thread.type == 1 ? thread.title : thread.firstPost.summary"
      :thread-type="thread.type"
      :media-url="thread.threadVideo && thread.threadVideo.media_url"
      :is-great="thread.firstPost.isLiked"
      :theme-like="thread.firstPost.likeCount"
      :theme-comment="thread.postCount - 1"
      :tags="[thread.category]"
      :images-list="thread.firstPost.images"
      :theme-essence="thread.isEssence"
      :video-width="thread.threadVideo && thread.threadVideo.width"
      :video-height="thread.threadVideo && thread.threadVideo.height"
      :video-id="thread.threadVideo && thread.threadVideo._jv.id"
      :cover-image="thread.threadVideo && thread.threadVideo.cover_url"
      :is-deleted="thread.isDeleted"
      @click="handleClickShare(thread._jv.id)"
      @handleIsGreat="
        handleIsGreat(
          thread.firstPost._jv.id,
          thread.firstPost.canLike,
          thread.firstPost.isLiked,
          thread.firstPost.likeCount,
        )
      "
      @commentClick="commentClick(thread._jv.id)"
      @contentClick="contentClick(thread._jv.id)"
      @backgroundClick="contentClick(thread._jv.id)"
      @headClick="headClick(thread.user._jv.id)"
      @videoPlay="handleVideoPlay"
    ></qui-content>
    <uni-popup ref="popupContent" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share" plain="true"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareContent(index)">
                <qui-icon
                  class="content-image"
                  :name="thread.icon"
                  size="46"
                  color="#777777"
                ></qui-icon>
              </view>
              <!-- <image :src="thread.icon" class="content-image" mode="widthFix" /> -->
            </view>
            <text class="popup-share-content-text">{{ thread.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
// #endif

export default {
  mixins: [
    // #ifdef  H5
    wxshare,
    // #endif
  ],
  props: {
    thread: {
      type: Object,
      default: () => {
        return {};
      },
    },
    currentindex: {
      type: [Number, String],
      default: '0',
    },
  },
  data() {
    return {
      isLiked: false, // 主题点赞状态
      shareShow: false, // h5内分享提示信息
      shareTitle: '', // h5内分享复制链接
      shareBtn: 'icon-share1',
      tabIndex: 0, // 选中标签栏的序列,默认显示第一个
      bottomData: [
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
      ],
    };
  },
  methods: {
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

    // #ifdef H5
    closeShare() {
      this.shareShow = false;
      console.log(this.shareShow, '8888');
    },
    // #endif

    // 取消按钮
    cancel() {
      this.$refs.popupContent.close();
    },
    // 点赞调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
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
    // 内容部分点赞按钮点击事件
    handleIsGreat(id, canLike, isLiked) {
      if (!this.$store.getters['session/get']('isLogin')) {
        // #ifdef MP-WEIXIN
        this.$store.getters['session/get']('auth').open();
        // #endif
        // #ifdef H5
        console.log('注册并绑定页');
        const url = '/pages/home/index';
        uni.navigateTo({
          url: `/pages/user/register-bind?url=${url}`,
        });
        // #endif
      }
      const params = {
        _jv: {
          type: 'posts',
          id,
        },
        isLiked: isLiked !== true,
      };
      this.$store.dispatch('jv/patch', params);
    },
    // 视频禁止同时播放
    handleVideoPlay(index) {
      if (this.playIndex !== index && this.playIndex !== null) {
        this.$refs[`thread-${this.playIndex}`][0].pauseVideo();
      }
      this.playIndex = index;
    },
    // 内容部分点击评论跳到详情页
    commentClick(id) {
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 首页内容部分分享按钮弹窗
    handleClickShare(id) {
      // #ifdef MP-WEIXIN
      this.$emit('handleClickShare', id);
      this.nowThreadId = id;
      this.$refs.popupContent.open();
      // 付费模式下不显示微信分享
      if (this.forums.set_site.site_mode === 'pay') {
        this.bottomData = [
          {
            text: this.i18n.t('home.generatePoster'),
            icon: 'icon-poster',
            name: 'wx',
            id: 1,
          },
        ];
      }
      // #endif
      // #ifdef H5
      const shareThread = this.$store.getters['jv/get'](`threads/${id}`);
      if (shareThread.type === 1) {
        this.shareTitle = shareThread.title;
      } else {
        this.shareTitle = shareThread.firstPost.summary;
      }
      this.h5Share({
        title: this.shareTitle,
        id,
      });
      // #endif
    },
  },
};
</script>
