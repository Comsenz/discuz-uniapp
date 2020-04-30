<template>
  <view class="my-profile">
    <qui-cell-item title="用户名" arrow :addon="profile.username"></qui-cell-item>
    <qui-cell-item title="头像" slot-right arrow>
      <image
        class="my-profile__avatar"
        :src="profile.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'"
        alt="avatarUrl"
      ></image>
    </qui-cell-item>
    <qui-cell-item title="手机号码" arrow :addon="profile.mobile"></qui-cell-item>
    <qui-cell-item title="密码" arrow addon="修改"></qui-cell-item>
    <qui-cell-item title="微信" arrow :addon="profile.wechat.nickname"></qui-cell-item>
    <qui-cell-item
      v-if="profile.realname"
      title="实名认证"
      arrow
      :addon="profile.realname"
    ></qui-cell-item>
    <qui-cell-item
      v-if="profile.realname"
      title="签名"
      arrow
      addon="修改"
      :border="false"
    ></qui-cell-item>
    <qui-cell-item
      v-if="!profile.realname"
      title="实名认证"
      arrow
      addon="去认证"
      :border="false"
    ></qui-cell-item>
  </view>
</template>

<script>
export default {
  components: {
    //
  },
  data() {
    return {
      hasPassword: false,
    };
  },
  computed: {
    profile() {
      return this.$store.getters['jv/get']('users/1');
    },
  },
  methods: {
    //
  },
};
</script>

<style lang="scss" scope>
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
