<template>
  <view class="cash" @click.stop="toggleBox">
    <view class="cash-content">
      <!-- 收款人 -->
      <view class="cash-content-tab">
        <qui-cell-item :title="i18n.t('modify.payee')" slot-right :arrow="false" :border="false">
          <test class="cash-content-name">
            {{ name }}
          </test>
        </qui-cell-item>
      </view>
      <!-- 可提现金额 -->
      <view class="cash-content-tab">
        <qui-cell-item
          :title="i18n.t('modify.withdrawable')"
          slot-right
          :arrow="false"
          :border="false"
        >
          <test class="cash-content-name">￥{{ balance }}</test>
        </qui-cell-item>
      </view>
      <!-- 提现金额 -->
      <view class="cash-content-tab">
        <qui-cell-item
          :title="i18n.t('modify.withdrawable')"
          slot-right
          :arrow="false"
          :border="false"
        >
          <input
            class="cash-content-input"
            type="number"
            :placeholder="i18n.t('modify.enteramount')"
            placeholder-style="color:rgba(221,221,221,1)"
            v-model="cashmany"
            @input="settlement"
          />
        </qui-cell-item>
      </view>
      <!-- 实际提现金额 -->
      <view class="cash-content-tab">
        <qui-cell-item
          :title="i18n.t('modify.actualamout')"
          slot-right
          :arrow="false"
          :border="false"
        >
          <view class="cash-content-name cash-content-actual">
            <view
              :class="length ? 'cash-content-ellipsis2' : 'cash-content-ellipsis'"
              v-text="contint"
            ></view>
            <view class="cash-content-proced">
              {{ i18n.t('modify.servicechaege') + procedures + i18n.t('modify.percentage') }}
            </view>
          </view>
        </qui-cell-item>
      </view>
      <!-- 验证码 -->
      <view class="input">
        <!-- 已绑定手机号码验证 -->
        <view class="cash-phon" v-if="phon">
          <view class="cash-phon-test">
            {{ i18n.t('modify.phonnumber') }}
          </view>
          <view class="cash-phon-num">
            {{ usertestphon }}
          </view>
          <button class="cash-phon-send" v-if="sun" @click="btnButton">
            {{ i18n.t('modify.sendverificode') }}
          </button>
          <button class="cash-phon-send" disabled v-else>
            {{ second + i18n.t('modify.retransmission') }}
          </button>
        </view>
        <!-- 验证码 -->
        <view class="cash-input" @click.stop="fourse">
          <view class="cash-input-test">
            {{ i18n.t('modify.placeentercode') }}
          </view>
          <qui-input-code
            @getdata="btndata"
            :title="judge"
            :text="test"
            :show="inshow"
            :isiphonex="inisIphone"
          ></qui-input-code>
        </view>
      </view>
      <view class="cash-button">
        <qui-button type="primary" size="large" @click="btncash">
          {{ i18n.t('modify.submission') }}
        </qui-button>
      </view>
    </view>
  </view>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import quiInputCode from '@/components/qui-input-code/qui-input-code';

export default {
  components: { quiInputCode },
  data() {
    return {
      userid: '',
      second: 60,
      num: 5,
      cashmany: '',
      name: '',
      balance: '',
      userphon: '',
      usertestphon: '',
      code: '',
      test: '',
      test2: '',
      judge: false,
      sun: true,
      phon: true,
      length: false,
      contint: '-.-',
      procedures: 0,
      inshow: false,
      inisIphone: false,
    };
  },
  onLoad(arr) {
    this.userid = Number(arr.id);
    this.setmydata();
  },
  methods: {
    fourse() {
      this.inshow = true;
    },
    getCode() {
      this.showText = false;
      const interval = setInterval(() => {
        this.second -= 1;
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        this.showText = true;
      }, 60000);
    },
    btndata(num) {
      this.code = num;
    },
    btncash() {
      this.verifytitle();
    },
    settlement() {
      if (this.cashmany.length > 0) {
        this.length = true;
        const number = this.cashmany - this.cashmany * 0.3;
        this.contint = `¥${number.toFixed(2)}`;
        const casnumber = this.cashmany * 0.3;
        this.procedures = casnumber.toFixed(2);
      } else if (this.cashmany.length <= 0) {
        this.length = false;
        this.contint = '-.-';
        const casnumber = this.cashmany * 0.3;
        this.procedures = casnumber.toFixed(2);
      }
    },
    // 点击获取验证码计时开始
    btnButton() {
      this.sun = !this.sun;
      this.showText = false;
      const interval = setInterval(() => {
        this.second -= 1;
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        this.showText = true;
        this.sun = !this.sun;
        this.second = 60;
      }, 60000);
      this.posttitle();
    },
    // 获取个人信息
    setmydata() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: ['groups', 'wechat'],
      };
      this.$store.dispatch('jv/get', params).then(data => {
        this.name = data.username;
        this.balance = data.walletBalance;
        this.usertestphon = data.mobile;
        this.userphon = data.originalMobile;
      });
    },
    // 发动短信
    posttitle() {
      const params = {
        _jv: {
          type: 'sms/send',
        },
        type: 'verify',
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon.then(res => {
        this.num -= 1;
        /* eslint-disable */
        this.second = res._jv.json.data.attributes.interval;
      })
    },
    // 验证短信
    verifytitle() {
      const params = {
        _jv: {
          type: 'sms/verify',
        },
        code: this.code,
        type: 'verify',
      };
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          if (res) {
            this.cashwithdrawal();
          }
        })
        .catch(err => {
          if (err.statusCode === 500) {
            this.test = this.i18n.t('modify.validionerro') + this.num + this.i18n.t('modify.frequency');
            this.judge = true;
            if (this.num <=0) {
              this.test = this.i18n.t('modify.lateron');
            }
          } else if (err.statusCode === 422) {
            this.test = err.data.errors[0].detail;
            this.judge = true;
          }
        });
    },
    // 提现申请
    cashwithdrawal() {
      const params = {
        _jv: {
          type: 'wallet/cash',
          include: ['user', 'userWallet'],
        },
        cash_apply_amount: this.cashmany,
      };
      const postcash = status.run(() => this.$store.dispatch('jv/post', params));
      postcash
        .then(res => {
          if(res) {
            uni.showToast({
              title: this.i18n.t('modify.withdrawal'),
              duration: 2000,
            });
            this.cashmany = '';
            this.contint = '';
            this.procedures = 0;
            this.setmydata();
            this.sun = true;
            this.second = 60;
          }
        })
        .catch(err => {
          if (err.statusCode === 422) {
            uni.showToast({
              icon: 'none',
              title: err.data.errors[0].detail[0],
              duration: 2000,
            });
          }
        });
    },
    toggleBox() {
      this.inshow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
.cash {
  width: 100vw;
  height: 100vh;
}
.cash-content {
  padding-left: 40rpx;
  margin-top: 31rpx;
}
.cash-content-tab {
  padding: 0 40rpx 0 0;
  justify-content: space-between;
  border-bottom: 2px solid --color(--qui-BOR-ED);
}
/deep/.cell-item__body__content-title{
  color: --color(--qui-FC-777);
}
.cash-content-name {
  font-size: $fg-f34;
  font-weight: 400;
  color: --color(--qui-FC-333);
}
.cash-content-input {
  width: 238rpx;
  height: 100%;
  font-size: $fg-f34;
  font-weight: bold;
  line-height: 100rpx;
  color: --color(--qui-FC-333);
  text-align: right;
}
.cash-content-actual {
  line-height: 50rpx;
}
.cash-content-ellipsis {
  height: 50rpx;
  font-size: $fg-f24;
  font-weight: 400;
  line-height: 50rpx;
  color: --color(--qui-FC-333);
  text-align: right;
}
.cash-content-ellipsis2 {
  height: 50rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 50rpx;
  color: --color(--qui-RED);
  text-align: bold;
}
.cash-content-proced {
  height: 50rpx;
  font-size: $fg-f24;
  font-weight: 400;
  color: --color(--qui-FC-777);
}
.cash-phon {
  display: flex;
  width: 710rpx;
  height: 100rpx;
  justify-content: space-between;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.cash-phon-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
}
.cash-phon-num {
  margin: 0 0 0 165rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(0, 0, 0, 1);
}
.cash-phon-send {
  display: block;
  height: 70rpx;
  min-width: 180rpx;
  margin: 15rpx 40rpx 0;
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 70rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background-color: --color(--qui-MAIN);
  border-radius: 5rpx;
}
.cash-input {
  width: 710rpx;
}
.cash-input-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
}
.cash-vftion-input {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.cash-button {
  margin: 52rpx 0 0;
}
</style>
