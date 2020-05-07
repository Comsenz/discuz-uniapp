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
      <view class="aogph-tab-button">
        <qui-button type="primary" size="large" @click="btnbutton">
          提交
        </qui-button>
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
      userid: 24,
      sun: true,
      content: '',
      num: 450,
      shuzi: '',
    };
  },
  onLoad() {
    this.mydata();
    // this.userid = sun.id
  },
  methods: {
    fun(e) {
      this.shuzi = e.target.value.length;
    },
    btnbutton() {
      this.signature();
    },
    // 获取用户数据
    mydata() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: 'groups',
      };
      this.$store.dispatch('jv/get', params).then(data => {
        this.content = data.signature;
      });
    },
    // 修改签名数据
    signature() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
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

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/reset.scss';
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
  font-size: $fg-f24;
  font-weight: 400;
  line-height: 45rpx;
  color: --color(--qui-FC-777);
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
  margin: 50rpx 0 0;
}
</style>
