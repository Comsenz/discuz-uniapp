<template>
  <view class="chagepas">
    <view class="chagepas-pas">
      <input type="text" class="chagepas-pas-inpa" v-model="sername" />
      <view class="chagepas-erro-test" v-if="edit">
        {{ test }}
      </view>
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
      edit: false,
      judge: false,
      sername: '',
      myname: '',
      test: '',
      userid: '',
      nametitle: { icon: 'none', title: '名字不能为空', duration: 2000 },
      modifysucc: '名字修改成功',
    };
  },
  onLoad(arr) {
    this.userid = Number(arr.id);
    this.mytitle();
  },
  methods: {
    submission() {
      if (this.sername) {
        this.changname();
      } else {
        uni.showToast({
          icon: this.nametitle.icon,
          title: this.nametitle.title,
          duration: this.nametitle.duration,
        });
      }
    },
    changname() {
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
          if (res) {
            uni.showToast({
              title: this.modifysucc,
              duration: 2000,
            });
          }
        })
        .catch(err => {
          if (err.statusCode === 500) {
            this.edit = true;
            /* eslint-disable */
            this.test = err.data.errors[0].detail[0];
          }
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
  box-sizing: border-box;
}
.chagepas-erro-test {
  margin-top: 20rpx;
  font-size: $fg-f24;
  font-weight: 400;
  color: --color(--qui-RED);
}
.chagepas-pas-inpa {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 100rpx;
  text-align: left;
  border-bottom: 2rpx solid --color(--qui-BG-ED);
}
.chagepas-pas-btn {
  margin: 50rpx 0 0;
}
</style>
