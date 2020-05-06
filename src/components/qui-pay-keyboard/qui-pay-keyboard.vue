<template>
  <view>
    <!-- mask层 -->
    <view :class="['mask', show ? '' : 'visible']"></view>
    <!-- 金额 -->
    <view :class="['content', show ? '' : 'contenthide']">
      <view class="title">
        <view class="close" @click="close()"><image src="@/static/close.png" /></view>
        <view class="center">{{ p.passwordTip }}</view>
        <view class="close"></view>
      </view>
      <view class="pay-money">
        <view>{{ p.sumOfMoney }}</view>
        <view class="money">
          ￥
          <text>11</text>
        </view>
      </view>
      <view class="pay-way">
        <view>支付方式</view>
        <view class="pay-img">
          <image src="@/static/yue.png" />
          {{ p.balance }}
        </view>
      </view>
      <view :class="['code', show ? '' : 'visible']">
        <view class="code-box">
          <block v-for="(item, index) in 6" :key="index">
            <view class="code-box-item">{{ (password[index] && '●') || '' }}</view>
          </block>
        </view>
        <input type="number" v-model="password" />
      </view>
    </view>
    <!-- 键盘 -->
    <view :class="['keyboard', show ? '' : 'active', isIphoneX ? 'isIphone' : '']">
      <block v-for="(item, index) in 9" :key="index">
        <view class="keyboard-item" @tap="key(index + 1)">{{ index + 1 }}</view>
      </block>
      <view class="keyboard-item hide"></view>
      <view class="keyboard-item" @tap="key(0)"><text>0</text></view>
      <view class="keyboard-item delte" @tap="del()">
        <image class="img" src="@/static/del.png" mode="aspectFill" :lazy-load="true"></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    isIphoneX: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      password: '',
      trantision: false,
    };
  },
  computed: {
    // 语言包
    p() {
      return this.i18n.p('pay');
    },
  },
  methods: {
    key(key) {
      if (this.password.length < 6) {
        this.password += key;
        if (this.password.length === 6) {
          console.log(this.password);
          uni.showToast({ title: '输入完成' });
        }
      }
    },
    clear() {
      this.password = '';
    },
    close() {
      this.password = '';
      this.trantision = false;
      this.$emit('close', false);
    },
    del() {
      if (this.password.length > 0) {
        this.password = this.password.substring(0, this.password.length - 1);
      }
    },
  },
};
</script>

<style lang="scss">
input {
  display: none;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  background: rgba(102, 102, 102, 0.3);
  opacity: 1;
  visibility: visible;
  transition: all 0.3s ease;
}
.content {
  position: fixed;
  top: 35%;
  left: 50%;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  width: 588rpx;
  height: 570rpx;
  margin-top: -285rpx;
  margin-left: -294rpx;
  background: #fff;
  border-radius: 15rpx;
  opacity: 1;
  visibility: visible;
  transition: all 0.3s ease;
}
.contenthide {
  z-index: 0;
  width: 700rpx;
  height: 680rpx;
  margin-top: -340rpx;
  margin-left: -350rpx;
  opacity: 0;
  visibility: hidden;
}
.visible {
  z-index: 2;
  opacity: 0;
  visibility: hidden;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 560rpx;
  height: 80rpx;
  font-size: 32rpx;
}
.center {
  font-size: 32rpx;
  color: #333;
}
.close {
  width: 50rpx;
  height: 50rpx;
}
image {
  width: 100%;
  height: 100%;
}
.pay-money {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 525rpx;
  height: 240rpx;
  border-bottom: 1rpx solid #ebebeb;
}
.pay-money view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80rpx;
}
.pay-way {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 520rpx;
  height: 85rpx;
  font-size: 28rpx;
  color: #8a8a8a;
}
.money {
  margin-bottom: 50rpx;
  font-size: 45rpx;
  font-weight: 600;
}
.money text {
  margin-left: 10rpx;
  font-size: 60rpx;
}
.pay-img {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
}
.pay-img image {
  width: 35rpx;
  height: 35rpx;
  margin-right: 10rpx;
}
.code {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 120rpx;
  background: #fff;
  box-sizing: border-box;
}
.code-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #d0d0d0;
}
.code-box-item {
  width: 86rpx;
  height: 86rpx;
  font-size: 40rpx;
  line-height: 75rpx;
  text-align: center;
  background: #fff;
}
.code-box-item:not(:last-child) {
  border-right: 1px solid #d0d0d0;
}
.keyboard {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  background: #ebebeb;
  transition: all 0.2s ease-in 0.2s;
}
.active {
  bottom: -400rpx;
}
.keyboard-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250rpx;
  height: 99rpx;
  font-size: 40rpx;
  color: #333;
  background: #fff;
  border: 1rpx solid #ebebeb;
  border-top: none;
  border-left: none;
  box-sizing: border-box;
}
.hide {
  opacity: 0;
}
.delte {
  background: none;
  box-shadow: none;
}
.delte image {
  width: 60rpx;
  height: 60rpx;
}
.isIphone {
  //   padding-bottom: 68rpx !important;
  padding-bottom: 68rpx;
}
</style>
