<template>
  <view class="setpw" @click.stop="toggleBox">
    <view class="setpw-input" v-if="pas" @click.stop="fourse">
      <view class="setpw-tit">
        {{ i18n.t('modify.enterpaymentpas') }}
      </view>
      <qui-input-code
        @getdata="btndata"
        :title="sun"
        :text="test"
        :show="inshow"
        :isiphonex="inisIphone"
        :number="types"
      ></qui-input-code>
    </view>
    <view class="setpw-input" v-else @click.stop="fourse">
      <view class="setpw-tit">
        {{ i18n.t('modify.enterpaymentagin') }}
      </view>
      <qui-input-code
        @getdata="btndata2"
        :title="sun"
        :text="test"
        :show="inshow"
        :isiphonex="inisIphone"
        :number="types"
      ></qui-input-code>
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
      pas: true,
      sun: false,
      types: 'password',
      test: '',
      inputpas: '',
      repeatpas: '',
      icon: 'none',
      time: 2000,
      inshow: false,
      inisIphone: false,
    };
  },
  onLoad(arr) {
    this.userid = Number(arr.id) || 24;
  },
  methods: {
    fourse() {
      this.inshow = true;
    },
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
              title: this.i18n.t('modify.paymentsucceed'),
              duration: 2000,
            });
            uni.navigateTo({
              url: '/pages/my/profile',
            });
          }
        })
        .catch(err => {
          if (err.statusCode === 422) {
            if (this.inputpas !== sum) {
              this.sun = true;
              this.test = this.i18n.t('modify.reenter');
            } else if (this.inputpas === sum) {
              // this.sun = true;
              // this.test = '已有支付密码';
              uni.showToast({
                icon: this.icon,
                title: this.i18n.t('modify.modification'),
                duration: this.time,
              });
            }
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
@import '@/styles/base/theme/fn.scss';
.setpw {
  width: 100vw;
  height: 100vh;
}
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
