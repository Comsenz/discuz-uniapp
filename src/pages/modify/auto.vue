<template>
  <view class="aogph">
    <view class="aogph-tab">
      <view class="aogph-tab-ao">
        <view class="aogph-tab-ao-my">
          我的签名
        </view>
        <view class="aogph-tab-ao-test">还能输入{{ num - shuzi }}个字</view>
      </view>
      <view class="aogph-tab-input">
        <textarea
          type="text"
          class="aogph-tab-input-in"
          maxlength="450"
          placeholder="请输入签名内容"
          placeholder-style="color:rgba(181,181,181,1)"
          v-model="content"
          @input="fun"
        />
        <view class="aogph-tab-input-text"></view>
      </view>
      <button class="aogph-tab-button" @click="btnbutton">提交</button>
    </view>
  </view>
</template>

<script>
import { status } from 'jsonapi-vuex';

export default {
  data() {
    return {
      sun: true,
      content: '',
      num: 450,
      shuzi: '',
    };
  },
  onLoad() {
    this.mydata();
  },
  methods: {
    fun(e) {
      this.shuzi = e.target.value.length;
    },
    btnbutton() {
      this.signature();
    },
    mydata() {
      this.$store.dispatch('jv/get', 'users/24?include=groups').then(data => {
        this.content = data.signature;
      });
    },
    signature() {
      const params = {
        _jv: {
          type: 'users',
          id: 24,
        },
        signature: this.content,
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
.aogph {
  width: 100vw;
  height: 100vh;
}
.aogph-tab {
  padding: 36rpx 40rpx 0;
}
.aogph-tab-ao {
  display: flex;
  justify-content: space-between;
}
.aogph-tab-ao-my,
.aogph-tab-ao-test {
  font-size: 24rpx;
  font-weight: 400;
  line-height: 45rpx;
  color: rgba(119, 119, 119, 1);
  opacity: 1;
}
.aogph-tab-input-in {
  width: 100%;
  height: 400rpx;
  padding: 20rpx 0 0 20rpx;
  text-align: top;
  background: rgba(249, 250, 252, 1);
  border: 1rpx solid rgba(221, 221, 221, 1);
  box-sizing: border-box;
}
.aogph-tab-button {
  width: 670rpx;
  height: 90rpx;
  margin: 50rpx 0 0;
  color: #fff;
  background: rgba(24, 120, 243, 1);
  border-radius: 5rpx;
  opacity: 1;
}
</style>
