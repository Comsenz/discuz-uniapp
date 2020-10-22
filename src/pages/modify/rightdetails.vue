<template>
  <qui-page :data-qui-theme="theme" class="details">
    <view class="details-box">
      <view class="details-box__head">
        {{ paidusergrouplist.name }}
      </view>
      <view class="details-box__foot">
        <view class="details-box__foot__top">
          {{ i18n.t('modify.haveauthority') }}
        </view>
        <view class="details-box__foot__center">
          <view
            class="details-box__foot__center__box"
            v-for="(item, index) in paidusergroup"
            :key="index"
          >
            {{ i18n.t('permission.' + item.permission.replace(/\./g, '_')) }}
          </view>
        </view>
      </view>
      <view class="details-box__bottom">
        <view class="details-box__bottom__top">{{ i18n.t('modify.termofvalidity') }}：</view>
        <view class="details-box__bottom__bot" v-if="oder">
          {{ i18n.t('modify.purchase') }}{{ paidusergrouplist.days }}
          {{ i18n.t('modify.daysafter') }}
        </view>
        <view class="details-box__bottom__bot" v-if="!oder">{{ fun(expirationTime) }}</view>
        <view class="details-box__bottom__bot" v-if="!oder">{{ sun(expirationTime) }}</view>
      </view>
      <view
        class="details-box__purchase purchase-model"
        v-if="oder && forums.paycenter.wxpay_close"
      >
        <view class="details-box__purchase-list money">
          <qui-cell-item
            :title="pricefun(paidusergrouplist.fee)"
            slot-right
            :arrow="false"
            :brief="
              i18n.t('modify.termofvalidity') + paidusergrouplist.days + i18n.t('modify.days')
            "
            :border="false"
          >
            <view class="details-box__purchase-list-btn" @click="purchase">
              {{ i18n.t('modify.immediately') }}
            </view>
          </qui-cell-item>
        </view>
      </view>
      <!-- 请提示 -->
      <qui-toast ref="toast"></qui-toast>
      <!-- 支付组件 -->
      <view v-if="payShowStatus">
        <qui-pay
          ref="payShow"
          :pay-type-val="payTypeVal"
          :wallet-status="user.canWalletPay"
          :description-show="true"
          :money="paidusergrouplist.fee"
          :balance="Number(user.walletBalance)"
          :pay-type="i18n.t('modify.purchaseuser')"
          :pay-type-data="payTypeData"
          :pay-password="pwdVal"
          @radioChange="radioChange"
          @paysureShow="paysureShow"
          @onInput="onInput"
        ></qui-pay>
        <!--遮罩层组件-->
        <qui-loading-cover v-if="false" mask-zindex="111"></qui-loading-cover>
      </view>
      <!-- 二维码弹框 -->
      <uni-popup ref="codePopup" type="center" class="code-popup-box" @change="codeImgChange">
        <view class="code-content" v-if="qrcodeShow">
          <view class="code-title">{{ p.payNow }}</view>
          <view class="code-pay-money">
            <view class="code-yuan">￥</view>
            {{ price }}
          </view>
          <view class="code-type-box">
            <view class="code-type-tit">{{ p.payType }}</view>
            <view class="code-type">
              <qui-icon
                class="code-type-icon"
                name="icon-wxPay"
                size="36"
                color="#09bb07"
              ></qui-icon>
              <view class="code-type-text">{{ p.wxPay }}</view>
            </view>
          </view>
          <image :src="codeUrl" class="code-img"></image>
          <view class="code-tip">{{ p.wechatIdentificationQRcode }}</view>
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
    </view>
  </qui-page>
</template>

<script>
import user from '@/mixin/user';
import forums from '@/mixin/forums';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';
import loginModule from '@/mixin/loginModule';
// #ifndef MP-WEIXIN
import appCommonH from '@/utils/commonHelper';
// #endif

let payWechat = null;
let payPhone = null;

export default {
  components: { uniPopupDialog },
  mixins: [user, forums, loginModule],
  data() {
    return {
      typenum1: true,
      typenum2: false,
      payShowStatus: false,
      coverLoading: false,
      payTypeData: [
        {
          name: '微信支付',
          icon: 'icon-wxPay',
          color: '#09bb07',
          value: '0',
        },
        {
          name: '钱包支付',
          icon: 'icon-walletPay',
          color: '#1878f3',
          value: '1',
        },
      ], // 支付方式
      payTypeVal: 1,
      value: '',
      price: '', // 价格
      orderSn: '', // 订单编号
      browser: 0, // 0为小程序，1为除小程序之外的设备
      isWeixin: false,
      isPhone: false,
      codeUrl: '', // 二维码支付url
      qrcodeShow: false, // 二维码显示
      groupId: '',
      paidusergroup: [],
      oder: '',
      paidusergrouplist: '', // 权限用户
      pwdVal: '', // 支付密码
      expirationTime: '', // 到期时间
      payingusers: '',
      rightsice: '',
      wechatTip: this.i18n.t('discuzq.wechatBind'), // 微信绑定提示
    };
  },
  onLoad(evn) {
    // #ifndef MP-WEIXIN
    this.isWeixin = appCommonH.isWeixin().isWeixin; // 这是微信网页
    this.isPhone = appCommonH.isWeixin().isPhone; // 这是h5
    this.browser = 1;
    // #endif
    this.rightsice = evn.sice;
    this.groupId = evn.groups;
    this.payingusers = evn.index;
    if (evn.sice === '1') {
      this.oder = true;
    } else {
      this.oder = false;
      this.grouplist();
    }
    this.allusergroups();
  },
  computed: {
    // pay支付语言包
    p() {
      return this.i18n.t('pay');
    },
    currentLoginId() {
      const userId = this.$store.getters['session/get']('userId');
      return parseInt(userId, 10);
    },
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
  },
  methods: {
    fun(num) {
      const time = num.replace(/T/, ' ').replace(/Z/, '');
      if (num) {
        return `${time
          .substring(0, 10)
          .replace(/-/, '年')
          .replace(/-/, '月')}日`;
      }
    },
    sun(num) {
      const now = new Date();
      const pass = new Date(num);
      const result = pass - now;
      if (result > 1000 * 60 * 60 * 24) {
        const days = Math.ceil(result / 1000 / 60 / 60 / 24);
        return `距离过期还有${days}天`;
      }
      if (result < 1000 * 60 * 60 * 24 && result > 1000 * 60 * 60) {
        const host = parseInt(result / 1000 / 60 / 60, 0);
        return `距离过期还有${host}小时`;
      }
      if (result < 1000 * 60 * 60) {
        const min = parseInt(result / 1000 / 60, 0);
        return `距离过期还有${min}分钟`;
      }
    },
    pricefun(num) {
      if (num) {
        const money = num.toFixed(2);
        return `¥${money}元`;
      }
    },
    allusergroups() {
      const params = {
        include: 'permission',
      };
      this.$store.dispatch('jv/get', [`groups/${this.groupId}`, { params }]).then(res => {
        this.paidusergroup = res.permission;
        this.paidusergrouplist = res;
        this.price = res.fee;
      });
    },
    grouplist() {
      const params = {
        sort: 'created_at',
        'filter[user]': this.usersid,
        'filter[delete_type]': 0,
        include: 'group',
      };
      this.$store.dispatch('jv/get', ['groups/paid', { params }]).then(res => {
        res.forEach((item, index) => {
          if (this.groupId === item.group._jv.id) {
            this.expirationTime = res[index].expiration_time;
          }
        });
      });
    },
    purchase() {
      this.payShowStatus = true;
      this.payTypeVal = 4;
      this.$nextTick(() => {
        // this.$refs.payShow.payClickShow();
        this.$refs.payShow.payClickShow(this.payTypeVal);
      });
    },
    radioMyHead(val) {
      // 是否显示用户头像ad
      this.isAnonymous = !val;
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
    // 输入密码完成时
    onInput(val) {
      if (!this.forums.paycenter.wxpay_close) {
        this.value = 1;
      } else {
        this.value = val;
      }
      this.creatOrder(this.price, 4, this.value, 1);
    },
    // 支付方式选择完成点击确定时
    paysureShow(payType) {
      // const _this = this;
      uni.setStorage({
        key: 'page',
        data: `/pages/modify/rightdetails?sice=${this.rightsice}&groups=${this.groupId}&index=${this.payingusers}`,
      });
      if (payType === 0) {
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
        this.creatOrder(this.price, 4, this.value, payType);
      } else if (payType === 1) {
        // 这是详情页获取到的支付方式---钱包
      }
    },
    allusergroupsusers() {
      const params = {
        sort: 'created_at',
        'filter[user]': this.usersid,
        'filter[delete_type]': 0,
        include: 'group',
      };
      this.$store.dispatch('jv/get', ['groups/paid', { params }]).then(() => {
        this.oder = false;
        this.grouplist();
      });
    },
    // 创建订单
    creatOrder(amount, type, value, payType) {
      const params = {
        _jv: {
          type: 'orders',
        },
        type,
        group_id: this.groupId,
        amount,
        is_anonymous: this.isAnonymous,
      };
      /* eslint-disable */
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          this.orderSn = res.order_sn;
          if (payType === 0) {
            // 微信支付
            if (this.browser === 0) {
              // 这是微信小程序内的支付
              this.orderPay(13, value, this.orderSn, payType, '0');
            } else {
              // 这是除微信小程序之外, this.isWeixin, this.isPhone
              if (this.isWeixin && this.isPhone) {
                // 这是微信浏览器
                this.orderPay(12, value, this.orderSn, payType, '1');
              } else if (this.isPhone) {
                this.orderPay(11, value, this.orderSn, payType, '2');
              } else {
                // 这是pc，没调接口之前
                this.orderPay(10, value, this.orderSn, payType, '3');
              }
            }
          } else if (payType === 1) {
            // 钱包支付
            this.orderPay(20, value, this.orderSn, payType);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 订单支付       broswerType: 0是小程序，1是微信浏览器，2是h5，3是pc
    orderPay(type, value, orderSn, payType, broswerType) {
      let params = {};
      if (payType === 0) {
        params = {
          _jv: {
            type: `trade/pay/order/${orderSn}`,
          },
          payment_type: type,
        };
      } else if (payType === 1) {
        params = {
          _jv: {
            type: `trade/pay/order/${orderSn}`,
          },
          payment_type: type,
          pay_password: value,
        };
      }

      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          this.wxRes = res;
          if (payType === 0) {
            if (broswerType === '0') {
              this.wechatPay(
                res.wechat_js.timeStamp,
                res.wechat_js.nonceStr,
                res.wechat_js.package,
                res.wechat_js.signType,
                res.wechat_js.paySign,
              );
            } else if (broswerType === '1') {
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
            } else if (broswerType === '2') {
              payPhone = setInterval(() => {
                if (this.payStatus === 1) {
                  clearInterval(payPhone);
                  return;
                }
                this.getOrderStatus(orderSn, broswerType);
              }, 3000);
              window.location.href = res.wechat_h5_link;
            } else if (broswerType === '3') {
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
                  this.getOrderStatus(this.orderSn, broswerType);
                  uni.hideLoading();
                }, 3000);
              }
            }
          } else if (payType === 1) {
            const _this = this;
            if (res.wallet_pay.result === 'success') {
              this.$store.dispatch('jv/get', [`users/${this.currentLoginId}`, {}]);
              uni.showToast({
                icon: 'none',
                title: '用户组购买成功',
                duration: 2000,
              });
              setTimeout(() => {
                _this.allusergroupsusers();
              }, 1500);
              this.payShowStatus = false;
              this.coverLoading = false;
            }
            this.coverLoading = false;
          }
        })
        .catch(err => {
          // 清空支付的密码
          this.$refs.payShow.clearPassword();
        });
    },

    wechatPay(timeStamp, nonceStr, packageVal, signType, paySign) {
      // 小程序支付。
      const _this = this;
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp,
        nonceStr,
        package: packageVal,
        signType,
        paySign,
        success(res) {
          _this.coverLoading = true;
          payWechat = setInterval(() => {
            if (_this.payStatus === 1) {
              clearInterval(payWechat);
              return;
            }
            _this.getOrderStatus(_this.orderSn);
          }, 3000);
        },
        fail(err) {
          _this.payShowStatus = false;
          _this.coverLoading = false;
          _this.$refs.toast.show({ message: _this.p.payFail });
        },
      });
    },

    // 非小程序内微信支付
    onBridgeReady(data) {
      // const that = this;
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
        function(data) {
          // alert('支付唤醒');
          if (data.err_msg == 'get_brand_wcpay_request:ok') {
            //微信支付成功，进行支付成功处理
          } else if (data.err_msg == 'get_brand_wcpay_request:cancel') {
            // 取消支付
            clearInterval(payWechat);
            resolve;
          } else if (data.err_msg == 'get_brand_wcpay_request:fail') {
            // 支付失败
            clearInterval(payWechat);
            resolve;
          }
        },
      );
      payWechat = setInterval(() => {
        if (this.payStatus === 1) {
          clearInterval(payWechat);
          return;
        }
        this.getOrderStatus(this.orderSn);
      }, 3000);
    },

    // 查询订单支状 broswerType: 0是小程序，1是微信浏览器，2是h5，3是pc
    getOrderStatus(orderSn, broswerType) {
      this.$store
        .dispatch('jv/get', [`orders/${orderSn}`, { custom: { loading: false } }])
        .then(res => {
          this.payStatus = res.status;
          if (this.payStatus === 1) {
            this.payShowStatus = false;
            this.coverLoading = false;
            if (broswerType === '4') {
              // return false;
            } else if (broswerType === '3') {
              // 这是pc扫码支付完成
              this.$refs.codePopup.close();
              this.qrcodeShow = false;
              uni.showToast({
                icon: 'none',
                title: '用户组购买成功',
                duration: 2000,
              });
              setTimeout(() => {
                _this.allusergroupsusers();
              }, 1500);
            }

            if (this.payTypeVal === 4) {
              const _this = this;
              // 这是主题支付，支付完成刷新详情页，重新请求数据
                _this.allusergroupsusers();
            }
            this.$refs.toast.show({ message: this.p.paySuccess });
          }
        })
        .catch(err => {
          this.coverLoading = false;
          this.$refs.toast.show({ message: this.p.payFail });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.details /deep/ {
  /* #ifdef H5 */
  padding-top: 0;
  /* #endif */
  // overflow: hidden;
  background: --color(--qui-BG-2);
  box-sizing: border-box;
  .details-box {
    // position: relative;
    width: 100vw;
    // height: 100vh;
    /* #ifdef H5 */
    padding: 88rpx 0 150rpx;
    /* #endif */
    /* #ifndef H5 */
    padding-bottom: 150rpx;
    /* #endif */
    box-sizing: border-box;
  }
}
.details {
  &-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
    &__head {
      width: 100%;
      height: 97rpx;
      padding-left: 40rpx;
      font-size: 36rpx;
      font-weight: bold;
      line-height: 97rpx;
      color: --color(--qui-FC-333);
      box-sizing: border-box;
    }
    &__center {
      width: 100%;
      padding: 0 40rpx;
      font-size: 28rpx;
      line-height: 45rpx;
      box-sizing: border-box;
    }
    &__foot {
      width: 100%;
      &__top {
        width: 100%;
        height: 31rpx;
        padding-left: 40rpx;
        font-size: 28rpx;
        font-weight: bold;
        line-height: 31rpx;
        color: --color(--qui-FC-333);
        box-sizing: border-box;
      }
      &__center {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        padding-left: 40rpx;
        margin-top: 21rpx;
        box-sizing: border-box;
      }
    }
    &__bottom {
      width: 100%;
      &__top {
        width: 100%;
        height: 31rpx;
        padding-left: 40rpx;
        margin-top: 50rpx;
        font-size: 28rpx;
        font-weight: bold;
        line-height: 31rpx;
        color: --color(--qui-FC-333);
        box-sizing: border-box;
      }
      &__bot {
        width: 100%;
        height: 40rpx;
        padding: 0 40rpx;
        margin-top: 20rpx;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 40rpx;
        color: --color(--qui-FC-333);
        box-sizing: border-box;
      }
    }
    &__purchase {
      position: fixed;
      bottom: 0;
      z-index: 1;
      /* #ifdef H5 */
      width: 100%;
      /* #endif */
      height: 130rpx;
      padding: 15rpx 40rpx 0;
      background: --color(--qui-BG-2);
      border-top: 2rpx solid --color(--qui-BG-ED);
      box-sizing: border-box;
    }
  }
}
/deep/.pay-tip {
  display: none;
}
/deep/.money {
  .cell-item__body__content-title {
    color: #fa5151;
  }
}
.purchase-model {
  /* #ifndef H5 */
  width: 100vw;
  /* #endif */
}
.ele {
  height: 100%;
}
.details-box__foot__center__box {
  height: 50rpx;
  min-width: 136rpx;
  padding: 0 20rpx;
  margin: 40rpx 40rpx 0 0;
  font-size: 24rpx;
  font-weight: 400;
  line-height: 50rpx;
  color: --color(--qui-FC-777);
  text-align: center;
  background: --color(--qui-BG-F7);
  border-radius: 6rpx;
  box-sizing: border-box;
}
.details-box__purchase-list-btn {
  width: 230rpx;
  height: 90rpx;
  font-size: 28rpx;
  font-weight: 400;
  line-height: 90rpx;
  color: --color(--qui-BG-2);
  text-align: center;
  background: --color(--qui-RED);
  border-radius: 5rpx;
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
</style>
