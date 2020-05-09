<template>
  <view class="chagepas">
    <view class="chagepas-pas">
      <input
        type="password"
        :class="judge ? 'chagepas-pas-inpa2' : 'chagepas-pas-inpa'"
        :placeholder="enterold"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="valueused"
        @input="changeinput"
      />
      <view class="chagepas-erro-messag1" v-if="judge">
        {{ text }}
      </view>
      <input
        type="password"
        :class="judge2 ? 'chagepas-pas-inpa2' : 'chagepas-pas-inpa'"
        :placeholder="enternew"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="valuenew"
        @input="changeinput2"
      />
      <view class="chagepas-erro-messag1" v-if="judge2">
        {{ text1 }}
      </view>
      <input
        type="password"
        :class="judge3 ? 'chagepas-pas-inpa2' : 'chagepas-pas-inpa'"
        :placeholder="enterreplace"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="valuetone"
        @input="changeinput3"
      />
      <view class="chagepas-erro-messag1" v-if="judge3">
        {{ masstext }}
      </view>
      <view class="chagepas-pas-btn">
        <qui-button :type="styledisbla" size="large" :disabled="disab" @click="submission">
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

export default {
  data() {
    return {
      userid: '',
      fun: true,
      valueused: '',
      valuenew: '',
      valuetone: '',
      judge: false,
      judge2: false,
      judge3: false,
      text: '',
      text1: '',
      masstext: '两次输入的密码不一致，请重新输入',
      styledisbla: 'primary',
      disab: false,
      enterold: '请输入旧密码',
      enternew: '请输入新密码',
      enterreplace: '请重复输入新密码',
      icon: 'none',
      oldpassword: '旧密码不能为空',
      newpassword: '新密码不能为空',
      confrimpasword: '确认密码不能为空',
      titlepassword: '密码修改成功',
    };
  },
  onLoad(arr) {
    this.userid = Number(arr.id);
  },
  methods: {
    submission() {
      if (this.valueused && this.valuetone && this.valuenew) {
        this.changpasword();
      } else if (!this.valueused) {
        uni.showToast({
          icon: this.icon,
          title: this.oldpassword,
          duration: 2000,
        });
      } else if (!this.valuenew) {
        uni.showToast({
          icon: this.icon,
          title: this.newpassword,
          duration: 2000,
        });
      } else if (!this.valuetone) {
        uni.showToast({
          icon: this.icon,
          title: this.confrimpasword,
          duration: 2000,
        });
      }
    },
    changtype() {
      this.disab = false;
    },
    changeinput() {
      if (this.valueused.length <= 0) {
        this.judge = false;
        this.disab = false;
        this.styledisbla = 'primary';
      }
      this.chanagedisab();
    },
    changeinput2() {
      if (this.valuenew <= 0) {
        this.judge2 = false;
        this.disab = false;
        this.styledisbla = 'primary';
      }
      this.chanagedisab();
    },
    changeinput3() {
      if (this.valuetone <= 0) {
        this.judge3 = false;
        this.disab = false;
        this.styledisbla = 'primary';
      }
      this.chanagedisab();
    },
    chanagedisab() {
      if (this.valueused && this.valuenew && this.valuetone) {
        this.disab = false;
        this.styledisbla = 'primary';
      }
    },
    // 修改密码请求
    changpasword() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        password: this.valueused,
        newPassword: this.valuenew,
        password_confirmation: this.valuetone,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/patch', params));
      postphon
        .then(res => {
          if (res) {
            uni.showToast({
              title: this.titlepassword,
              duration: 2000,
            });
          }
        })
        .catch(err => {
          this.disab = true;
          this.styledisbla = 'default';
          /* eslint-disable */
          if (err.statusCode === 422) {
            if (this.valuetone === this.valuenew) {
              this.judge2 = true;
              this.judge3 = false;
              this.text1 = err.data.errors[0].detail[0];
            } else {
              this.judge3 = true;
              this.judge2 = false;
              this.disab = true;
            }
          } else if (err.statusCode === 500) {
            this.judge2 = false;
            this.judge3 = false;
            this.judge = true;
            this.text = err.data.errors[0].detail[0];
          }
        });
    },
    runretire() {
      uni.navigateTo({
        url: `/pages/modify/findpwd?user=${this.userid}&pas=reset_pwd`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.chagepas {
  width: 100vw;
  height: 100vh;
}
.chagepas-pas {
  width: 100%;
  padding: 0 0 0 40rpx;
  margin: 31rpx 0 0;
}
.chagepas-pas-inpa {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 100rpx;
  text-align: left;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.chagepas-pas-inpa2 {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-RED);
  text-align: left;
  border-bottom: 2rpx solid --color(--qui-RED);
}
.chagepas-pas-btn {
  margin: 50rpx auto 0;
}
.chagepas-erro-messag1 {
  margin-top: 20rpx;
  font-size: $fg-f24;
  font-weight: 400;
  color: --color(--qui-RED);
}
.chagepas-erro-forget {
  margin: 30rpx 0 0;
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 37rpx;
  color: --color(--qui-LINK);
}
</style>
