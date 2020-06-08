<template>
  <view class="qui-back">
    <view class="qui-back__body">
      <view class="qui-back__body__content">
        <view class="qui-back__body__content-title">
          <qui-icon
            :name="iconLeft"
            size="32"
            :color="theme === $u.light() ? '#333' : '#fff'"
            @tap="back"
          ></qui-icon>
          <text @tap="back">{{ title }}</text>
        </view>
      </view>
      <view class="qui-back_body__right" v-if="slotRight">
        <slot></slot>
      </view>
      <view class="qui-back__body__right" v-if="!slotRight">
        <qui-icon
          name="icon-home"
          size="32"
          :color="theme === $u.light() ? '#777' : '#fff'"
          @tap="backPage('/pages/home/index')"
        ></qui-icon>
        <qui-icon
          name="icon-more"
          size="32"
          :color="theme === $u.light() ? '#000' : '#fff'"
          @tap="showMore"
        ></qui-icon>
        <view class="qui-back__body__right-pop" v-if="ifShowMenu">
          <view class="qui-back__body__right-pop-item" @tap="backPage('/pages/home/index')">
            {{ i18n.t('profile.post') }}
          </view>
          <view class="qui-back__body__right-pop-item" @tap="backPage('/pages/home/index')">
            {{ i18n.t('profile.notice') }}
          </view>
          <view class="qui-back__body__right-pop-item" @tap="backPage('/pages/home/index')">
            {{ i18n.t('profile.mine') }}
          </view>
          <!-- 管理员才显示站点管理 -->
          <view
            class="qui-back__body__right-pop-item"
            @tap="backPage('/pages/manage/index')"
            v-if="userInfo.groupsName == '管理员'"
          >
            {{ i18n.t('site.site') }}
          </view>
        </view>
      </view>
    </view>
    <view class="qui-back-mask" v-if="ifShowMenu" @tap="hideMenu"></view>
  </view>
</template>

<script>
export default {
  name: 'QuiBack',
  props: {
    title: {
      type: String,
      default: '',
    },
    iconLeft: {
      type: String,
      default: 'icon-back',
    },
    slotRight: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      ifShowMenu: false,
    };
  },
  computed: {
    userId() {
      return this.$store.getters['session/get']('userId');
    },
    userInfo() {
      const userInfo = this.$store.getters['jv/get'](`users/${this.userId}`);
      userInfo.groupsName = userInfo.groups ? userInfo.groups[0].name : '';
      return userInfo;
    },
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    backPage(pageUrl) {
      this.ifShowMenu = false;
      uni.navigateTo({
        url: pageUrl,
      });
    },
    hideMenu() {
      this.ifShowMenu = false;
    },
    showMore() {
      this.ifShowMenu = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.qui-back {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 0 40rpx;
  background: --color(--qui-BG-2);
  box-sizing: border-box;
}
.qui-back__body {
  position: relative;
  display: flex;
  height: 100rpx;
  align-items: center;
  justify-content: space-between;
}
.qui-back__body__content-title {
  font-size: $fg-f28;
  font-weight: bold;
  color: --color(--qui-FC-333);
  transition: $switch-theme-time;
}
.qui-back__body__content-title .qui-icon {
  margin-right: 18rpx;
}
.qui-back__body__content {
  flex: 1 1 0%;
}
.cell-item__body__right {
  align-items: center;
  justify-content: flex-end;
  font-size: $fg-f28;
  text-align: right;
}
.icon-home {
  margin-right: 32rpx;
}
.qui-back__body__right-pop {
  position: absolute;
  top: 90rpx;
  right: -20rpx;
  z-index: 100;
  width: 180rpx;
  padding: 10rpx;
  background: --color(--qui-BG-2);
  border-radius: 10rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
}
.qui-back__body__right-pop-item {
  height: 70rpx;
  font-size: $fg-f28;
  line-height: 70rpx;
  color: --color(--qui-FC-777);
  text-align: center;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.qui-back__body__right-pop-item:last-child {
  border: none;
}
.qui-back__body__right-pop:before {
  position: absolute;
  top: -12rpx;
  right: 24rpx;
  width: 0;
  height: 0;
  border-color: transparent transparent --color(--qui-BOR-ED);
  border-style: solid;
  border-width: 0 12rpx 12rpx;
  content: '';
}
.qui-back__body__right-pop:after {
  position: absolute;
  top: -10rpx;
  right: 24rpx;
  width: 0;
  height: 0;
  border-color: transparent transparent --color(--qui-BG-2);
  border-style: solid;
  border-width: 0 12rpx 12rpx;
  content: '';
}
.qui-back-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  background: transparent;
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
}
</style>
