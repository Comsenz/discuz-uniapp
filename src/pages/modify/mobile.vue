<template>
  <view class="input">
    <!-- 已绑定手机号码验证 -->
    <view class="modify-phon" v-if="phon">
      <view class="modify-phon-test">
        已绑定手机
      </view>
      <view class="modify-phon-num">
        {{ userphon }}
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
    <view class="modify-button">
      <qui-button type="primary" size="large" @click="submission">提交</qui-button>
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
      second: 60,
      sun: true,
      phon: true,
      userphon: '', // 我的手号码加密
      userphone1: '', // 手机号
      coum: '',
      judge: false,
      test: '',
      icon: 'none',
      num: 5,
      valifailed: '验证失败',
      lateron: '稍后重试',
      duration: 2000,
    };
  },
  onLoad(arr) {
    this.userid = Number(arr.id);
    this.senduser();
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
    // 点击获取验证码计时开始
    btnButton() {
      this.sun = !this.sun;
      const interval = setInterval(() => {
        this.second -= 1;
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        this.sun = !this.sun;
        this.second = 60;
      }, 60000);
      this.sendsms();
    },
    // 获取用户信息
    senduser() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: ['groups', 'wechat'],
      };
      const man = status.run(() => this.$store.dispatch('jv/get', params));
      man.then(res => {
        this.userphon = res.mobile;
        this.userphone1 = res.originalMobile;
      });
    },
    // 发送短信接口
    sendsms() {
      const params = {
        _jv: {
          type: 'sms/send',
        },
        type: 'verify',
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon
        .then(res => {
          this.num -= 1;
          /* eslint-disable */
          this.second = res._jv.json.data.attributes.interval;
        })
        .catch(err => {
          if(err.statusCode === 500 ) {
            uni.showToast({
              icon: this.icon,
              title: this.lateron,
              duration: this.duration,
            });
          }
        })
    },
    btndata(num) {
      this.coum = num;
    },
    // 验证短信
    submission() {
      const params = {
        _jv: {
          type: 'sms/verify',
        },
        code: this.coum,
        type: 'verify',
      };
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          if (res) {
            uni.navigateTo({
              url: '/pages/modify/setphon',
            });
          }
        })
        .catch(err => {
          uni.showToast({
            icon: this.icon,
            title: this.valifailed,
            duration: 2000,
          });
          if (err.statusCode === 422) {
            this.judge = true;
            /* eslint-disable */
            this.test = err.data.errors[0].detail[0];
          } else if (err.statusCode === 500) {
            this.test = `验证码错误，您还可以重发${this.num}次`;
            this.judge = true;
            if(this.num < 0){
              this.test = '请稍后重试'
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
page {
  width: 100vw;
  height: 100vh;
}
.input {
  width: 100vw;
  height: 100vh;
}
.modify-phon {
  display: flex;
  width: 710rpx;
  height: 100rpx;
  margin: 31rpx 0 0 40rpx;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.modify-phon-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
  opacity: 1;
}
.modify-phon-num {
  margin: 0 0 0 109rpx;
  font-size: $fg-f34;
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
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 70rpx;
  color: --color(--qui-FC-FFF);
  background-color: --color(--qui-BG-BTN);
  border-radius: 5rpx;
}
.modify-input {
  width: 710rpx;
  margin: 0 0 0 40rpx;
}
.modify-input-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
  opacity: 1;
}
.modify-button {
  width: 670rpx;
  margin: 52rpx auto 0;
}
</style>
