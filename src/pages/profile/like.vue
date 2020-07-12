<template>
  <view class="like-page">
    <qui-content
      v-for="(item, index) in data"
      :ref="'myVideo' + index"
      :key="index"
      :currentindex="index"
      :scroll-top="scrollTop"
      :pay-status="(item.price > 0 && item.paid) || item.price == 0"
      :user-name="item.user ? item.user.username : ''"
      :theme-reply-btn="item.canReply || ''"
      :theme-image="item.user && item.user.avatarUrl"
      :user-groups="item.user && item.user.groups"
      :theme-time="item.createdAt"
      :tags="[item.category]"
      :theme-content="item.type == 1 ? item.title : item.firstPost.summary"
      :thread-type="item.type"
      :media-url="item.threadVideo && item.threadVideo.media_url"
      :is-great="item.firstPost.isLiked"
      :theme-like="item.firstPost.likeCount"
      :theme-comment="item.postCount - 1"
      :images-list="item.firstPost.images"
      :theme-essence="item.isEssence"
      :video-width="item.threadVideo && item.threadVideo.width"
      :video-height="item.threadVideo && item.threadVideo.height"
      :video-id="item.threadVideo && item.threadVideo._jv.id"
      :cover-image="item.threadVideo && item.threadVideo.cover_url"
      @click="handleClickShare(item._jv.id)"
      @handleIsGreat="
        handleIsGreat(item.firstPost._jv.id, item.firstPost.canLike, item.firstPost.isLiked, index)
      "
      @commentClick="commentClick(item._jv.id)"
      @contentClick="contentClick(item._jv.id)"
      @headClick="headClick(item.user._jv.id)"
      @videoPlay="handleVideoPlay"
    ></qui-content>
    <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
    <uni-popup ref="popupContent" type="bottom">
      <qui-share :now-thread-id="nowThreadId" share-type="content" @close="cancel"></qui-share>
    </uni-popup>
  </view>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
import loginAuth from '@/mixin/loginAuth-h5';
// #endif

export default {
  mixins: [
    // #ifdef  H5
    wxshare,
    loginAuth,
    // #endif
  ],
  props: {
    userId: {
      type: String,
      default: '',
    },
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loadingType: '',
      data: [],
      pageSize: 20,
      pageNum: 1, // 当前页数
      nowThreadId: '',
      editThreadId: '',
      playIndex: null,
      shareTitle: '', // h5内分享复制链接
      currentLoginId: this.$store.getters['session/get']('userId'),
      scrollTopPosition: 0,
    };
  },
  watch: {
    // 监听得到的数据
    scrollTop(val) {
      if (val !== this.scrollTopPosition) {
        this.scrollTopPosition = val;
      }
    },
  },
  mounted() {
    this.loadlikes();
  },
  methods: {
    handleClickShare(id) {
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
        this.shareTitle = shareThread.firstPost.summary;
      }
      this.h5Share({
        title: this.shareTitle,
        id,
        url: 'pages/topic/index',
      });
      // #endif
    },
    // 取消按钮
    cancel() {
      this.$refs.popupContent.close();
    },
    // 调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
    // 加载当前点赞数据
    loadlikes() {
      this.loadingType = 'loading';
      const params = {
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[isApproved]': 1,
        'filter[user_id]': this.userId,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads/likes', { params }]))
        .then(res => {
          if (res._jv) {
            delete res._jv;
          }
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          this.data = [...this.data, ...res];
        });
    },
    // 评论部分点击评论跳到详情页
    commentClick(id) {
      // #ifdef H5
      if (!this.$store.getters['session/get']('isLogin')) {
        if (!this.handleLogin()) {
          return;
        }
      }
      // #endif
      this.editThreadId = id;
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 内容部分点击跳转到详情页
    contentClick(id) {
      // #ifdef H5
      if (!this.$store.getters['session/get']('isLogin')) {
        if (!this.handleLogin()) {
          return;
        }
      }
      // #endif
      this.editThreadId = id;
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
    // 内容部分点赞按钮点击事件
    handleIsGreat(id, canLike, isLiked, index) {
      if (!this.$store.getters['session/get']('isLogin')) {
        // #ifdef MP-WEIXIN
        this.$store.getters['session/get']('auth').open();
        // #endif
        // #ifdef H5
        if (!this.handleLogin()) {
          return;
        }
        // #endif
      }
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
      }
      const params = {
        _jv: {
          type: 'posts',
          id,
        },
        isLiked: isLiked !== true,
      };
      this.$store.dispatch('jv/patch', params).then(() => {
        if (isLiked && this.currentLoginId === this.userId) {
          const data = JSON.parse(JSON.stringify(this.data));
          data.splice(index, 1);
          this.data = data;
          this.$emit('changeFollow', { userId: this.userId });
        } else {
          // 修改点赞
          // const likedData = this.data[index];
          // const count = !isLiked ? res.likeCount + 1 : res.likeCount - 1;
          // likedData.firstPost.likeCount = count;
        }
      });
    },
    // 视频禁止同时播放
    handleVideoPlay(index) {
      if (this.playIndex !== index && this.playIndex !== null) {
        this.$refs[`myVideo${this.playIndex}`][0].pauseVideo();
      }
      this.playIndex = index;
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.loadlikes();
    },
    uploadItem() {
      if (!this.editThreadId) {
        return;
      }
      const item = this.$store.getters['jv/get'](`threads/${this.editThreadId}`);
      this.data.forEach((data, index) => {
        if (data._jv.id === this.editThreadId) {
          this.editThreadId = '';
          this.$set(this.data, index, item);
        }
      });
    },
  },
};
</script>
