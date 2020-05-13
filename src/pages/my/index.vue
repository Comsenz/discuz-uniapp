<template>
  <qui-page class="my">
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
      <view class="my-info__introduction" v-if="userInfo.signature">
        {{ userInfo.signature }}
      </view>
    </view>
    <view class="my-tabs">
      <qui-tabs :values="items" @clickItem="onClickItem" :brief="true" :current="-1"></qui-tabs>
    </view>
    <view>
      <view class="my-items">
        <navigator url="./profile" hover-class="none">
          <qui-cell-item :title="i18n.t('profile.myprofile')" arrow></qui-cell-item>
        </navigator>
        <navigator url="./wallet" hover-class="none">
          <qui-cell-item :title="i18n.t('profile.mywallet')" arrow></qui-cell-item>
        </navigator>
        <navigator url="./favorite" hover-class="none">
          <qui-cell-item
            :title="i18n.t('profile.myfavorite')"
            arrow
            :border="false"
          ></qui-cell-item>
        </navigator>
      </view>
      <view class="my-items">
        <qui-cell-item :title="i18n.t('profile.circleinfo')" arrow></qui-cell-item>
        <navigator url="/pages/site/search" hover-class="none">
          <qui-cell-item :title="i18n.t('profile.search')" arrow></qui-cell-item>
        </navigator>
        <qui-cell-item
          :title="i18n.t('profile.circlemanagement')"
          arrow
          :border="false"
        ></qui-cell-item>
      </view>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  components: {
    //
  },
  data() {
    return {
      items: [
        { title: this.i18n.t('profile.topic'), brief: '73' },
        { title: this.i18n.t('profile.following'), brief: '12' },
        { title: this.i18n.t('profile.followers'), brief: '31' },
        { title: this.i18n.t('profile.likes'), brief: '65' },
      ],
      current: 0,
      userId: uni.getStorageSync('user_id'),
    };
  },
  computed: {
    userInfo() {
      const data = this.$store.getters['jv/get'](`users/${this.userId}`);
      data.groupsName = data.groups ? Object.values(data.groups)[0].name : '';
      return data;
    },
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    onClickItem(e) {
      uni.navigateTo({
        url: `/pages/profile/index?current=${e.currentIndex}`,
      });
    },
    // 获取我的信息
    getUserInfo() {
      const params = {
        include: 'wechat,groups',
      };
      status
        .run(() => this.$store.dispatch('jv/get', [`users/${this.userId}`, { params }]))
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

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.my-items {
  padding-left: 40rpx;
  margin-top: 30rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
/deep/ .cell-item {
  padding-right: 40rpx;
}
.my-info {
  padding: 40rpx;
  font-size: 28rpx;
  background: --color(--qui-BG-2);
}
.my-info__box {
  display: flex;
  justify-content: space-between;
}
.my-info__introduction {
  margin-top: 40rpx;
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
  border-radius: 50%;
}
.my-tabs {
  background: --color(--qui-BG-2);
}
.my-tabs .qui-tabs__item--active {
  border: 0;
}
.my-tabs .qui-tabs__item--active .qui-tabs__item__title {
  color: --color(--qui-FC-AAA);
}
</style>
