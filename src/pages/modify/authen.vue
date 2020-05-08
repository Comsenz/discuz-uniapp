<template>
  <view class="authen">
    <view class="authen-input">
      <view class="authen-tit">
        请输入支付密码，以验证身份
      </view>
      <qui-input-code @getdata="btndata" :title="sun" :text="test" :number="types"></qui-input-code>
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
      types: 'password',
      test: '',
      status: '',
      inputpas: '',
      repeatpas: '',
      icon: 'none',
      authensucceeded: '身份验证成功',
      authenfailed: '身份验证失败',
    };
  },
  onLoad(arr) {
    this.userid = Number(arr.id);
  },
  methods: {
    btndata(num) {
      if (num.length === 6) {
        this.mobelypas(num);
      }
    },
    // 验证信息获取token
    mobelypas(sum) {
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
            uni.showToast({
              title: this.authensucceeded,
              duration: 2000,
            });
          }
        })
        .catch(err => {
          uni.showToast({
            icon: this.icon,
            title: this.authenfailed,
            duration: 2000,
          });
          if (err.statusCode === 422) {
            this.sun = true;
            const {data:{errors}} = err;
            this.test = errors[0].detail[0];
          } else if(err.statusCode === 500) {
            this.sun = true;
            this.test = '密码输入错误';
          }
        });
    },
    forgetpay() {
      uni.navigateTo({
        url: `/pages/modify/findpwd?user=${this.userid}&pas=reset_pay_pwd`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.authen-input {
  width: 710rpx;
  height: 200rpx;
  padding: 0 0 0 40rpx;
  margin: 31rpx 0 0;
  background: --color(--qui-FC-FFF);
}
.authen-tit {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
}
.authen-forget {
  margin: 30rpx 0 0;
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 37rpx;
  color: --color(--qui-LINK);
}
.authen-erro-messag1 {
  font-size: $fg-f24;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-RED);
}
</style>
