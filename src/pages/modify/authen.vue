<template>
  <view class="authen">
    <view class="authen-input">
      <view class="authen-tit">
        请输入支付密码，以验证身份
      </view>
      <qui-input-code @getdata="btndata" :title="sun" :text="test" :number="types"></qui-input-code>
      <view class="authen-erro-messag1" v-if="judge">
        {{ status }}
      </view>
      <view class="authen-forget" @click="forgetpay">
        忘记旧密码?
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
      userid: '',
      pas: true,
      sun: false,
      judge: false,
      types: 'password',
      test: '两次输入的密码不同，请重新输入',
      status: '',
      inputpas: '',
      repeatpas: '',
    };
  },
  // onLoad(arr) {
  //   this.userid = arr.id;
  // },
  methods: {
    btndata(num) {
      console.log('num', num);
      if (num.length === 6) {
        this.mobelypas(num);
      }
    },
    // 验证信息获取token
    mobelypas(sum) {
      console.log(sum);
      const params = {
        _jv: {
          type: 'users/pay-password/reset',
        },
        pay_password: sum,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon
        .then(res => {
          /* eslint-disable */
          if (res._jv.json.data.id) {
            console.log('验证成功');
          }
        })
        .catch(err => {
          if (err.statusCode === 422) {
            this.judge = true;
            const {data:{errors}} = err;
            this.status = errors[0].detail[0];
          } else if(err.statusCode === 500) {
            this.judge = true;
            this.status = '密码输入错误';
          }
        });
    },
    forgetpay() {
      uni.navigateTo({
        url: '/pages/modify/findpwd?user=24&pas=reset_pay_pwd',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.authen-input {
  width: 710rpx;
  height: 200rpx;
  padding: 0 0 0 40rpx;
  background: rgba(255, 255, 255, 1);
  opacity: 1;
}
.authen-tit {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(119, 119, 119, 1);
  opacity: 1;
}
.authen-forget {
  margin: 30rpx 0 0;
  font-size: 28rpx;
  font-weight: 400;
  line-height: 37rpx;
  color: rgba(0, 71, 155, 1);
}
.authen-erro-messag1 {
  font-size: 24rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(250, 81, 81, 1);
  opacity: 1;
}
</style>
