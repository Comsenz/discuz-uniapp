<template>
  <qui-page>
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
  </qui-page>
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
      inshow: true,
      inisIphone: false,
      usertokenid: '',
    };
  },
  onLoad(arr) {
    this.userid = Number(arr.id);
    this.usertokenid = arr.token || '';
    console.log(this.usertokenid);
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
      if (sum.length >= 6) {
        this.mobelypas(sum);
      }
    },
    mobelypas(sum) {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        pay_password_token: this.usertokenid,
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
            if (this.usertokenid) {
              uni.navigateBack({
                delta: 2,
              });
            } else {
              uni.navigateBack();
            }
          }
        })
        .catch(err => {
          if (err.statusCode === 422) {
            if (this.inputpas !== sum) {
              this.sun = true;
              this.test = this.i18n.t('modify.reenter');
            } else if (this.inputpas === sum) {
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
  padding-top: 31rpx;
  background-color: --color(--qui-BG-2);
  box-sizing: border-box;
}
.setpw-input {
  width: 710rpx;
  height: 200rpx;
  padding: 0 0 0 40rpx;
  background: --color(--qui-BG-2);
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
