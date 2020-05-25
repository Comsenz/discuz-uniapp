<template>
  <qui-page class="my" :footer="true">
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
              :src="userInfo.avatarUrl || '/static/noavatar.gif'"
              alt="avatarUrl"
              :mode="modeVal"
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
  </qui-page>
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
      userId: this.$store.getters['session/get']('userId'),
      // 图片裁剪、缩放的模式
      modeVal: {
        type: String,
        default: 'aspectFill',
      },
    };
  },
  computed: {
    userInfo() {
      const data = this.$store.getters['jv/get'](`users/${this.userId}`);
      data.groupsName = data.groups ? Object.values(data.groups)[0].name : '';
      this.setNum(data);
      return data;
    },
  },
  onLoad() {
    this.checked = this.$store.getters['theme/get']('currentTheme') !== THEME_DEFAULT;
  },
  methods: {
    changeCheck(e) {
      this.$store.dispatch('theme/setTheme', e ? THEME_DARK : THEME_DEFAULT);
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
/deep/ .cell-item {
  padding-right: 40rpx;
}
/deep/ .no-border .cell-item {
  border: 0;
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
  transition: $switch-theme-time;
}
/deep/ .my-tabs .qui-tabs__item--active {
  border: 0;
}
/deep/ .qui-tabs__item--active .qui-tabs__item__title {
  font-weight: normal;
  color: --color(--qui-FC-AAA);
  transition: $switch-theme-time;
}
.scroll-y {
  max-height: calc(100vh - 140rpx);
}
</style>
