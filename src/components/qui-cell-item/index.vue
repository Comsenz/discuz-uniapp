<template>
  <view :class="['cell-item', 'cell-item--wrap', { border: border }]" @tap="$_click">
    <view class="cell-item__body">
      <view class="cell-item__body__left" v-if="slotLeft">
        <slot></slot>
      </view>
      <view class="cell-item__body__content">
        <view class="cell-item__body__content-title" v-if="title" v-text="title"></view>
        <view class="cell-item__body__content-brief" v-if="brief" v-text="brief"></view>
      </view>
      <view class="cell-item__body__right" v-if="slotRight">
        <slot></slot>
        <qui-icon class="text" name="icon-folding-r" size="16" color="#ddd" v-if="arrow"></qui-icon>
      </view>
      <view class="cell-item__body__right" v-if="!slotRight">
        <text class="cell-item__body__right-text">
          {{ addon }}
        </text>
        <qui-icon class="text" name="icon-folding-r" size="16" color="#ddd" v-if="arrow"></qui-icon>
        <view class="cell-item__body__right-brief" v-if="briefRight">{{ briefRight }}</view>
      </view>
    </view>
    <view
      v-if="addon2"
      v-text="addon2"
      class="cell-item_children"
      style="font-size: 24upx;color: #858b9c;"
    ></view>
  </view>
</template>

<script>
/**
 * 列表单元组件
 * @property {String} title 标题 - 默认：空
 * @property {String} brief 标题下描述文本 - 默认：空
 * @property {String} addon 右侧文字 - 默认：空
 * @property {String} briefRight 右侧文字下描述 - 默认：空
 * @property {Boolean} arrow 右箭头 - 默认：false
 * @property {String} addon2 附加文本2 - 在列表单元下显示文字说明，默认：空
 * @property {Boolean} disabled 禁用状态 - 默认：false
 * @property {Boolean} border 下边框 - 默认：true
 * @property {Boolean} slot-left 插槽左 - 不可同时打开两个插槽，默认：false
 * @property {Boolean} slot-right 插槽右 - 不可再使用addon，默认：false
 * @event {Function} click 列表单元项 点击事件
 * @example <cell-item title="普通条目" addon="附加文案" arrow></cell-item>
 */
export default {
  name: 'QuiCellItem',

  props: {
    title: {
      type: String,
      default: '',
    },
    brief: {
      type: String,
      default: '',
    },
    addon: {
      type: String,
      default: '',
    },
    arrow: {
      type: Boolean,
      default: false,
    },
    addon2: {
      type: String,
      default: '',
    },
    briefRight: {
      type: String,
      default: '',
    },
    border: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    slotLeft: {
      type: Boolean,
      default: false,
    },
    slotRight: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    /**
     * item项点击事件
     */
    $_click(e) {
      if (!this.disabled) {
        this.$emit('click', e);
      }
    },
  },
};
</script>

<style lang="scss">
.cell-item--wrap {
  position: relative;
}
.cell-item.border {
  border-bottom: 2rpx solid #ededed;
}

.cell-item__body {
  position: relative;
  display: flex;
  height: 100rpx;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.cell-item__body__content-title {
  font-size: 28rpx;
}

.cell-item__body__content-brief,
.cell-item__body__right-brief {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #aaa;
}

.cell-item__body__content {
  flex: 1 1 0%;
}

.cell-item__body__right {
  align-items: center;
  justify-content: flex-end;
  font-size: 28rpx;
  text-align: right;
}

.cell-item__body__right .cell-item__body__right-text {
  font-size: 28rpx;
}

.cell-item__children {
  padding: 20upx 0;
  margin: 0 20upx;
}

.cell-item.is-disabled .cell-item__body__content,
.cell-item.is-disabled .cell-item__body__content-title,
.cell-item.is-disabled .cell-item__body__content-brief,
.cell-item.is-disabled .cell-item__body__left,
.cell-item.is-disabled .cell-item__body__right,
.cell-item.is-disabled .cell-item__body__right-brief,
.cell-item.is-disabled .cell-item__children {
  color: #c5cad5;
}
.qui-icon {
  margin-left: 20rpx;
  font-size: 18rpx;
  color: #ddd;
}
</style>
