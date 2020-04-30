<template>
  <view class="profile">
    <view class="profile-info">
      <view class="profile-info__box">
        <view class="profile-info__box__detail">
          <image
            class="profile-info__box__detail-avatar"
            :src="userInfo.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'"
            alt="avatarUrl"
          ></image>
          <cell-item
            :title="userInfo.username"
            slot-right
            :brief="userInfo.groups ? Object.values(userInfo.groups)[0].name : ''"
            :border="false"
          >
            <view v-if="pageType !== 'my'">
              <view class="profile-info__box__detail-operate">
                <qui-icon class="text" name="icon-message" size="22" color="#333"></qui-icon>
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
                  :color="userInfo.follow == 0 ? '#777' : userInfo.follow == 1 ? '#ddd' : '#ff8888'"
                ></qui-icon>
                <text>
                  {{ userInfo.follow == 0 ? '关注' : userInfo.follow == 1 ? '已关注' : '互相关注' }}
                </text>
              </view>
            </view>
          </cell-item>
        </view>
      </view>
      <view class="profile-info__introduction">
        {{ userInfo.signature || '暂无签名' }}
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
          <like :user-id="userId"></like>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import quiTabs from '@/components/qui-tabs';
import cellItem from '@/components/qui-cell-item';
import { status } from 'jsonapi-vuex';
import topic from './topic';
import following from './following';
import followers from './followers';
import like from './like';

export default {
  components: {
    quiTabs,
    cellItem,
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
      pageType: '', // 个人主页还是他人主页
      current: 0,
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters['jv/get'](`users/${this.userId}`);
    },
  },
  onLoad(params) {
    // 区分是自己的主页还是别人的主页
    const { userId, current, type } = params;
    // 我的用户id从缓存拿
    this.userId = userId || 1;
    this.pageType = type;
    this.current = current || 0;
    this.getUserInfo(userId || 1);
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
        include: ['wechat', 'groups'],
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
          if (this.$refs.followers) this.$refs.followers.getFollowerList();
        })
        .catch(err => {
          console.log('verify', err);
        });
    },
    // 取消关注
    deleteFollow(userInfo) {
      this.$store.dispatch('jv/delete', `follow/${userInfo.id}/1`).then(() => {
        this.getUserInfo(this.userId);
        if (this.$refs.followers) this.$refs.followers.getFollowerList();
      });
    },
    changeFollow(e) {
      this.getUserInfo(e.userId);
    },
  },
};
</script>
<style lang="scss">
page {
  background-color: #f9fafc;
}
.profile {
  .qui-icon {
    margin-right: 14rpx;
  }
}
.profile-info {
  padding: 40rpx;
  font-size: 28rpx;
  background: #fff;
}
.profile-info__box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40rpx;
}
.profile-info__box__detail {
  position: relative;
  width: 100%;
  padding-left: 100rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
.profile-info__box__detail /deep/ .cell-item__body {
  height: 80rpx;
  align-items: flex-start;
}
.profile-info__box__detail-operate {
  display: inline-block;
  margin-left: 42rpx;
  color: #333;
}
.profile-info__box__detail-avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 80rpx;
  height: 80rpx;
  background: #a8a8a8;
  border-radius: 50%;
}
.profile-tabs__content {
  padding-top: 30rpx;
}
.qui-tabs {
  background: #fff;
}
</style>
