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
 * @property {Array} filterList 筛选条件 - 数据格式  默认是false
        [{
          title: '板块1',
          data: [
            { label: '细类1', value: '1',selected:true },
            { label: '细类2', value: '2' ,selected:false},
          ],
        },
        {
          title: '板块2',
          data: [
            { label: '细类1', value: '1' ,selected:false},
            { label: '细类2', value: '1' ,selected:false},
          ],
        }],
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
    multiSelect: {
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
      // 如果没有选中默认给每项的第一项
      // const data = [];
      this.selectedData.forEach((v, i) => {
        if (v.data.length === 0) {
          this.filterList[i].data[0].selected = true;
          this.selectedData[i].data.push(this.filterList[i].data[0]);
        }
      });
      this.$emit('confirm', this.selectedData);
      this.$emit('change', this.filterList);
      this.selectedData = [];
    },
    cancel() {
      this.showValue = false;
      this.$emit('cancel');
      this.selectedData = [];
    },
    // dataIndex : 板块index  filterIndex : 细类index
    changeSelected(item, dataIndex, filterIndex) {
      // 区分单选多选
      if (!this.multiSelect) {
        const moduleData = this.filterList[dataIndex].data;
        moduleData.forEach((v, index) => {
          moduleData[index].selected = index === filterIndex;
        });
        this.selectedData[dataIndex].data = item;
        // 不需要确定按钮
        if (!this.ifNeedConfirm) {
          this.confirm();
        }
      } else {
        // const moduleData = this.filterList[dataIndex].data;
        // if (moduleData.selected) {
        //   this.filterList[dataIndex].data.selected = false;
        //   this.filterList[dataIndex].data.splice(filterIndex, 1);
        // } else {
        //   this.filterList[dataIndex].data.selected = true;
        //   this.filterList[dataIndex].data.push(item);
        // }
      }
      // 动态改变数据
      this.$emit('change', this.filterList);
    },
    // 传入的值放入选中里面,保证按照分类顺序展示
    setData() {
      const selectedData = [];
      this.filterList.forEach((v, i) => {
        let flag = false;
        v.data.forEach(item => {
          if (item.selected) {
            flag = true;
            selectedData[i] = { title: v.title, data: item };
          }
        });
        if (!flag) {
          selectedData[i] = { title: v.title, data: [] };
        }
      });
      this.selectedData = selectedData;
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
