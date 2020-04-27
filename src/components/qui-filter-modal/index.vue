<template>
  <view
    class="filter-modal"
    :class="{ show: showValue }"
    @tap.stop="cancel"
    :style="{
      top: top + 'rpx',
    }"
  >
    <view class="filter-modal__content" v-if="showValue" @tap.stop>
      <view v-for="(item, index) in filterList" class="filter-modal__content__item" :key="index">
        <view class="filter-modal__content__item-title">{{ item.title }}</view>
        <view
          v-for="(filterItem, filterIndex) in item.data"
          :class="!filterItem.selected ? '' : 'active'"
          :key="filterIndex"
          @click="changeSelected(filterItem, index, filterIndex)"
          class="filter-modal__content__item-detail"
        >
          {{ filterItem.label }}
        </view>
      </view>
      <view class="filter-modal__content__confirm" @tap.stop="confirm" v-if="ifNeedConfirm">
        {{ confirmText }}
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 筛选弹框
 * @property {String} confirmText 确定弹框的文字 -默认：筛选
 * @property {Boolean} value 显示隐藏 - 默认： 否
 * @property {Array} selectedData 选中的items 
 * @property {Boolean} ifNeedConfirm 是否需要确定按钮
 * @property {Array} filterList 筛选条件 - 数据格式 
        [{
          title: '板块1',
          data: [
            { label: '细类1', value: '1',selected:true },
            { label: '细类2', value: '2' ,selected:'false},
          ],
        },
        {
          title: '板块2',
          data: [
            { label: '细类1', value: '1' ,selected:'false},
            { label: '细类2', value: '1' ,selected:'false},
          ],
        },],
 * @event {Function} confirm  点击确定
 * @event {Function} cancel  取消事件
 * @event {Function} changeSelected  切换选中
 * @example <filter-modal v-model="show" @confirm="confirm" :filter-list="filterList"></filter-modal>
 */
export default {
  name: 'FilterModal',
  props: {
    confirmText: {
      type: String,
      default: '筛选',
    },
    ifNeedConfirm: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
    filterList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    top: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showValue: this.value,
      selectedData: [],
    };
  },
  watch: {
    value(n) {
      this.showValue = n;
    },
    showValue(n) {
      this.$emit('input', n);
    },
  },
  methods: {
    confirm() {
      this.showValue = false;
      this.$emit('confirm', this.selectedData);
      this.selectedData = [];
    },
    cancel() {
      this.showValue = false;
      this.$emit('cancel');
      this.selectedData = [];
    },
    changeSelected(item, dataIndex, filterIndex) {
      if (!this.ifNeedConfirm) {
        this.selectedData.push(item);
        this.confirm();
        return;
      }
      // 设置选中取消
      const current = this.filterList[dataIndex].data[filterIndex];
      console.log(current);
      if (current.selected) {
        current.selected = false;
        this.selectedData = this.selectedData.filter(obj => obj.value !== item.value);
      } else {
        current.selected = true;
        this.selectedData.push(item);
      }

      this.$emit('changeSelected', { item, dataIndex, filterIndex });
    },
  },
};
</script>

<style lang="scss">
.filter-modal {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
}
@keyframes fadeZoom {
  0% {
    opacity: 0.6;
    transform: scale(0.7);
  }
  80% {
    opacity: 0.3;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.filter-modal__content {
  position: absolute;
  top: 0;
  width: 100%;
  padding: 30rpx;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
  animation: fadeZoom 0.15s linear;
}
.filter-modal.show {
  opacity: 1;
  visibility: visible;
}
.filter-modal__content__confirm {
  height: 90rpx;
  margin-top: 40rpx;
  line-height: 90rpx;
  color: #fff;
  text-align: center;
  background: rgba(24, 120, 243, 1);
  border-radius: 5rpx;
}
.filter-modal__content__item {
  text-align: left;
}
.filter-modal__content__item-title {
  padding-top: 10rpx;
  padding-bottom: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
}
.filter-modal__content__item-detail {
  display: inline-block;
  height: 70rpx;
  padding: 0 20rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 26rpx;
  line-height: 70rpx;
  color: #777;
  background: #f9fafc;
  border: 1rpx solid #cdf;
  border-radius: 10rpx;
  &.active {
    color: #fff;
    background: #1878f3;
    border: 0;
  }
}
</style>
