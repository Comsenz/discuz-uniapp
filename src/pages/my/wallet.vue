<template>
  <view class="wallet">
    <cell-item
      title="可用余额"
      arrow
      :addon="`¥ ${dataInfo.available_amount || 0.0}`"
      class="wallet-available"
    ></cell-item>
    <navigator url="./freeze" open-type="navigate">
      <cell-item title="冻结金额" arrow :addon="`¥ ${dataInfo.freeze_amount || 0.0}`"></cell-item>
    </navigator>
    <navigator url="./withdrawalslist" open-type="navigate">
      <cell-item title="提现记录" arrow></cell-item>
    </navigator>
    <navigator url="./walletlist" open-type="navigate">
      <cell-item title="钱包明细" arrow></cell-item>
    </navigator>
    <navigator url="./orderlist" open-type="navigate">
      <cell-item title="订单明细" arrow></cell-item>
    </navigator>
    <cell-item v-if="hasPassword" title="钱包密码" arrow :border="false"></cell-item>
    <cell-item v-if="!hasPassword" title="设置支付密码" arrow :border="false"></cell-item>
  </view>
</template>

<script>
import cellItem from '@/components/qui-cell-item';
import { status } from 'jsonapi-vuex';

export default {
  components: {
    cellItem,
  },
  data() {
    return {
      dataInfo: {},
      hasPassword: false,
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
.wallet-available {
  color: #fa5151;
}
</style>
