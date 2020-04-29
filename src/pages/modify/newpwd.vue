<template>
  <view class="setuppas">
    <view class="setuppas-pas">
      <input
        type="password"
        class="setuppas-pas-inpa"
        placeholder="请输入新密码"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="valueused"
      />
      <input
        type="password"
        class="setuppas-pas-inpa"
        placeholder=" 请重复输入新密码"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="valuenew"
      />
      <view class="setuppas-erro-messag1" v-if="judge2">
        {{ test }}
      </view>
      <view class="setuppas-pas-btn">
        <qui-button type="primary" size="large" @click="submission">
          提交
        </qui-button>
      </view>
    </view>
  </view>
</template>
<script>
import { status } from 'jsonapi-vuex';

export default {
  data() {
    return {
      userid: 24,
      fun: true,
      valueused: '',
      valuenew: '',
      judge: false,
      judge2: false,
      test: '两次输入的密码不一致，请重新输入',
    };
  },
  onLoad() {
    //  this.userid = sun.id;
  },
  methods: {
    submission() {
      console.log(this.valueused, this.valuenew, this.judge2);
      if (this.valueused === this.valuenew) {
        this.setpassword();
      } else {
        this.judge2 = true;
      }
    },
    setpassword() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        newPassword: this.valueused,
        password_confirmation: this.valuenew,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/patch', params));
      postphon
        .then(res => {
          console.log('成功', res);
        })
        .catch(err => {
          /* eslint-disable */
          console.log('失败', err);
          if (err.statusCode === 422) {
            this.judge2 = true;
            this.test = err.data.errors[0].detail[0];
          } else if (err.statusCode === 500) {
            this.judge2 = true;
            this.test = err.data.errors[0].detail[0];
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.setuppas {
  width: 100vw;
  height: 100vh;
}
.setuppas-pas {
  width: 100%;
  padding: 31px 0 0 40rpx;
}
.setuppas-pas-inpa {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 100rpx;
  text-align: left;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  opacity: 1;
}
.setuppas-pas-inpa2 {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-RED);
  text-align: left;
  border-bottom: 2rpx solid --color(--qui-RED);
  opacity: 1;
}
.setuppas-pas-btn {
  margin: 50rpx 0 0;
}
.setuppas-erro-messag1 {
  font-size: $fg-f24;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-RED);
}
</style>
