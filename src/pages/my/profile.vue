<template>
  <view class="my-profile">
    <cell-item title="用户名" arrow addon="猛子"></cell-item>
    <cell-item title="头像" slot-right arrow>
      <text class="my-profile__avatar"></text>
    </cell-item>
    <cell-item title="手机号码" arrow addon="186****7553"></cell-item>
    <cell-item title="密码" arrow addon="修改"></cell-item>
    <cell-item title="微信" arrow addon="小夕"></cell-item>
    <cell-item v-if="ifIdentificate" title="实名认证" arrow addon="某某某"></cell-item>
    <cell-item v-if="ifIdentificate" title="签名" arrow addon="修改" :border="false"></cell-item>
    <cell-item
      v-if="!ifIdentificate"
      title="实名认证"
      arrow
      addon="去认证"
      :border="false"
    ></cell-item>
  </view>
</template>

<script>
import cellItem from '@/components/qui-cell-item';

export default {
  components: {
    cellItem,
  },
  data() {
    return {
      ifIdentificate: true,
    };
  },
};
</script>

<style lang="scss">
page {
  background-color: #f9fafc;
}
.my-profile {
  padding-top: 40rpx;
  padding-left: 40rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;
  .cell-item {
    padding-right: 40rpx;
  }
  .cell-item:last-child {
    border: 0;
  }
  /deep/ .cell-item__body__content-title {
    color: #777;
  }
  .cell-item__body__right {
    color: #333;
  }
}

.my-profile__avatar {
  width: 75rpx;
  height: 75rpx;
  border-radius: 50%;
}
</style>
