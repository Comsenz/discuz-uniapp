<template>
  <view class="my-profile">
    <navigator :url="'../modify/editusername?id=' + userId" hover-class="none">
      <qui-cell-item title="用户名" arrow :addon="profile.username"></qui-cell-item>
    </navigator>
    <qui-cell-item title="头像" slot-right arrow>
      <image
        class="my-profile__avatar"
        :src="profile.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'"
        alt="avatarUrl"
      ></image>
    </qui-cell-item>
    <navigator :url="'../modify/mobile?id=' + userId" hover-class="none">
      <qui-cell-item title="手机号码" arrow :addon="profile.mobile"></qui-cell-item>
    </navigator>
    <navigator :url="'../modify/editpwd?id=' + userId" hover-class="none">
      <qui-cell-item title="密码" arrow addon="修改"></qui-cell-item>
    </navigator>
    <qui-cell-item title="微信" arrow :addon="profile.wechat.nickname"></qui-cell-item>
    <qui-cell-item
      v-if="profile.realname"
      title="实名认证"
      arrow
      :addon="profile.realname"
    ></qui-cell-item>
    <navigator :url="'../modify/signature?id=' + userId" hover-class="none">
      <qui-cell-item
        v-if="profile.realname"
        title="签名"
        arrow
        addon="修改"
        :border="false"
      ></qui-cell-item>
    </navigator>
    <navigator :url="'../modify/realname?id=' + userId" hover-class="none">
      <qui-cell-item
        v-if="!profile.realname"
        title="实名认证"
        arrow
        addon="去认证"
        :border="false"
      ></qui-cell-item>
    </navigator>
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
      userId: 1, // 获取当前登陆用户的ID
    };
  },
  computed: {
    profile() {
      console.log(this.$store.getters['jv/get']('users/1'));
      return this.$store.getters['jv/get']('users/1');
    },
  },
  methods: {
    // 获取当前登陆用户的ID
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
  /deep/ .cell-item__body__content-title {
    color: #777;
  }
  .cell-item__body__right {
    color: #333;
  }
}

.my-profile__avatar {
  position: absolute;
  top: 13rpx;
  right: 44rpx;
  width: 75rpx;
  height: 75rpx;
  border-radius: 50%;
}
</style>
