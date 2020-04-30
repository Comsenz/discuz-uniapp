<template>
  <view class="qui-tabs">
    <view
      v-for="(item, index) in values"
      :class="index === currentIndex ? 'qui-tabs__item--active qui-tabs__item' : 'qui-tabs__item'"
      :key="index"
      :style="{
        borderColor: index === currentIndex ? activeColor : 'transparent',
      }"
      @tap="onClick(index)"
    >
      <text v-if="brief" class="qui-tabs__item__brief">
        {{ item.brief }}
      </text>
      <text class="qui-tabs__item__title">
        {{ item.title }}
      </text>
    </view>
  </view>
</template>

<script>
/**
 * 列表单元组件 (如果不能满足需求可自行添加slot)
 * @property {Number} current 标题 - 当前索引值 -默认：0
 * @property {Array} values 选项数组 - 支持标题和备注，其他需要的可自行添加
 * @property {Boolean} brief 备注 - 默认：false
 * @property {String} activeColor 选中的标签边框颜色
 * @event {Function} onClick  点击事件
 * @example <qui-tabs :current="current" :values="items"></qui-tabs>
 */
export default {
  name: 'QuiTabs',
  props: {
    current: {
      type: Number,
      default: 0,
    },
    values: {
      type: Array,
      default() {
        return [];
      },
    },
    brief: {
      type: Boolean,
      default: false,
    },
    activeColor: {
      type: String,
      default: '#1878F3',
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  watch: {
    current(val) {
      if (val !== this.currentIndex) {
        this.currentIndex = val;
      }
    },
  },
  created() {
    this.currentIndex = this.current;
  },
  methods: {
    onClick(index) {
      if (this.currentIndex !== index) {
        this.currentIndex = index;
        this.$emit('clickItem', { currentIndex: index });
      }
    },
  },
};
</script>

<style lang="scss">
.qui-tabs {
  display: flex;
  flex-direction: row;
  border-bottom: 2rpx solid #ededed;
  box-sizing: border-box;
}
.qui-tabs__item {
  position: relative;
  display: inline-flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20rpx;
  padding-bottom: 40rpx;
  box-sizing: border-box;
}
.qui-tabs__item__brief {
  font-size: 28rpx;
  color: #333;
}
.qui-tabs__item__title {
  font-size: 24rpx;
  color: #aaa;
}
.qui-tabs__item--active {
  border-bottom: 4rpx solid;
}
.qui-tabs__item--active .qui-tabs__item__title {
  color: #333;
}
</style>
