<template>
  <view class="tica">
    <view class="tica-name">
      <input
        type="text"
        class="tica-name-inpa"
        placeholder="容请输入真实姓名"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="myname"
      />
      <input
        type="text"
        class="tica-name-inpa"
        placeholder="请输入您的身份证号码"
        placeholder-style="color:rgba(221,221,221,1)"
        v-model="myid"
      />
      <view class="tica-erro-messag1" v-if="judge">
        {{ title1 }}
      </view>
      <view class="chagepas-pas-btn">
        <qui-button type="primary" size="large" @click="btntica">
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
          console.log('成功', res);
        })
        .catch(err => {
          console.log('失败', err);
          /* eslint-disable */
          if (err.statusCode === 422) {
            this.judge = true;
            this.title1 = err.data.errors[0].detail[0];
            console.log('tltle', this.title1);
          } else if (err.statusCode === 500) {
            this.judge = true
            this.title1 = err.data.errors[0].detail[0];
            console.log('tltle', this.title1);
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
}
.tica-name {
  width: 100%;
  padding: 31px 0 0 40rpx;
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
.chagepas-pas-btn {
  margin: 50rpx 0 0;
}
.tica-erro-messag1 {
  font-size: $fg-f24;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-RED);
}
</style>
