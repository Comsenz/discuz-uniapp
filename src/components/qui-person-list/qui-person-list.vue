<template>
  <!-- 支付列表 -->
  <view class="det-reward-box" v-if="showStatus">
    <view class="det-rew-number">{{ personNum }}人打赏</view>
    <view class="det-rew-per-list">
      <view class="det-rew-person" v-for="(person, index) in personList" :key="index">
        <image :src="person" v-if="index < 10" class="det-rew-per-head"></image>
      </view>
    </view>
    <qui-icon name="icon-unfold" class="icon-unfold" @click="handleClick"></qui-icon>
    <button class="det-rew-btn" v-if="btnShow" :style="{ background: btnBg }">
      <qui-icon
        :name="'icon-' + btnIconName"
        :color="btnTextColor"
        class="qui-icon"
        v-if="brnIconShow"
      ></qui-icon>
      <view :style="{ color: btnTextColor }">{{ btnText }}</view>
    </button>
  </view>
</template>

<script>
export default {
  props: {
    // 是否显示
    showStatus: {
      default: true,
      type: Boolean,
    },
    // list总数
    personNum: {
      default: '0',
      type: [Number, String],
    },
    // list列表
    personList: {
      default: () => {
        return [];
      },
      type: Array,
    },
    // 是否显示按钮
    btnShow: {
      default: true,
      type: Boolean,
    },
    // 按钮背景色
    btnBg: {
      default: '#fa5151',
      type: String,
    },
    // 按时是否显示icon
    brnIconShow: {
      default: true,
      type: Boolean,
    },
    // icon的name值
    btnIconName: {
      default: '',
      type: String,
    },
    // 按钮text
    btnText: {
      default: '按钮',
      type: String,
    },
    // 按钮text颜色
    btnTextColor: {
      default: '#ffffff',
      type: String,
    },
  },
  data: () => {
    return {};
  },
  onLoad() {},
  methods: {
    handleClick(param) {
      this.$emit('click', param);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.det-reward-box {
  display: flex;
  flex-direction: column;
  padding: 80rpx 0;
  text-align: center;
  .det-rew-number {
    font-size: $fg-f28;
    color: --color(--qui-FC-AAA);
    text-align: center;
  }
  .det-rew-per-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: 30rpx 0;
  }
  .det-rew-person {
    width: 50rpx;
    height: 50rpx;
    margin: 0 3rpx 10rpx 4rpx;
    border-radius: 50%;
    .det-rew-per-head {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .icon-unfold {
    padding: 0 0 30rpx;
    font-size: 34rpx;
    color: --color(--qui-FC-B5);
  }
  .det-rew-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 465rpx;
    height: 90rpx;
    font-size: $fg-f28;
    line-height: 90rpx;
    .qui-icon {
      margin-right: 13rpx;
      font-size: 36rpx;
      line-height: 90rpx;
    }
  }
}
</style>
