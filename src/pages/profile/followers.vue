<template>
  <view class="following">
    <view class="follow-content">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDown"
        @scrolltoupper="refresh"
        show-scrollbar="false"
        class="scroll-y"
      >
        <view
          class="follow-content__items"
          v-for="(followerItem, index) in followerList"
          :key="index"
        >
          <image
            class="follow-content__items__avatar"
            :src="
              followerItem.fromUser.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'
            "
            alt="avatarUrl"
            @tap="toProfile(followerItem.fromUser.id)"
          ></image>
          <qui-cell-item
            :title="followerItem.fromUser.username"
            slot-right
            :brief="
              followerItem.fromUser.groups
                ? Object.values(followerItem.fromUser.groups)[0].name
                : ''
            "
          >
            <!-- follow 关注状态 0：未关注 1：已关注 2：互相关注 -->
            <view
              class="follow-content__items__operate"
              @tap="addFollow(followerItem.fromUser)"
              v-if="followerItem.fromUser.id != '1'"
            >
              <text>
                {{
                  followerItem.fromUser.follow == 0
                    ? i18n.t('profile.following')
                    : followerItem.fromUser.follow == 1
                    ? i18n.t('profile.followed')
                    : i18n.t('profile.mutualfollow')
                }}
              </text>
              <qui-icon
                class="text"
                :name="followerItem.fromUser.follow == 0 ? 'icon-follow' : 'icon-each-follow'"
                size="22"
                :color="
                  followerItem.fromUser.follow == 0
                    ? '#777'
                    : followerItem.fromUser.follow == 1
                    ? '#ddd'
                    : '#ff8888'
                "
              ></qui-icon>
            </view>
          </qui-cell-item>
        </view>
        <qui-load-more :status="loadingType"></qui-load-more>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';

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
      followerList: [],
      totalData: 0, // 总数
      pageSize: 20,
      pageNum: 1, // 当前页数
      currentLoginId: uni.getStorageSync('user_id'),
    };
  },
  mounted() {
    this.getFollowerList();
  },
  methods: {
    // 获取用户粉丝列表
    getFollowerList() {
      const params = {
        include: ['fromUser', 'fromUser.groups'],
        'filter[type]': 2,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[user_id]': this.userId,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['follow', { params }]))
        .then(res => {
          this.totalData = res._jv.json.meta.total;
          delete res._jv;
          this.loadingType = Object.keys(res).length === this.pageSize ? 'more' : 'nomore';
          if (this.totalData === 0) {
            this.followerList = [];
          } else {
            this.followerList = { ...this.followerList, ...res };
          }
        });
    },
    // 点击头像到个人主页
    toProfile(userId) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${userId}`,
      });
    },
    // 下拉加载
    pullDown() {
      if (this.pageNum * this.pageSize < this.totalData) {
        this.pageNum += 1;
        this.getFollowerList(this.pageNum);
      } else {
        this.loadingType = 'nomore';
      }
    },
    refresh() {
      this.pageNum = 1;
      this.followerList = [];
      this.getFollowerList();
    },
    // 添加关注
    addFollow(userInfo) {
      if (userInfo.follow !== 0) {
        this.deleteFollow(userInfo);
        return;
      }
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
          this.$emit('changeFollow', { userId: this.userId });
          this.getFollowerList();
        })
        .catch(err => {
          console.log('verify', err);
        });
    },
    // 取消关注
    deleteFollow(userInfo) {
      this.$store.dispatch('jv/delete', `follow/${userInfo.id}/${this.currentLoginId}`).then(() => {
        this.$emit('changeFollow', { userId: this.userId });
        this.getFollowerList();
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.following {
  padding: 0 20rpx;
  font-size: 28rpx;
  /deep/ .cell-item__body {
    padding-right: 20rpx;
  }
  .cell-item__body__right {
    font-size: 28rpx;
    color: --color(--qui-FC-333);
  }
  .qui-icon {
    margin-right: 0;
    margin-left: 14rpx;
  }
}
.follow-content {
  padding: 20rpx 0;
  background: --color(--qui-BG-2);
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}
.follow-content__items {
  position: relative;
  padding-left: 110rpx;
}
.follow-content__items__avatar {
  position: absolute;
  top: 16rpx;
  left: 20rpx;
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
}
.scroll-y {
  max-height: calc(100vh - 297rpx);
}
.text {
  margin-left: 12rpx;
}
</style>
