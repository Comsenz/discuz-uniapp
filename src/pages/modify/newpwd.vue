<template>
  <view class="setuppas">
    <view class="setuppas-pas">
      <input
        type="password"
        class="setuppas-pas-inpa"
        :placeholder="i18n.t('modify.enternew')"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="valueused"
      />
      <input
        type="password"
        class="setuppas-pas-inpa"
        :placeholder="i18n.t('modify.enterreplace')"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="valuenew"
      />
      <view class="setuppas-erro-messag1" v-if="judge2">
        {{ test }}
      </view>
      <view class="setuppas-pas-btn">
        <qui-button type="primary" size="large" @click="submission">
          {{ i18n.t('modify.submission') }}
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
      userid: '',
      fun: true,
      valueused: '',
      valuenew: '',
      judge: false,
      judge2: false,
      test: '',
    };
  },
  onLoad(arr) {
    this.userid = Number(arr.id);
  },
  methods: {
    submission() {
      if (this.valueused && this.valuenew) {
        if (this.valueused === this.valuenew) {
          this.setpassword();
        } else {
          this.judge2 = true;
          this.test = this.i18n.t('modify.masstext');
        }
      } else if (!this.valueused) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('modify.newpassword'),
          duration: 2000,
        });
      } else if (!this.valuenew) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('modify.confrimpasword'),
          duration: 2000,
        });
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
          if (res) {
            uni.showToast({
              title: this.i18n.t('modify.passwordsetsucc'),
              duration: 2000,
            });
          }
        })
        .catch(err => {
          /* eslint-disable */
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
  padding: 0 0 0 40rpx;
  margin-top: 31rpx;
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
  margin-top: 20rpx;
  font-size: $fg-f24;
  font-weight: 400;
  color: --color(--qui-RED);
}
</style>
