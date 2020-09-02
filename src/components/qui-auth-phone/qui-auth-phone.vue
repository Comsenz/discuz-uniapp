<template>
  <view class="auth">
    <view class="auth__header">
      <qui-icon
        @tap="closeDialog"
        class="auth__header__close"
        name="icon-close"
        size="36"
      ></qui-icon>
    </view>
    <view class="auth__content">
      <image
        class="auth__content__image"
        mode="aspectFit"
        :src="(forums && forums.set_site && forums.set_site.site_logo) || '/static/logo.png'"
      ></image>
      <qui-button
        type="primary"
        open-type="getPhoneNumber"
        @getphonenumber="decryptPhoneNumber"
        lang="zh_CN"
        size="medium"
      >
        {{ t.phone }}
      </qui-button>
    </view>
  </view>
</template>

<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';

export default {
  mixins: [forums, user],
  computed: {
    t() {
      return this.i18n.t('auth');
    },
  },
  mounted() {
    this.getPhoneParam();
  },
  methods: {
    getPhoneParam() {
      uni.login({
        success: loginRes => {
          if (loginRes.errMsg === 'login:ok') {
            console.log('loginRes', loginRes);
            this.$store.dispatch('session/setCode', loginRes.code);
          }
        },
        fail: error => {
          console.log(error);
        },
      });
    },
    decryptPhoneNumber(res) {
      console.log(res);
      if (res.detail.errMsg === 'getPhoneNumber:ok') {
        const params = {
          data: {
            attributes: {
              js_code: this.$store.getters['session/get']('code'),
              iv: res.detail.iv,
              encryptedData: res.detail.encryptedData,
            },
          },
        };
        console.log('params', params);
        this.$store
          .dispatch('session/bindPhonenum', params)
          .then(result => {
            this.$emit('closeDialog');
            if (result && result.data && result.data.data && result.data.data.id) {
              console.log('result', result);
              const pages = getCurrentPages();
              const url = pages[pages.length - 1].route;
              if (url === '/pages/my/profile') {
                uni.showToast({
                  title: this.i18n.t('auth.success'),
                  duration: 2000,
                });
                uni.redirectTo({
                  url: `/pages/my/profile`,
                });
              } else {
                this.logind();
                uni.showToast({
                  title: this.i18n.t('auth.success'),
                  duration: 2000,
                });
              }
            }
            if (result && result.data && result.data.errors) {
              this.getPhoneParam();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.auth {
  height: 400rpx;
  background: --color(--qui-BG-2);
  &__header {
    padding: 30rpx 32rpx;
    text-align: right;
    &__close {
      justify-content: flex-end;
      color: --color(--qui-FC-AAA);
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &__image {
      max-height: 65rpx;
      margin: 10rpx 0 57rpx;
    }
  }
}
</style>
