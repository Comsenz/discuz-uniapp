<template>
  <view class="retireve">
    <view class="retireve-tab">
      <view class="retireve-titel">忘记密码 \ 找回密码</view>
      <!-- 已绑定手机号码验证 -->
      <view class="retireve-phon" v-if="phon">
        <view class="retireve-phon-test">
          手机号
        </view>
        <view class="retireve-phon-num">
          {{ disphon }}
        </view>
        <button class="retireve-phon-send" v-if="sun" @click="btnButton">发送验证码</button>
        <button class="retireve-phon-send" disabled v-else>{{ second }}秒后重发</button>
      </view>
      <view class="retireve-pas">
        <view class="retireve-pas-title">
          请输新密码
        </view>
        <view class="retireve-pas-input">
          <input class="retireve-pas-input-i" type="password" v-model="newpassword" maxlength="6" />
        </view>
      </view>
      <view class="retireve-pass" v-if="passt">
        {{ passtext }}
      </view>
      <!-- 验证码 -->
      <view class="retireve-input">
        <view class="retireve-input-test">
          请输入验证码
        </view>
        <qui-input-code @getdata="btndata" :title="pad" :text="test"></qui-input-code>
      </view>
      <view class="retireve-button">
        <qui-button type="primary" size="large" @click="submission">
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
    };
  },
  onLoad(sing) {
    this.sendtype = sing.pas;
    this.userid = Number(sing.user);
    this.personaldata();
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
      sendphon
        .then(res => {
          console.log(res);
          this.num -= 1;
        })
        .catch(err => {
          console.log(err);
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
          console.log('成功', res);
        })
        .catch(err => {
          console.log('失败', err);
          if (err.statusCode === 422) {
            this.passt = true;
            /* eslint-disable */
            this.passtext = err.data.errors[0].detail[0];
          } else if (err.statusCode === 500) {
            this.test = `验证码错误，您还可以重发${this.num}次`;
            this.pad = true;
            if(this.num < 0){
              this.test = '请过5分钟重试'
            }
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.retireve {
  width: 100vw;
  height: 100vh;
}
.retireve-tab {
  padding: 31rpx 0 0 40rpx;
}
.retireve-titel {
  font-size: 50rpx;
  font-weight: bold;
  line-height: 60rpx;
  color: rgba(51, 51, 51, 1);
  opacity: 1;
}
.retireve-phon {
  display: flex;
  width: 710rpx;
  height: 100rpx;
  justify-content: space-between;
  margin: 31rpx 0 0;
  border-bottom: 2rpx solid rgba(237, 237, 237, 1);
  box-sizing: border-box;
}
.retireve-phon-test {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(119, 119, 119, 1);
  opacity: 1;
}
.retireve-phon-num {
  margin: 0 0 0 109rpx;
  font-size: 34rpx;
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
  font-size: 28rpx;
  font-weight: 400;
  line-height: 70rpx;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  background: rgba(24, 120, 243, 1);
  border-radius: 5rpx;
  opacity: 1;
}
.retireve-pas {
  display: flex;
  width: 100%;
  height: 100rpx;
  padding: 0 40rpx 0 0;
  border-bottom: 2rpx solid rgba(237, 237, 237, 1);
  box-sizing: border-box;
  justify-content: space-between;
}
.retireve-pas-title {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(119, 119, 119, 1);
  opacity: 1;
}
.retireve-input {
  width: 710rpx;
}
.retireve-input-test {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(119, 119, 119, 1);
  opacity: 1;
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
  font-size: 24rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(250, 81, 81, 1);
  opacity: 1;
}
</style>
