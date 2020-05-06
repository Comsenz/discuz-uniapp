<template>
  <view class="setpw">
    <view class="setpw-input" v-if="pas">
      <view class="setpw-tit">
        请输入支付密码
      </view>
      <qui-input-code @getdata="btndata" :title="sun" :text="test" :number="types"></qui-input-code>
    </view>
    <view class="setpw-input" v-else>
      <view class="setpw-tit">
        请在次输入支付密码
      </view>
      <qui-input-code
        @getdata="btndata2"
        :title="sun"
        :text="test"
        :number="types"
      ></qui-input-code>
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
      pas: true,
      sun: false,
      types: 'password',
      test: '两次输入的密码不同，请重新输入',
      status: '',
      inputpas: '',
      repeatpas: '',
    };
  },
  onLoad() {
    this.senduser();
    // this.userid = sun.id
  },
  methods: {
    btndata(num) {
      if (num.length >= 6) {
        this.inputpas = num;
        this.pas = false;
      }
    },
    btndata2(sum) {
      if (this.inputpas !== sum) {
        this.sun = true;
      }
      this.mobelypas(sum);
    },
    senduser() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: 'groups',
      };
      const man = status.run(() => this.$store.dispatch('jv/get', params));
      man.then(res => {
        this.status = res.status;
      });
    },
    mobelypas(sum) {
      console.log(sum);
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        payPassword: this.inputpas,
        pay_password_confirmation: sum,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/patch', params));
      postphon
        .then(res => {
          console.log('users', res);
        })
        .catch(err => {
          console.log('users', err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.setpw-input {
  width: 710rpx;
  height: 200rpx;
  padding: 0 0 0 40rpx;
  background: rgba(255, 255, 255, 1);
  opacity: 1;
}
.setpw-tit {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(119, 119, 119, 1);
  opacity: 1;
}
</style>
