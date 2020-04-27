<template>
  <view class="chagepas">
    <view class="chagepas-pas">
      <input type="text" class="chagepas-pas-inpa" v-model="sername" />
      <button class="chagepas-pas-btn" @click="submission">提交</button>
    </view>
  </view>
</template>
<script>
import { status } from 'jsonapi-vuex';

export default {
  data() {
    return {
      fun: true,
      valueused: '',
      judge: false,
      sername: '',
      myname: '',
      userid: '',
    };
  },
  onLoad() {
    this.$store.dispatch('jv/get', 'users/24?include=groups').then(data => {
      console.log(data);
      this.sername = data.username;
    });
  },
  methods: {
    submission() {
      console.log(1);
      this.changname();
    },
    changname() {
      console.log(this.sername);
      const params = {
        _jv: {
          type: 'users',
          id: 24,
        },
        username: this.sername,
      };
      const patchname = status.run(() => this.$store.dispatch('jv/patch', params));
      patchname
        .then(res => {
          console.log('成功', res);
        })
        .catch(err => {
          console.log('失败', err);
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
.chagepas-pas-btn {
  width: 670rpx;
  height: 90rpx;
  margin: 50rpx 0 0;
  color: #fff;
  background: rgba(24, 120, 243, 1);
  border-radius: 5rpx;
  opacity: 1;
}
.chagepas-erro-messag1 {
  font-size: 24rpx;
  font-weight: 400;
  line-height: 100rpx;
  color: rgba(250, 81, 81, 1);
  opacity: 1;
}
</style>
