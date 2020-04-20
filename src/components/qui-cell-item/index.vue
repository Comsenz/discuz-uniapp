<template>
  <view :class="['qui-cell-item', 'cell-wrap', { border: border }]" @tap="$_click">
    <view class="qui-cell-item-body">
      <view class="qui-cell-item-left" v-if="slotLeft">
        <slot></slot>
      </view>
      <view class="qui-cell-item-content">
        <view class="qui-cell-item-title" v-if="title" v-text="title"></view>
        <view class="qui-cell-item-brief" v-if="brief" v-text="brief"></view>
      </view>
      <view class="qui-cell-item-right" v-if="slotRight">
        <slot></slot>
        <text class="quiicons icon-folding-r" v-if="arrow"></text>
      </view>
      <view class="qui-cell-item-right" v-if="!slotRight">
        <text class="qui-cell-addon-text">
          {{ addon }}
        </text>
        <text class="quiicons icon-folding-r" v-if="arrow"></text>
        <view class="qui-brief-right" v-if="briefRight">{{ briefRight }}</view>
      </view>
    </view>
    <view
      v-if="addon2"
      v-text="addon2"
      class="qui-cell-item-children"
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
 * @example <qui-cell-item title="普通条目" addon="附加文案" arrow></qui-cell-item>
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
.cell-wrap {
  position: relative;
}
.qui-cell-item.border {
  border-bottom: 2rpx solid #ededed;
}

.qui-cell-item-body {
  position: relative;
  display: flex;
  height: 100rpx;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.qui-cell-item-title {
  font-size: 28rpx;
}

.qui-cell-item-brief,
.qui-brief-right {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #aaa;
}

.qui-cell-item-content {
  flex: 1 1 0%;
}

.qui-cell-item-right {
  align-items: center;
  justify-content: flex-end;
  font-size: 28rpx;
  text-align: right;
}

.qui-cell-item-right .qui-cell-addon-text {
  font-size: 28rpx;
}

.qui-cell-item-children {
  padding: 20upx 0;
  margin: 0 20upx;
}

.qui-cell-item.is-disabled .qui-cell-item-content,
.qui-cell-item.is-disabled .qui-cell-item-title,
.qui-cell-item.is-disabled .qui-cell-item-brief,
.qui-cell-item.is-disabled .qui-cell-item-left,
.qui-cell-item.is-disabled .qui-cell-item-right,
.qui-cell-item.is-disabled .qui-brief-right,
.qui-cell-item.is-disabled .qui-cell-item-children {
  color: #c5cad5;
}
.icon-folding-r {
  margin-left: 20rpx;
  font-size: 18rpx;
  color: #ddd;
}
</style>
