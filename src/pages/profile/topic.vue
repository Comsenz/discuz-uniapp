<template>
  <view class="topic-page">
    <uni-popup ref="popup" type="bottom">
      <qui-drawer :bottom-data="bottomData"></qui-drawer>
    </uni-popup>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      @scrolltoupper="refresh"
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
        :theme-content="item.type == 1 ? item.title : item.firstPost.contentHtml"
        :is-great="item.firstPost.isLiked"
        :theme-like="item.firstPost.likeCount"
        :theme-comment="item.firstPost.replyCount"
        :tags="item.category.name"
        :images-list="item.firstPost.images"
        :theme-essence="item.isEssence"
        @click="handleClickShare"
        @handleIsGreat="
          handleIsGreat(
            item.firstPost._jv.id,
            item.firstPost.canLike,
            item.firstPost.isLiked,
            item.firstPost.likeCount,
          )
        "
        @commentClick="commentClick(item._jv.id)"
        @contentClick="contentClick(item._jv.id)"
        @headClick="headClick(item._jv.id)"
      ></qui-content>
      <qui-load-more :status="loadingType"></qui-load-more>
    </scroll-view>
    <uni-popup ref="popup" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="handleClick">
                <qui-icon class="content-image" :name="item.icon" size="36" color="#777"></qui-icon>
              </view>
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">取消</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { status } from 'jsonapi-vuex';

export default {
  components: {
    //
  },
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
      totalData: 0, // 总数
      pageSize: 20,
      pageNum: 1, // 当前页数
      bottomData: [
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
      ],
    };
  },
  mounted() {
    this.loadThreads();
  },
  methods: {
    handleClickShare() {
      this.$refs.popup.open();
    },
    // 首页底部发帖点击事件跳转
    handleClick() {
      uni.navigateTo({
        url: '/pages/topic/post',
      });
    },
    // 取消按钮
    cancel() {
      this.$refs.popup.close();
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
          this.totalData = res._jv.json.meta.threadCount;
          delete res._jv;
          this.loadingType = Object.keys(res).length === this.pageSize ? 'more' : 'nomore';
          this.data = { ...this.data, ...res };
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
    handleIsGreat(id, canLike, isLiked) {
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
      this.$store.dispatch('jv/patch', params);
    },
    // 下拉加载
    pullDown() {
      if (this.pageNum * this.pageSize < this.totalData) {
        this.pageNum += 1;
        this.loadThreads();
      } else {
        this.loadingType = 'nomore';
      }
    },
    refresh() {
      this.pageNum = 1;
      this.data = [];
      this.loadThreads();
    },
  },
};
</script>
<style lang="scss" scope>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
/deep/ .themeItem {
  margin-right: 0;
  margin-left: 0;
}
.scroll-y {
  max-height: calc(100vh - 297rpx);
}
</style>
