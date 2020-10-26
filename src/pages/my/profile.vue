<template>
  <qui-page :data-qui-theme="theme" class="profile">
    <view class="my-profile">
      <!-- canEditUsername 是否允许修改用户名-->
      <navigator
        :url="`/pages/modify/editusername?id=${userId}`"
        hover-class="none"
        v-if="profile.canEditUsername"
      >
        <qui-cell-item
          :title="i18n.t('profile.username')"
          arrow
          :addon="profile.username"
        ></qui-cell-item>
      </navigator>
      <qui-cell-item
        :title="i18n.t('profile.username')"
        arrow
        class="no-arrow"
        v-if="!profile.canEditUsername"
        :addon="profile.username"
      ></qui-cell-item>
      <qui-cell-item :title="i18n.t('profile.avatar')" slot-right arrow @tap="changeAvatar">
        <qui-avatar class="my-profile__avatar" :user="profile" :is-real="profile.isReal" />
      </qui-cell-item>
      <!-- qcloud_sms 是否开启短信服务  没有绑定手机号码，跳到“设置新手机”页,反之跳到修改手机号页面，-->
      <qui-cell-item
        :title="i18n.t('profile.mobile')"
        arrow
        :addon="profile.mobile ? profile.mobile : i18n.t('profile.bindingmobile')"
        v-if="forums.qcloud && forums.qcloud.qcloud_sms"
        @click="bindPhone"
      ></qui-cell-item>
      <!--没有密码，跳到“设置密码”页,反之跳到密码是修改页面，-->
      <navigator
        :url="
          profile.hasPassword
            ? `/pages/modify/editpwd?id=${userId}`
            : `/pages/modify/newpwd?id=${userId}`
        "
        hover-class="none"
      >
        <qui-cell-item
          :title="i18n.t('profile.password')"
          arrow
          :addon="profile.hasPassword ? i18n.t('profile.modify') : i18n.t('profile.setpassword')"
        ></qui-cell-item>
      </navigator>
      <qui-cell-item
        :title="i18n.t('profile.wechat')"
        :addon="name"
        arrow
        @click="bindWechat"
      ></qui-cell-item>
      <!-- qcloud_faceid 是否开启实名认证 -->
      <qui-cell-item
        v-if="profile.realname && forums.qcloud && forums.qcloud.qcloud_faceid"
        :title="i18n.t('profile.certification')"
        :addon="profile.realname"
        arrow
        class="no-arrow"
      ></qui-cell-item>
      <navigator
        :url="`/pages/modify/realname?id=${userId}`"
        hover-class="none"
        v-if="!profile.realname && forums.qcloud && forums.qcloud.qcloud_faceid"
      >
        <qui-cell-item
          :title="i18n.t('profile.certification')"
          arrow
          :addon="i18n.t('profile.tocertification')"
        ></qui-cell-item>
      </navigator>
      <navigator :url="`/pages/modify/signature?id=${userId}`" hover-class="none">
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
        count="1"
        ref="upload"
        name="avatar"
        @uploadSuccess="uploadSuccess"
        @uploadFail="uploadFail"
        @chooseSuccess="chooseSuccess"
      ></qui-uploader>
      <qui-toast ref="toast"></qui-toast>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <uni-popup ref="authPhone" type="bottom">
      <qui-auth-phone @closeDialog="closeDialog"></qui-auth-phone>
    </uni-popup>
    <!-- #endif -->
    <uni-popup ref="bind" type="center">
      <uni-popup-dialog
        type="warn"
        :content="i18n.t('user.noBindTips')"
        :before-close="true"
        @close="handleClickCancel"
        @confirm="handleClickOk"
      ></uni-popup-dialog>
    </uni-popup>
  </qui-page>
</template>

<script>
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import forums from '@/mixin/forums';
import loginModule from '@/mixin/loginModule';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';
import { getCurUrl } from '@/utils/getCurUrl';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  components: { uniPopupDialog },
  mixins: [
    forums,
    loginModule,
    // #ifdef H5
    appCommonH,
    // #endif
  ],
  data() {
    return {
      hasPassword: false,
      header: {},
      formData: {},
      profile: {},
      name: '',
      show: false,
      host: DISCUZ_REQUEST_HOST,
      userId: this.$store.getters['session/get']('userId'), // 获取当前登陆用户的ID
      // #ifdef H5
      isWeixin: false, // 默认不是微信浏览器
      // #endif
    };
  },
  // 解决左上角返回数据不刷新情况
  onShow() {
    this.getUserInfo();
  },
  onLoad() {
    const token = uni.getStorageSync('access_token');
    this.header = {
      authorization: `Bearer ${token}`,
    };
    this.formData = {
      type: 1,
    };
    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif
  },
  methods: {
    bindPhone() {
      // #ifdef MP-WEIXIN
      if (this.profile && this.profile.mobile === '') {
        this.$refs.authPhone.open();
      } else {
        uni.navigateTo({
          url: `/pages/modify/mobile?id=${this.userId}`,
        });
      }
      // #endif
      // #ifdef H5
      if (this.profile && this.profile.mobile !== '') {
        uni.navigateTo({
          url: `/pages/modify/mobile?id=${this.userId}`,
        });
      } else {
        uni.navigateTo({
          url: `/pages/modify/setphon?id=${this.userId}`,
        });
      }
      // #endif
    },
    bindWechat() {
      // 绑定
      if (this.name === '绑定') {
        uni.setStorage({
          key: 'page',
          data: getCurUrl(),
        });
        // #ifdef MP-WEIXIN
        uni.setStorageSync('isSend', true);
        uni.setStorageSync('isBind', true);
        this.$store.getters['session/get']('auth').open();
        // #endif
        // #ifdef H5
        if (this.isWeixin) {
          this.wxh5Login(0, 0);
        } else {
          uni.showToast({
            icon: 'none',
            title: this.i18n.t('profile.wechatTip'),
            duration: 2000,
          });
        }
        // #endif
        return;
      }
      // 解绑/换绑
      if (
        this.name !== '绑定' &&
        this.forums &&
        this.forums.set_reg &&
        this.forums.set_reg.register_type === 2
      ) {
        uni.setStorage({
          key: 'page',
          data: getCurUrl(),
        });
        uni.setStorageSync('isSend', false);
        uni.setStorageSync('isBind', false);
        // #ifdef MP-WEIXIN
        this.jump2LoginBindPage();
        // #endif
        // #ifdef H5
        this.wxh5Login(0, 1);
        // #endif
      } else {
        this.$refs.bind.open();
      }
    },
    handleClickOk() {
      this.$store.dispatch('jv/delete', `users/${this.userId}/wechat`).then(res => {
        if (res && res._jv && res._jv.id) {
          this.getUserInfo();
          this.handleClickCancel();
          uni.showToast({
            title: '解绑成功',
            duration: 2000,
          });
        }
      });
    },
    handleClickCancel() {
      this.$refs.bind.close();
    },
    getUserInfo() {
      const params = {
        include: 'groups,wechat',
      };
      this.$store.dispatch('jv/get', [`users/${this.userId}`, { params }]).then(res => {
        if (res && res._jv && res._jv.id) {
          this.profile = res;
          // 公众号mp_openid   小程序min_openid
          // #ifdef MP-WEIXIN
          if (res && res.wechat && res.wechat.min_openid !== '') {
            if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
              this.name = `${res.wechat.nickname} (换绑)`;
            } else {
              this.name = `${res.wechat.nickname} (解绑)`;
            }
          } else {
            this.name = '绑定';
          }
          // #endif
          // #ifdef H5
          if (res && res.wechat && res.wechat.mp_openid !== '') {
            if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
              this.name = `${res.wechat.nickname} (换绑)`;
            } else {
              this.name = `${res.wechat.nickname} (解绑)`;
            }
          } else {
            this.name = '绑定';
          }
          // #endif
          const userInfo = {
            headimgurl: res.avatarUrl,
            username: res.username,
          };
          uni.setStorageSync('userInfo', userInfo);
        }
      });
    },
    uploadSuccess(res) {
      uni.hideLoading();
      if (res.statusCode >= 200 && res.statusCode < 300) {
        this.$refs.toast.show({ message: this.i18n.t('profile.successfullyuploadedtheavatar') });
        const newAvatar = JSON.parse(res.data).data.attributes.avatarUrl;
        this.profile.avatarUrl = newAvatar;
      } else {
        const { code } = JSON.parse(res.data).errors[0];
        if (code === 'upload_time_not_up') {
          this.$refs.toast.show({ message: this.i18n.t('profile.uploadtimenotup') });
        } else if (code === 'validation_error') {
          this.$refs.toast.show({ message: this.i18n.t('profile.validationerror') });
        } else {
          this.$refs.toast.show({ message: code });
        }
      }
    },
    changeAvatar() {
      this.$refs.upload.uploadClick();
    },
    chooseSuccess() {
      uni.showLoading();
    },
    // #ifdef MP-WEIXIN
    closeDialog() {
      this.$refs.authPhone.close();
    },
    // #endif
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.profile /deep/ {
  overflow: hidden;
  .my-profile {
    position: relative;
    padding-top: 20rpx;
    padding-left: 40rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    box-sizing: border-box;
  }
  .cell-item {
    padding-right: 40rpx;
  }
  .cell-item__body__content-title {
    color: --color(--qui-FC-777);
  }
  .cell-item__body__right {
    color: --color(--qui-FC-333);
  }
  .qui-uploader-box {
    display: none;
  }
  .no-arrow .arrow {
    visibility: hidden;
  }
}

.my-profile__avatar {
  position: absolute;
  top: 13rpx;
  right: 44rpx;
  width: 75rpx;
  height: 75rpx;
}
</style>
