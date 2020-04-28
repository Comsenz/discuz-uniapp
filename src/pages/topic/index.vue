<template>
  <view class="content bg" v-if="status">
    <view class="ft-gap">
      <view class="detail-tip" v-if="topicStatus == 0">{{ t.examineTip }}</view>
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
        @personJump="personJump"
      ></qui-topic-content>
      <!-- 已支付用户列表 -->
      <view v-if="paidStatus">
        <qui-person-list
          :type="t.pay"
          :person-num="thread.paidCount"
          :limit-count="limitShowNum"
          :person-list="thread.paidUsers"
          :btn-show="true"
          :btn-icon-show="true"
          btn-icon-name="rmb"
          btn-text="t.paymentViewPicture"
          @personJump="personJump"
          @btnClick="payClick"
        ></qui-person-list>
      </view>
      <!-- 打赏用户列表 -->
      <view v-if="rewardStatus">
        <qui-person-list
          :type="t.reward"
          :person-num="thread.rewardedCount"
          :limit-count="limitShowNum"
          :person-list="thread.rewardedUsers"
          :btn-show="true"
          :btn-icon-show="true"
          btn-icon-name="rmb"
          :btn-text="t.reward"
          @personJump="personJump"
          @btnClick="rewardClick"
        ></qui-person-list>
      </view>
      <view v-if="likedStatus">
        <!-- 点赞用户列表 -->
        <qui-person-list
          :type="t.giveLike"
          :person-num="thread.firstPost.likeCount"
          :limit-count="limitShowNum"
          :person-list="thread.firstPost.likedUsers"
          :btn-show="false"
          @personJump="personJump"
        ></qui-person-list>
      </view>
      <view class="det-con-ft">
        <view class="det-con-ft-child">{{ t.read }}{{ thread.viewCount }}</view>
        <view
          class="det-con-ft-child"
          @click="
            threadCollectionClick(
              thread.firstPost._jv.id,
              thread.canFavorite,
              thread.isFavorite,
              '1',
            )
          "
        >
          <qui-icon v-if="thread.isFavorite" name="icon-collectioned" class="qui-icon"></qui-icon>

          <qui-icon v-else name="icon-collection" class="qui-icon"></qui-icon>
          <view v-if="thread.isFavorite">{{ t.collectionAlready }}</view>
          <view v-else>{{ t.collection }}</view>
        </view>
      </view>
      <!-- 评论 -->
      <view class="comment">
        <view class="comment-num">{{ thread.postCount }}{{ t.item }}{{ t.comment }}</view>
        <view v-if="postsStatus">
          <qui-topic-comment
            v-for="(post, index) in posts"
            :key="index"
            :post-id="post._jv.id"
            :comment-avatar-url="post.user.avatarUrl"
            :user-name="post.user.username"
            :is-liked="post.isLiked"
            user-role="管理员"
            :comment-time="post.createdAt"
            comment-status="1"
            :comment-content="post.contentHtml"
            :reply-list="post.lastThreeComments"
            :comment-like-count="post.likeCount"
            :images-list="post.images"
            :reply-count="post.replyCount"
            @personJump="personJump(post.user.id)"
            @commentLikeClick="commentLikeClick(post._jv.id, post.canLike)"
            @commentJump="commentJump(post._jv.id)"
            @imageClick="imageClick"
            @delete-comment="deleteComment(post._jv.id)"
          ></qui-topic-comment>
          <!-- <view v-for="(post, index) in posts" :key="index">
          {{ post.likeCount }}
          <view v-for="(group, gindex) in post.user.groups" :key="gindex">{{ group.name }}</view>
        </view> -->
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
    <view class="det-ft flex" v-if="footerShow">
      <view
        class="det-ft-child flex"
        @click="
          threadLikeClick(
            thread.firstPost._jv.id,
            thread.firstPost.canLike,
            thread.firstPost.isLiked,
          )
        "
      >
        <qui-icon v-if="isLiked" name="icon-liked" class="qui-icon"></qui-icon>
        <qui-icon v-else name="icon-like" class="qui-icon"></qui-icon>
        <view class="ft-child-word" v-if="isLiked">{{ t.giveLikeAlready }}</view>
        <view class="ft-child-word" v-else>{{ t.giveLike }}</view>
      </view>
      <view class="det-ft-child flex" @click="threadComment">
        <qui-icon name="icon-comments" class="qui-icon"></qui-icon>
        <view class="ft-child-word">{{ t.writeComment }}</view>
      </view>
      <view class="det-ft-child flex" @click="shareClick">
        <qui-icon name="icon-share" class="qui-icon"></qui-icon>
        <view class="ft-child-word">{{ t.share }}</view>
      </view>
    </view>
    <uni-popup ref="sharePopup" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="36"
                  color="#777777"
                  @click="handleClick"
                ></qui-icon>
              </view>
              <!-- <image :src="item.icon" class="content-image" mode="widthFix" /> -->
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
/* eslint-disable */
import { status } from 'jsonapi-vuex';
import lodash from 'lodash';

export default {
  data() {
    return {
      thread: {},
      loadDetailStatus: {},
      status: false,
      topicStatus: 0, // 0 是不合法 1 是合法 2 是忽略
      posts: {},
      loadDetailCommnetStatus: {},
      postsStatus: false,
      footerShow: true, // 默认显示底部
      commentShow: false, // 显示评论
      textAreaValue: '', // 评论输入框
      placeholderColor: 'color:#b5b5b5', // 默认textarea的placeholder颜色
      isLiked: false, // 主题点赞状态
      username: 'admin',
      time: '16分钟前',
      role: '管理员',
      replyStatus: '审核中',
      content: '内容内容内容,内容内容内容内容内容内容内容内容内容,内容内容内容内容内容...',
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
      tagList: [
        { tag: '女神视频1' },
        { tag: '女神视频22' },
        { tag: '女神视频333' },
        { tag: '女神视频4444' },
      ],
      seleShow: false, // 默认收起管理菜单
      selectList: [
        { text: '编辑', type: '1' },
        { text: '精华', type: '2' },
        { text: '删除', type: '3' },
        { text: '置顶', type: '4' },
      ], // 管理菜单

      limitShowNum: 2,
      paidStatus: false, // 是否有已支付数据
      rewardStatus: false, // 是否已有打赏数据
      likedStatus: false, // 是否已有点赞数据
      commentStatus: {},
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
    console.log(option.id);
    this.loadThreads();
    this.loadThreadPosts();
    // const forums = this.$store.getters['jv/get']('forums/1');
    // console.log(forums);
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
      this.loadDetailStatus = status.run(() =>
        this.$store.dispatch('jv/get', ['threads/11', { params }]).then(data => {
          console.log(data, '~~~~~~~~~~~~~~~~~~~');
          this.thread = data;
          this.isLiked = data.firstPost.isLiked;
          this.status = true;
          this.topicStatus = data.isApproved;
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
    // 主题点赞调用接口
    handleIsGreat(id, canLike, isLiked) {
      console.log(id, canLike, isLiked);
      if (!canLike) {
        console.log('没有点赞权限');
      }
      // console.log(id, canLike, isLiked);
      const params = {
        _jv: {
          type: 'posts',
          id: id,
        },
        isLiked: isLiked === true ? false : true,
      };

      this.$store
        .dispatch('jv/patch', params)
        .then(data => {
          console.log(data);
          console.log('点赞请求接口成功呢');
          if (data.isLiked) {
            // 未点赞时，点击点赞'
            // this.thread.firstPost.likedUsers.unshift({
            //   _data: { username: this.currentUserName, id: this.userId }
            // });
            this.thread.firstPost.likeCount = this.thread.firstPost.likeCount + 1;
          } else {
            // this.thread.firstPost.likedUsers.map((value, key, likedUsers) => {
            //   value._data.id === this.userId && likedUsers.splice(key, 1);
            // });
            this.thread.firstPost.likeCount = this.thread.firstPost.likeCount - 1;
          }
          this.isLiked = data.isLiked;
        })
        .catch(err => {
          console.log('1111');
        });
    },
    // 主题其他操作调用接口（包括收藏）
    threadOpera(id, canStatus, isStatus, type) {
      console.log(id, canStatus, isStatus);
      if (!canStatus) {
        if (type == '1') {
          console.log('没有收藏权限');
        }
      }
      const params = {
        _jv: {
          type: 'threads',
          id: id,
        },
        isFavorite: isStatus === true ? false : true,
      };

      this.$store
        .dispatch('jv/patch', params)
        .then(data => {
          console.log(data);
          console.log('请求操作接口成功呢');
          // 当type为1时，表示类型是收藏
          if (type == '1') {
            this.isFavorite = data.isFavorite;
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
                id: 11,
              },
            },
          },
        },
        content: this.textAreaValue,
      };
      this.commentStatus = status.run(() => {
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
      console.log(id, '用户id');
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
    // 主题评论点击发布事件
    publishClick() {
      console.log('发布主题评论');
      this.postComment();
    },
    // 跳转到评论详情页
    commentJump(postId) {
      console.log(postId, 'postId跳转到评论详情页');
      // uni.navigateTo({
      //   url: '',
      // });
    },
    // 评论点赞
    commentLikeClick(postId, likeStatus) {
      if (!likeStatus) {
        console.log('没有点赞权限');
      } else {
        console.log(postId, '请求接口，评论点赞');
      }
    },
    // 删除主题
    deleteComment(postId) {
      console.log(postId, 'postid');
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

    // 主题点赞
    threadLikeClick(postId, canLike, isLiked) {
      console.log(this.thread.firstPost.canLike, '主题点赞');
      this.handleIsGreat(postId, canLike, isLiked);
    },
    // 主题收藏
    threadCollectionClick(id, canStatus, isStatus, type) {
      console.log('主题收藏');
      this.threadOpera(id, canStatus, isStatus, type);
    },
    // 主题回复
    threadComment() {
      if (!this.thread.canReply) {
        console.log('没有回复权限');
      } else {
        console.log('主题回复');
        this.$refs.commentPopup.open();
      }
    },
    // 分享
    shareClick() {
      this.$refs.sharePopup.open();
    },
    // 取消分享
    cancel() {
      this.$refs.sharePopup.close();
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
</style>
