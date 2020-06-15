<template>
  <view class="my">
    <uni-nav-bar
      title="我的"
      fixed="true"
      :color="checked ? '#fff' : '#000'"
      :background-color="checked ? '#2e2f30' : '#fff'"
      status-bar
    ></uni-nav-bar>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      show-scrollbar="false"
      class="scroll-y"
    >
      <view class="my-info">
        <view class="my-info__box">
          <view class="my-info__box__detail">
            <image
              class="my-info__box__detail-avatar"
              :src="userInfo.avatarUrl"
              @error="imageError"
              lazy-load
            ></image>
            <qui-cell-item
              :title="userInfo.username || ''"
              :brief="userInfo.groupsName"
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
          <navigator url="/pages/my/profile" hover-class="none">
            <qui-cell-item :title="i18n.t('profile.myprofile')" arrow></qui-cell-item>
          </navigator>
          <navigator url="/pages/my/wallet" hover-class="none">
            <qui-cell-item :title="i18n.t('profile.mywallet')" arrow></qui-cell-item>
          </navigator>
          <navigator url="/pages/my/favorite" hover-class="none">
            <qui-cell-item
              :title="i18n.t('profile.myfavorite')"
              arrow
              :border="false"
            ></qui-cell-item>
          </navigator>
        </view>
        <view class="my-items">
          <navigator url="/pages/site/index" hover-class="none">
            <qui-cell-item :title="i18n.t('profile.circleinfo')" arrow></qui-cell-item>
          </navigator>
          <navigator url="/pages/site/search" hover-class="none">
            <qui-cell-item
              :title="i18n.t('profile.search')"
              arrow
              :class="userInfo.groupsName == '管理员' ? '' : 'no-border'"
            ></qui-cell-item>
          </navigator>
          <navigator
            v-if="userInfo.groupsName == '管理员'"
            url="/pages/manage/index"
            hover-class="none"
          >
            <qui-cell-item
              :title="i18n.t('profile.circlemanagement')"
              arrow
              :border="false"
            ></qui-cell-item>
          </navigator>
        </view>

        <view class="my-items">
          <qui-cell-item :title="i18n.t('profile.theme')" slot-right :border="false">
            <u-switch @change="changeCheck" v-model="checked" active-color="#1E78F3"></u-switch>
          </qui-cell-item>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { THEME_DEFAULT, THEME_DARK } from '@/common/const';

export default {
  data() {
    return {
      items: [
        { title: this.i18n.t('profile.topic'), brief: '0' },
        { title: this.i18n.t('profile.following'), brief: '0' },
        { title: this.i18n.t('profile.followers'), brief: '0' },
        { title: this.i18n.t('profile.likes'), brief: '0' },
      ],
      current: 0,
      checked: false,
    };
  },
  computed: {
    userId() {
      return this.$store.getters['session/get']('userId');
    },
    userInfo() {
      const userInfo = this.$store.getters['jv/get'](`users/${this.userId}`);
      userInfo.groupsName = userInfo.groups ? userInfo.groups[0].name : '';
      userInfo.avatarUrl = userInfo.avatarUrl || '/static/noavatar.gif';
      this.setNum(userInfo);
      return userInfo;
    },
  },
  methods: {
    changeCheck(e) {
      getApp().globalData.themeChanged(e ? THEME_DARK : THEME_DEFAULT);
    },
    onClickItem(e) {
      uni.navigateTo({
        url: `/pages/profile/index?current=${e.currentIndex}`,
      });
    },
    // 设置粉丝点赞那些数字
    setNum(res) {
      this.items[0].brief = res.threadCount || 0;
      this.items[1].brief = res.followCount || 0;
      this.items[2].brief = res.fansCount || 0;
      this.items[3].brief = res.likedCount || 0;
    },
    // 组件初始化数据
    ontrueGetList() {
      this.checked = this.theme !== THEME_DEFAULT;
    },
    // 头像加载失败,显示默认头像
    imageError() {
      this.userInfo.avatarUrl = '/static/noavatar.gif';
    },
    // 获取最新主题数那些
    refreshNum() {
      const userId = this.$store.getters['session/get']('userId');
      const params = {
        include: 'groups,wechat',
      };
      this.$store.dispatch('jv/get', [`users/${userId}`, { params }]);
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
  transition: $switch-theme-time;
}
.my-info {
  padding: 40rpx;
  padding-top: 30rpx;
  font-size: $fg-f28;
  background: --color(--qui-BG-2);
  transition: $switch-theme-time;
}
.my-info__box {
  display: flex;
  justify-content: space-between;
}
.my-info__introduction {
  margin-top: 40rpx;
  color: --color(--qui-FC-333);
  word-break: break-all;
  transition: $switch-theme-time;
}
.my-info__box__detail {
  position: relative;
  width: 100%;
  padding-left: 100rpx;
  font-size: $fg-f28;
  box-sizing: border-box;
}
.my-info__box__detail-avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  will-change: transform;
}
.my-tabs {
  background: --color(--qui-BG-2);
  transition: $switch-theme-time;
}
.scroll-y {
  max-height: calc(100vh - 260rpx);
}
</style>
