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
          v-for="(followingItem, index) in followingList"
          @tap="toProfile(followingItem.toUser.id)"
          :key="index"
        >
          <image
            class="follow-content__items__avatar"
            :src="
              followingItem.toUser.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'
            "
            alt="avatarUrl"
          ></image>
          <qui-cell-item
            :title="followingItem.toUser.username"
            slot-right
            :brief="
              followingItem.toUser.groups ? Object.values(followingItem.toUser.groups)[0].name : ''
            "
          >
            <!-- follow 关注状态 0：未关注 1：已关注 2：互相关注 -->
            <view
              class="follow-content__items__operate"
              @tap="addFollow(followingItem.toUser)"
              @tap.stop
              v-if="followingItem.toUser.id != currentLoginId"
            >
              <text>
                {{
                  followingItem.toUser.follow == 0
                    ? i18n.t('profile.following')
                    : followingItem.toUser.follow == 1
                    ? i18n.t('profile.followed')
                    : i18n.t('profile.mutualfollow')
                }}
              </text>
              <qui-icon
                class="text"
                :name="followingItem.toUser.follow == 0 ? 'icon-follow' : 'icon-each-follow'"
                size="22"
                :color="
                  followingItem.toUser.follow == 0
                    ? '#777'
                    : followingItem.toUser.follow == 1
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
      flag: true, // 滚动节流
      followingList: [],
      pageSize: 10,
      pageNum: 1, // 当前页数
      currentLoginId: uni.getStorageSync('user_id'),
    };
  },
  mounted() {
    this.getFollowingList();
  },
  methods: {
    // 获取用户关注列表
    getFollowingList(type) {
      const params = {
        include: ['toUser', 'toUser.groups'],
        'filter[type]': 1,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[user_id]': this.userId,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['follow', { params }]))
        .then(res => {
          if (res._jv) {
            delete res._jv;
          }
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          if (type === 'change') {
            this.followingList = res;
          } else {
            this.followingList = [...this.followingList, ...res];
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
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getFollowingList();
    },
    refresh() {
      this.pageNum = 1;
      this.followingList = [];
      this.getFollowingList();
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
          this.getFollowingList('change');
        })
        .catch(err => {
          console.log('verify', err);
        });
    },
    // 取消关注
    deleteFollow(userInfo) {
      this.$store.dispatch('jv/delete', `follow/${userInfo.id}/1`).then(() => {
        this.$emit('changeFollow', { userId: this.userId });
        // 如果是个人主页直接删除这条数据
        if (this.userId === this.currentLoginId) {
          const dataList = this.followingList;
          dataList.forEach((item, index) => {
            if (item.toUser && item.toUser.id === userInfo.id) {
              const data = JSON.parse(JSON.stringify(dataList));
              data.splice(index, 1);
              this.followingList = data;
            }
          });
        } else {
          this.getFollowingList('change');
        }
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
  font-size: $fg-f28;
  .cell-item__body__right {
    font-size: $fg-f28;
    color: --color(--qui-FC-333);
  }
  .qui-icon {
    margin-right: 0;
    margin-left: 14rpx;
  }
  /deep/ .cell-item__body {
    padding-right: 20rpx;
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
