<template>
  <view>
    <uni-popup ref="payPopup" type="bottom">
      <view class="popup-pay">
        <view class="popup-content">
          <view class="pay-title">{{ p.payHave }}{{ payType }}</view>
          <!--<qui-button size="100%" type="primary" class="payBtn" @click="publishClick()">
            {{ p.pay }}{{ money }}{{ p.rmb }}
          </qui-button>-->
          <button class="payBtn" @click="payChoice">{{ p.pay }}￥{{ money }}{{ p.rmb }}</button>
          <radio-group @change="radioChange">
            <label class="pay-radio">
              <view>
                <radio :value="checkVal" class="radio" color="#2699fb" />
              </view>
              <view :style="{ color: checkStatus ? '#2699fb' : '#333' }">{{ p.showMyHead }}</view>
            </label>
          </radio-group>
        </view>
        <view class="popup-content-space"></view>
        <text class="popup-cancel-btn" @click="cancel('1')">取消</text>
      </view>
    </uni-popup>
    <uni-popup ref="payTypePopup" type="bottom">
      <view class="popup-pay-type">
        <view class="pay-title">{{ p.payHave }}{{ payType }}</view>
        <view class="money--box">
          ￥
          <view class="money-num">{{ money }}</view>
        </view>
        <view class="pay-type-chi" v-for="(item, index) in payTypeData" :key="index">
          <view class="pay-type-l">
            <qui-icon name="icon-wxPay" class="icon-pay wxpay"></qui-icon>
            <view class="pay-type-word">{{ p.wxPay }}</view>
          </view>
          <view class="pay-type-r">
            <radio-group @change="radioChange" class="pay-radio-box">
              <label class="pay-radio">
                <view>
                  <radio :value="checkVal" class="radio" color="#2699fb" />
                </view>
              </label>
            </radio-group>
          </view>
        </view>
        <!--<view class="pay-type-chi">
          <view class="pay-type-l">
            <qui-icon name="icon-walletPay" class="icon-pay walletpay"></qui-icon>
            <view class="pay-type-word">{{ p.walletPay }}</view>
          </view>
          <view class="pay-type-r">
            <view class="check-tip">{{ p.walletBalance }}，￥{{ balance }}</view>
            <radio-group @change="radioChange" class="pay-radio-box">
              <label class="pay-radio">
                <view>
                  <radio :value="checkVal" class="radio" color="#2699fb" />
                </view>
              </label>
            </radio-group>
          </view>
        </view>-->
        <qui-button size="100%" type="primary" class="paySureBtn" @tap="payClickShow()">
          {{ p.surePay }}￥{{ money }}{{ p.rmb }}
        </qui-button>
        <view class="pay-tip">
          ￥{{ money }}{{ p.rmb }}{{ p.payTo }}，{{ toName }}{{ p.ofAccount }}
        </view>
        <view class="popup-share-content-space"></view>

        <text class="popup-share-btn" @click="cancel('2')">取消</text>
      </view>
    </uni-popup>
    <qui-pay-keyboard :show="keyboardShow" :password="payPassword" @key="key"></qui-pay-keyboard>
  </view>
</template>

<script>
export default {
  props: {
    // 支付金额
    money: {
      type: String,
      default: '0.00',
    },
    // 余额
    balance: {
      type: String,
      default: '0.00',
    },
    payType: {
      type: String,
      default: '权限',
    },
    toName: {
      type: String,
      default: '',
    },
    payTypeData: {
      type: Array,
      default: () => {
        return [
          {
            name: '微信支付',
            icon: 'icon-wxPay',
          },
        ];
      },
    },
    payPassword: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      password: '',
      trantision: false,
      keyboardShow: false,
      checkVal: '0',
      checkStatus: false, // 单选框状态
    };
  },
  computed: {
    p() {
      return this.i18n.t('pay');
    },
  },
  onLoad() {},

  methods: {
    // 父组件触发是否显示弹框
    payClickShow() {
      console.log('这是父组件触发的事件');
      this.$refs.payPopup.open();
    },
    // 单选框change事件
    radioChange() {
      console.log('这是change事件');
      this.checkStatus = true;
      this.$emit('radioChange');
    },
    // 确认支付，选择支付方式
    payChoice() {
      console.log('确认支付，选择支付方式');
      this.$refs.payPopup.close();
      this.$refs.payTypePopup.open();
    },
    // 取消支付
    cancel(type) {
      console.log(type);
      if (type === '1') {
        this.$refs.payPopup.close();
      } else {
        this.$refs.payTypePopup.close();
      }
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.popup-pay {
  display: flex;
  flex-direction: column;
  background: --color(--qui-BG-2);
}
.popup-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-FC-DDD);
}
.popup-cancel-btn {
  height: 100rpx;
  font-size: $fg-f28;
  line-height: 90rpx;
  color: #666;
  text-align: center;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}
.popup-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.pay-title {
  padding-top: 40rpx;
  padding-bottom: 20rpx;
  font-size: $fg-f28;
  line-height: 37rpx;
  text-align: center;
}
.payBtn {
  width: 265rpx;
  height: 90rpx;
  font-size: $fg-f28;
  line-height: 90rpx;
  color: #fff;
  text-align: center;
  background: --color(--qui-RED);
}
.pay-radio {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 20rpx 0 40rpx;
  .radio {
    transform: scale(0.7);
  }
}
.popup-pay-type {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: --color(--qui-BG-2);
}
.money--box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 40rpx;
  line-height: 80rpx;
  .money-num {
    font-size: 60rpx;
    line-height: 80rpx;
  }
}
.pay-type-chi {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 99rpx;
  padding: 0 40rpx;
  align-items: center;
}
.pay-type-l {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.pay-type-r {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.icon-pay {
  margin-right: 20rpx;
  font-size: 60rpx;
}
.wxpay {
  color: #09bb07;
}
.walletpay {
  color: #1878f3;
}
.pay-tip {
  padding: 40rpx 0;
  font-size: $fg-f24;
  color: --color(--qui-FC-AAA);
  text-align: center;
}
.check-tip {
  padding-right: 20rpx;
  font-size: $fg-f24;
  color: --color(--qui-FC-AAA);
}
.pay-radio-box {
  height: 99rpx;
}
.popup-share-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-FC-DDD);
}
.popup-share-btn {
  height: 100rpx;
  font-size: $fg-f28;
  line-height: 90rpx;
  color: #666;
  text-align: center;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}
.paySureBtn {
  width: 100%;
  border-radius: 0;
}
</style>
