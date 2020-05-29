<template>
  <view class="like-page">
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y"
    >
      <qui-content
        v-for="(item, index) in data"
        :ref="'myVideo' + index"
        :key="index"
        :currentindex="index"
        :pay-status="(item.price > 0 && item.paid) || item.price == 0"
        :user-name="item.user.username"
        :theme-image="item.user.avatarUrl"
        :theme-btn="item.canHide"
        :theme-reply-btn="item.canReply"
        :user-groups="item.user.groups"
        :theme-time="item.createdAt"
        :tags="[item.category]"
        :theme-content="item.type == 1 ? item.title : item.firstPost.summary"
        :thread-type="item.type"
        :media-url="item.threadVideo.media_url"
        :is-great="item.firstPost.isLiked"
        :theme-like="item.firstPost.likeCount"
        :theme-comment="item.postCount - 1"
        :images-list="item.firstPost.images"
        :theme-essence="item.isEssence"
        :video-width="item.threadVideo.width"
        :video-height="item.threadVideo.height"
        :video-id="item.threadVideo._jv.id"
        :cover-image="item.threadVideo.cover_url"
        @click="handleClickShare(item._jv.id)"
        @handleIsGreat="
          handleIsGreat(
            item.firstPost._jv.id,
            item.firstPost.canLike,
            item.firstPost.isLiked,
            index,
          )
        "
        @commentClick="commentClick(item._jv.id)"
        @contentClick="contentClick(item._jv.id)"
        @headClick="headClick(item.user._jv.id)"
        @videoPlay="handleVideoPlay"
      ></qui-content>
      <qui-load-more :status="loadingType" :show-icon="false"></qui-load-more>
    </scroll-view>
    <uni-popup ref="popupContent" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareContent(index)">
                <qui-icon class="content-image" :name="item.icon" size="46" color="#777"></qui-icon>
              </view>
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingType: '',
      data: [],
      flag: true, // 滚动节流
      pageSize: 20,
      pageNum: 1, // 当前页数
      nowThreadId: '',
      currentLoginId: this.$store.getters['session/get']('userId'),
      bottomData: [
        {
          text: this.i18n.t('home.generatePoster'),
          icon: 'icon-poster',
          name: 'wx',
        },
        {
          text: this.i18n.t('home.wxShare'),
          icon: 'icon-wx-friends',
          name: 'wx',
        },
      ],
    };
  },
  mounted() {
    this.loadlikes();
  },
  methods: {
    handleClickShare(id) {
      if (this.forums.set_site.site_mode === 'pay') {
        this.bottomData = [
          {
            text: this.i18n.t('home.generatePoster'),
            icon: 'icon-poster',
            name: 'wx',
          },
        ];
      }
      this.nowThreadId = id;
      this.$refs.popupContent.open();
    },
    // 内容部分分享海报,跳到分享海报页面
    shareContent(index) {
      if (index === 0) {
        uni.navigateTo({
          url: `/pages/share/topic?id=${this.nowThreadId}`,
        });
      }
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
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
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
    // 内容部分点赞按钮点击事件
    handleIsGreat(id, canLike, isLiked, index) {
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
      this.$store.dispatch('jv/patch', params).then(res => {
        if (isLiked && this.currentLoginId === this.userId) {
          const data = JSON.parse(JSON.stringify(this.data));
          data.splice(index, 1);
          this.data = data;
          this.$emit('changeFollow', { userId: this.userId });
        } else {
          // 修改点赞
          const likedData = this.data[index];
          const count = !isLiked ? res.likeCount + 1 : res.likeCount - 1;
          likedData.firstPost.likeCount = count;
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
  },
};
</script>
<style lang="scss" scoped>
/deep/ .themeItem {
  margin-right: 0;
  margin-left: 0;
}
.scroll-y {
  max-height: calc(100vh - 515rpx);
}
</style>
