<template>
  <qui-page class="profile">
    <view class="profile-info">
      <view class="profile-info__box">
        <view class="profile-info__box__detail">
          <image
            class="profile-info__box__detail-avatar"
            :src="userInfo.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'"
            alt="avatarUrl"
          ></image>
          <qui-cell-item
            :title="userInfo.username"
            slot-right
            :brief="userInfo.groupsName"
            :border="false"
          >
            <view v-if="userId != currentLoginId">
              <view class="profile-info__box__detail-operate" @tap="chat">
                <qui-icon class="text" name="icon-message1" size="22" color="#333"></qui-icon>
                <text>私信</text>
              </view>
              <!-- follow 关注状态 0：未关注 1：已关注 2：互相关注 -->
              <view
                class="profile-info__box__detail-operate"
                @tap="userInfo.follow == 0 ? addFollow(userInfo) : deleteFollow(userInfo)"
              >
                <qui-icon
                  class="text"
                  :name="userInfo.follow == 0 ? 'icon-follow' : 'icon-each-follow'"
                  size="22"
                  :color="userInfo.follow == 0 ? '#777' : userInfo.follow == 1 ? '#333' : '#ff8888'"
                ></qui-icon>
                <text>
                  {{ userInfo.follow == 0 ? '关注' : userInfo.follow == 1 ? '已关注' : '互相关注' }}
                </text>
              </view>
            </view>
          </qui-cell-item>
        </view>
      </view>
      <view class="profile-info__introduction" v-if="userInfo.signature">
        {{ userInfo.signature }}
      </view>
    </view>
    <view class="profile-tabs">
      <qui-tabs
        :current="current"
        :values="items"
        @clickItem="onClickItem"
        :brief="true"
      ></qui-tabs>
      <view class="profile-tabs__content">
        <view v-if="current == 0" class="items">
          <topic :user-id="userId"></topic>
        </view>
        <view v-if="current == 1" class="items">
          <following :user-id="userId" @changeFollow="changeFollow"></following>
        </view>
        <view v-if="current == 2" class="items">
          <followers :user-id="userId" ref="followers" @changeFollow="changeFollow"></followers>
        </view>
        <view v-if="current == 3" class="items">
          <like :user-id="userId" @changeFollow="changeFollow"></like>
        </view>
      </view>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import topic from './topic';
import following from './following';
import followers from './followers';
import like from './like';

export default {
  components: {
    topic,
    following,
    followers,
    like,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      items: [
        { title: '主题', brief: '73' },
        { title: '关注', brief: '12' },
        { title: '粉丝', brief: '31' },
        { title: '点赞', brief: '65' },
      ],
      userId: '',
      currentLoginId: uni.getStorageSync('user_id'),
      current: 0,
      dialogId: 0, // 会话id
    };
  },
  computed: {
    userInfo() {
      const userInfo = this.$store.getters['jv/get'](`users/${this.userId}`);
      userInfo.groupsName = userInfo.groups ? Object.values(userInfo.groups)[0].name : '';
      return userInfo;
    },
  },
  onLoad(params) {
    // 区分是自己的主页还是别人的主页
    const { userId, current } = params;
    // 我的用户id从缓存拿
    this.userId = userId || this.currentLoginId;
    this.current = current || 0;
    this.getUserInfo(userId || this.currentLoginId);
  },
  methods: {
    onClickItem(e) {
      if (e.currentIndex !== this.current) {
        this.current = e.currentIndex;
      }
    },
    // 获取用户信息
    getUserInfo(userId) {
      const params = {
        include: 'groups',
      };
      status
        .run(() => this.$store.dispatch('jv/get', [`users/${userId}`, { params }]))
        .then(res => {
          this.items[0].brief = res.threadCount || 0;
          this.items[1].brief = res.followCount || 0;
          this.items[2].brief = res.fansCount || 0;
          this.items[3].brief = res.likedCount || 0;
        });
    },
    // 添加关注
    addFollow(userInfo) {
      const params = {
        _jv: {
          type: 'follow',
        },
        type: 'user_follow',
        to_user_id: userInfo.id,
      };
      status
        .run(() => this.$store.dispatch('jv/post', params))
        .then(() => {
          this.getUserInfo(this.userId);
          if (this.$refs.followers) this.$refs.followers.getFollowerList('change');
        })
        .catch(err => {
          console.log('verify', err);
        });
    },
    // 取消关注
    deleteFollow(userInfo) {
      this.$store.dispatch('jv/delete', `follow/${userInfo.id}/1`).then(() => {
        this.getUserInfo(this.userId);
        if (this.$refs.followers) this.$refs.followers.getFollowerList('change');
      });
    },
    changeFollow(e) {
      this.getUserInfo(e.userId);
    },
    // 私信
    chat() {
      const params = {
        _jv: {
          type: 'dialog',
        },
        recipient_username: this.userInfo.username,
      };
      // 调用创建会话接口
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          this.dialogId = res._jv.json.data.id;
          this.jumpChatPage();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转到聊天页面（传入用户名和会话id）
    jumpChatPage() {
      uni.navigateTo({
        url: `../notice/msglist?username=${this.userInfo.username}&dialogId=${this.dialogId}`,
      });
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.profile {
  .qui-icon {
    margin-right: 14rpx;
  }
}
.profile-info {
  padding: 40rpx;
  padding-top: 30rpx;
  font-size: $fg-f28;
  background: --color(--qui-BG-2);
}
.profile-info__box {
  display: flex;
  justify-content: space-between;
}
.profile-info__introduction {
  margin-top: 40rpx;
}
.profile-info__box__detail {
  position: relative;
  width: 100%;
  padding-left: 100rpx;
  font-size: $fg-f28;
  box-sizing: border-box;
}
.profile-info__box__detail /deep/ .cell-item__body {
  height: 80rpx;
  align-items: flex-start;
}
.profile-info__box__detail-operate {
  display: inline-block;
  margin-left: 42rpx;
  color: --color(--qui-FC-333);
}
.profile-info__box__detail-avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
.profile-tabs__content {
  padding-top: 30rpx;
}
/deep/ .qui-tabs {
  background: --color(--qui-BG-2);
}
</style>
