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
        ></qui-icon>
        <qui-icon
          name="icon-more"
          size="32"
          :color="theme === $u.light() ? '#000' : '#fff'"
        ></qui-icon>
      </view>
    </view>
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

  methods: {
    back() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.qui-back {
  position: relative;
  padding: 0 40rpx;
  background: --color(--qui-BG-2);
}
.qui-back__body {
  position: relative;
  display: flex;
  height: 100rpx;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
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
</style>
