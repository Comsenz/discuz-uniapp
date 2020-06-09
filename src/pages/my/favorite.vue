<template>
  <qui-page :data-qui-theme="theme" class="favorite">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('profile.myfavorite')"></qui-header-back>
    <!-- #endif -->
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y"
    >
      <view class="favorite-head">
        <qui-cell-item
          :title="`${totalData}${i18n.t('profile.item')}${i18n.t('profile.collection')}`"
          :border="false"
        ></qui-cell-item>
      </view>
      <view class="favorite-content">
        <qui-content
          v-for="(item, index) in data"
          :ref="'myVideo' + index"
          :key="index"
          :currentindex="index"
          :pay-status="(item.price > 0 && item.paid) || item.price == 0"
          :user-name="item.user && item.user.username"
          :theme-image="item.user && item.user.avatarUrl"
          :user-groups="item.user && item.user.groups"
          :theme-time="item.createdAt"
          :theme-content="item.type == 1 ? item.title : item.firstPost.summary"
          :thread-type="item.type"
          :tags="[item.category]"
          :media-url="item.threadVideo && item.threadVideo.media_url"
          :is-great="item.firstPost.isLiked"
          :theme-like="item.firstPost.likeCount"
          :theme-comment="item.postCount - 1"
          :images-list="item.firstPost.images"
          :theme-essence="item.isEssence"
          theme-btn="icon-delete"
          :video-width="item.threadVideo && item.threadVideo.width"
          :video-height="item.threadVideo && item.threadVideo.height"
          :video-id="item.threadVideo && item.threadVideo._jv.id"
          :cover-image="item.threadVideo && item.threadVideo.cover_url"
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
          @deleteClick="itemDelete(item._jv.id, item.isFavorite, index)"
        ></qui-content>
        <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
      </view>
      <uni-popup ref="popupContent" type="bottom">
        <view class="popup-share">
          <view class="popup-share-content">
            <button class="popup-share-button" open-type="share"></button>
            <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
              <view class="popup-share-content-image">
                <view class="popup-share-box" @click="shareContent(index)">
                  <qui-icon
                    class="content-image"
                    :name="item.icon"
                    size="46"
                    color="#777"
                  ></qui-icon>
                </view>
              </view>
              <text class="popup-share-content-text">{{ item.text }}</text>
            </view>
          </view>
          <view class="popup-share-content-space"></view>
          <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
        </view>
      </uni-popup>
    </scroll-view>
  </qui-page>
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
      totalData: 0, // 总数
      pageSize: 20,
      pageNum: 1, // 当前页数
      nowThreadId: '',
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
    // 唤起小程序原声分享（微信）
    onShareAppMessage(res) {
      // 来自页面内分享按钮
      if (res.from === 'button') {
        const threadShare = this.$store.getters['jv/get'](`/threads/${this.nowThreadId}`);
        return {
          title: threadShare.type === 1 ? threadShare.title : threadShare.firstPost.summary,
          path: `/pages/topic/index?id=${this.nowThreadId}`,
        };
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
          'firstPost',
          'user.groups',
          'lastThreePosts',
          'lastThreePosts.user',
          'firstPost.likedUsers',
          'rewardedUsers',
          'lastThreePosts.replyUser',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['favorites', { params }]))
        .then(res => {
          if (res._jv) {
            this.totalData = res._jv.json.meta.threadCount;
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
    handleIsGreat(id, canLike, isLiked) {
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
        // const likedData = this.data[index];
        // const count = !isLiked ? res.likeCount + 1 : res.likeCount - 1;
        // likedData.firstPost.likeCount = count;
      });
    },
    // 视频禁止同时播放
    handleVideoPlay(index) {
      if (this.playIndex !== index && this.playIndex !== null) {
        this.$refs[`myVideo${this.playIndex}`][0].pauseVideo();
      }
      this.playIndex = index;
    },
    // 删除收藏
    itemDelete(id, isFavorite, index) {
      const params = {
        _jv: {
          type: 'threads',
          id,
        },
        isFavorite: isFavorite !== true,
      };
      this.$store.dispatch('jv/patch', params).then(() => {
        this.totalData -= 1;
        this.data.splice(index, 1);
      });
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
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.scroll-y {
  max-height: 100vh;
}
.favorite /deep/ {
  .favorite-head {
    padding-top: 20rpx;
    padding-left: 40rpx;
    /* #ifdef H5 */
    margin-top: 60rpx;
    /* #endif */
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .cell-item__body {
    height: 78rpx;
  }
  .themeCount .addFine {
    display: none;
  }
  .themeCount .icon-delete {
    position: absolute;
    top: 35rpx;
    right: 40rpx;
  }
}
</style>
