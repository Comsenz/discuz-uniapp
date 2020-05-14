<template>
  <view class="new" @click.stop="toggleBox">
    <view class="new-phon" v-if="phon">
      <view class="new-phon-test">
        {{ i18n.t('modify.newphonnumber') }}
      </view>
      <view class="new-phon-number">
        <input class="new-phon-num" type="text" v-model="newphon" />
        <button class="new-phon-send" v-if="sun" @click="btnButton">
          {{ i18n.t('modify.sendverificode') }}
        </button>
        <button class="new-phon-send" disabled v-else>
          {{ second + i18n.t('modify.retransmission') }}
        </button>
      </view>
    </view>
    <!-- 验证码 -->
    <view class="new-input" @click.stop="fourse">
      <view class="new-input-test">
        {{ i18n.t('modify.placeentercode') }}
      </view>
      <qui-input-code
        @getdata="btndata"
        :title="tit"
        :text="test"
        :show="inshow"
        :isiphonex="inisIphone"
      ></qui-input-code>
    </view>
    <view class="new-button">
      <qui-button type="primary" size="large" @click="dingphon">
        {{ i18n.t('modify.nextsetp') }}
      </qui-button>
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
      iptValue: '',
      isFocus: false,
      second: 60,
      num: 5,
      tit: false,
      test: '',
      sun: true,
      phon: true,
      newphon: '',
      setnum: '',
      icon: 'none',
      duration: 2000,
      inshow: false,
      inisIphone: false,
    };
  },
  methods: {
    fourse() {
      this.inshow = true;
    },
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
          this.num -= 1;
          /* eslint-disable */
          this.second = res._jv.json.data.attributes.interval;
        })
        .catch(err => {
          if(err.statusCode === 500) {
            uni.showToast({
              icon: this.icon,
              title: this.i18n.t('modify.lateron'),
              duration: this.duration,
            });
          }
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
          uni.showToast({
            title: '手机号修改成功',
            duration: 1000
          });
          uni.navigateTo({
              url: '/pages/my/profile',
          });
        })
        .catch(err => {
          uni.showToast({
            icon: this.icon,
            title: this.i18n.t('modify.valifailed'),
            duration: 2000,
          });
          if (err.statusCode === 422) {
            this.tit = true;
            /* eslint-disable */
            this.test = err.data.errors[0].detail[0];
          } else if (err.statusCode === 500) {
            this.test = this.i18n.t('modify.validionerro') + this.num + this.i18n.t('modify.frequency');
            this.tit = true;
            if(this.num < 0){
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
.new-input {
  width: 710rpx;
  margin: 0 0 0 40rpx;
}
.new-input-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(119, 119, 119, 1);
  opacity: 1;
}
.new-vftion-input {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.new-button {
  margin: 52rpx 40rpx 0;
}
</style>
