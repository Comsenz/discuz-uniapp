<template>
  <view class="cash">
    <view class="cash-content">
      <!-- 收款人 -->
      <view class="cash-content-tab">
        <qui-cell-item title="收款人" slot-right :arrow="false" :border="false">
          <test class="cash-content-name">
            {{ name }}
          </test>
        </qui-cell-item>
      </view>
      <!-- 可提现金额 -->
      <view class="cash-content-tab">
        <qui-cell-item title="可提现余额" slot-right :arrow="false" :border="false">
          <test class="cash-content-name">￥{{ balance }}</test>
        </qui-cell-item>
      </view>
      <!-- 提现金额 -->
      <view class="cash-content-tab">
        <qui-cell-item title="提现金额" slot-right :arrow="false" :border="false">
          <input
            class="cash-content-input"
            type="number"
            placeholder="请输入提现金额"
            placeholder-style="color:rgba(221,221,221,1)"
            v-model="cashmany"
            @input="settlement"
          />
        </qui-cell-item>
      </view>
      <view class="cash-erro-messag1" v-if="judge2">
        {{ test2 }}
      </view>
      <!-- 实际提现金额 -->
      <view class="cash-content-tab">
        <qui-cell-item title="实际提现金额" slot-right :arrow="false" :border="false">
          <view class="cash-content-name cash-content-actual">
            <view
              :class="length ? 'cash-content-ellipsis2' : 'cash-content-ellipsis'"
              v-text="contint"
            ></view>
            <view class="cash-content-proced">
              手续费：{{ cashmany * (0.3).toFixed(2) }}元 (30%)
            </view>
          </view>
        </qui-cell-item>
      </view>
      <!-- 验证码 -->
      <view class="input">
        <!-- 已绑定手机号码验证 -->
        <view class="modify-phon" v-if="phon">
          <view class="modify-phon-test">
            已绑定手机
          </view>
          <view class="modify-phon-num">
            {{ usertestphon }}
          </view>
          <button class="modify-phon-send" v-if="sun" @click="btnButton">发送验证码</button>
          <button class="modify-phon-send" disabled v-else>{{ second }}秒后重发</button>
        </view>
        <!-- 验证码 -->
        <view class="modify-input">
          <view class="modify-input-test">
            请输入验证码
          </view>
          <qui-input-code @getdata="btndata" :title="judge" :text="test"></qui-input-code>
        </view>
      </view>
      <view class="modify-button">
        <qui-button type="primary" size="large" @click="btncash">
          提交
        </qui-button>
      </view>
    </view>
  </view>
</template>

<script>
import { status } from 'jsonapi-vuex';
import quiInputCode from '@/components/qui-input-code/qui-input-code';

export default {
  components: { quiInputCode },
  data() {
    return {
      userid: 24,
      second: 60,
      cashmany: '',
      name: '',
      balance: '',
      userphon: '',
      usertestphon: '',
      code: '',
      test: '',
      test2: '',
      judge: false,
      judge2: false,
      sun: true,
      phon: true,
      length: false,
      contint: '-.-',
    };
  },
  onLoad() {
    this.setmydata();
  },
  methods: {
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
      console.log('num', num);
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
      } else {
        this.length = false;
        this.contint = '-.-';
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
        console.log(data);
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
      postphon
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
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
          console.log('成功', res);
          if (res) {
            this.cashwithdrawal();
          }
        })
        .catch(err => {
          console.log('失败', err);
        });
    },
    // 提现申请
    cashwithdrawal() {
      console.log('cashmany', this.cashmany);
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
          console.log('成功', res);
        })
        .catch(err => {
          console.log('失败', err);
          if (err.statusCode === 422) {
            this.judge2 = true;
            /* eslint-disable */
            this.test2 = err.data.errors[0].detail[0];
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.cash {
  width: 100vw;
  height: 100vh;
}
.cash-content {
  padding: 31rpx 0 0 40rpx;
}
.cash-content-tab {
  padding: 0 40rpx 0 0;
  justify-content: space-between;
  border-bottom: 2px solid rgba(237, 237, 237, 1);
}
/deep/.cell-item__body__content-title{
  color: #777;
}
.cash-content-name {
  font-size: 34rpx;
  font-weight: 400;
  color: #333;
  opacity: 1;
}
.cash-content-input {
  width: 238rpx;
  height: 100%;
  line-height: 100rpx;
  color: #333;
  text-align: right;
}
.cash-content-actual {
  line-height: 50rpx;
}
.cash-content-ellipsis {
  height: 50rpx;
  font-size: 24rpx;
  font-weight: 400;
  line-height: 50rpx;
  color: rgba(51, 51, 51, 1);
  text-align: right;
  opacity: 1;
}
.cash-content-ellipsis2 {
  height: 50rpx;
  font-size: 34rpx;
  font-weight: 400;
  line-height: 50rpx;
  color: rgba(250, 81, 81, 1);
  text-align: bold;
  opacity: 1;
}
.cash-content-proced {
  height: 50rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: rgba(119, 119, 119, 1);
  opacity: 1;
}
.modify-phon {
  display: flex;
  width: 710rpx;
  height: 100rpx;
  border-bottom: 2rpx solid rgba(237, 237, 237, 1);
}
.modify-phon-test {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(119, 119, 119, 1);
  opacity: 1;
}
.modify-phon-num {
  margin: 0 0 0 109rpx;
  font-size: 34rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(0, 0, 0, 1);
  opacity: 1;
}
.modify-phon-send {
  display: block;
  height: 70rpx;
  min-width: 180rpx;
  margin: 15rpx 0 0 40rpx;
  font-size: 28rpx;
  font-weight: 400;
  line-height: 70rpx;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  background: rgba(24, 120, 243, 1);
  border-radius: 5rpx;
  opacity: 1;
}
.modify-input {
  width: 710rpx;
  height: 200rpx;
}
.modify-input-test {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(119, 119, 119, 1);
  opacity: 1;
}
.modify-vftion-input {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.hidden-ipt {
  width: 0;
  height: 0;
  margin: 0;
  border: 0;
}
.modify-button {
  width: 670rpx;
  height: 90rpx;
  margin: 52rpx 0 0;
  opacity: 1;
}
.cash-erro-messag1 {
  font-size: 24rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(250, 81, 81, 1);
  opacity: 1;
}
</style>
