<template>
  <qui-page class="profile">
    <view class="my-profile">
      <navigator :url="'../modify/editusername?id=' + userId" hover-class="none">
        <qui-cell-item
          :title="i18n.t('profile.username')"
          arrow
          :addon="profile.username"
        ></qui-cell-item>
      </navigator>
      <qui-cell-item :title="i18n.t('profile.avatar')" slot-right arrow>
        <image
          class="my-profile__avatar"
          :src="profile.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'"
          alt="avatarUrl"
        ></image>
      </qui-cell-item>
      <navigator :url="'../modify/mobile?id=' + userId" hover-class="none">
        <qui-cell-item
          :title="i18n.t('profile.mobile')"
          arrow
          :addon="profile.mobile"
        ></qui-cell-item>
      </navigator>
      <navigator :url="'../modify/editpwd?id=' + userId" hover-class="none">
        <qui-cell-item
          :title="i18n.t('profile.password')"
          arrow
          :addon="i18n.t('profile.modify')"
        ></qui-cell-item>
      </navigator>
      <qui-cell-item
        :title="i18n.t('profile.wechat')"
        arrow
        :addon="profile.wechat.nickname"
      ></qui-cell-item>
      <qui-cell-item
        v-if="profile.realname"
        :title="i18n.t('profile.certification')"
        arrow
        :addon="profile.realname"
      ></qui-cell-item>
      <navigator :url="'../modify/signature?id=' + userId" hover-class="none">
        <qui-cell-item
          v-if="profile.realname"
          :title="i18n.t('profile.signature')"
          arrow
          :addon="i18n.t('profile.modify')"
          :border="false"
        ></qui-cell-item>
      </navigator>
      <navigator :url="'../modify/realname?id=' + userId" hover-class="none">
        <qui-cell-item
          v-if="!profile.realname"
          :title="i18n.t('profile.certification')"
          arrow
          :addon="i18n.t('profile.tocertification')"
          :border="false"
        ></qui-cell-item>
      </navigator>
    </view>
  </qui-page>
</template>

<script>
export default {
  components: {
    //
  },
  data() {
    return {
      hasPassword: false,
      userId: uni.getStorageSync('user_id'), // 获取当前登陆用户的ID
    };
  },
  computed: {
    profile() {
      return this.$store.getters['jv/get'](`users/${this.userId}`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.my-profile {
  padding-top: 40rpx;
  padding-left: 40rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  /deep/ .cell-item {
    padding-right: 40rpx;
  }
  /deep/ .cell-item__body__content-title {
    color: --color(--qui-FC-777);
  }
  .cell-item__body__right {
    color: --color(--qui-FC-333);
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
