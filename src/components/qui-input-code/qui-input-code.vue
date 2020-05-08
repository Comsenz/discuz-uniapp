<template>
  <view class="modify-vftion">
    <view class="modify-vftion-input" @tap="onFocus">
      <input
        type="number"
        class="hidden-ipt"
        maxlength="6"
        :focus="isFocus"
        @input="setValue"
        @blur="lose"
        v-model="inpcont"
      />
      <input
        :class="
          title ? 'hidden-ipt-input2' : iptValue[0] ? 'hidden-ipt-input' : 'hidden-ipt-input alias'
        "
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 1 ? iptValue[0] : ''"
      />
      <input
        :class="
          title ? 'hidden-ipt-input2' : iptValue[1] ? 'hidden-ipt-input' : 'hidden-ipt-input alias'
        "
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 2 ? iptValue[1] : ''"
      />
      <input
        :class="
          title ? 'hidden-ipt-input2' : iptValue[2] ? 'hidden-ipt-input' : 'hidden-ipt-input alias'
        "
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 3 ? iptValue[2] : ''"
      />
      <input
        :class="
          title ? 'hidden-ipt-input2' : iptValue[3] ? 'hidden-ipt-input' : 'hidden-ipt-input alias'
        "
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 4 ? iptValue[3] : ''"
      />
      <input
        :class="
          title ? 'hidden-ipt-input2' : iptValue[4] ? 'hidden-ipt-input' : 'hidden-ipt-input alias'
        "
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 3 ? iptValue[4] : ''"
      />
      <input
        :class="
          title ? 'hidden-ipt-input2' : iptValue[5] ? 'hidden-ipt-input' : 'hidden-ipt-input alias'
        "
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 4 ? iptValue[5] : ''"
      />
    </view>
    <view class="hidden-ipt-test" v-if="title">
      {{ text }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      default: false,
      type: Boolean,
    },
    text: {
      default: '输入错误',
      type: String,
    },
    number: {
      default: 'number',
      type: String,
    },
  },
  data() {
    return {
      iptValue: '',
      isFocus: false,
      inpcont: '',
    };
  },
  methods: {
    onFocus() {
      this.isFocus = true;
    },
    setValue(event) {
      // 文本框输入事件
      const { value } = event.target;
      setTimeout(() => {
        this.iptValue = value;
      }, 1); // 重点
    },
    lose() {
      this.isFocus = false;
      this.$emit('getdata', this.inpcont);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.modify-vftion {
  width: 710rpx;
}
.modify-vftion-input {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.hidden-ipt {
  width: 0;
  height: 0;
  margin: 0;
  border: 0;
}
.hidden-ipt-input {
  width: 92rpx;
  height: 98rpx;
  margin: 0 24rpx 0 0;
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 45rpx;
  text-align: center;
  border-bottom: 2rpx solid --color(--qui-FC-333);
}
.hidden-ipt-input2 {
  width: 92rpx;
  height: 98rpx;
  margin: 0 24rpx 0 0;
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 45rpx;
  color: --color(--qui-RED);
  text-align: center;
  border-bottom: 2rpx solid --color(--qui-RED);
}
.alias {
  border-bottom: 2rpx solid rgba(197, 202, 213, 1);
}
.hidden-ipt-test {
  margin: 21rpx 0 0;
  font-size: $fg-f24;
  font-weight: 400;
  color: --color(--qui-RED);
  opacity: 1;
}
</style>
