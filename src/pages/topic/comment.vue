<template>
  <view class="content bg" v-if="status">
    <view class="ft-gap">
      <qui-topic-content
        v-if="postStatus"
        :avatar-url="post.user.avatarUrl"
        :user-name="post.user.username"
        :theme-time="post.createdAt"
        :theme-content="post.contentHtml"
        :images-list="post.images"
        @personJump="personJump"
      ></qui-topic-content>
      <view class="thread-box">
        <view class="thread">
          <view class="thread__header">
            <view class="thread__header__img">
              <image
                :src="
                  thread.user.avatarUrl != '' && thread.user.avatarUrl != null
                    ? thread.user.avatarUrl
                    : 'https://discuz.chat/static/images/noavatar.gif'
                "
                alt
                @click="personJump"
              ></image>
            </view>
            <view class="thread__header__title">
              <view class="thread__header__title__top">
                <span class="thread__header__title__username" @click="personJump">
                  {{ thread.user.username }}
                </span>
                <span
                  class="thread__header__title__isAdmin"
                  v-for="(group, gindex) in thread.user.groups"
                  :key="gindex"
                >
                  （{{ group.name }}）
                </span>
              </view>
              <view class="thread__header__title__time">{{ thread.createdAt }}</view>
            </view>
            <image src="@/static/essence.png" alt class="addFine"></image>
          </view>

          <view class="thread__content" @click="contentClick">
            <view class="thread__content__text">
              <rich-text :nodes="thread.firstPost.contentHtml"></rich-text>
            </view>
          </view>
        </view>
      </view>
      <view v-if="postStatus">
        <!-- 点赞用户列表 -->
        <qui-person-list
          :type="t.giveLike"
          :person-num="post.likeCount"
          :limit-count="limitShowNum"
          :person-list="post.likedUsers"
          :btn-show="false"
          @personJump="personJump"
        ></qui-person-list>
      </view>
      <view class="det-con-ft">
        <view class="det-con-ft-child" @click="deleteReply(post._jv.id, post.canDelete)">
          <qui-icon name="icon-delete" class="qui-icon"></qui-icon>
          <view>{{ t.delete }}</view>
        </view>
        <view
          class="det-con-ft-child"
          @click="commentLikeClick(post._jv.id, post.canLike, post.isLiked)"
        >
          <qui-icon v-if="post.isLiked" name="icon-liked" class="qui-icon"></qui-icon>
          <qui-icon v-else name="icon-like" class="qui-icon"></qui-icon>
          <view class="" v-if="post.isLiked">{{ t.giveLikeAlready }}</view>
          <view class="" v-else>{{ t.giveLike }}</view>
        </view>
        <view class="det-con-ft-child" @click="replyComment(post._jv.id, thread.canReply)">
          <qui-icon name="icon-comments" class="qui-icon"></qui-icon>
          <view>{{ t.reply }}</view>
        </view>
      </view>
      <!-- 评论 -->
      <view class="comment">
        <view class="comment-num">{{ post.replyCount }}{{ t.item }}{{ t.comment }}</view>
        <view v-if="postsStatus">
          <qui-topic-comment
            v-for="(commentPost, index) in post.commentPosts"
            :key="index"
            :post-id="commentPost._jv.id"
            :comment-avatar-url="commentPost.user.avatarUrl"
            :user-name="commentPost.user.username"
            :is-liked="commentPost.isLiked"
            user-role="管理员"
            :comment-time="commentPost.createdAt"
            comment-status="1"
            :comment-content="commentPost.contentHtml"
            :comment-like-count="commentPost.likeCount"
            :images-list="commentPost.images"
            :reply-count="commentPost.replyCount"
            :can-delete="commentPost.canDelete"
            :comment-show="false"
            @personJump="personJump(commentPost.user.id)"
            @commentLikeClick="
              commentLikeClick(commentPost._jv.id, '4', commentPost.canLike, commentPost.isLiked)
            "
            @commentJump="commentJump(commentPost._jv.id)"
            @imageClick="imageClick"
            @deleteComment="deleteComment(commentPost._jv.id)"
          ></qui-topic-comment>
        </view>
      </view>

      <!-- <view>{{ forums.set_site.site_name }}</view> -->

      <uni-popup ref="commentPopup" type="bottom" class="comment-popup-box">
        <view class="comment-popup">
          <view class="comment-popup-top">
            <view class="comment-popup-top-l">
              <qui-icon name="icon-expression" class="comm-icon"></qui-icon>
              <qui-icon name="icon-call" class="comm-icon"></qui-icon>
              <qui-icon name="icon-image" class="comm-icon"></qui-icon>
            </view>
            <view>{{ t.canWrite }}{{ 450 - textAreaValue.length }}{{ t.word }}</view>
          </view>
          <view class="comment-content-box">
            <view class="comment-content">
              <textarea
                ref="commentText"
                auto-height
                focus="true"
                :maxlength="450"
                class="comment-textarea"
                :placeholder="t.writeComments"
                :placeholder-style="placeholderColor"
                v-model="textAreaValue"
              />
            </view>
          </view>
          <qui-button size="100%" type="primary" class="publishBtn" @click="publishClick()">
            {{ t.publish }}
          </qui-button>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
/* eslint-disable */
import { status } from 'jsonapi-vuex';
import lodash from 'lodash';

export default {
  data() {
    return {
      threadId: '',
      commentId: '',
      thread: {},
      post: {},
      loadDetailStatus: {},
      status: false,
      postStatus: false,
      topicStatus: 0, // 0 是不合法 1 是合法 2 是忽略
      posts: {},
      loadDetailCommnetStatus: {},
      postsStatus: false,
      footerShow: true, // 默认显示底部
      commentShow: false, // 显示评论
      textAreaValue: '', // 评论输入框
      placeholderColor: 'color:#b5b5b5', // 默认textarea的placeholder颜色
      isLiked: false, // 主题点赞状态
      role: '管理员',
      isActive: true,
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

      seleShow: false, // 默认收起管理菜单
      selectList: [
        { text: '编辑', type: '0' },
        { text: '精华', type: '2' },
        { text: '置顶', type: '3' },
        { text: '删除', type: '4' },
      ], // 管理菜单

      limitShowNum: 2,
      paidStatus: false, // 是否有已支付数据
      rewardStatus: false, // 是否已有打赏数据
      likedStatus: false, // 是否已有点赞数据
      commentStatus: {}, //回复状态
      commentId: '',
    };
  },
  computed: {
    // thread() {
    //   return this.$store.getters['jv/get']('threads/11');
    // },
    forums() {
      return this.$store.getters['jv/get']('forums/1');
    },
    // postList() {
    //   // console.log(this.$store.getters['jv/get']('posts'));
    //   return this.$store.getters['jv/get']('posts');
    // },
    // 语言包
    t() {
      return this.i18n.t('topic');
    },
  },
  onLoad(option) {
    console.log(option.threadId, '这是回复页接收的主题id');
    console.log(option.commentId, '这是回复页接收的回复id');
    this.threadId = option.threadId;
    this.commentId = option.commentId;
    this.loadPost();
    this.loadThread();
    this.loadThreadPosts();
    // const forums = this.$store.getters['jv/get']('forums/1');
    // console.log(forums);
  },
  methods: {
    // // 加载当前主题数据
    loadPost() {
      const params = {
        'filter[isDeleted]': 'no',
        include: [
          'user',
          'likedUsers',
          'commentPosts',
          'commentPosts.user',
          'commentPosts.user.groups',
          'commentPosts.replyUser',
          'commentPosts.replyUser.groups',
          'commentPosts.mentionUsers',
          'commentPosts.images',
          'images',
          'attachments',
        ],
      };
      this.loadDetailStatus = status.run(() =>
        this.$store.dispatch('jv/get', ['posts/' + this.commentId, { params }]).then(data => {
          console.log(data, '~~~~~~~~~~~~~~~~~~~');
          this.post = data;
          console.log(this.post.likedUsers, '这是点赞列表');
          this.postStatus = true;
        }),
      );
    },
    // 加载当前回复数据
    loadThread() {
      const params = {
        'filter[isDeleted]': 'no',
        include: ['user.groups', 'user', 'firstPost'],
      };
      this.loadDetailStatus = status.run(() =>
        this.$store.dispatch('jv/get', ['threads/' + this.threadId, { params }]).then(data => {
          // console.log(data, '~~~~~~~~~~~~~~~~~~~');
          this.thread = data;
          this.status = true;
        }),
      );
    },

    // post操作调用接口（包括type 1回复点赞，2删除回复，3删除回复的评论，4回复的评论点赞）
    postOpera(id, type, canStatus, isStatus) {
      console.log(id, type, canStatus, isStatus);
      if (type == '1' && !canStatus) {
        console.log('没有主题点赞权限');
        return;
      }
      if (type == '4' && !canStatus) {
        console.log('没有评论点赞权限');
        return;
      }
      const jvObj = {
        type: 'posts',
        id: id,
      };
      let params = {};
      if (type == '1') {
        params = {
          _jv: jvObj,
          isLiked: isStatus === true ? false : true,
        };
      } else if (type == '2') {
        params = {
          _jv: jvObj,
          isDeleted: isStatus === true ? false : true,
        };
      } else if (type == '3') {
        params = {
          _jv: jvObj,
          isDeleted: isStatus === true ? false : true,
        };
      } else if (type == '4') {
        params = {
          _jv: jvObj,
          isLiked: isStatus === true ? false : true,
        };
      }
      this.$store
        .dispatch('jv/patch', params)
        .then(data => {
          console.log(data, 'wwwwwwwwwwwwwwwwwwww');
          if (type == '1') {
            this.isLiked = data.isLiked;
            if (data.isLiked) {
              // 未点赞时，点击点赞'
              // this.thread.firstPost.likedUsers.unshift({
              //   _data: { username: this.currentUserName, id: this.userId }
              // });
              this.post.likeCount = this.thread.firstPost.likeCount + 1;
            } else {
              // this.thread.firstPost.likedUsers.map((value, key, likedUsers) => {
              //   value._data.id === this.userId && likedUsers.splice(key, 1);
              // });
              this.post.likeCount = this.thread.firstPost.likeCount - 1;
            }
          } else if (type == '2') {
            if (data.isDeleted) {
              console.log('跳转到主题详情页');
            } else {
              console.log('当前回复删除失败');
            }
          } else if (type == '3') {
            if (data.isDeleted) {
              console.log('回复的评论删除成功');
            } else {
              console.log('回复的评论删除失败');
            }
          } else if (type == '4') {
            if (isStatus) {
              console.log('点赞数加1');
              data.likeCount = data.likeCount - 1;
            } else {
              console.log('点赞数减1');
              data.likeCount = data.likeCount + 1;
            }
          }
        })
        .catch(err => {
          console.log('1111');
        });
    },

    // 主题回复调用接口
    postComment() {
      const params = {
        _jv: {
          type: 'posts',
          relationships: {
            thread: {
              data: {
                type: 'threads',
                id: this.threadId,
              },
            },
          },
        },
        content: this.textAreaValue,
        isComment: true,
        replyId: this.commentId,
      };
      console.log(params, '传给接口的参数');
      status.run(() => {
        this.$store
          .dispatch('jv/post', params)
          .then(res => {
            this.$refs.commentPopup.close();
            // console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      });
    },

    // 加载当前主题评论的数据
    loadThreadPosts() {
      const params = {
        'filter[isDeleted]': 'no',
        'filter[thread]': 11,
        include: [
          'replyUser',
          'user.groups',
          'user',
          'images',
          'lastThreeComments',
          'lastThreeComments.user',
          'lastThreeComments.replyUser',
        ],
      };
      this.loadDetailCommnetStatus = status.run(() =>
        this.$store.dispatch('jv/get', ['posts', { params }]).then(data => {
          delete data._jv;
          this.posts = data;
          console.log('&&&&&&~~~~~~~~~!', this.posts);
          console.log(123, this.posts[12].user.groups[10].name);
          // Object.getOwnPropertyNames(data).forEach(function(key) {
          //   console.log({ key }, data[key].user.username);
          // });

          this.postsStatus = true;
        }),
      );
    },
    // 对象转数组
    limitArray(obj) {
      const arr = [];
      Object.values(obj).forEach(item => {
        arr.push(item);
      });
      return arr;
    },

    // 跳转到用户主页
    personJump(id) {
      console.log(id, '用户id');
      // uni.navigateTo({
      //   url: '/pages/home/index',
      // });
    },

    // 主题评论点击发布事件
    publishClick() {
      console.log('发布主题评论');
      this.postComment(this.commentId);
    },
    // 评论点赞
    commentLikeClick(postId, type, canStatus, isStatus) {
      console.log(postId, '请求接口，评论点赞');
      this.postOpera(postId, type, canStatus, isStatus);
    },
    // 删除当前回复
    deleteReply(postId, canStatus) {},
    // 删除回复的评论
    deleteComment(postId) {
      console.log(postId, '删除回复postid');
      this.postOpera(postId, '3');
    },
    // 评论的回复
    replyComment(postId, canStatus) {
      if (!canStatus) {
        console.log('没有回复权限');
      } else {
        // this.commentId = postId;
        console.log(postId, '评论回复id');
        this.$refs.commentPopup.open();
      }
    },
    // 点击图片
    imageClick(imageId) {
      console.log(imageId, '图片id');
      this.previewImg();
    },
    // 图片预览
    previewImg() {
      console.log('图片预览');
      // uni.previewImage({
      //   urls: '',
      //   longPressActions: {
      //     itemList: ['发送给朋友', '保存图片', '收藏'],
      //     success: function(data) {
      //       // console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
      //     },
      //     fail: function(err) {
      //       // console.log(err.errMsg);
      //     }
      //   }
      // });
    },

    // 当前回复点赞
    commentLikeClick(postId, canLike, isLiked) {
      console.log(this.thread.firstPost.canLike, '主题点赞');
      this.postOpera(postId, '1', canLike, isLiked);
    },
  },
  mounted() {
    console.log(this.$refs.commentText, '获取的dom');
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

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
  width: 100%;
  padding: 40rpx;
  margin-top: 30rpx;
  box-sizing: border-box;
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
.ft-gap {
  width: 100%;
  margin-bottom: 80rpx;
}
.det-ft {
  position: fixed;
  bottom: 0;
  left: 0;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: --color(--qui-FC-FFF);
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
  .ft-child-word {
    font-size: $fg-f28;
    color: --color(--qui-FC-777);
  }
}
.comment-popup-box {
  width: 100%;
  padding-top: 40rpx;
  background: --color(--qui-FC-FFF);
}
.comment-popup {
  width: 100%;
  background: --color(--qui-FC-FFF);
  border-top-right-radius: 10rpx;
  border-top-left-radius: 10rpx;
  box-sizing: border-box;
}
.comment-popup-top {
  display: flex;
  flex-direction: row;
  padding: 40rpx 40rpx 20rpx;
  .comment-popup-top-l {
    flex: 1;
    display: flex;
    flex-direction: row;
  }
  .comm-icon {
    flex: 1;
  }
}
.comment-content-box {
  padding: 0 40rpx 30rpx;
  .comment-content {
    width: 100%;
    height: 400rpx;
    padding: 20rpx;
    background: --color(--qui-FC-GRAY);
    border: 1px solid --color(--qui-FC-DDD);
    border-radius: 10rpx;
    box-sizing: border-box;
  }
  .comment-textarea {
    font-size: $fg-f28;
    line-height: 37rpx;
  }
}
.publishBtn {
  width: 100%;
}

.popup-share {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  background: --color(--qui-BG-2);
}
.popup-share-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 250rpx;
  padding-top: 40rpx;
  padding-right: 97rpx;
  padding-left: 98rpx;
  background: --color(--qui-BG-BTN-GRAY-1);
  // padding: 15px;
}
.popup-share-box {
  width: 120rpx;
  height: 120rpx;
  line-height: 120rpx;
  background: --color(--qui-BG-2);
  border-radius: 10px;
}
.popup-share-content-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  width: 120rpx;
  height: 164rpx;
  // background: --color(--qui-BG-2);
}
.popup-share-content-image {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  // align-items: center;
  width: 120rpx;
  height: 120rpx;
  overflow: hidden;
  border-radius: 10rpx;
}
.content-image {
  width: 60rpx;
  height: 60rpx;
  margin: 35rpx;
  line-height: 60rpx;
}
.popup-share-content-text {
  padding-top: 5px;
  font-size: $fg-f26;
  color: #333;
}
.popup-share-btn {
  height: 100rpx;
  font-size: $fg-f28;
  line-height: 90rpx;
  color: #666;
  text-align: center;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}
.popup-share-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-FC-DDD);
}
.thread-box {
  padding: 80rpx 40rpx;
}
.thread {
  padding: 20rpx;
  background: --color(--qui-BG-ED);
  border-radius: 5rpx;
  &__header {
    position: relative;
    display: flex;
    width: 100%;
    height: 80rpx;
    margin-bottom: 12rpx;
    &__img {
      width: 80rpx;
      height: 80rpx;
      margin-right: 18rpx;
      background: #ccc;
      border-radius: 100%;

      image {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }

    &__title {
      flex: 1;

      &__top {
        height: 37rpx;
        margin-left: 2rpx;
        font-family: $font-family;
        font-size: 28rpx;
        line-height: 37rpx;
      }

      &__username {
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }

      &__isAdmin {
        margin-left: 13rpx;
        font-weight: 400;
        color: rgba(170, 170, 170, 1);
      }

      &__time {
        font-size: 24rpx;
        font-weight: 400;
        line-height: 31rpx;
        color: rgba(170, 170, 170, 1);
      }

      &__jumpBtn {
        float: right;
        width: 10rpx;
        height: 37rpx;
        font-size: 10rpx;
        line-height: 37rpx;
        color: #ddd;
      }
      &__deleteBtn {
        float: right;
      }
      &__reward {
        float: right;
        font-size: 28rpx;
        font-weight: bold;
        color: --color(--qui-RED);
      }
    }
  }
}
.addFine {
  position: absolute;
  top: -25rpx;
  right: 0;
  width: 31rpx;
  height: 41rpx;
}
</style>
