<template>
  <view class="topic-page">
    <uni-popup ref="popup" type="bottom">
      <qui-drawer :bottom-data="bottomData"></qui-drawer>
    </uni-popup>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y"
    >
      <qui-content
        v-for="(item, index) in data"
        :key="index"
        :user-name="item.user.username"
        :theme-image="item.user.avatarUrl"
        :theme-btn="item.canHide"
        :theme-reply-btn="item.canReply"
        :user-groups="item.user.groups"
        :theme-time="item.createdAt"
        :theme-content="item.type == 1 ? item.title : item.firstPost.summary"
        :thread-type="item.type"
        :tags="[item.category]"
        :media-url="item.threadVideo.media_url"
        :is-great="item.firstPost.isLiked"
        :theme-like="item.firstPost.likeCount"
        :theme-comment="item.postCount - 1"
        :images-list="item.firstPost.images"
        :theme-essence="item.isEssence"
        :video-width="item.threadVideo.width"
        :video-height="item.threadVideo.height"
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
      ></qui-content>
      <qui-load-more :status="loadingType"></qui-load-more>
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

export default {
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingType: 'more',
      data: [],
      flag: true, // 滚动节流
      pageSize: 20,
      pageNum: 1, // 当前页数
      nowThreadId: '',
      currentLoginId: uni.getStorageSync('user_id'),
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
    this.loadThreads();
  },
  methods: {
    handleClickShare(id) {
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
    // 加载当前主题数据
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
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[userId]': this.userId,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads', { params }]))
        .then(res => {
          if (res._jv) {
            delete res._jv;
          }
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          this.data = [...this.data, ...res];
        });
    },
    // 内容部分点击跳转到详情页
    contentClick(id) {
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 评论部分点击评论跳到详情页
    commentClick(id) {
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
      if (!canLike) {
        console.log('没有点赞权限');
      }
      const params = {
        _jv: {
          type: 'posts',
          id,
        },
        isLiked: isLiked !== true,
      };
      this.$store.dispatch('jv/patch', params).then(res => {
        // 如果是个人主页
        if (this.currentLoginId === this.userId) {
          this.$emit('changeFollow', { userId: this.userId });
        }
        const likedData = this.data[index];
        const count = !isLiked ? res.likeCount + 1 : res.likeCount - 1;
        likedData.firstPost.likeCount = count;
      });
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.loadThreads();
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
  max-height: calc(100vh - 297rpx);
}
</style>
