<template>
  <qui-page>
    <view class="tica">
      <view class="tica-name">
        <input
          type="text"
          class="tica-name-inpa"
          :placeholder="i18n.t('modify.realname')"
          placeholder-style="color:rgba(221,221,221,1)"
          v-model="myname"
        />
        <input
          type="text"
          class="tica-name-inpa"
          :placeholder="i18n.t('modify.enteridnumber')"
          placeholder-style="color:rgba(221,221,221,1)"
          v-model="myid"
        />
        <view class="tica-erro-messag1" v-if="judge">
          {{ title1 }}
        </view>
        <view class="tica-pas-btn">
          <qui-button type="primary" size="large" @click="btntica">
            {{ i18n.t('modify.submission') }}
          </qui-button>
        </view>
      </view>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  data() {
    return {
      fun: true,
      myname: '',
      myid: '',
      title1: '',
      judge: false,
    };
  },
  methods: {
    btntica() {
      this.authentication();
    },
    authentication() {
      const params = {
        _jv: {
          type: 'users/real',
        },
        identity: this.myid,
        realname: this.myname,
      };
      const patchname = status.run(() => this.$store.dispatch('jv/patch', params));
      patchname
        .then(res => {
          if (res) {
            uni.showToast({
              title: this.i18n.t('modify.nameauthensucc'),
              duration: 2000,
            });
            uni.navigateBack();
          }
        })
        .catch(err => {
          if (err.statusCode === 422) {
            this.judge = true;
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.title1 = sun;
            uni.showToast({
              icon: 'none',
              title: this.title1,
              duration: 2000,
            });
          } else if (err.statusCode === 500) {
            this.judge = true;
            this.title1 = err.data.errors[0].detail;
            uni.showToast({
              icon: 'none',
              title: this.title1,
              duration: 2000,
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.tica {
  width: 100vw;
  height: 100vh;
  padding-top: 31rpx;
  background-color: --color(--qui-BG-2);
  box-sizing: border-box;
}
.tica-name {
  width: 100%;
  padding: 0 0 0 40rpx;
}
.tica-name-inpa {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 100rpx;
  text-align: left;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.tica-pas-btn {
  margin: 50rpx 0 0;
}
.tica-erro-messag1 {
  margin-top: 20rpx;
  font-size: $fg-f24;
  font-weight: 400;
  color: --color(--qui-RED);
}
</style>
