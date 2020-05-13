<template>
  <view class="wallet">
    <qui-cell-item
      title="可用余额"
      arrow
      :addon="`¥ ${dataInfo.available_amount || 0.0}`"
      class="wallet-available"
    ></qui-cell-item>
    <navigator :url="'./freeze?totalamount=' + dataInfo.freeze_amount" hover-class="none">
      <qui-cell-item
        title="冻结金额"
        arrow
        :addon="`¥ ${dataInfo.freeze_amount || 0.0}`"
      ></qui-cell-item>
    </navigator>
    <navigator url="./withdrawalslist" hover-class="none">
      <qui-cell-item title="提现记录" arrow></qui-cell-item>
    </navigator>
    <navigator url="./walletlist" hover-class="none">
      <qui-cell-item title="钱包明细" arrow></qui-cell-item>
    </navigator>
    <navigator url="./orderlist" hover-class="none">
      <qui-cell-item title="订单明细" arrow></qui-cell-item>
    </navigator>
    <qui-cell-item v-if="hasPassword" title="钱包密码" arrow :border="false"></qui-cell-item>
    <navigator :url="'../modify/paypwd?id=' + userId" hover-class="none">
      <qui-cell-item v-if="!hasPassword" title="设置支付密码" arrow :border="false"></qui-cell-item>
    </navigator>
  </view>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  components: {
    //
  },
  data() {
    return {
      dataInfo: {},
      hasPassword: false,
      userId: 1, // 获取当前登陆用户的ID
    };
  },
  onLoad() {
    this.getInfo();
  },
  methods: {
    // 获取钱包信息
    getInfo() {
      status
        .run(() => this.$store.dispatch('jv/get', 'wallet/user/1'))
        .then(res => {
          this.dataInfo = res;
          this.hasPassword = res.user.canWalletPay;
        });
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #f9fafc;
}
.wallet {
  padding-top: 40rpx;
  padding-left: 40rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;
  .cell-item {
    padding-right: 40rpx;
  }
  /deep/ .cell-item__body__content-title {
    color: #777;
  }
  .cell-item__body__right {
    color: #333;
  }
}
.wallet-available .cell-item__body__right-text {
  color: #fa5151;
}
</style>
