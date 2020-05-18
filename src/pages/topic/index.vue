<template>
  <qui-page class="content bg" v-if="status[loadDetailStatusId]">
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      show-scrollbar="false"
      :scroll-top="scrollTopNum"
      class="scroll-y"
      @scrolltolower="pullDown"
      @scrolltoupper="toUpper"
    >
      <view class="ft-gap">
        <view class="detail-tip" v-if="topicStatus == 0">{{ t.examineTip }}</view>
        <qui-topic-content
          v-model="thread"
          :pay-status="thread.price > 0 && thread.paid"
          :avatar-url="thread.user.avatarUrl"
          :user-name="thread.user.username"
          :theme-type="thread.type"
          :theme-time="thread.createdAt"
          :management-show="true"
          :theme-content="thread.firstPost.contentHtml"
          :images-list="thread.firstPost.images"
          :select-list="selectList"
          :tags="[thread.category]"
          :thread-price="thread.price"
          :media-url="thread.threadVideo.media_url"
          :cover-image="thread.threadVideo.cover_url"
          @personJump="personJump"
          @selectChoice="selectChoice"
        ></qui-topic-content>
        <!-- <qui-button size="max" type="primary" class="publishBtn" @tap="payClickShow()">
        {{ p.pay }}
      </qui-button> -->
        <!-- 已支付用户列表 -->
        <view v-if="paidStatus">
          <qui-person-list
            :type="t.pay"
            :person-num="thread.paidCount"
            :limit-count="limitShowNum"
            :person-list="thread.paidUsers"
            :btn-show="thread.price > 0 && !thread.paid"
            :btn-icon-show="true"
            btn-icon-name="rmb"
            :btn-text="payThreadTypeText"
            @personJump="personJump"
            @btnClick="payClickShow"
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
            btn-icon-name="reward"
            :btn-text="t.reward"
            @personJump="personJump"
            @btnClick="rewardClick"
          ></qui-person-list>
        </view>
        <view v-if="thread.firstPost.likeCount > 0">
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
              threadCollectionClick(thread._jv.id, thread.canFavorite, thread.isFavorite, '1')
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
          <view class="comment-num" v-if="thread.postCount > 1">
            {{ thread.postCount - 1 }}{{ t.item }}{{ t.comment }}
          </view>

          <view v-if="status[loadDetailCommnetStatusId]">
            <view v-for="(post, index) in posts" :key="index">
              <qui-topic-comment
                v-if="!post.isDeleted"
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
                :can-delete="post.canDelete"
                :comment-show="true"
                @personJump="personJump(post.user.id)"
                @commentLikeClick="
                  commentLikeClick(post._jv.id, '4', post.canLike, post.isLiked, index)
                "
                @commentJump="commentJump(threadId, post._jv.id)"
                @imageClick="imageClick"
                @deleteComment="deleteComment(post._jv.id, '3', post.canHide, post.isDeleted)"
                @replyComment="replyComment(post._jv.id, index)"
              ></qui-topic-comment>
            </view>
            <!--<view v-for="(post, index) in posts" :key="index">
            {{ post.likeCount }}
            <view v-for="(group, gindex) in post.user.groups" :key="gindex">{{ group.name }}</view>
          </view>-->
          </view>
        </view>

        <!-- <view>{{ forums.set_site.site_name }}</view> -->
        <!--回复弹框-->
        <uni-popup ref="commentPopup" type="bottom" class="comment-popup-box">
          <view class="comment-popup">
            <view class="comment-popup-topbox">
              <view class="comment-popup-top">
                <view class="comment-popup-top-l">
                  <qui-icon
                    name="icon-expression"
                    class="comm-icon"
                    @click="emojiShow = !emojiShow"
                  ></qui-icon>
                  <qui-icon name="icon-call" class="comm-icon" @click="callClick"></qui-icon>
                  <qui-icon name="icon-image" class="comm-icon" @click="imageUploader"></qui-icon>
                </view>
                <view class="text-word-tip">
                  {{ t.canWrite }}{{ 450 - textAreaValue.length }}{{ t.word }}
                </view>
              </view>
              <qui-emoji
                :list="allEmoji"
                position="absolute"
                top="110rpx"
                v-if="emojiShow"
                border-radius="10rpx"
                @click="getEmojiClick"
              ></qui-emoji>
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
                  :placeholder-style="placeholderStyle"
                  placeholder-class="text-placeholder"
                  v-model="textAreaValue"
                  @blur="contBlur"
                />
                <qui-uploader
                  v-if="uploaderShow"
                  url="https://dq.comsenz-service.com/api/attachments"
                  :header="header"
                  :form-data="formData"
                  :count="3"
                  async-clear
                  ref="upload"
                  @change="uploadChange"
                  @clear="uploadClear"
                ></qui-uploader>
              </view>
            </view>
            <!--<qui-button size="100%" type="primary" class="publishBtn" @click="publishBtn()">
            {{ t.publish }}
          </qui-button>-->
            <button class="publishBtn" @click="publishClick()">
              {{ t.publish }}
            </button>
          </view>
        </uni-popup>
      </view>
      <!--详情页底部-->
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
          <qui-icon
            :name="thread.firstPost.isLiked ? 'icon-liked' : 'icon-like'"
            class="qui-icon"
          ></qui-icon>
          <view class="ft-child-word">
            {{ thread.firstPost.isLiked ? t.giveLikeAlready : t.giveLike }}
          </view>
        </view>
        <view class="det-ft-child flex" @click="threadComment(thread._jv.id)">
          <qui-icon name="icon-comments" class="qui-icon"></qui-icon>
          <view class="ft-child-word">{{ t.writeComment }}</view>
        </view>
        <view class="det-ft-child flex" @click="shareClick">
          <qui-icon name="icon-share" class="qui-icon"></qui-icon>
          <view class="ft-child-word">{{ t.share }}</view>
        </view>
      </view>
      <!--分享弹框-->
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
          <text class="popup-share-btn" @click="cancel('share')">{{ c.cancel }}</text>
        </view>
      </uni-popup>
      <!--打赏选择金额弹框-->
      <uni-popup ref="rewardPopup" type="bottom">
        <view class="popup-share">
          <view class="popup-reward-content">
            <text class="popup-title">
              {{ t.supportTheAuthorToCreate }}
            </text>
            <view class="popup-content-btn">
              <qui-button
                class="popup-btn"
                v-for="(item, index) in payNum"
                :key="index"
                :type="payNumCheck[0].name === item.name ? 'primary' : 'default'"
                plain
                size="post"
                @click="moneyClick(index)"
              >
                {{ item.name }}
              </qui-button>
            </view>
          </view>
          <view class="popup-share-content-space"></view>
          <text class="popup-share-btn" @click="cancel()">{{ i18n.t('discuzq.post.cancel') }}</text>
        </view>
      </uni-popup>
      <!--自定义打赏金额弹框-->
      <uni-popup ref="customAmountPopup" type="center">
        <view class="popup-dialog">
          <view class="popup-dialog__top">
            <text>
              {{ t.enterTheRewardPaymeAmount }}
            </text>
          </view>
          <view class="popup-dialog__cont">
            <qui-icon class="popup-dialog__cont-rmb" name="icon-rmb" size="40"></qui-icon>
            <input
              class="popup-dialog__cont-input"
              v-model="inputPrice"
              type="digit"
              placeholder="0.0"
              focus
            />
          </view>
          <view class="popup-dialog__ft">
            <button class="popup-btn--close" @click="diaLogClose">
              {{ i18n.t('discuzq.close') }}
            </button>
            <button class="popup-btn--ok" @click="diaLogOk">{{ i18n.t('discuzq.ok') }}</button>
          </view>
        </view>
      </uni-popup>

      <!--支付组件-->
      <view v-if="payShowStatus">
        <qui-pay
          ref="payShow"
          :money="price"
          :wallet-status="true"
          :pay-password="pwdVal"
          balance="10"
          :pay-type-data="payTypeData"
          :to-name="thread.user.username"
          :pay-type="payTypeText"
          @radioMyHead="radioMyHead"
          @radioChange="radioChange"
          @onInput="onInput"
          @paysureShow="paysureShow"
        ></qui-pay>
      </view>
      <!--遮罩层组件-->
      <qui-loading-cover v-if="coverLoading" mask-zindex="11"></qui-loading-cover>
      <!--轻提示-->
      <qui-toast ref="toast"></qui-toast>
      <qui-load-more :status="loadingType"></qui-load-more>
    </scroll-view>
  </qui-page>
</template>

<script>
/* eslint-disable */
import { status, utils } from '@/library/jsonapi-vuex/index';
import { isEmpty } from 'lodash';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      threadId: '', //主题id
      userId: 57, //当前用户Id
      // userInfo: '', //当前用户信息
      // thread: {}, //主题数据
      loadDetailStatusId: 0, // 主题接口请求状态
      topicStatus: 0, // 0 是不合法 1 是合法 2 是忽略
      posts: [], //评论列表数据
      loadingType: 'more', // 上拉加载状态
      pageNum: 1, //这是主题回复当前页数
      pageSize: 5, //这是主题回复每页数据条数
      payThreadTypeText: '', // 主题支付类型不同，支付按钮文字显示不同的支付提示
      loadDetailCommnetStatusId: 0,
      postIndex: '', //点击主题评论时的index
      footerShow: true, // 默认显示底部
      commentShow: false, // 显示评论
      cursor: 0, // 光标位置
      textAreaValue: '', // 评论输入框
      uploadFile: [], //上传的文件
      placeholderStyle: 'color:#b5b5b5', // 默认textarea的placeholder颜色
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
      ], //分享方式

      seleShow: false, // 默认收起管理菜单
      selectList: [
        { text: this.i18n.t('topic.edit'), type: '0' },
        { text: this.i18n.t('topic.essence'), type: '2' },
        { text: this.i18n.t('topic.sticky'), type: '3' },
        { text: this.i18n.t('topic.delete'), type: '4' },
      ], // 管理菜单

      limitShowNum: 5,
      paidStatus: false, // 是否有已支付数据
      rewardStatus: false, // 是否已有打赏数据
      likedStatus: false, // 是否已有点赞数据
      commentStatus: {}, //回复状态
      commentReply: false, //发布的是否是回复的回复
      emojiShow: false, //表情组件显示状态
      uploaderShow: false, //图片上传组件显示状态
      header: {},
      formData: {}, //请求头部
      commentId: '', //评论id
      postIndex: '', //点击时当前评论Index
      isAnonymous: '0', //支付时是否显示头像，默认不显示
      payTypeText: '支付',
      payTypeVal: '', //点击的支付类型， 0主题支付  1主题打赏
      payNum: [
        {
          name: '￥1',
          pay: 1,
        },
        {
          name: '￥2',
          pay: 2,
        },
        {
          name: '￥5',
          pay: 5,
        },
        {
          name: '￥10',
          pay: 10,
        },
        {
          name: '￥20',
          pay: 20,
        },
        {
          name: '￥50',
          pay: 50,
        },
        {
          name: '￥88',
          pay: 88,
        },
        {
          name: '￥128',
          pay: 128,
        },
        {
          name: this.i18n.t('discuzq.post.customize'),
          pay: 0,
        },
      ], // 打赏金额数组列表
      payNumCheck: [
        {
          name: '￥1',
          pay: 1,
        },
      ],
      price: 0.0, //需要支付的金额
      inputPrice: '', //自定义金额输入框的值
      payShowStatus: true, //是否显示支付
      pwdVal: '123456', //支付密码
      orderSn: '', //订单编号
      payStatus: false, //订单支付状态
      payStatusNum: 0, // 订单支付状态查询最大次数
      coverLoading: false, // loading显示状态
      payTypeData: [
        {
          name: '微信支付',
          icon: 'icon-wxPay',
          color: '#09bb07',
          value: '0',
        },
        {
          name: '钱包支付',
          icon: 'icon-walletPay',
          color: '#1878f3',
          value: '1',
        },
      ], //支付方式
      currentReplyPost: {},
    };
  },
  computed: {
    ...mapState({
      getAtMemberData: state => state.atMember.atMemberData,
    }),
    thread() {
      const threadId = this.threadId;
      return utils.deepCopy(this.$store.getters['jv/get'](`threads/${threadId}`));
      // return this.$store.getters['jv/get']('threads/'+this.threadId);
    },
    // forums() {
    //   return this.$store.getters['jv/get']('forums/1');
    // },
    // posts() {
    //   // console.log(this.$store.getters['jv/get']('posts'));
    //   const posts = this.$store.getters['jv/get']('posts', '{ _jv: { type: "threads", id: "48" }');
    //   return posts;
    // },

    allEmoji() {
      return this.$store.getters['jv/get']('emoji');
    },
    // userInfo() {
    //   return this.$store.getters['jv/get']('users/1');
    // },
    //   const thread = this.$store.getters['jv/get']({ _jv: { type: "threads", id: this.threadId}});

    //   // console.log(thread.posts, 'posts');
    //   return thread.posts;
    // },
    // 语言包
    // topic详情页语言包
    t() {
      return this.i18n.t('topic');
    },
    // pay支付语言包
    p() {
      return this.i18n.t('pay');
    },
    // core公共变量语言包
    c() {
      return this.i18n.t('p');
    },
    status() {
      return status.status;
    },
  },
  onLoad(option) {
    console.log(this.user, '这是用户信息~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log(option, '这是详情页接收的id');
    this.threadId = option.id;
    // this.threadId = 188;
    this.loadThread();
    this.loadThreadPosts();
    console.log(this.allEmoji, '!!~~~~');
    if (Object.keys(this.allEmoji).length < 1) {
      this.getEmoji();
    }
    // this.getUser();
    const token = uni.getStorageSync('access_token');
    this.header = {
      authorization: `Bearer ${token}`,
    };
    this.formData = {
      isGallery: 1,
    };
    // const forums = this.$store.getters['jv/get']('forums/1');
    // console.log(forums);
  },
  onShow() {
    // let authTimeout = setTimeout(() => {
    //   if (!this.$store.getters['session/get']('isLogin')) {
    //     this.$store.getters['session/get']('auth').open();
    //   }
    //   clearTimeout(authTimeout);
    // }, 4000);
    console.log(this.getAtMemberData, '~~~~!!@!!');
    let atMemberList = '';
    this.getAtMemberData.map(item => {
      atMemberList += `@${item.username} `;
      return atMemberList;
    });

    this.textAreaValue = `${this.textAreaValue.slice(0, this.cursor) +
      atMemberList +
      this.textAreaValue.slice(this.cursor)}`;
  },
  methods: {
    // 表情接口请求
    getEmoji() {
      this.$store.dispatch('jv/get', ['emoji', {}]);
    },
    // 用户信息
    // getUser() {
    //   this.$store.dispatch('jv/get', ['users/' + this.userId, {}]).then(data => {
    //     console.log(data, '这是当前用户数据');
    //     this.userInfo = data;
    //   });
    // },
    // 加载当前主题数据
    loadThread() {
      const params = {
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
      const threadAction = status.run(() =>
        this.$store.dispatch('jv/get', ['threads/' + this.threadId, { params }]),
      );

      this.loadDetailStatusId = threadAction._statusID;

      threadAction.then(data => {
        console.log(data, '~~~~~~~~~~~~~~~~~~~');
        console.log(this.thread.type);
        // this.thread = data;
        // 追加管理菜单权限字段
        this.selectList[0].canOpera = this.thread.firstPost.canEdit;
        this.selectList[1].canOpera = this.thread.canEssence;
        this.selectList[2].canOpera = this.thread.canSticky;
        this.selectList[3].canOpera = this.thread.canDelete;
        this.selectList[0].canOpera = true;
        this.selectList[1].isStatus = this.thread.isEssence;
        this.selectList[2].isStatus = this.thread.isSticky;
        this.selectList[3].isStatus = false;
        console.log(this.selectList, '管理菜单数据');
        if (data.isEssence) {
          //如果初始化状态为true
          this.selectList[1].text = this.c.cancelEssence;
        }
        if (data.isSticky) {
          //如果初始化状态为true
          this.selectList[2].text = this.c.cancelSticky;
        }
        this.isLiked = data.firstPost.isLiked;
        this.topicStatus = data.isApproved;
        // console.log(isEmpty(data.paidUsers));
        if (!data.paid || data.paidUsers.length > 0) {
          this.paidStatus = true;
        } else {
          this.paidStatus = false;
        }
        if (data.type == 3) {
          this.payThreadTypeText = this.t.pay + data.price + this.t.paymentViewPicture;
        } else if (data.type == 2) {
          this.payThreadTypeText = this.t.pay + data.price + this.t.paymentViewRemainingContent;
        } else if (data.type == 1) {
          this.payThreadTypeText = this.t.pay + data.price + this.t.paymentViewVideo;
        }
        // if (isEmpty(data.rewardedUsers)) {
        //   this.rewardStatus = false;
        // } else {
        //   this.rewardStatus = true;
        // }
        if (data.price <= 0) {
          this.rewardStatus = true;
        } else if (data.price > 0 && data.paid) {
          this.rewardStatus = true;
        }
        if (isEmpty(data.firstPost.likedUsers)) {
          this.likedStatus = false;
        } else {
          this.likedStatus = true;
        }
      });
    },
    // post操作调用接口（包括type 1点赞，2删除主题，3删除回复，4回复点赞）
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
          isLiked: !isStatus,
        };
      } else if (type == '2') {
        params = {
          _jv: jvObj,
          isDeleted: !isStatus,
        };
      } else if (type == '3') {
        params = {
          _jv: jvObj,
          isDeleted: !isStatus,
        };
      } else if (type == '4') {
        params = {
          _jv: jvObj,
          isLiked: !isStatus,
        };
      }
      this.$store
        .dispatch('jv/patch', params)
        .then(data => {
          console.log(data, 'wwwwwwwwwwwwwwwwwwww');
          if (type == '1') {
            // 主题点赞
            this.isLiked = data.isLiked;
            if (data.isLiked) {
              // 未点赞时，点击点赞'

              console.log('主题未点赞时，点击点赞');
              console.log(this.thread.firstPost.likedUsers);
              this.thread.firstPost.likedUsers.unshift(this.user);
              this.thread.firstPost.likeCount++;
            } else {
              console.log('主题已点赞时，取消点赞');
              likedUsers.splice(likedUsers.indexOf(this.user), 1);
              console.log(this.thread.firstPost.likedUsers);
              this.thread.firstPost.likeCount--;
            }
          } else if (type == '2') {
            if (data.isDeleted) {
              console.log('跳转到首页');
              uni.navigateTo({
                url: `/pages/home/index`,
              });
            } else {
              console.log('主题删除失败');
            }
          } else if (type == '3') {
            if (data.isDeleted) {
              console.log('回复删除成功');
            } else {
              console.log('回复删除失败');
            }
          } else if (type == '4') {
            // 评论点赞
            if (data.isLiked) {
              console.log('点赞数加1');
            } else {
              console.log('点赞数减1');
            }
          }
        })
        .catch(err => {
          console.log('1111');
        });
    },
    // 主题其他操作调用接口（包括 type 1主题收藏，2主题加精，3主题置顶）
    threadOpera(id, canStatus, isStatus, type) {
      console.log(id, canStatus, isStatus, type);
      if (!canStatus) {
        if (type == '1') {
          console.log('没有收藏权限');
        }
      }
      const jvObj = {
        type: 'threads',
        id: id,
      };
      let params = {};
      if (type == '1') {
        // 主题收藏
        params = {
          _jv: jvObj,
          isFavorite: !isStatus,
        };
      } else if (type == '2') {
        // 主题加精
        params = {
          _jv: jvObj,
          isEssence: !isStatus,
        };
      } else if (type == '3') {
        // 主题置顶
        params = {
          _jv: jvObj,
          isSticky: !isStatus,
        };
      } else {
        // 主题删除
        params = {
          _jv: jvObj,
          isDeleted: !isStatus,
        };
      }
      console.log(params, '接口接收的参数');
      this.$store
        .dispatch('jv/patch', params)
        .then(data => {
          console.log(data);
          console.log('请求主题操作接口成功');
          if (type == '1') {
            this.thread.isFavorite = data.isFavorite;
          } else if (type == '2') {
            this.selectList[1].isStatus = data.isEssence;
            if (data.isEssence) {
              this.selectList[1].text = this.c.essence;
            } else {
              this.selectList[1].text = this.c.cancelEssence;
            }
          } else if (type == '3') {
            this.selectList[2].isStatus = data.isSticky;
            if (data.isSticky) {
              this.selectList[2].text = this.c.cancelSticky;
            } else {
              this.selectList[2].text = this.c.sticky;
            }
          } else if (type == '4') {
            // if (data.isDeleted) {
            console.log('删除成功，跳转到首页');
            uni.navigateTo({
              url: `/pages/home/index`,
            });
            // }
          }
        })
        .catch(err => {
          console.log('1111');
        });
    },
    // 主题回复，评论的回复调用接口
    postComment() {
      if (this.textAreaValue.length < 1) {
        this.$refs.toast.show({ message: this.t.replyContentCannotBeEmpty });
        return false;
      }
      let params = {};
      if (this.commentReply) {
        params = {
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
      } else {
        params = {
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
        };
        params._jv.relationships.attachments = {
          data: [],
        };
        if (this.uploadFile) {
          this.uploadFile.forEach(item => {
            params._jv.relationships.attachments.data.push({
              type: 'attachments',
              id: item.data.id,
            });
          });
        }
      }

      console.log(params, '传给接口的参数');
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          this.$refs.commentPopup.close();
          if (!res.isComment) {
            this.posts.unshift(res);
          } else {
            res.replyUser = this.currentReplyPost.user;
            this.currentReplyPost.lastThreeComments.unshift(res);
          }
          this.textAreaValue = '';
          this.uploadFile = '';
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 加载当前主题评论的数据
    loadThreadPosts() {
      const params = {
        'filter[isDeleted]': 'no',
        'filter[isComment]': 'no',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[thread]': this.threadId,
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
      let loadDetailCommnetAction = status.run(() =>
        this.$store.dispatch('jv/get', ['posts', { params }]),
      );

      this.loadDetailCommnetStatusId = loadDetailCommnetAction._statusID;
      loadDetailCommnetAction.then(data => {
        delete data._jv;
        this.loadingType = data.length === this.pageSize ? 'more' : 'nomore';
        // this.posts = [...this.posts, ...data];
        this.posts = data;
        console.log(this.posts, '这是主题评论列表！！！@@@@@');
      });
    },

    // 创建订单
    creatOrder(amount, type, value, payType) {
      console.log('创建订单', '这是参数', payType);
      const params = {
        _jv: {
          type: 'orders',
        },
        type: type,
        thread_id: this.threadId,
        amount: amount,
        is_anonymous: this.isAnonymous,
      };
      console.log(params, '传给接口的参数');
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          console.log(res, '成功创建订单', typeof payType, '这是支付类型');
          this.orderSn = res.order_sn;
          if (payType == 0) {
            // 微信支付
            this.orderPay(13, value, this.orderSn, payType);
          } else if (payType == 1) {
            // 钱包支付
            console.log(type, value, this.orderSn, '这是参数');

            this.orderPay(20, value, this.orderSn, payType);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 订单支付
    orderPay(type, value, orderSn, payType) {
      console.log('订单支付');
      let params = {};
      if (payType == 0) {
        console.log('这是微信支付时触发');
        params = {
          _jv: {
            type: 'trade/pay/order/' + orderSn,
          },
          payment_type: type,
        };
      } else if (payType == 1) {
        params = {
          _jv: {
            type: 'trade/pay/order/' + orderSn,
          },
          payment_type: type,
          pay_password: value,
        };
      }

      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          console.log(res, '订单支付接口请求成功');
          if (payType == 0) {
            console.log('这是微信支付时触发');
            this.wechatPay(
              res.wechat_js.timeStamp,
              res.wechat_js.nonceStr,
              res.wechat_js.package,
              res.wechat_js.signType,
              res.wechat_js.paySign,
            );
          } else if (payType == 1) {
            this.getOrderStatus(orderSn);
            const payWechat = setInterval(() => {
              if (this.payStatus == '1' || this.payStatusNum > 10) {
                clearInterval(payWechat);
                return;
              }
              this.getOrderStatus(orderSn);
            }, 3000);
            this.coverLoading = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 查询订单支状
    getOrderStatus(orderSn) {
      const params = {
        _jv: {
          type: 'orders/' + orderSn,
        },
      };
      this.$store
        .dispatch('jv/get', params)
        .then(res => {
          console.log(res.status, '订单支付状态接口查询');
          this.payStatus = res.status;
          this.payStatusNum++;
          if (this.payStatus == '1' || this.payStatusNum > 10) {
            console.log('支付成功');
            // this.payShow = false;
            this.payShowStatus = false;
            this.coverLoading = false;
            this.$refs.toast.show({ message: this.p.paySuccess });
            if (this.payTypeVal == 0) {
              // 这是主题支付，支付完成刷新详情页，重新请求数据
              console.log('这是主题支付');
              this.loadThread();
            } else if (this.payTypeVal == 1) {
              // 这是主题打赏，打赏完成，给主题打赏列表新增一条数据
              console.log('这是主题打赏');
              this.thread.rewardedUsers.unshift(this.user);
            }
          }
        })
        .catch(err => {
          console.log(err, '123这是catch');
          this.coverLoading = false;
          this.$refs.toast.show({ message: this.p.payFail });
        });
    },

    wechatPay(timeStamp, nonceStr, packageVal, signType, paySign) {
      // 小程序支付。
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: packageVal,
        signType: signType,
        paySign: paySign,
        success: function(res) {
          alert('微信支付成功');
          console.log('success:' + JSON.stringify(res));
        },
        fail: function(err) {
          alert('微信支付失败');
          console.log('fail:' + JSON.stringify(err));
        },
      });
    },
    //输入密码完成时
    onInput(val) {
      console.log(val, '这是详情页输出的密码');
      console.log('详情页监听到密码输入完成');
      console.log(this.thread.price, '这是价格');
      this.value = val;
      if (this.payTypeVal == 0) {
        // 这是主题支付
        this.creatOrder(this.thread.price, 3, val, '1');
      } else if (this.payTypeVal == 1) {
        // 这是主题打赏
        this.creatOrder(this.price, 2, val, '1');
      }
    },
    // 支付方式选择完成点击确定时
    paysureShow(payType) {
      if (payType === 0) {
        console.log('这是详情页获取到的支付方式---微信');
        console.log(this.value, this.orderSn, '这是密码和订单号');
        if (this.payTypeVal == 0) {
          // 这是主题支付
          this.creatOrder(this.thread.price, 3, this.value, payType);
        } else if (this.payTypeVal == 1) {
          // 这是主题打赏
          this.creatOrder(this.price, 2, this.value, payType);
        }
      } else if (payType === 1) {
        console.log('这是详情页获取到的支付方式---钱包');
      }
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
    selectChoice(param) {
      console.log(param, '父页面得到的参数');
      if (param.type == '0') {
        console.log('跳转到编辑主题页面');
        uni.navigateTo({
          url: '/pages/topic/post?operating=edit&threadId=' + this.thread._jv.id,
        });
      } else if (param.type == '4') {
        this.postOpera(this.threadId, '2');
      } else {
        this.threadOpera(this.threadId, param.canOpera, param.status, param.type);
      }
    },
    // 跳转到用户主页
    personJump(id) {
      console.log(id, '用户id');
      // uni.navigateTo({
      //   url: '/pages/home/index',
      // });
    },
    // 主题支付
    payClickShow() {
      console.log('主题支付');
      this.payShowStatus = true;
      this.payTypeVal = 0;
      this.price = this.thread.price;
      this.$refs.payShow.payClickShow();
    },
    // 支付触发子组件弹出框事件
    // payClickShow() {
    //   this.$refs.payShow.payClickShow();
    //   console.log(this.$refs.payShow);
    //   // this.$refs.payShow.childMethod();
    //   // console.log(this.$refs.payShow);
    // },
    // 支付是否显示用户头像
    radioMyHead(val) {
      console.log(val, '是否显示用户头像');
      this.isAnonymous = val;
    },

    //选择支付方式，获取值
    radioChange(val) {
      console.log(val, '这是父级得到的');
    },
    // 打赏
    rewardClick() {
      console.log('打赏');
      this.payTypeVal = 1;
      // this.payShowStatus = true;
      this.$refs.rewardPopup.open();
    },
    // 打赏选择付费金额
    moneyClick(index) {
      // this.setType = 'pay';
      this.payNumCheck = [];
      this.payNumCheck.push(this.payNum[index]);
      console.log(this.payNumCheck[0].name, '这是选中的打赏的name值');

      if (this.payNumCheck[0].name === '自定义') {
        this.$refs.rewardPopup.close();

        this.$nextTick(() => {
          this.$refs.customAmountPopup.open();
        });
      } else {
        console.log('点击');
        this.price = this.payNumCheck[0].pay;
        this.payShowStatus = true;
        this.$refs.rewardPopup.close();
        this.payTypeVal = 1;
        this.$refs.payShow.payClickShow();
      }
    },
    // 自定义付费金额弹框点击关闭时
    diaLogClose() {
      this.$refs.customAmountPopup.close();
    },
    // 自定义付费金额弹框点击确定时
    diaLogOk() {
      this.price = this.inputPrice;
      this.$refs.customAmountPopup.close();
      this.payShowStatus = true;
      this.$refs.payShow.payClickShow();
    },
    // 回复文本域失去焦点时，获取光标位置
    contBlur(e) {
      this.cursor = e.detail.cursor;
      // console.log(this.cursor, '这是失去焦点时，光标的位置');
    },
    // 点击表情插入到文本域
    getEmojiClick(num) {
      let text = '';
      text = `${this.textAreaValue.slice(0, this.cursor) +
        this.allEmoji[num].code +
        this.textAreaValue.slice(this.cursor)}`;

      this.textAreaValue = text;
      this.emojiShow = false;
    },
    // 点击@跳转到@页
    callClick() {
      uni.navigateTo({ url: '/components/qui-at-member-page/qui-at-member-page' });
    },
    imageUploader() {
      console.log('点击上传图片');
      this.uploaderShow = true;
      console.log(this.$refs.upload, '输出的');
      this.$nextTick(() => {
        this.$refs.upload.uploadClick();
      });
    },
    uploadChange(e) {
      console.log('这是上传');
      this.uploadFile = e;
      console.log(this.uploadFile, '这是上传的图片数据');
    },
    uploadClear(list, del) {
      this.delAttachments(list.data.id).then(() => {
        this.$refs.upload.clear(del);
      });
    },
    // 主题评论点击发布事件
    publishClick() {
      console.log('发布主题评论');
      this.postComment(this.commentId);
    },
    // 跳转到评论详情页
    commentJump(threadId, postId) {
      console.log(threadId, 'threadId跳转到评论详情页');
      console.log(postId, 'postId跳转到评论详情页');

      // uni.navigateTo({
      //   url: `/pages/topic/comment?threadId=${threadId}&commentId=${postId}`,
      // });
      uni.navigateTo({
        url: '/pages/topic/comment?threadId=' + threadId + '&commentId=' + postId,
      });
    },
    // 评论点赞
    commentLikeClick(postId, type, canStatus, isStatus, index) {
      console.log(postId, '请求接口，评论点赞');
      this.postIndex = index;
      this.postOpera(postId, type, canStatus, isStatus);
    },
    // 删除评论
    deleteComment(postId, type, canStatus, isStatus) {
      console.log(postId, '删除回复postid');
      this.postOpera(postId, '3', canStatus, isStatus);
    },
    // 评论的回复
    replyComment(postId, postIndex) {
      if (!this.thread.canReply) {
        console.log('没有回复权限');
      } else {
        this.commentReply = true;
        this.postIndex = postIndex;
        this.commentId = postId;
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

    // 主题点赞
    threadLikeClick(postId, canLike, isLiked) {
      console.log(this.thread.firstPost.canLike, '主题点赞');
      this.postOpera(postId, '1', canLike, isLiked);
    },
    // 主题收藏
    threadCollectionClick(id, canStatus, isStatus, type) {
      console.log(id, canStatus, isStatus, type, '主题收藏参数');
      this.threadOpera(id, canStatus, isStatus, type);
    },
    // 主题回复
    threadComment(threadId) {
      if (!this.thread.canReply) {
        console.log('没有回复权限');
      } else {
        console.log(threadId, '主题回复id');
        this.commentId = threadId;
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
    // 下拉加载
    pullDown() {
      // if (this.loadingType !== 'more') {
      //   return;
      // }
      // this.pageNum += 1;
      // this.loadThread();
      // console.log(this.pageNum, '页码');
    },
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
  word-break: break-all;
}
.flex {
  display: flex;
}
.scroll-y {
  // max-height: calc(100vh - 497rpx);
  max-height: calc(100vh - 100rpx);
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
.comment-popup-topbox {
  position: relative;
}
.comment-popup-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 40rpx 40rpx 20rpx;
  .comment-popup-top-l {
    // flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 230rpx;
  }
  .text-word-tip {
    font-size: $fg-f28;
    color: --color(--qui-FC-777);
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
    width: 100%;
    min-height: 70rpx;
    font-size: $fg-f28;
    line-height: 37rpx;
  }
  .text-placeholder {
    font-size: 28rpx;
  }
}
.publishBtn {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f28;
  line-height: 100rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background: --color(--qui-MAIN);
  border-radius: 0;
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
.popup-content-btn {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.popup-reward-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 477rpx;
  padding: 40rpx 45rpx;
  background: --color(--qui-BG-BTN-GRAY-1);
  .popup-title {
    height: 37rpx;
  }
}
.popup-dialog {
  width: 670rpx;
  height: 342rpx;
  background-color: --color(--qui-BG-2);
  border-radius: 14rpx;
  &__top {
    padding-top: 40rpx;
    text-align: center;
    text {
      font-size: $fg-f28;
      color: --color(--qui-FC-333);
    }
  }

  &__cont {
    position: relative;
    display: flex;
    align-items: center;
    padding: 24rpx 52rpx 40rpx;
    &-rmb {
      position: absolute;
      margin-left: 25rpx;
    }
    &-input {
      width: 100%;
      height: 100rpx;
      padding: 0 25rpx 0 80rpx;
      text-align: right;
      border: 1px solid --color(--qui-BOR-DDD);
      box-sizing: border-box;
    }
  }

  &__ft {
    display: flex;
    height: 100rpx;
    border-top: 2rpx solid --color(--qui-BOR-DDD);

    button {
      width: 50%;
      color: --color(--qui-FC-777);
      background-color: --color(--qui-BG-2);
      border-radius: 0;
      &:after {
        border: none;
      }
      &:last-of-type {
        border-left: 2rpx solid --color(--qui-BOR-DDD);
        border-bottom-right-radius: 10rpx;
      }
      &:first-of-type {
        border-bottom-left-radius: 10rpx;
      }
    }
  }
}
</style>
