<template>
  <view class="content bg">
    <view class="detail-tip">{{ tip }}</view>
    <view class="detail-hd">
      <view class="det-hd-per-head-box">
        <image src="@/assets/essence.png" class="det-hd-per-head"></image>
      </view>
      <view class="det-hd-per-info">
        <text class="det-hd-per-name">{{ username }}</text>
        <view class="det-hd-post-time">{{ time }}</view>
      </view>
      <view class="det-hd-opera">
        <view class="det-hd-operaCli">
          <qui-icon name="icon-management"></qui-icon>
          <view>管理</view>
        </view>
        <image src="@/assets/essence.png" class="essence"></image>
      </view>
    </view>
    <view class="detail-post-content">
      <text class="det-post-con" @click="commentJump()">
        亚马逊上线了一个海外直邮防护用户页面，来自美国英
        国、日本、德国亚马逊的防护用品，包括一些奇形怪状
        的口罩、温度计、洗手液、消毒湿巾、护目镜、手套维
        生素、空气净化器等产品，买不到防护产品的同学试试 亚马逊吧，有奇效。海外购速度也挺快。
        新型冠狀病毒
      </text>
      <view class="det-post-img-list">
        <view class="det-post-img-box">
          <image class="det-post-img" mode="widthFix" src="@/assets/essence.png"></image>
        </view>
        <view class="det-post-img-box">
          <image class="det-post-img" mode="widthFix" src="@/assets/essence.png"></image>
        </view>
      </view>
      <view class="det-post-tag-list">
        <view class="det-post-tag" v-for="(tag, index) in tagList" :key="index">{{ tag.tag }}</view>
      </view>
    </view>
    <!-- 打赏 -->
    <view class="det-reward-box">
      <view class="det-rew-number">7人打赏</view>
      <view class="det-rew-per-list">
        <view class="det-rew-person">
          <image src="@/assets/essence.png" mode="widthFix" class="det-rew-per-head"></image>
        </view>
        <view class="det-rew-person">
          <image src="@/assets/essence.png" mode="widthFix" class="det-rew-per-head"></image>
        </view>
        <view class="det-rew-person">
          <image src="@/assets/essence.png" mode="widthFix" class="det-rew-per-head"></image>
        </view>
      </view>
      <qui-icon name="icon-unfold"></qui-icon>
      <button class="det-rew-btn">
        <qui-icon name="icon-reward"></qui-icon>
        <view>打赏</view>
      </button>
    </view>
    <!-- 点赞 -->
    <view class="det-reward-box pad-top">
      <view class="det-rew-number">54人点赞</view>
      <view class="det-rew-per-list">
        <view class="det-rew-person">
          <image src="@/assets/essence.png" mode="widthFix" class="det-rew-per-head"></image>
        </view>
        <view class="det-rew-person">
          <image src="@/assets/essence.png" mode="widthFix" class="det-rew-per-head"></image>
        </view>
        <view class="det-rew-person">
          <image src="@/assets/essence.png" mode="widthFix" class="det-rew-per-head"></image>
        </view>
      </view>
      <qui-icon name="icon-unfold"></qui-icon>
    </view>
    <view class="det-con-ft">
      <view class="det-con-ft-child">阅读2345</view>
      <view class="det-con-ft-child">
        <qui-icon name="icon-like"></qui-icon>
        <view>赞44343</view>
      </view>
      <view class="det-con-ft-child">
        <qui-icon name="icon-collection"></qui-icon>
        <view>收藏</view>
      </view>
    </view>
    <!-- 评论 -->
    <view class="comment">
      <view class="comment-num">217条评论</view>
      <view class="comment-child">
        <view class="comment-child-hd">
          <view class="comment-child-per-head-box">
            <image
              src="@/assets/essence.png"
              mode="widthFix"
              class="comment-child-per-head"
            ></image>
          </view>
          <view class="comment-child-per-info">
            <view class="comment-child-per-det">
              <view class="comment-child-per-name">{{ username }}</view>
              <view class="comment-chile-per-role">({{ role }})</view>
            </view>
            <view class="comment-child-time">{{ time }}</view>
          </view>
          <view class="comment-child-status">{{ status }}</view>
        </view>
        <view class="comment-child-con">
          {{ content }}
          <text class="comment-child-con-all">全部</text>
        </view>
        <view class="comment-child-comment-box">
          <view class="comment-child-reply">
            <view class="reply-user">{{ username }}</view>
            <view class="reply-connector">回复</view>
            <view class="reply-user">{{ username }}：</view>
            <text class="reply-content">
              回复的内容内容内容回复的内容内容内容回复的内容内容内容回复的内容内容内容回复的内容内容内容
            </text>
          </view>
        </view>
      </view>
    </view>
    <view class="det-ft flex">
      <view class="det-ft-child flex">
        <qui-icon name="icon-like"></qui-icon>
        <view>点赞</view>
      </view>
      <view class="det-ft-child flex">
        <qui-icon name="icon-comments"></qui-icon>
        <view>写评论</view>
      </view>
      <view class="det-ft-child flex">
        <qui-icon name="icon-share"></qui-icon>
        <view>分享</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      username: 'admin',
      time: '16分钟前',
      role: '管理员',
      status: '审核中',
      content: '内容内容内容,内容内容内容内容内容内容内容内容内容,内容内容内容内容内容...',
      isActive: true,
      tagList: [
        { tag: '女神视频1' },
        { tag: '女神视频22' },
        { tag: '女神视频333' },
        { tag: '女神视频4444' },
      ],
      tip: '内容正在审核中，审核通过后才能正常显示！',
    };
  },
  computed: {
    ...mapState({
      allThreads: state => state.dzThreads.all,
    }),
  },
  onLoad() {
    this.loadAllThreads({
      'page[size]': 10,
      'page[number]': 1,
    });
  },
  methods: {
    // 跳转到评论详情页
    commentJump() {
      console.log('跳转');
      // uni.navigateTo({
      //   url: '',
      // });
    },
    ...mapActions({
      loadAllThreads: 'dzThreads/loadAll',
    }),
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';
* {
  padding: 0;
  margin: 0;
  font-size: $fg-f28;
  color: --color(--qui-FC-333);
}
.flex {
  display: flex;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: --color(--qui-BG-2);
}
.detail-tip {
  display: block;
  width: 100%;
  font-size: $fg-f28;
  line-height: 60rpx;
  color: #fff;
  text-align: center;
  background: --color(--qui-RED);
}
.detail-hd {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 30rpx 40rpx 37rpx;
  box-sizing: border-box;
  .det-hd-per-head-box {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    .det-hd-per-head {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .det-hd-per-info {
    width: 400px;
    padding-left: 20rpx;
    .det-hd-per-name {
      margin-bottom: 10px;
      font-size: $fg-f28;
      font-weight: bold;
      line-height: 37rpx;
    }
    .det-hd-post-time {
      font-size: $fg-f24;
      line-height: 31rpx;
      color: --color(--qui-FC-AAA);
    }
  }
}
.det-hd-opera {
  align-self: flex-end;
  text-align: right;
  flex-shrink: 0;
  .det-hd-operaCli {
    display: flex;
    flex-direction: row;
    .icon-management {
      margin-right: 7rpx;
      font-size: 26rpx;
    }
    font-size: $fg-f28;
    line-height: 40rpx;
  }
  .essence {
    display: inline-block;
    width: 49rpx;
    height: 60rpx;
  }
}
//详情页帖子内容
.detail-post-content {
  padding: 0 40rpx 30rpx;
  text-align: left;
  .det-post-con {
    line-height: 45rpx;
  }
  .det-post-img-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 30rpx 0;
    // flex-wrap: wrap;
  }
  .det-post-img-box {
    .det-post-img {
      width: 314rpx;
      vertical-align: top;
    }
  }
  .det-post-tag-list {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    .det-post-tag {
      padding: 10rpx 20rpx;
    }
  }
}
.det-reward-box {
  display: flex;
  flex-direction: column;
  padding: 80rpx 0;
  text-align: center;
  .det-rew-number {
    font-size: $fg-f28;
    color: --color(--qui-FC-AAA);
    text-align: center;
  }
  .det-rew-per-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: 30rpx 0;
  }
  .det-rew-person {
    width: 50rpx;
    height: 50rpx;
    margin: 0 3rpx 10rpx 4rpx;
    border-radius: 50%;
    .det-rew-per-head {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .icon-unfold {
    padding: 0 0 30rpx;
    font-size: 34rpx;
    color: --color(--qui-FC-B5);
  }
  .det-rew-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 465rpx;
    height: 90rpx;
    font-size: $fg-f28;
    line-height: 90rpx;
    color: #fff;
    background: #fa5151;
    * {
      color: #fff;
    }
    .qui-icon {
      margin-right: 13rpx;
      font-size: 36rpx;
      line-height: 90rpx;
    }
  }
}
.det-con-ft {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 0 40rpx 30rpx;
  box-sizing: border-box;
  &-child {
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-size: $fg-f28;
    color: --color(--qui-FC-777);
    align-items: center;
    .qui-icon {
      margin-right: 17rpx;
      font-size: 30rpx;
    }
    * {
      font-size: $fg-f28;
      color: --color(--qui-FC-777);
    }
  }
}
.pad-top {
  padding-top: 0;
}
//评论
.comment {
  padding: 40rpx;
  margin-top: 30rpx;
}
.comment-num {
  font-weight: bold;
  line-height: 37rpx;
}
.comment-child {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 40rpx 0;
}
.comment-child-hd {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  .comment-child-per-head-box {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    .comment-child-per-head {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .comment-child-status {
    align-items: flex-start;
    padding-top: 8rpx;
    font-size: $fg-f26;
    line-height: 35rpx;
    color: --color(--qui-RED);
  }
}
.comment-child-per-info {
  width: 480rpx;
  padding-left: 20rpx;
  .comment-child-per-det {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .comment-child-per-name {
      margin-bottom: 10rpx;
      font-weight: bold;
      line-height: 37rpx;
    }
    .comment-chile-per-role {
      line-height: 37rpx;
      color: --color(--qui-FC-AAA);
    }
  }
  .comment-child-time {
    font-size: $fg-f24;
    line-height: 31rpx;
    color: --color(--qui-FC-AAA);
  }
}
.comment-child-con {
  padding: 20rpx 0 40rpx;
  line-height: 45rpx;
  text-align: left;
  .comment-child-con-all {
    color: --color(--qui-LINK);
    * {
      color: --color(--qui-LINK);
    }
  }
}
.comment-child-comment-box {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 20rpx;
  background: --color(--qui-BG-ED);
  border-radius: 10rpx;
  box-sizing: border-box;
}
.comment-child-reply {
  display: block;
  font-size: $fg-f26;
  line-height: 35rpx;
  .reply-user {
    display: inline;
    color: --color(--qui-LINK);
  }
  .reply-connector {
    display: inline;
    padding: 0 5px;
    color: --color(--qui-FC-777);
    flex-shrink: 0;
  }
  .reply-content {
    display: inline;
    color: --color(--qui-FC-777);
  }
}
.det-ft {
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  box-shadow: 0 -3rpx 6rpx rgba(0, 0, 0, 0.05);
}
.det-ft-child {
  flex: auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  line-height: 80rpx;
  color: --color(--qui-FC-777);
  .qui-icon {
    margin-right: 18rpx;
    font-size: 30rpx;
    line-height: 80rpx;
  }
}
</style>
