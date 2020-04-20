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
        size="24"
        :class="{ select: true, active: item.id === sel }"
        @click="select(item)"
      ></qui-icon>
      <text class="ft-box-content">{{ item.tabsName }}</text>
    </view>
    <!-- <view class="ft-box">
      <qui-icon
        class="ft-box-icon"
        name="icon-message"
        size="24"
        color="#777"
        @click="handleClick"
      ></qui-icon>
      <text class="ft-box-content">消息</text>
    </view>
    <view class="ft-box" @click="handleClick">
      <qui-icon
        class="ft-box-icon"
        name="icon-mine"
        size="24"
        color="#777"
        @click="handleClick"
      ></qui-icon>
      <text class="ft-box-content">我</text>
    </view> -->
    <view class="ft-box-spacal">
      <image class="ft-box-spacal-icon" src="@/assets/publish.svg"></image>
    </view>
  </view>
</template>
<script>
export default {
  props: {},
  data: () => {
    return {
      sel: 1,
      tabs: [
        {
          tabsName: '圈子',
          tabsIcon: 'icon-home',
          id: 1,
        },
        {
          tabsName: '消息',
          tabsIcon: 'icon-message',
          id: 2,
        },
        {
          tabsName: '我',
          tabsIcon: 'icon-mine',
          id: 3,
        },
      ],
    };
  },
  methods: {
    select(item) {
      this.sel = item.id;
      console.log('2222');
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
}
.ft-box-content {
  margin-top: 5rpx;
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
</style>
