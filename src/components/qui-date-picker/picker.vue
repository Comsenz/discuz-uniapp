<template>
  <view class="min-picker">
    <picker-view
      :indicator-style="indicatorStyle"
      :value="value"
      @change="bindChange"
      style="height: 400rpx;"
    >
      <picker-view-column>
        <view class="picker item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
      </picker-view-column>
      <picker-view-column>
        <view class="picker item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
      </picker-view-column>
    </picker-view>
    <view class="picer-top">
      <view @click="cacel" style="padding-left: 20rpx;">取消</view>
      <view @click="sure" style="padding-right: 20rpx;" class="sure">确认</view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    start: {
      type: Number,
    },
  },
  data() {
    return {
      years: [],
      months: [],
      value: [0, 0],
      visible: false,
      flag: false,
      indicatorStyle: `height: ${Math.round(
        uni.getSystemInfoSync().screenWidth / (750 / 100),
      )}rpx;`,
    };
  },
  mounted() {
    this.getYears();
    this.getMonth();
  },
  methods: {
    bindChange(e) {
      this.flag = true;
      const val = e.detail.value;
      this.year = this.years[val[0]];
      this.month = this.months[val[1]];
    },
    // 获得年份
    getYears() {
      const time = new Date();
      for (let i = time.getFullYear(); i < 2085; i += 1) {
        this.years.push(i);
      }
    },
    // 获取月份
    getMonth() {
      const time = new Date();
      for (let i = time.getMonth() + 1; i <= 12; i += 1) {
        this.months.push(i);
      }
    },
    // 取消
    cacel() {
      this.$emit('cancel', false);
    },
    // 确认
    sure() {
      if (!this.flag) {
        this.$emit('cancel', false);
        this.$emit('sure', { year: this.years[0], month: this.months[0], day: this.days[0] });
        return;
      }
      this.$emit('cancel', false);
      this.$emit('sure', { year: this.year, month: this.month, day: this.day });
    },
  },
};
</script>
<style lang="scss" scoped>
.picer-top {
  display: flex;
  width: 100%;
  height: 100rpx;
  justify-content: space-between;
  align-items: center;
  font-size: 30rpx;
  .sure {
    color: #007aff;
  }
}
.picker {
  line-height: 50rpx;
  text-align: center;
}
</style>
