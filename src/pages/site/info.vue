<template>
  <qui-page :data-qui-theme="theme" class="site">
    <qui-header
      head-img="/static/logo.png"
      :theme="i18n.t('home.theme')"
      :theme-num="forums.other && forums.other.count_users"
      :post="i18n.t('home.homecontent')"
      :post-num="forums.other && forums.other.count_threads"
      :share="i18n.t('home.share')"
      :iconcolor="theme === $u.light() ? '#333' : '#fff'"
      @click="open"
    ></qui-header>
    <uni-popup ref="popupHead" type="bottom">
      <qui-share @close="cancel"></qui-share>
    </uni-popup>
    <view class="site-item">
      <qui-cell-item
        class="cell-item--left cell-item--auto"
        :title="i18n.t('site.circleintroduction')"
        :addon="forums.set_site && forums.set_site.site_introduction"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.creationtime')"
        :addon="forums.set_site && forums.set_site.site_install"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('discuzq.post.paymentAmount')"
        :addon="'¥' + ((forums.set_site && forums.set_site.site_price) || 0)"
        class="site-item__pay"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.periodvalidity')"
        :addon="
          forums.set_site && forums.set_site.site_expire
            ? (forums.set_site && forums.set_site.site_expire) + i18n.t('site.day')
            : i18n.t('site.permanent')
        "
      ></qui-cell-item>
      <qui-cell-item :title="i18n.t('site.circlemaster')" slot-right>
        <view class="site-item__owner">
          <image
            class="site-item__owner-avatar"
            :src="(forums.set_site && forums.set_site.site_author.avatar) || '/static/noavatar.gif'"
            @tap="toProfile(forums.set_site && forums.set_site.site_author.id)"
            lazy-load
          ></image>
          <text class="site-item__owner-name">
            {{ forums.set_site && forums.set_site.site_author.username }}
          </text>
        </view>
      </qui-cell-item>
      <qui-cell-item :title="i18n.t('home.theme')" slot-right :border="false">
        <view class="site-item__person">
          <view
            v-for="(item, index) in forums.users"
            :key="index"
            class="site-item__person__content"
          >
            <image
              class="site-item__person__content-avatar"
              :src="item.avatarUrl || '/static/noavatar.gif'"
              @tap="toProfile(item.id)"
              lazy-load
            ></image>
          </view>
        </view>
      </qui-cell-item>
    </view>
    <view class="site-invite">
      <view class="site-invite__detail">
        <text>{{ i18n.t('site.justonelaststepjoinnow') }}</text>
        <text class="site-invite__detail__bold">DISCUZQ</text>
        <text>{{ i18n.t('site.site') }}</text>
      </view>
      <view class="site-invite__button">
        <qui-button type="primary" size="large" @click="submit">
          {{ i18n.t('site.paynow') }}，¥{{ (forums.set_site && forums.set_site.site_price) || 0 }}
          {{
            forums.set_site && forums.set_site.site_expire
              ? `  / ${i18n.t('site.periodvalidity')}${forums.set_site &&
                  forums.set_site.site_expire}${i18n.t('site.day')}`
              : ` / ${i18n.t('site.permanent')}`
          }}
        </qui-button>
      </view>
      <view v-if="payShowStatus">
        <qui-pay
          ref="payShow"
          :money="forums.set_site && forums.set_site.site_price"
          :wallet-status="true"
          :balance="10"
          :pay-type-data="payTypeData"
          @radioMyHead="radioMyHead"
          @onInput="onInput"
          @paysureShow="paysureShow"
        ></qui-pay>
      </view>
      <qui-toast ref="toast"></qui-toast>
    </view>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
      payShowStatus: true, // 是否显示支付
      isAnonymous: '0',
      payTypeData: [
        {
          name: '微信支付',
          icon: 'icon-wxPay',
          color: '#09bb07',
          value: '0',
        },
      ],
    };
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    uni.hideHomeButton();
    // #endif
    this.$u.event.$on('logind', data => {
      if (data.paid) {
        uni.redirectTo({
          url: '/pages/home/index',
        });
      }
    });
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
  methods: {
    // 首页头部分享按钮弹窗
    open() {
      this.$refs.popupHead.open();
    },
    // 支付是否显示用户头像
    radioMyHead(val) {
      this.isAnonymous = val;
    },
    // 输入密码完成时
    onInput(val) {
      this.value = val;
      this.creatOrder(this.forums.set_site.site_price, '1', val);
    },
    // 支付方式选择完成点击确定时
    paysureShow() {
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
        // 微信支付
        this.orderPay(13, value, this.orderSn);
      });
    },
    // 订单支付
    orderPay(type, value, orderSn) {
      let params = {};
      params = {
        _jv: {
          type: `trade/pay/order/${orderSn}`,
        },
        payment_type: type,
      };
      this.$store.dispatch('jv/post', params).then(res => {
        this.wechatPay(
          res.wechat_js.timeStamp,
          res.wechat_js.nonceStr,
          res.wechat_js.package,
          res.wechat_js.signType,
          res.wechat_js.paySign,
        );
      });
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
          uni.navigateTo({
            url: '/pages/home/index',
          });
        },
        fail(err) {
          console.log(`fail:${JSON.stringify(err)}`);
        },
      });
    },
    // 取消按钮
    cancel() {
      this.$refs.popupHead.close();
    },
    // 点击头像到个人主页
    toProfile(userId) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${userId}`,
      });
    },
    // 跳支付页面
    submit() {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      this.$refs.payShow.payClickShow();
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
  .header {
    height: auto;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .header .circleDet {
    padding: 60rpx 40rpx 50rpx;
    opacity: 1;
  }
  .header .circleDet-txt {
    color: --color(--qui-FC-333);
    opacity: 1;
  }
  .header .logo {
    height: 75rpx;
    padding-top: 71rpx;
  }
  .cell-item__body__content-title {
    width: 112rpx;
    margin-right: 40rpx;
    color: --color(--qui-FC-777);
  }
  .header .circleDet-num,
  .header .circleDet-share {
    color: --color(--qui-FC-333);
  }
  .site-invite {
    text-align: center;
  }
}
//下面部分样式
.site-item {
  padding-left: 40rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.site .cell-item {
  padding-right: 40rpx;
}
.cell-item--auto .cell-item__body {
  height: auto;
  padding: 35rpx 0;
  align-items: flex-start;
}
.site-invite__detail__bold {
  margin: 0 5rpx;
  font-weight: bold;
}
.site-invite__detail {
  width: 90%;
  padding: 0 20rpx;
  margin: 50rpx auto 30rpx;
  font-size: 28rpx;
}
.site-item__pay .cell-item__body__right-text {
  color: --color(--qui-RED);
}
.site-item__person__content-avatar,
.site-item__owner-avatar {
  width: 60rpx;
  height: 60rpx;
  margin-left: 8rpx;
  border-radius: 50%;
  will-change: transform;
}
.site-item__person__content-avatar {
  margin-left: 8rpx;
}
.site-item__owner {
  display: flex;
  align-items: center;
}
.site-item__owner-avatar {
  margin-right: 20rpx;
}
.site-item__person {
  height: 60rpx;
  overflow: hidden;
  font-size: 0;
}
.site-item__person__content {
  display: inline-block;
}
.cell-item--left .cell-item__body__right {
  text-align: left;
}
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
</style>
