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
        :class="title ? 'hidden-ipt-input2' : 'hidden-ipt-input'"
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 1 ? iptValue[0] : ''"
      />
      <input
        :class="title ? 'hidden-ipt-input2' : 'hidden-ipt-input'"
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 2 ? iptValue[1] : ''"
      />
      <input
        :class="title ? 'hidden-ipt-input2' : 'hidden-ipt-input'"
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 3 ? iptValue[2] : ''"
      />
      <input
        :class="title ? 'hidden-ipt-input2' : 'hidden-ipt-input'"
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 4 ? iptValue[3] : ''"
      />
      <input
        :class="title ? 'hidden-ipt-input2' : 'hidden-ipt-input'"
        :type="number"
        disabled
        @tap="onFocus"
        :value="iptValue.length >= 3 ? iptValue[4] : ''"
      />
      <input
        :class="title ? 'hidden-ipt-input2' : 'hidden-ipt-input'"
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
      if (value.length >= 6) {
        this.$emit('getdata', this.inpcont);
      }
    },
    lose() {
      this.isFocus = false;
      this.$emit('getdata', this.inpcont);
      console.log(this.title);
    },
  },
};
</script>

<style lang="scss">
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
  font-size: 50rpx;
  font-weight: bold;
  line-height: 45rpx;
  text-align: center;
  border-bottom: 2rpx solid #333;
}
.hidden-ipt-input2 {
  width: 92rpx;
  height: 98rpx;
  margin: 0 24rpx 0 0;
  font-size: 50rpx;
  font-weight: bold;
  line-height: 45rpx;
  color: rgba(250, 81, 81, 1);
  text-align: center;
  border-bottom: 2rpx solid #fa5151;
}
.hidden-ipt-test {
  font-size: 24rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(250, 81, 81, 1);
  opacity: 1;
}
</style>
