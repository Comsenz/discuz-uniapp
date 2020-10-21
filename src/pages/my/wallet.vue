<template>
  <qui-page :data-qui-theme="theme" class="wallet-page">
    <view class="wallet">
      <!-- <navigator url="/pages/modify/withdrawals" hover-class="none"> -->
      <view @click="nextClick()">
        <qui-cell-item
          :title="i18n.t('profile.availableamount')"
          arrow
          :addon="`¥ ${dataInfo.available_amount || 0.0}`"
          class="wallet-available"
        ></qui-cell-item>
      </view>
      <!-- </navigator> -->
      <navigator url="/pages/my/freeze" hover-class="none">
        <qui-cell-item
          :title="i18n.t('profile.freezeamount')"
          arrow
          :addon="`¥ ${dataInfo.freeze_amount || 0.0}`"
        ></qui-cell-item>
      </navigator>
      <navigator url="/pages/my/withdrawalslist" hover-class="none">
        <qui-cell-item :title="i18n.t('profile.withdrawalslist')" arrow></qui-cell-item>
      </navigator>
      <navigator url="/pages/my/walletlist" hover-class="none">
        <qui-cell-item :title="i18n.t('profile.walletlist')" arrow></qui-cell-item>
      </navigator>
      <navigator url="/pages/my/orderlist" hover-class="none">
        <qui-cell-item :title="i18n.t('profile.orderlist')" arrow></qui-cell-item>
      </navigator>
      <navigator :url="'/pages/modify/authen?id=' + userId" hover-class="none">
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
    <uni-popup ref="wechatPopup" type="center">
      <uni-popup-dialog
        type="warn"
        :content="wechatTip"
        :before-close="true"
        @close="handleWechatClickCancel"
        @confirm="handleWechatClickOk"
      ></uni-popup-dialog>
    </uni-popup>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';
import loginModule from '@/mixin/loginModule';
// #ifdef  H5
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  components: { uniPopupDialog },
  mixins: [
    forums,
    user,
    loginModule,
    // #ifdef H5
    appCommonH,
    // #endif
  ],
  data() {
    return {
      dataInfo: {},
      hasPassword: false,
      userId: this.$store.getters['session/get']('userId'), // 获取当前登陆用户的ID
      wechatTip: this.i18n.t('discuzq.wechatBind'), // 微信绑定提示
    };
  },
  onLoad() {
    this.getInfo();
    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    this.isPhone = appCommonH.isWeixin().isPhone; // 这是h5
    this.browser = 1;
    if (this.type === 1) {
      uni.$on('vditor', (vditor, vditorComponent) => {
        this.vditor = vditor;
        this.vditor.setValue(this.textAreaValue);
        vditorComponent.setPostComponent(this);
      });
    }
    // #endif
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
    // 判断是否开通企业到付零钱服务
    nextClick() {
      uni.setStorage({
        key: 'page',
        data: '/pages/my/wallet',
      });
      // #ifdef H5
      if (!this.isWeixin) {
        uni.navigateTo({
          url: `/pages/modify/withdrawals`,
        });
      } else if (
        this.forums &&
        this.forums.paycenter.wxpay_mchpay_close === false &&
        this.isWeixin === true
      ) {
        uni.navigateTo({
          url: `/pages/modify/withdrawals`,
        });
      } else if (this.forums && this.forums.paycenter.wxpay_mchpay_close) {
        if (
          (this.isWeixin === true && this.user.wechat === undefined) ||
          (this.user.wechat && this.user.wechat.mp_openid === '')
        ) {
          this.$refs.wechatPopup.open();
          return;
        }
        uni.navigateTo({
          url: `/pages/modify/withdrawals`,
        });
      }
      // #endif

      // #ifdef MP-WEIXIN
      if (this.forums && this.forums.paycenter.wxpay_mchpay_close === false) {
        uni.navigateTo({
          url: `/pages/modify/withdrawals`,
        });
        return;
      }
      if (
        this.user.wechat === undefined ||
        (this.user.wechat && this.user.wechat.min_openid === '')
      ) {
        this.$refs.wechatPopup.open();
      } else {
        uni.navigateTo({
          url: `/pages/modify/withdrawals`,
        });
      }
      // #endif
    },
    // 确认去绑定微信
    handleWechatClickOk() {
      // #ifdef MP-WEIXIN
      this.mpLogin();
      // #endif
      // #ifdef H5
      if (this.isWeixin) {
        this.wxh5Login(0, 0);
      } else {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.unLogin'),
          duration: 2000,
        });
      }
      // #endif
    },
    // 取消去绑定微信
    handleWechatClickCancel() {
      this.$refs.wechatPopup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.wallet-page /deep/ {
  overflow: hidden;
  .wallet {
    padding-top: 20rpx;
    padding-left: 40rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .cell-item {
    padding-right: 40rpx;
  }
  .cell-item__body__content-title {
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
