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
import quiButton from '@/components/qui-button/qui-button';
import quiInputCode from '@/components/qui-input-code/qui-input-code';

export default {
  components: { quiInputCode, quiButton },
  data() {
    return {
      userid: 24,
      second: 60,
      sun: true,
      phon: true,
      userphon: '', // 我的手号码加密
      userphone1: '', // 手机号
      coum: '',
      judge: false,
      test: '',
      num: 5,
    };
  },
  onLoad() {
    this.senduser();
    // this.userid = sun.id
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
      console.log(this.userphone1);
      this.sendsms();
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
        this.userphon = res.mobile;
        this.userphone1 = res.originalMobile;
        console.log(this.userphon, this.userphone1);
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
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    btndata(num) {
      this.coum = num;
    },
    // 验证短信
    submission() {
      console.log(this.coum);
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
          console.log(res);
          if (res) {
            uni.navigateTo({
              url: '/pages/modify/setphon',
            });
          }
        })
        .catch(err => {
          console.log(err);
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
  border-bottom: 2rpx solid rgba(237, 237, 237, 1);
}
.modify-phon-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(119, 119, 119, 1);
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
  color: rgba(255, 255, 255, 1);
  text-align: center;
  background-color: --color(--qui-BG-BTN);
  border-radius: 5rpx;
  opacity: 1;
}
.modify-input {
  width: 710rpx;
  height: 200rpx;
  margin: 0 0 0 40rpx;
}
.modify-input-test {
  font-size: $fg-f28;
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
  margin: 52rpx auto 0;
}
</style>
