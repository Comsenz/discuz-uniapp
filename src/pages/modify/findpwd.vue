<template>
  <view class="retireve" @click.stop="toggleBox">
    <view class="retireve-tab">
      <view class="retireve-titel">
        {{ i18n.t('modify.forgetpassword') }}\{{ i18n.t('modify.retrievepassword') }}
      </view>
      <!-- 已绑定手机号码验证 -->
      <view class="retireve-phon" v-if="phon">
        <view class="retireve-phon-test">
          {{ i18n.t('modify.phonnumber') }}
        </view>
        <view class="retireve-phon-num">
          {{ disphon }}
        </view>
        <button class="retireve-phon-send" v-if="sun" @click="btnButton">
          {{ i18n.t('modify.sendverificode') }}
        </button>
        <button class="retireve-phon-send" disabled v-else>
          {{ second + i18n.t('modify.retransmission') }}
        </button>
      </view>
      <view class="retireve-pas">
        <view class="retireve-pas-title">
          {{ i18n.t('modify.placeenternewpass') }}
        </view>
        <view class="retireve-pas-input">
          <input class="retireve-pas-input-i" type="password" v-model="newpassword" />
        </view>
      </view>
      <view class="retireve-pass" v-if="passt">
        {{ passtext }}
      </view>
      <!-- 验证码 -->
      <view class="retireve-input" @click.stop="fourse">
        <view class="retireve-input-test">
          {{ i18n.t('modify.placeentercode') }}
        </view>
        <qui-input-code
          @getdata="btndata"
          :title="pad"
          :text="test"
          :show="inshow"
          :isiphonex="inisIphone"
        ></qui-input-code>
      </view>
      <view class="retireve-button">
        <qui-button type="primary" size="large" @click="submission">
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
      passt: false,
      sun: true,
      phon: true,
      disphon: '',
      phonnumber: '',
      newpassword: '',
      codepass: '',
      pad: false,
      num: 5,
      test: '',
      passtext: '',
      sendtype: '',
      inshow: false,
      inisIphone: false,
    };
  },
  onLoad(sing) {
    this.sendtype = sing.pas;
    this.userid = Number(sing.user);
    this.personaldata();
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
      this.sendout();
    },
    submission() {
      this.postphon();
    },
    btndata(num) {
      this.codepass = num;
    },
    // 获取个人信息
    personaldata() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: 'groups',
      };
      this.$store.dispatch('jv/get', params).then(data => {
        this.disphon = data.mobile;
        this.phonnumber = data.originalMobile;
      });
    },
    // 发送短信
    sendout() {
      const params = {
        _jv: {
          type: 'sms/send',
        },
        mobile: this.phonnumber,
        type: this.sendtype,
      };
      const sendphon = status.run(() => this.$store.dispatch('jv/post', params));
      sendphon.then(res => {
        if (res) {
          this.num -= 1;
        }
      });
    },
    // 验证短信
    postphon() {
      const params = {
        _jv: {
          type: 'sms/verify',
        },
        mobile: this.phonnumber,
        code: this.codepass,
        type: this.sendtype,
        password: this.newpassword,
        pay_password: this.newpassword,
        pay_password_confirmation: this.newpassword,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon
        .then(res => {
          if (res) {
            uni.showToast({
              title: this.i18n.t('modify.titlepassword'),
              duration: 2000,
            });
            uni.navigateBack(1);
          }
        })
        .catch(err => {
          uni.showToast({
            icon: 'none',
            title: this.i18n.t('modify.valifailed'),
            duration: 2000,
          });
          if (err.statusCode === 422) {
            this.passt = true;
            /* eslint-disable */
            this.passtext = err.data.errors[0].detail[0];
          } else if (err.statusCode === 500) {
            this.test = this.i18n.t('modify.validionerro') + this.num + this.i18n.t('modify.frequency');
            this.pad = true;
            if (this.num < 0) {
              this.test = this.i18n.t('modify.lateron');
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
.retireve {
  width: 100vw;
  height: 100vh;
}
.retireve-tab {
  padding-left: 40rpx;
  margin-top: 31rpx;
  box-sizing: border-box;
}
.retireve-titel {
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 60rpx;
  color: --color(--qui-FC-333);
  opacity: 1;
}
.retireve-phon {
  display: flex;
  width: 710rpx;
  height: 100rpx;
  justify-content: space-between;
  margin: 80rpx 0 0;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  box-sizing: border-box;
}
.retireve-phon-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
}
.retireve-phon-num {
  margin: 0 0 0 109rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(0, 0, 0, 1);
  opacity: 1;
}
.retireve-phon-send {
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
.retireve-pas {
  display: flex;
  width: 100%;
  height: 100rpx;
  padding: 0 40rpx 0 0;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  box-sizing: border-box;
  justify-content: space-between;
}
.retireve-pas-title {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
  opacity: 1;
}
.retireve-input {
  width: 710rpx;
}
.retireve-input-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
}
.retireve-vftion-input {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.retireve-pas-input-i {
  height: 100rpx;
  line-height: 100rpx;
  text-align: right;
}
.retireve-button {
  margin: 52rpx 0 0;
}
.retireve-pass {
  font-size: $fg-f24;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-RED);
}
</style>
