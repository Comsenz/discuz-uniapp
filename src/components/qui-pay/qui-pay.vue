<template>
  <view>
    <uni-popup ref="payPopup" type="bottom">
      <view class="popup-pay">
        <view class="popup-content">
          <view class="pay-title">{{ p.payHave }}{{ payType }}</view>
          <!--<qui-button size="100%" type="primary" class="payBtn" @click="publishClick()">
            {{ p.pay }}{{ money }}{{ p.rmb }}
          </qui-button>-->
          <button class="payBtn">{{ p.pay }}￥{{ money }}{{ p.rmb }}</button>
          <radio-group @change="radioChange">
            <label class="pay-radio">
              <view>
                <radio :value="checkVal" class="radio" color="#2699fb" />
              </view>
              <view :style="{ color: checkStatus ? '$2699fb' : '#333' }">{{ p.showMyHead }}</view>
            </label>
          </radio-group>
        </view>
        <view class="popup-content-space"></view>
        <text class="popup-cancel-btn" @click="cancel('share')">取消</text>
      </view>
    </uni-popup>
    <qui-pay-keyboard :show="keyboardShow"></qui-pay-keyboard>
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
</style>
