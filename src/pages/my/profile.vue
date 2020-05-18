<template>
  <qui-page class="profile">
    <view class="my-profile">
      <navigator :url="`../modify/editusername?id=${userId}`" hover-class="none">
        <qui-cell-item
          :title="i18n.t('profile.username')"
          arrow
          :addon="profile.username"
        ></qui-cell-item>
      </navigator>
      <qui-cell-item :title="i18n.t('profile.avatar')" slot-right arrow>
        <image
          class="my-profile__avatar"
          :src="profile.avatarUrl || '/static/noavatar.gif'"
          alt="avatarUrl"
        ></image>
      </qui-cell-item>
      <!-- qcloud_sms 是否开启短信服务  没有绑定手机号码，跳到“设置新手机”页,反之跳到修改手机号页面，-->
      <navigator
        :url="profile.mobile ? `../modify/mobile?id=${userId}` : `../modify/setphon?id=${userId}`"
        hover-class="none"
        v-if="forums.qcloud.qcloud_sms"
      >
        <qui-cell-item
          :title="i18n.t('profile.mobile')"
          arrow
          :addon="profile.mobile"
        ></qui-cell-item>
      </navigator>
      <!--没有密码，跳到“设置密码”页,反之跳到密码是修改页面，-->
      <navigator
        :url="
          profile.hasPassword ? `../modify/editpwd?id=${userId}` : `../modify/newpwd?id=${userId}`
        "
        hover-class="none"
      >
        <qui-cell-item
          :title="i18n.t('profile.password')"
          arrow
          :addon="profile.hasPassword ? i18n.t('profile.modify') : i18n.t('profile.setpaypassword')"
        ></qui-cell-item>
      </navigator>
      <qui-cell-item
        :title="i18n.t('profile.wechat')"
        arrow
        :addon="profile.wechat.nickname"
      ></qui-cell-item>
      <!-- qcloud_faceid 是否开启实名认证 -->
      <qui-cell-item
        v-if="profile.realname && forums.qcloud.qcloud_faceid"
        :title="i18n.t('profile.certification')"
        arrow
        :addon="profile.realname"
      ></qui-cell-item>
      <navigator :url="`../modify/realname?id=${userId}`" hover-class="none">
        <qui-cell-item
          v-if="!profile.realname && forums.qcloud_faceid"
          :title="i18n.t('profile.certification')"
          arrow
          :addon="i18n.t('profile.tocertification')"
        ></qui-cell-item>
      </navigator>
      <navigator :url="`../modify/signature?id=${userId}`" hover-class="none">
        <qui-cell-item
          :title="i18n.t('profile.signature')"
          arrow
          :addon="i18n.t('profile.modify')"
          :border="false"
        ></qui-cell-item>
      </navigator>
      <qui-uploader
        :url="`${host}api/users/${userId}/avatar`"
        :header="header"
        :form-data="formData"
        async-clear
        ref="upload"
        @change="uploadChange"
      ></qui-uploader>
    </view>
  </qui-page>
</template>

<script>
import { DISCUZ_REQUEST_HOST } from '@/common/const';

export default {
  components: {
    //
  },
  data() {
    return {
      hasPassword: false,
      header: {},
      formData: {},
      host: DISCUZ_REQUEST_HOST,
      userId: uni.getStorageSync('user_id'), // 获取当前登陆用户的ID
    };
  },
  computed: {
    profile() {
      return this.$store.getters['jv/get'](`users/${this.userId}`);
    },
  },
  onLoad() {
    const token = uni.getStorageSync('access_token');
    this.header = {
      authorization: `Bearer ${token}`,
    };
    this.formData = {
      isGallery: 1,
    };
  },
  methods: {
    uploadChange(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.my-profile {
  position: relative;
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
  /deep/ .qui-uploader-box {
    position: absolute;
    top: 140rpx;
    right: 0;
    display: inline;
    min-height: 100rpx;
    padding: 0;
  }
  /deep/ .qui-uploader-box__add {
    height: 100rpx;
    background: transparent;
  }
  /deep/ .icon-add {
    display: none;
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
