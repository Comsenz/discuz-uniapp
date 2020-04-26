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
  </view>
</template>
<script>
export default {
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
// .uni-share {
//   /* #ifndef APP-NVUE */
//   display: flex;
//   flex-direction: column;
//   /* #endif */
//   background: --color(--qui-BG-2);
// }
// // .uni-share-title {
// //   padding: 15rpx 0;
// //   font-size: 24rpx;
// //   line-height: 60rpx;
// //   text-align: center;
// //   background: --color(--qui-BG-BTN-GRAY-1);
// // }
// .uni-share-content {
//   /* #ifndef APP-NVUE */
//   display: flex;
//   /* #endif */
//   flex-direction: row;
//   flex-wrap: wrap;
//   justify-content: space-between;
//   height: 250rpx;
//   padding-top: 40rpx;
//   padding-right: 97rpx;
//   padding-left: 98rpx;
//   background: --color(--qui-BG-BTN-GRAY-1);

//   // padding: 15px;
// }
// .uni-share-box{
//   width: 120rpx;
//   height: 120rpx;
//   line-height: 120rpx;
//   background: --color(--qui-BG-2);
// }
// .uni-share-content-box {
//   /* #ifndef APP-NVUE */
//   display: flex;
//   /* #endif */
//   flex-direction: column;
//   align-items: center;
//   width: 120rpx;
//   height: 157rpx;
//   // background: --color(--qui-BG-2);
// }
// .uni-share-content-image {
//   /* #ifndef APP-NVUE */
//   display: flex;
//   /* #endif */
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   width: 120rpx;
//   height: 120rpx;
//   overflow: hidden;
//   border-radius: 10rpx;
// }
// .content-image {
//   width: 60rpx;
//   height: 60rpx;
//   margin: 35rpx;
//   line-height: 60rpx;

// }
// .uni-share-content-text {
//   padding-top: 5px;
//   padding-bottom: 10px;
//   font-size: $fg-f26;
//   color: #333;

// }
// .uni-share-btn {
//   height: 90rpx;
//   font-size: $fg-f26;
//   line-height: 90rpx;
//   color: #666;
//   text-align: center;
//   border-top-color: #f5f5f5;
//   border-top-style: solid;
//   border-top-width: 1px;

// }
</style>
