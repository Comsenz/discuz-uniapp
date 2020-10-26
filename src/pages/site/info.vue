<template>
  <qui-page :data-qui-theme="theme" class="site" :header="false">
    <qui-site-thread share-url="pages/site/info"></qui-site-thread>
    <view class="site-invite">
      <view class="site-invite__detail" v-if="isLogin">
        <text>{{ i18n.t('site.justonelaststepjoinnow') }}</text>
        <text class="site-invite__detail__bold">
          {{ forums.set_site && forums.set_site.site_name }}
        </text>
        <text>{{ i18n.t('site.site') }}</text>
      </view>
    </view>
    <view class="site-submit">
      <view>
        <view class="site-submit__price">
          {{ `¥${(forums.set_site && forums.set_site.site_price) || 0}` }}
        </view>
        <view class="site-submit__expire">
          {{
            forums.set_site && forums.set_site.site_expire
              ? `${i18n.t('site.periodvalidity')} ${forums.set_site &&
                  forums.set_site.site_expire} ${i18n.t('site.day')}`
              : i18n.t('site.permanent')
          }}
        </view>
      </view>
      <qui-button type="primary" @click="submit" size="small">
        {{ isLogin ? i18n.t('site.paynow') : i18n.t('site.join') + i18n.t('site.site') }}
      </qui-button>
    </view>
    <view v-if="payShowStatus">
      <qui-pay
        ref="payShow"
        :money="forums.set_site && parseFloat(forums.set_site.site_price)"
        :wallet-status="true"
        :balance="10"
        :current-pay-type="0"
        :pay-type-data="payTypeData"
        @radioMyHead="radioMyHead"
        @onInput="onInput"
        @paysureShow="paysureShow"
      ></qui-pay>
    </view>
    <uni-popup ref="codePopup" type="center" class="code-popup-box">
      <view class="code-content" v-if="qrcodeShow">
        <view class="code-title">{{ pay.payNow }}</view>
        <view class="code-pay-money">
          <view class="code-yuan">￥</view>
          {{ forums.set_site && forums.set_site.site_price }}
        </view>
        <view class="code-type-box">
          <view class="code-type-tit">{{ pay.payType }}</view>
          <view class="code-type">
            <qui-icon class="code-type-icon" name="icon-wxPay" size="36" color="#09bb07"></qui-icon>
            <view class="code-type-text">{{ pay.wxPay }}</view>
          </view>
        </view>
        <image :src="codeUrl" class="code-img"></image>
        <view class="code-tip">{{ pay.wechatIdentificationQRcode }}</view>
      </view>
    </uni-popup>
    <uni-popup ref="wechatPopup" type="center">
      <uni-popup-dialog
        type="warn"
        :content="wechatTip"
        :before-close="true"
        @close="handleWechatClickCancel"
        @confirm="handleWechatClickOk"
      ></uni-popup-dialog>
    </uni-popup>
    <qui-toast ref="toast"></qui-toast>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';
import loginModule from '@/mixin/loginModule';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
// #endif
import { getCurUrl } from '@/utils/getCurUrl';

let payWechat = null;
export default {
  components: { uniPopupDialog },
  mixins: [
    forums,
    loginModule,
    // #ifdef H5
    appCommonH,
    // #endif
  ],
  data() {
    return {
      payShowStatus: true, // 是否显示支付
      codeUrl: '', // 二维码支付url，base64
      shareShow: false, // h5内分享提示信息
      isAnonymous: '0',
      qrcodeShow: false, // 二维码弹框
      isWeixin: '', // 是否是微信浏览器内
      isPhone: false,
      wxRes: '',
      browser: 0, // 0为小程序，1为除小程序之外的设备
      payStatus: false, // 订单支付状态
      orderSn: '', // 订单编号
      isLogin: this.$store.getters['session/get']('isLogin'),
      wechatTip: this.i18n.t('discuzq.wechatBind'), // 微信绑定提示
      payTypeData: [
        {
          name: this.i18n.t('pay.wxPay'),
          icon: 'icon-wxPay',
          color: '#09bb07',
          value: '0',
        },
      ],
    };
  },
  computed: {
    // pay支付语言包
    pay() {
      return this.i18n.t('pay');
    },
    userId() {
      return this.$store.getters['session/get']('userId');
    },
    user() {
      return this.$store.getters['jv/get'](`users/${this.userId}`);
    },
  },
  created() {
    // 华为手机支付后不刷新也不进入任何生命周期的情况
    this.$u.event.$on('refresh', () => {
      window.location.reload();
    });
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    uni.hideHomeButton();
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    // #endif
    this.$u.event.$on('logind', data => {
      // 点击授权登陆成功后如果是已付费去首页
      if (data.paid) {
        uni.redirectTo({
          url: '/pages/home/index',
        });
      }
    });
    // #ifdef  H5
    this.isWeixin = appCommonH.isWeixin().isWeixin;
    this.isPhone = appCommonH.isWeixin().isPhone;
    this.browser = 1;
    // #endif
    // 已经支付过的直接去首页
    if (!this.userId) {
      return;
    }
    this.userInfo();
  },
  onUnload() {
    clearInterval(payWechat);
  },
  // 唤起小程序原声分享
  onShareAppMessage(res) {
    // 来自页面内分享按钮
    if (res.from === 'button') {
      return {
        title: this.forums.set_site.site_name,
      };
    }
    return {
      title: this.forums.set_site.site_name,
    };
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.forums.set_site.site_name,
      query: '',
    };
  },
  methods: {
    userInfo() {
      const params = {
        include: 'groups',
      };
      this.$store.dispatch('jv/get', [`users/${this.userId}`, { params }]).then(res => {
        if (res.paid) {
          window.location.href = '/pages/home/index';
        }
      });
    },
    // 支付是否显示用户头像
    radioMyHead(val) {
      this.isAnonymous = val;
    },
    // 输入密码完成时
    onInput(val) {
      this.value = val;
      this.creatOrder(this.forums.set_site.site_price, 1, val);
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
    // 支付方式选择完成点击确定时
    paysureShow() {
      uni.setStorage({
        key: 'page',
        data: `/pages/site/info`,
      });
      // #ifdef H5
      if (this.isWeixin === true && this.user.wechat === undefined) {
        this.$refs.wechatPopup.open();
        return;
      }
      if (this.isWeixin === true && this.user.wechat && this.user.wechat.mp_openid === '') {
        this.$refs.wechatPopup.open();
        return;
      }
      // #endif
      // #ifdef MP-WEIXIN
      if (
        this.user.wechat === undefined ||
        (this.user.wechat && this.user.wechat.min_openid === '')
      ) {
        this.$refs.wechatPopup.open();
        return;
      }
      // #endif
      this.creatOrder(this.forums.set_site.site_price, 1, this.value);
    },
    // 创建订单
    creatOrder(amount, type, value) {
      const params = {
        _jv: {
          type: 'orders',
        },
        type,
        amount,
        is_anonymous: this.isAnonymous,
      };
      this.$store.dispatch('jv/post', params).then(res => {
        this.orderSn = res.order_sn;
        if (this.browser === 0) {
          this.orderPay(13, value, this.orderSn, '0'); // 微信小程序
        } else if (this.isWeixin && this.isPhone) {
          this.orderPay(12, value, this.orderSn, '1'); // 微信浏览器
        } else if (this.isPhone) {
          this.orderPay(11, value, this.orderSn, '2'); // 手机浏览器
        } else {
          this.orderPay(10, value, this.orderSn, '3'); // pc浏览器
        }
      });
    },
    // 订单支付
    orderPay(type, value, orderSn, browserType) {
      let params = {};
      params = {
        _jv: {
          type: `trade/pay/order/${orderSn}`,
        },
        payment_type: type,
      };
      this.$store.dispatch('jv/post', params).then(res => {
        this.wxRes = res;
        if (browserType === '0') {
          this.wechatPay(
            res.wechat_js.timeStamp,
            res.wechat_js.nonceStr,
            res.wechat_js.package,
            res.wechat_js.signType,
            res.wechat_js.paySign,
          );
        } else if (browserType === '1') {
          if (typeof WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(res), false);
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(res));
              document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(res));
            }
          } else {
            this.onBridgeReady(res);
          }
        } else if (browserType === '2') {
          const url = encodeURI(`${DISCUZ_REQUEST_HOST}pages/site/payH5`);
          window.location.href = `${res.wechat_h5_link}&redirect_url=${url}`;
        } else if (browserType === '3') {
          if (res) {
            this.codeUrl = res.wechat_qrcode;
            this.payShowStatus = false;
            this.$refs.codePopup.open();
            this.qrcodeShow = true;
            payWechat = setInterval(() => {
              if (this.payStatus === 1) {
                clearInterval(payWechat);
                return;
              }
              this.getOrderStatus(this.orderSn, browserType);
              uni.hideLoading();
            }, 3000);
          }
        }
      });
    },
    // 查询订单支状 browserType: 0是小程序，1是微信浏览器，2是h5，3是pc
    getOrderStatus(orderSn, browserType) {
      this.$store
        .dispatch('jv/get', [`orders/${orderSn}`, { custom: { loading: false } }])
        .then(res => {
          this.payStatus = res.status;
          if (this.payStatus === 1) {
            this.payShowStatus = false;
            this.coverLoading = false;
            if (browserType === '3') {
              // 这是pc扫码支付完成
              this.$refs.codePopup.close();
              this.qrcodeShow = false;
            }
            window.location.href = '/pages/home/index';
            this.$refs.toast.show({ message: this.p.paySuccess });
          }
        })
        .catch(() => {
          this.coverLoading = false;
          this.$refs.toast.show({ message: this.pay.payFail });
        });
    },
    // 非小程序内微信支付
    onBridgeReady(data) {
      // eslint-disable-next-line no-undef
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: data.wechat_js.appId, // 公众号名称，由商户传入
          timeStamp: data.wechat_js.timeStamp, // 时间戳，自1970年以来的秒数
          nonceStr: data.wechat_js.nonceStr, // 随机串
          package: data.wechat_js.package,
          signType: 'MD5', // 微信签名方式：
          paySign: data.wechat_js.paySign, // 微信签名
        },
        res => {
          // alert('支付唤醒');
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            window.location.href = '/pages/home/index';
            // 微信支付成功，进行支付成功处理
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            // 取消支付
            clearInterval(payWechat);
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            // 支付失败
            clearInterval(payWechat);
          }
        },
      );
      payWechat = setInterval(() => {
        if (this.payStatus === 1) {
          clearInterval(payWechat);
          return;
        }
        this.getOrderStatus(this.orderSn, '1');
      }, 3000);
    },
    wechatPay(timeStamp, nonceStr, packageVal, signType, paySign) {
      // 小程序支付。
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp,
        nonceStr,
        package: packageVal,
        signType,
        paySign,
        success() {
          uni.redirectTo({
            url: '/pages/home/index',
          });
        },
        fail(err) {
          console.log(`fail:${JSON.stringify(err)}`);
        },
      });
    },
    // 跳支付页面
    submit() {
      if (!this.$store.getters['session/get']('isLogin')) {
        uni.setStorage({
          key: 'page',
          data: getCurUrl(),
        });
        // #ifdef MP-WEIXIN
        this.mpLoginMode();
        // #endif
        // #ifdef H5
        this.h5LoginMode();
        // #endif
      }
      this.payStatus = false;
      this.payShowStatus = true;
      this.$nextTick(() => {
        this.$refs.payShow.payClickShow();
      });
    },
    // 调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.site /deep/ {
  padding-bottom: 130rpx;
  .popup-pay {
    .pay-title,
    .pay-radio {
      display: none;
    }
    .pay-btn {
      margin-top: 40rpx;
      margin-bottom: 40rpx;
    }
  }
  .popup-pay-type {
    padding-top: 40rpx;
    .pay-title {
      display: none;
    }
    .pay-tip {
      display: none;
    }
    .pay-type-chi {
      margin-bottom: 40rpx;
    }
  }
  .site-submit .qui-button--button {
    position: absolute;
    top: 20rpx;
    right: 24rpx;
  }
  .header {
    height: auto;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    .circleDet {
      padding: 60rpx 30rpx;
      opacity: 1;
    }
    .circleDet-txt {
      color: --color(--qui-FC-34);
      opacity: 0.49;
    }
    .logo {
      height: 75rpx;
      padding-top: 71rpx;
    }
    .circleDet-num,
    .circleDet-share {
      color: --color(--qui-FC-333);
    }
  }
  .themeCount .themeItem__footer {
    display: none;
  }
  .themeCount .addAsk {
    top: 0;
  }
  .themeCount .themeItem {
    padding-left: 0;
    margin: 0;
    border-top: none;
  }
  .site-theme__last {
    .themeItem {
      border-bottom: none;
    }
  }
}
// 微信二维码弹框
.code-content {
  position: fixed;
  top: 10%;
  left: 11%;
  z-index: 22;
  display: flex;
  flex-direction: column;
  width: 78%;
  padding: 40rpx;
  background: --color(--qui-BG-FFF);
  border-radius: 16rpx;
  box-sizing: border-box;
  .code-title {
    text-align: center;
  }
  .code-pay-money {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 36rpx;
    padding-bottom: 36rpx;
    font-size: 70rpx;
    .code-yuan {
      font-size: 48rpx;
      line-height: 66rpx;
    }
  }
}
.code-type-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 24rpx 0 34rpx;
  line-height: 36rpx;
  border-top: 1px solid --color(--qui-BG-ED);
  .code-type-tit {
    color: --color(--qui-FC-AAA);
  }
  .code-type {
    display: flex;
    flex-direction: row;
    .code-type-icon {
      font-size: 36rpx;
    }
    .code-type-text {
      padding-left: 12rpx;
    }
  }
}
.code-img {
  align-self: center;
  width: 380rpx;
  height: 380rpx;
}
.code-tip {
  padding: 14rpx 0 20rpx;
}
//下面部分样式
.site-invite {
  padding: 30rpx 60rpx;
  text-align: center;
  &__detail__bold {
    margin: 0 5rpx;
    font-weight: bold;
  }
  &__detail {
    width: 90%;
    font-size: $fg-f4;
  }
}
.site-submit {
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 130rpx;
  padding: 20rpx 24rpx;
  background: --color(--qui-BG-2);
  box-shadow: 0rpx -3rpx 6rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  &__price {
    margin-top: 10rpx;
    font-size: $fg-f5;
    color: --color(--qui-BG-FF);
  }
  &__expire {
    font-size: $fg-f2;
    color: --color(--qui-FC-333);
  }
}
</style>
