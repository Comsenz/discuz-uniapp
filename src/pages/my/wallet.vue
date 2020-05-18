<template>
  <qui-page class="wallet-page">
    <view class="wallet">
      <navigator url="/pages/modify/withdrawals" hover-class="none">
        <qui-cell-item
          :title="i18n.t('profile.availableamount')"
          arrow
          :addon="`¥ ${dataInfo.available_amount || 0.0}`"
          class="wallet-available"
        ></qui-cell-item>
      </navigator>
      <navigator :url="'./freeze'" hover-class="none">
        <qui-cell-item
          :title="i18n.t('profile.freezeamount')"
          arrow
          :addon="`¥ ${dataInfo.freeze_amount || 0.0}`"
        ></qui-cell-item>
      </navigator>
      <navigator url="./withdrawalslist" hover-class="none">
        <qui-cell-item :title="i18n.t('profile.withdrawalslist')" arrow></qui-cell-item>
      </navigator>
      <navigator url="./walletlist" hover-class="none">
        <qui-cell-item :title="i18n.t('profile.walletlist')" arrow></qui-cell-item>
      </navigator>
      <navigator url="./orderlist" hover-class="none">
        <qui-cell-item :title="i18n.t('profile.orderlist')" arrow></qui-cell-item>
      </navigator>
      <navigator :url="`/pages/modify/editpwd?id=${userId}`" hover-class="none">
        <qui-cell-item
          v-if="hasPassword"
          :title="i18n.t('profile.walletpassword')"
          arrow
          :border="false"
        ></qui-cell-item>
      </navigator>
      <navigator :url="`/pages/modify/paypwd?id=${userId}`" hover-class="none">
        <qui-cell-item
          v-if="!hasPassword"
          :title="i18n.t('profile.setpaypassword')"
          arrow
          :border="false"
        ></qui-cell-item>
      </navigator>
    </view>
  </qui-page>
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
      userId: uni.getStorageSync('user_id'), // 获取当前登陆用户的ID
    };
  },
  onLoad() {
    this.getInfo();
  },
  methods: {
    // 获取钱包信息
    getInfo() {
      status
        .run(() => this.$store.dispatch('jv/get', `wallet/user/${this.userId}`))
        .then(res => {
          this.dataInfo = res;
          this.hasPassword = res.user.canWalletPay;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.wallet {
  padding-top: 40rpx;
  padding-left: 40rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  /deep/ .cell-item {
    padding-right: 40rpx;
  }
  /deep/ .cell-item__body__content-title {
    color: --color(--qui-FC-777);
  }
  .cell-item__body__right {
    color: --color(--qui-FC-333);
  }
}
.wallet-available /deep/ .cell-item__body__right-text {
  color: --color(--qui-RED);
}
</style>
