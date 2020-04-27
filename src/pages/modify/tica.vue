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
      <button class="chagepas-pas-btn" @click="btntica">提交</button>
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
      title: '',
      title2: '',
    };
  },
  methods: {
    btntica() {
      this.authentication();
    },
    authentication() {
      const params = {
        _jv: {
          type: 'users',
          id: 'real',
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
          if (err.statusCode === 422) {
            [this.title1.data.errors[0].detail[0]] = err;
            console.log('tltle', this.title1);
          } else if (err.statusCode === 500) {
            [this.title1.data.errors[0].detail[0]] = err;
            console.log('tltle', this.title1);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.tica {
  width: 100vw;
  height: 100vh;
}
.tica-name {
  width: 100%;
  padding: 31px 0 0 40rpx;
  opacity: 1;
}
.tica-name-inpa {
  width: 100%;
  height: 100rpx;
  font-size: 34rpx;
  font-weight: 400;
  line-height: 100rpx;
  text-align: left;
  border-bottom: 2rpx solid rgba(237, 237, 237, 1);
  opacity: 1;
}
.chagepas-pas-btn {
  width: 670rpx;
  height: 90rpx;
  margin: 50rpx 0 0;
  color: #fff;
  background: rgba(24, 120, 243, 1);
  border-radius: 5rpx;
  opacity: 1;
}
</style>
