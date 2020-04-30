<template>
  <view class="my">
    <view class="my-info">
      <view class="my-info__box">
        <view class="my-info__box__detail">
          <image
            class="my-info__box__detail-avatar"
            :src="userInfo.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'"
            alt="avatarUrl"
          ></image>
          <qui-cell-item
            :title="userInfo.username || ''"
            :brief="userInfo.groups ? Object.values(userInfo.groups)[0].name : ''"
            :border="false"
          ></qui-cell-item>
        </view>
      </view>
      <view class="my-info__introduction">
        {{ userInfo.signature || '暂无签名' }}
      </view>
    </view>
    <view class="my-tabs">
      <qui-tabs :values="items" @clickItem="onClickItem" :brief="true"></qui-tabs>
    </view>
    <view>
      <view class="my-items">
        <navigator url="./profile" open-type="navigate">
          <qui-cell-item title="我的资料" arrow></qui-cell-item>
        </navigator>
        <navigator url="./wallet" open-type="navigate">
          <qui-cell-item title="我的钱包" arrow></qui-cell-item>
        </navigator>
        <navigator url="./favorite" open-type="navigate">
          <qui-cell-item title="我的收藏" arrow :border="false"></qui-cell-item>
        </navigator>
      </view>
      <view class="my-items">
        <qui-cell-item title="圈子信息" arrow></qui-cell-item>
        <qui-cell-item title="搜索" arrow></qui-cell-item>
        <qui-cell-item title="管理圈子" arrow :border="false"></qui-cell-item>
      </view>
    </view>
  </view>
</template>

<script>
import { status } from 'jsonapi-vuex';

export default {
  components: {
    //
  },
  data() {
    return {
      items: [
        { title: '主题', brief: '73' },
        { title: '关注', brief: '12' },
        { title: '粉丝', brief: '31' },
        { title: '点赞', brief: '65' },
      ],
      current: 0,
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters['jv/get']('users/1');
    },
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    onClickItem(e) {
      uni.navigateTo({
        url: `/pages/profile/index?current=${e.currentIndex}&type=my`,
      });
    },
    // 获取我的信息
    getUserInfo() {
      const params = {
        include: ['wechat', 'groups'],
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['users/1', { params }]))
        .then(res => {
          this.items[0].brief = res.threadCount || 0;
          this.items[1].brief = res.followCount || 0;
          this.items[2].brief = res.fansCount || 0;
          this.items[3].brief = res.likedCount || 0;
        });
    },
  },
};
</script>

<style lang="scss" scope>
page {
  background-color: #f9fafc;
}
.my-items {
  padding-left: 40rpx;
  margin-top: 30rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;
  .cell-item {
    padding-right: 40rpx;
  }
}
.my-info {
  padding: 40rpx;
  font-size: 28rpx;
  background: #fff;
}
.my-info__box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40rpx;
}
.my-info__box__detail {
  position: relative;
  width: 100%;
  padding-left: 100rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
.my-info__box__detail /deep/ .cell-item__body {
  height: 80rpx;
  align-items: flex-start;
}
.my-info__box__detail-avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 80rpx;
  height: 80rpx;
  background: #a8a8a8;
  border-radius: 50%;
}
.qui-tabs {
  background: #fff;
}
.my-tabs .qui-tabs__item--active {
  border: 0;
}
.my-tabs .qui-tabs__item--active .qui-tabs__item__title {
  color: #aaa;
}
</style>
