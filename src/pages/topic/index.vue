<template>
  <view class="content bg" v-if="status">
    <view class="detail-tip" v-if="topicStatus == 0">{{ tip }}</view>
    <qui-topic-content
      v-model="thread"
      :pay-status="true"
      :avatar-url="thread.user.avatarUrl"
      :user-name="thread.user.username"
      :theme-types="thread.type"
      :theme-time="thread.createdAt"
      :theme-content="thread.firstPost.contentHtml"
      :images-list="thread.firstPost.images"
      :tags="[thread.category]"
      :person-jump="personJump"
    ></qui-topic-content>
    <!-- 已支付用户列表 -->
    <view v-if="paidStatus">
      <qui-person-list
        :show-status="true"
        type="支付"
        :person-num="thread.paidCount"
        :limit-count="limitShowNum"
        :person-list="thread.paidUsers"
        :btn-show="true"
        :btn-icon-show="true"
        btn-icon-name="rmb"
        btn-text="支付查看图片"
        @personJump="personJump"
        @btnClick="payClick"
      ></qui-person-list>
    </view>

    <!-- 打赏用户列表 -->
    <view v-if="rewardStatus">
      <qui-person-list
        :show-status="true"
        type="打赏"
        :person-num="thread.rewardedCount"
        :limit-count="limitShowNum"
        :person-list="thread.rewardedUsers"
        :btn-show="true"
        :btn-icon-show="true"
        btn-icon-name="rmb"
        btn-text="打赏"
        @personJump="personJump"
        @btnClick="rewardClick"
      ></qui-person-list>
    </view>
    <view v-if="likedStatus">
      <!-- 点赞用户列表 -->
      <qui-person-list
        :show-status="true"
        type="点赞"
        :person-num="thread.firstPost.likeCount"
        :limit-count="limitShowNum"
        :person-list="thread.firstPost.likedUsers"
        :btn-show="false"
        @personJump="personJump"
      ></qui-person-list>
    </view>
    <view class="det-con-ft">
      <view class="det-con-ft-child">阅读{{ thread.viewCount }}</view>
      <view class="det-con-ft-child">
        <qui-icon name="icon-like" class="qui-icon"></qui-icon>
        <view>赞{{ thread.firstPost.likeCount }}</view>
      </view>
      <view class="det-con-ft-child">
        <qui-icon name="icon-collection" class="qui-icon"></qui-icon>
        <view>收藏</view>
      </view>
    </view>
    <!-- 评论 -->
    <view class="comment">
      <view class="comment-num">{{ thread.postCount }}条评论</view>
      <qui-topic-comment
        v-for="(post, index) in thread.posts"
        :key="index"
        :comment-avatar-url="post.user.avatarUrl"
        :user-name="post.user.username"
        user-role="管理员"
        :comment-time="post.user.createdAt"
        :comment-content="post.contentHtml"
        :comment-like-count="post.likedCount"
        :images-list="post.images"
      ></qui-topic-comment>
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
    <view class="det-ft flex">
      <view class="det-ft-child flex">
        <qui-icon name="icon-like" class="qui-icon"></qui-icon>
        <view>点赞</view>
      </view>
      <view class="det-ft-child flex">
        <qui-icon name="icon-comments" class="qui-icon"></qui-icon>
        <view>写评论</view>
      </view>
      <view class="det-ft-child flex">
        <qui-icon name="icon-share" class="qui-icon"></qui-icon>
        <view>分享</view>
      </view>
    </view>
  </view>
</template>

<script>
import { status } from 'jsonapi-vuex';
import lodash from 'lodash';

export default {
  data() {
    return {
      loadStatus: {},
      topicStatus: 0, // 0 是不合法 1 是合法 2 是忽略
      username: 'admin',
      time: '16分钟前',
      role: '管理员',
      replyStatus: '审核中',
      content: '内容内容内容,内容内容内容内容内容内容内容内容内容,内容内容内容内容内容...',
      isActive: true,
      tagList: [
        { tag: '女神视频1' },
        { tag: '女神视频22' },
        { tag: '女神视频333' },
        { tag: '女神视频4444' },
      ],
      tip: '内容正在审核中，审核通过后才能正常显示！',
      seleShow: false, // 默认收起管理菜单
      selectList: [
        { text: '编辑', type: '1' },
        { text: '精华', type: '2' },
        { text: '删除', type: '3' },
        { text: '置顶', type: '4' },
      ], // 管理菜单
      topic: {
        username: 'admin',
        time: '15分钟前',
        themeTypes: '0',
        themeContent: '内容内容',
        images: [
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
        ],
        tags: [
          {
            tagName: '女神',
          },
          {
            tagName: '女神经',
          },
          {
            tagName: '女神经病',
          },
        ],
        payList: [
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
        ],
        likes: [
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
          'https://dq.comsenz-service.com/storage/attachment/2020/04/19/czIWBB13JCi8klmV_thumb.jpg',
        ],
      },
      status: false,
      limitShowNum: 2,
      paidStatus: false, // 是否有已支付数据
      rewardStatus: false, // 是否已有打赏数据
      likedStatus: false, // 是否已有点赞数据
      datas: [
        {
          userName: '佟掌柜',
          themeTypes: '(管理员)',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
        {
          userName: '佟掌柜',
          themeTypes: '(管理员)',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
        {
          userName: '佟掌柜',
          themeTypes: '(管理员)',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
        {
          userName: '佟掌柜',
          themeTypes: '(管理员)',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
      ],
    };
  },
  computed: {
    thread() {
      return this.$store.getters['jv/get']('threads/11');
    },
  },
  onLoad() {
    this.loadThreads();
  },
  methods: {
    // 加载当前主题数据
    loadThreads() {
      const params = {
        'filter[isDeleted]': 'no',
        include: [
          'posts.replyUser',
          'user.groups',
          'user',
          'posts',
          'posts.user',
          'posts.likedUsers',
          'posts.images',
          'firstPost',
          'firstPost.likedUsers',
          'firstPost.images',
          'firstPost.attachments',
          'rewardedUsers',
          'category',
          'threadVideo',
          'paidUsers',
        ],
      };
      this.loadStatus = status.run(() =>
        this.$store.dispatch('jv/get', ['threads/11', { params }]).then(data => {
          this.status = true;
          console.log(data.posts, '~~~~~~~~~~~~~~~~~~~');
          // console.log(lodash.isEmpty(data.paidUsers));
          if (lodash.isEmpty(data.paidUsers)) {
            this.paidStatus = false;
          } else {
            this.paidStatus = true;
          }
          if (lodash.isEmpty(data.rewardedUsers)) {
            this.rewardStatus = false;
          } else {
            this.rewardStatus = true;
          }
          if (lodash.isEmpty(data.firstPost.likedUsers)) {
            this.likedStatus = false;
          } else {
            this.likedStatus = true;
          }
          // console.log('over', this.limitArray(data.paidUsers, 1));
        }),
      );
    },
    // 管理菜单点击事件
    selectClick() {
      this.seleShow = !this.seleShow;
    },
    // 管理菜单内标签点击事件
    selectChoice(type) {
      this.seleShow = false;
      console.log(type, '类型');
    },
    // 跳转到用户主页
    personJump(id) {
      console.log(id, 'id');
      // uni.navigateTo({
      //   url: '/pages/home/index',
      // });
    },
    // 支付
    payClick() {
      console.log('支付');
    },
    // 打赏
    rewardClick() {
      console.log('打赏');
    },
    // 跳转到评论详情页
    commentJump() {
      console.log('跳转');
      // uni.navigateTo({
      //   url: '',
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';
page {
  padding: 0;
  margin: 0;
  font-size: $fg-f28;
  color: --color(--qui-FC-333);
}
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
    width: 400rpx;
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
  .essence {
    display: inline-block;
    width: 39rpx;
    height: 44rpx;
  }
}
.det-hd-operaCli {
  position: relative;
  z-index: 10;
  .det-hd-management {
    display: flex;
    flex-direction: row;
    .icon-management {
      margin-right: 7rpx;
      font-size: 26rpx;
    }
  }
  font-size: $fg-f28;
  line-height: 40rpx;
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
  font-size: $fg-f28;
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
