/* eslint-disable vue/no-parsing-error */
<template>
  <qui-page>
    <view class="topic-content-header">
      <view class="topic-content-header_title">#{{ anncData[0].title }}#</view>
      <view class="topic-content-header_toAll" @click="toAllTopic">全部话题 ></view>
      <view class="topic-content-header_details">
        <view class="details_title">
          热度：
          <text>{{ anncTopicData.heat }}</text>
        </view>
        <view class="details_title">
          内容：
          <text>{{ anncTopicData.content }}</text>
        </view>
        <view class="details_title">
          <qui-icon
            class="post-box__hd-l__icon"
            name="icon-share"
            size="30"
            color="#777"
            @click="topicPage"
          ></qui-icon>
          <text>{{ '  分享' }}</text>
        </view>
      </view>
    </view>
    <qui-content
      v-for="(item, i) in topicData"
      :key="i"
      topic-name=""
      :user-name="item.user.username"
      :theme-image="item.user.avatarUrl"
      :images-list="item.images"
      :theme-time="item.user.createdAt"
      :theme-like="item.user.likedcount"
      :theme-comment="item.commit"
      :tags="item.keywords"
      :theme-content="item.title"
      theme-type="1"
      :theme-essence="item.isEssence"
      :is-great="isGreat"
    ></qui-content>
    <qui-load-more></qui-load-more>
  </qui-page>
</template>

<script>
import { mapMutations } from 'vuex';
import quiContent from '../../components/qui-content/qui-content';

export default {
  components: {
    quiContent,
  },
  data() {
    return {
      topicData: [],
      isGreat: false,
    };
  },
  methods: {
    ...mapMutations({
      setAtMember: 'atMember/SET_ATMEMBER',
    }),
    toAllTopic() {
      uni.navigateTo({
        url: '/pages/topic/list',
      });
    },
    handleIsGreat(e) {
      if (e) {
        console.log(e);
      } else {
        console.log(`e is not defined`);
      }
      // this.isGreat = !this.isGreat;
      // this.$store.dispatch('session/setAuth', this.$refs.auth);
      // if (!this.$store.getters['session/get']('isLogin')) {
      //   this.$refs.auth.open();
      // }
      // // if (!canLike) {
      // //   console.log('没有点赞权限');
      // // }
      // const params = {
      //   _jv: {
      //     type: 'posts',
      //     id,
      //   },
      //   isLiked: isLiked !== true,
      // };
      // this.$store.dispatch('jv/patch', params).then(data => {
      //   const likedPost = this.$store.getters['jv/get'](`/posts/${id}`);
      //   if (data.isLiked) {
      //     likedPost.likeCount += 1;
      //   } else {
      //     likedPost.likeCount -= 1;
      //   }
      // });
    },
  },
  onLoad() {
    // 请求话题数据
    this.$store.dispatch('jv/get', ['threads', { params: {} }]).then(res => {
      this.topicData = res;
      console.log(res);
    });
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

$otherHeight: 292rpx;
$toAllBlue: #1450a0;
.topic-content-header {
  padding: 15rpx;
  margin-bottom: 10rpx;
  font-size: 40rpx;
  background: #fff;
  box-sizing: border-box;
  &_title {
    margin: 20rpx;
    font-weight: 600;
  }
  &_details {
    display: flex;
  }
  &_toAll {
    margin-bottom: 15rpx;
    margin-left: 36rpx;
    font-size: 28rpx;
    color: $toAllBlue;
  }
}
.details_title {
  width: 33.3%;
  margin-top: 10rpx;
  margin-left: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #aaa;
  text {
    font-size: 24rpx;
    color: #343434;
  }
}
</style>
