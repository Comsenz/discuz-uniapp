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
          <qui-cell-item :title="followerItem.fromUser.username" slot-right>
            <!-- follow 关注状态 0：未关注 1：已关注 2：互相关注 -->
            <view class="follow-content__items__operate" @tap="addFollow(followerItem.fromUser)">
              <text>
                {{
                  followerItem.fromUser.follow == 0
                    ? '关注'
                    : followerItem.fromUser.follow == 1
                    ? '已关注'
                    : '互相关注'
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
      </scroll-view>
      <qui-load-more :status="loadingType"></qui-load-more>
    </view>
  </view>
</template>

<script>
import { status } from 'jsonapi-vuex';

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
          // eslint-disable-next-line no-underscore-dangle
          this.totalData = res._jv.json.meta.total;
          const data = JSON.parse(JSON.stringify(res));
          // eslint-disable-next-line no-underscore-dangle
          delete data._jv;
          this.loadingType = Object.keys(data).length === this.pageSize ? 'more' : 'nomore';
          if (this.totalData === 0) {
            this.followerList = [];
          } else {
            this.followerList = { ...this.followerList, ...data };
          }
        });
    },
    // 添加关注
    // 取消关注
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
      this.$store.dispatch('jv/delete', `follow/${userInfo.id}/1`).then(() => {
        this.$emit('changeFollow', { userId: this.userId });
        this.getFollowerList();
      });
    },
  },
};
</script>

<style lang="scss" scope>
.following {
  padding: 0 20rpx;
  font-size: 28rpx;
  .cell-item {
    padding-right: 20rpx;
  }
  .cell-item__body__right {
    font-size: 28rpx;
    color: #333;
  }
  .qui-icon {
    margin-right: 0;
    margin-left: 14rpx;
  }
}
.follow-content {
  padding: 20rpx 0;
  background: #fff;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}
.follow-content__items {
  position: relative;
  padding-left: 110rpx;
}
.follow-content__items:last-child .cell-item {
  border: 0;
}
.follow-content__items__avatar {
  position: absolute;
  top: 16rpx;
  left: 20rpx;
  width: 70rpx;
  height: 70rpx;
  background: #a8a8a8;
  border-radius: 50%;
}
.scroll-y {
  max-height: calc(100vh - 297rpx);
}
.text {
  margin-left: 12rpx;
}
</style>
