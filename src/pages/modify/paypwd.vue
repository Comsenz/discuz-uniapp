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
      userid: '',
      pas: true,
      sun: false,
      types: 'password',
      test: '',
      inputpas: '',
      repeatpas: '',
      icon: 'none',
      modification: '已有支付密码',
      time: 2000,
    };
  },
  onLoad(arr) {
    this.userid = Number(arr.id);
  },
  methods: {
    btndata(num) {
      if (num.length >= 6) {
        this.inputpas = num;
        this.pas = false;
      }
    },
    btndata2(sum) {
      this.mobelypas(sum);
    },
    mobelypas(sum) {
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
          if (res) {
            uni.showToast({
              title: '支付密码设置成功',
              duration: 2000,
            });
            uni.navigateTo({
              url: '/pages/my/profile',
            });
          }
        })
        .catch(err => {
          console.log(err);
          if (err.statusCode === 422) {
            if (this.inputpas !== sum) {
              this.sun = true;
              this.test = '两次输入的密码不同，请重新输入';
            } else if (this.inputpas === sum) {
              // this.sun = true;
              // this.test = '已有支付密码';
              uni.showToast({
                icon: this.icon,
                title: this.modification,
                duration: this.time,
              });
            }
          }
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
  margin: 31rpx 0 0;
  background: --color(--qui-FC-FFF);
  opacity: 1;
}
.setpw-tit {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
  opacity: 1;
}
</style>
