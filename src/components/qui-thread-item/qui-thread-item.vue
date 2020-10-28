<template>
  <view class="thread">
    <qui-content
      :ref="'thread-' + currentindex"
      :currentindex="currentindex"
      :pay-status="(thread.price > 0 && thread.paid) || thread.price == 0"
      :user-name="thread.user ? thread.user.username : ''"
      :theme-image="thread.user ? thread.user.avatarUrl : ''"
      :post-goods="thread.firstPost.postGoods ? thread.firstPost.postGoods : ''"
      :is-real="thread.user ? thread.user.isReal : false"
      :theme-btn="thread.canHide || ''"
      :theme-reply-btn="thread.canReply || ''"
      :user-groups="handleGroup(thread.user && thread.user.groups)"
      :user-answer-groups="
        handleGroup(thread.question && thread.question.beUser ? thread.question.beUser.groups : [])
      "
      :answer-image="
        thread.question && thread.question.beUser ? thread.question.beUser.avatarUrl : ''
      "
      :theme-time-answer="thread.question && thread.question.answered_at"
      :theme-time="thread.createdAt"
      :theme-content="thread.type == 1 ? thread.title : thread.firstPost.summary"
      :thread-type="thread.type"
      :them-pay-btn="thread.price > 0 || thread.attachmentPrice > 0"
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
      :duration="thread.threadVideo && thread.threadVideo.duration"
      :is-deleted="thread.isDeleted"
      :questions-name="thread.user.username"
      :be-ask-name="
        thread.question && thread.question.beUser ? thread.question.beUser.username : ''
      "
      :question-content="thread.question && thread.question.content"
      :add-ask="thread.question && thread.question.is_answer"
      :onlooker-number="thread.question && thread.question.onlooker_number"
      :free-ask="thread.question && thread.question.price == 0"
      :ask-price="thread.question && thread.question.price"
      :ask-content="thread.question && thread.question.content"
      :onlooker-unit-price="thread.question && thread.question.onlooker_unit_price"
      :on-looker="thread.question && thread.question.onlooker_unit_price == 0"
      :thread-position="
        thread.location ? [thread.location, thread.address, thread.longitude, thread.latitude] : []
      "
      :thread-audio="thread.threadAudio"
      @click="handleClickShare(thread._jv.id)"
      @handleIsGreat="
        handleIsGreat(
          thread.firstPost._jv.id,
          thread.firstPost.canLike,
          thread.firstPost.isLiked,
          currentindex,
        )
      "
      @commentClick="commentClick(thread._jv.id)"
      @answeClick="answeClick(thread.user._jv.id)"
      @beAskClick="beAskClick(thread.question.beUser.id)"
      @contentClick="contentClick(thread._jv.id)"
      @backgroundClick="contentClick(thread._jv.id)"
      @headClick="headClick(thread.user._jv.id)"
      @videoPlay="handleVideoPlay"
    ></qui-content>
    <uni-popup ref="popupContent" type="bottom">
      <qui-share @close="cancel" share-type="content" :now-thread-id="nowThreadId"></qui-share>
    </uni-popup>
  </view>
</template>

<script>
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
// #endif
import forums from '@/mixin/forums';
import loginModule from '@/mixin/loginModule';
import { getCurUrl } from '@/utils/getCurUrl';

export default {
  mixins: [
    forums,
    loginModule,
    // #ifdef H5
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
    conversationId: {
      type: [Number, String],
      default: 0,
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
      playIndex: null,
      nowThreadId: '',
      tabIndex: 0, // 选中标签栏的序列,默认显示第一个
    };
  },
  methods: {
    // 内容部分点击跳转到详情页
    contentClick(id) {
      this.$emit('toTopic', id);
      uni.navigateTo({
        url: `/topic/index?id=${id}&topicid=${this.conversationId}`,
      });
    },
    // 点击头像调转到个人主页
    headClick(id) {
      if (id <= 0) {
        return;
      }
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
    // 点击用户名跳转提问者个人主页
    answeClick(id) {
      if (id <= 0) {
        return;
      }
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
    // 点击用户名跳转回答者个人主页
    beAskClick(id) {
      console.log('ididdidiidid');
      if (id <= 0) {
        return;
      }
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },

    // #ifdef H5
    closeShare() {
      this.shareShow = false;
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
    // 内容部分点赞按钮点击事件
    handleIsGreat(id, canLike, isLiked, index) {
      if (!this.$store.getters['session/get']('isLogin')) {
        uni.setStorage({
          key: 'page',
          data: getCurUrl(),
        });
        // #ifdef MP-WEIXIN
        this.mpLoginMode();
        // #endif
        // #ifdef H5
        this.h5LoginMode();
        // #endif
      }
      const params = {
        _jv: {
          type: 'posts',
          id,
        },
        isLiked: isLiked !== true,
      };
      this.$store.dispatch('jv/patch', params).then(() => {
        this.$emit('greatCallBack', isLiked, index);
      });
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
        url: `/topic/index?id=${id}`,
      });
      this.$emit('toTopic', id);
    },
    // 首页内容部分分享按钮弹窗
    handleClickShare(id) {
      if (!this.$store.getters['session/get']('isLogin')) {
        uni.setStorage({
          key: 'page',
          data: getCurUrl(),
        });
        // #ifdef MP-WEIXIN
        this.mpLoginMode();
        // #endif
        // #ifdef H5
        this.h5LoginMode();
        // #endif
      }
      // #ifdef MP-WEIXIN
      this.$emit('handleClickShare', id);
      this.nowThreadId = id;
      this.$refs.popupContent.open();
      // #endif
      // #ifdef H5
      const shareThread = this.$store.getters['jv/get'](`threads/${id}`);
      if (shareThread.type === 1) {
        this.shareTitle = shareThread.title;
      } else {
        this.shareTitle = shareThread.firstPost.summaryText;
      }
      this.h5Share({
        title: this.shareTitle,
        id,
        url: 'pages/topic/index',
      });
      // #endif
    },
    handleGroup(data) {
      let groups = [];
      if (data && data.length > 0) {
        groups = data.filter(item => item.isDisplay);
      }
      if (groups.length > 0) {
        return [groups[0]];
      }
      return [];
    },
  },
};
</script>
