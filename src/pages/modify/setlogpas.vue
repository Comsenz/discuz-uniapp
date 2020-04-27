<template>
  <view class="chagepas">
    <view class="chagepas-pas">
      <input
        type="password"
        :class="judge ? 'chagepas-pas-inpa2' : 'chagepas-pas-inpa'"
        placeholder="请输入旧密码"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="valueused"
      />
      <view class="chagepas-erro-messag1" v-if="judge">
        {{ text }}
      </view>
      <input
        type="password"
        :class="judge2 ? 'chagepas-pas-inpa2' : 'chagepas-pas-inpa'"
        placeholder="请输入新密码"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="valuenew"
      />
      <view class="chagepas-erro-messag1" v-if="judge2">
        {{ text1 }}
      </view>
      <input
        type="password"
        :class="judge3 ? 'chagepas-pas-inpa2' : 'chagepas-pas-inpa'"
        placeholder="请重复输入新密码"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="valuetone"
        @input="changtype"
      />
      <view class="chagepas-erro-messag1" v-if="judge3">
        两次输入的密码不一致，请重新输入
      </view>
      <view class="chagepas-pas-btn">
        <qui-button
          class="chagepas-pas-btn"
          type="primary"
          size="large"
          :disabled="disab"
          @click="submission"
        >
          提交
        </qui-button>
      </view>
      <view class="chagepas-erro-forget" @click="runretire">
        忘记旧密码?
      </view>
    </view>
  </view>
</template>
<script>
import { status } from 'jsonapi-vuex';
import quiButton from '@/components/qui-button/qui-button';

export default {
  components: { quiButton },
  data() {
    return {
      fun: true,
      valueused: '',
      valuenew: '',
      valuetone: '',
      judge: false,
      judge2: false,
      judge3: false,
      text: '',
      text1: '',
      disab: false,
    };
  },
  methods: {
    submission() {
      if (this.valuetone !== this.valuenew) {
        this.judge3 = true;
        this.disab = true;
      }
      this.changpasword();
    },
    changtype() {
      console.log(1);
      this.disab = false;
    },
    // 修改密码请求
    changpasword() {
      const params = {
        _jv: {
          type: 'users',
          id: 24,
        },
        password: this.valueused,
        newPassword: this.valuenew,
        password_confirmation: this.valuetone,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/patch', params));
      postphon
        .then(res => {
          console.log('成功', res);
        })
        .catch(err => {
          console.log('users', err);
          if (err.statusCode === 422) {
            this.judge2 = true;
            [this.text1.data.errors[0].detail[0]] = err;
          } else if (err.statusCode === 500) {
            this.judge = true;
            [this.text.data.errors[0].detail[0]] = err;
          }
        });
    },
    runretire() {
      uni.navigateTo({
        url: '/pages/modify/retireve',
      });
    },
  },
};
</script>

<style lang="scss">
.chagepas {
  width: 100vw;
  height: 100vh;
}
.chagepas-pas {
  width: 100%;
  padding: 31px 0 0 40rpx;
  opacity: 1;
}
.chagepas-pas-inpa {
  width: 100%;
  height: 100rpx;
  font-size: 34rpx;
  font-weight: 400;
  line-height: 100rpx;
  text-align: left;
  border-bottom: 2rpx solid rgba(237, 237, 237, 1);
  opacity: 1;
}
.chagepas-pas-inpa2 {
  width: 100%;
  height: 100rpx;
  font-size: 34rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(250, 81, 81, 1);
  text-align: left;
  border-bottom: 2rpx solid rgba(250, 81, 81, 1);
  opacity: 1;
}
.chagepas-pas-btn {
  margin: 50rpx auto 0;
}
.chagepas-erro-messag1 {
  font-size: 24rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(250, 81, 81, 1);
  opacity: 1;
}
.chagepas-erro-forget {
  margin: 30rpx 0 0;
  font-size: 28rpx;
  font-weight: 400;
  line-height: 37rpx;
  color: rgba(0, 71, 155, 1);
}
</style>
