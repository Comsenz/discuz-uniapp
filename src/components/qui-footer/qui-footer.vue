<template>
  <view class="ft">
    <view
      class="ft-box "
      :class="{ select: true, active: item.id === sel }"
      @click="select(item)"
      v-for="(item, index) in tabs"
      :key="index"
    >
      <qui-icon
        class="ft-box-icon"
        :name="item.tabsIcon"
        size="36"
        :class="{ select: true, active: item.id === sel }"
        @click="select(item)"
      ></qui-icon>
      <text class="ft-box-content">{{ item.tabsName }}</text>
    </view>

    <view class="ft-box-spacal">
      <image class="ft-box-spacal-icon" src="@/static/publish.svg" @click="footerOpen"></image>
    </view>
    <uni-icons
      class="red-circle"
      type="smallcircle-filled"
      size="7"
      color="red"
      v-if="redCircle"
    ></uni-icons>
  </view>
</template>
<script>
import { uniIcons } from '@dcloudio/uni-ui';

export default {
  components: {
    uniIcons,
  },
  props: {
    tabs: {
      type: Array,
      default: () => {
        return [];
      },
    },
    postImg: {
      type: String,
      default: '',
    },
    redCircle: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      sel: 1,
      type: '',
    };
  },
  methods: {
    select(item) {
      this.sel = item.id;
      if (item.url) {
        uni.navigateTo({
          url: item.url,
        });
      }
    },
    footerOpen(evt) {
      this.$emit('click', evt);
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.ft {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 119rpx;
  background-color: --color(--qui-BG-2);
  justify-content: space-around;
}
.ft-box {
  display: flex;
  height: 72rpx;
  margin-top: 20rpx;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
}
.ft-box-icon {
  height: 46rpx;
  // background: #c33;
}
.ft-box-content {
  padding-top: 2px;
  font-size: 20rpx;
  text-align: center;
}
.ft-box-spacal {
  position: relative;
  width: 125rpx;
  height: 125rpx;
}
.ft-box-spacal-icon {
  position: relative;
  top: -20rpx;
  width: 125rpx;
  height: 125rpx;
}
.active {
  color: #1878f3;
}
.red-circle {
  position: absolute;
  top: -3rpx;
  left: 267rpx;
}
</style>
