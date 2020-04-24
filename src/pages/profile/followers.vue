<template>
  <view class="following">
    <view class="follow-content">
      <view
        class="follow-content__items"
        v-for="(followerItem, index) in followerList"
        :key="index"
      >
        <image
          class="follow-content__items__avatar"
          :src="followerItem.fromUser.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'"
          alt="avatarUrl"
          @tap="toProfile(followerItem.fromUser.id)"
        ></image>
        <cell-item
          :title="followerItem.fromUser.username"
          slot-right
          :brief="Object.values(followerItem.fromUser.groups)[0].name"
        >
          <!-- follow 关注状态 0：未关注 1：已关注 2：互相关注 -->
          <view class="follow-content__items__operate">
            <text>
              {{
                followingItem.toUser.follow === 0
                  ? '关注'
                  : followingItem.toUser.follow == 1
                  ? '已关注'
                  : '互相关注'
              }}
            </text>
            <qui-icon
              class="text"
              :name="userInfo.follow === 0 ? 'icon-follow' : 'icon-each-follow'"
              size="16"
              :color="
                followingItem.toUser.follow === 0
                  ? '#777'
                  : followingItem.toUser.follow == 1
                  ? '#ddd'
                  : '#ff8888'
              "
            ></qui-icon>
          </view>
        </cell-item>
      </view>
    </view>
  </view>
</template>

<script>
import cellItem from '@/components/qui-cell-item';
import { status } from 'jsonapi-vuex';

export default {
  components: {
    cellItem,
  },
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      followerList: [],
      totalData: 0, // 总数
      totalPage: 1, // 总页数
      currentPage: 1, // 当前页数
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
        'page[number]': 1,
        'page[limit]': 10,
        'filter[user_id]': this.userId,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['follow', { params }]))
        .then(res => {
          this.followerList = res;
          console.log(res);
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
  },
};
</script>

<style lang="scss">
.following {
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
</style>
