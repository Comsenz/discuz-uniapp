<template>
  <view class="chagepas">
    <view class="chagepas-pas">
      <input type="text" class="chagepas-pas-inpa" v-model="sername" />
      <view class="chagepas-pas-btn">
        <qui-button type="primary" size="large" :disabled="disab" @click="submission">
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
      valueused: '',
      judge: false,
      sername: '',
      myname: '',
      userid: 24,
    };
  },
  onLoad() {
    this.mytitle();
    // this.userid = sun.id
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
          id: this.userid,
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
    mytitle() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: 'groups',
      };
      this.$store.dispatch('jv/get', params).then(data => {
        console.log(data);
        this.sername = data.username;
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
  padding: 31rpx 0 0 40rpx;
}
.chagepas-pas-inpa {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 100rpx;
  text-align: left;
  border-bottom: 2rpx solid rgba(237, 237, 237, 1);
  opacity: 1;
}
.chagepas-pas-btn {
  margin: 50rpx 0 0;
  border-radius: 5rpx;
}
</style>
