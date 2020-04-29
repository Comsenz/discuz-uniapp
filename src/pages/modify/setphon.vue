<template>
  <view class="new">
    <view class="new-phon" v-if="phon">
      <view class="new-phon-test">
        输入新手机号码
      </view>
      <view class="new-phon-number">
        <input class="new-phon-num" type="text" v-model="newphon" />
        <button class="new-phon-send" v-if="sun" @click="btnButton">发送验证码</button>
        <button class="new-phon-send" disabled v-else>{{ second }}秒后重发</button>
      </view>
    </view>
    <!-- 验证码 -->
    <view class="modify-input">
      <view class="modify-input-test">
        请输入验证码
      </view>
      <qui-input-code @getdata="btndata"></qui-input-code>
    </view>
    <view class="modify-button">
      <qui-button type="primary" size="large" @click="dingphon">
        下一步
      </qui-button>
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
      iptValue: '',
      isFocus: false,
      second: 60,
      sun: true,
      phon: true,
      newphon: '',
      setnum: '',
    };
  },
  methods: {
    onFocus() {
      this.isFocus = true;
    },
    setValue(event) {
      // 文本框输入事件
      const { value } = event.target;
      setTimeout(() => {
        this.iptValue = value;
      }, 1); // 重点
    },
    lose() {
      this.isFocus = false;
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
    btndata(num) {
      console.log(num);
      this.setnum = num;
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
      this.setphon();
    },
    dingphon() {
      this.bindphon();
    },
    // 新手机号发送验证码
    setphon() {
      console.log(this.newphon);
      const params = {
        _jv: {
          type: 'sms/send',
        },
        mobile: this.newphon,
        type: 'rebind',
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
    // 验证手机号
    bindphon() {
      const params = {
        _jv: {
          type: 'sms/verify',
        },
        mobile: this.newphon,
        code: this.setnum,
        type: 'rebind',
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon
        .then(res => {
          console.log('verify', res);
        })
        .catch(err => {
          console.log('verify', err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';
.new {
  width: 100vw;
  height: 100vh;
}
.new-phon {
  width: 710rpx;
  height: 200rpx;
  margin: 31rpx 0 0 40rpx;
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 100rpx;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.new-phon-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
}
.new-phon-number {
  display: flex;
}
.new-phon-num {
  width: 399rpx;
  height: 100rpx;
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 100rpx;
  color: rgba(52, 52, 52, 1);
}
.new-phon-send {
  display: block;
  height: 70rpx;
  min-width: 180rpx;
  margin: 15rpx 0 0 91rpx;
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 70rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background: --color(--qui-BG-HIGH-LIGHT);
  border-radius: 5rpx;
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
.modify-button {
  margin: 52rpx 40rpx 0;
}
</style>
