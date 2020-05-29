<template>
  <view class="page-message">
    <view class="page-message--inner">
      <!-- 如果不是本地的图片，这里可以改一下，只用一个 image 标签即可，更换 src 的值即可-->
      <image
        class="page-message--icon"
        src="@/static/msg-404.svg"
        mode="aspectFit"
        lazy-load
        v-if="forumError.code === '404'"
      ></image>
      <image
        class="page-message--icon"
        src="@/static/msg-warning.svg"
        mode="aspectFit"
        lazy-load
        v-if="show"
      ></image>
      <view class="page-message--title" v-if="message.title">{{ message.title }}</view>
      <view class="page-message--subtitle" v-if="show">
        {{ message.subtitle | closedError(forumError, forumError.code) }}
      </view>
      <!-- 退出小程序：https://uniapp.dcloud.io/component/navigator?id=navigator 2.1.0+ -->

      <navigator class="out page-message--exit" open-type="exit" target="miniProgram" v-if="show">
        <qui-button size="medium" @click="handleClick" class="out-btn">
          {{ message.btnTxt }}
        </qui-button>
      </navigator>

      <qui-button size="medium" @click="handleLoginClick" v-if="forumError.code === 'site_closed'">
        {{ i18n.t('core.admin_login') }}
      </qui-button>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import { i18n } from '@/locale';

const TYPE_404 = '404';
const TYPE_CLOSED = 'site_closed';
const NOT_INSTALL = 'not_install';
const BAN_USER = 'ban_user';
const message = {
  [TYPE_404]: {
    title: i18n.t('core.page_not_found'),
    subtitle: i18n.t('core.page_not_found_detail'),
    btnTxt: i18n.t('core.back_home'),
    icon: '@/static/msg-404.svg',
  },
  [TYPE_CLOSED]: {
    title: i18n.t('core.site_closed'),
    subtitle: '', // 从接口读取站点关闭后的提示语
    btnTxt: i18n.t('core.close'),
    icon: '@/static/msg-warning.svg',
  },
  [NOT_INSTALL]: {
    title: i18n.t('core.not_install'),
    subtitle: '', // 从接口读取站点关闭后的提示语
    btnTxt: i18n.t('core.close'),
    icon: '@/static/msg-warning.svg',
  },
  [BAN_USER]: {
    title: i18n.t('core.ban_user'),
    subtitle: '', // 从接口读取站点关闭后的提示语
    btnTxt: i18n.t('core.close'),
    icon: '@/static/msg-warning.svg',
  },
};
export default {
  filters: {
    closedError(subtitle, err, code) {
      if (err && err.detail && code === TYPE_CLOSED) return err.detail[0];
      return subtitle;
    },
  },
  computed: {
    ...mapState({
      forumError: state => state.forum.error,
    }),
    message() {
      return message[this.forumError.code] || {};
    },
    show() {
      return [TYPE_CLOSED, NOT_INSTALL, BAN_USER].indexOf(this.forumError.code) >= 0;
    },
  },
  methods: {
    handleClick() {
      console.log(111);
      // 404
      if (this.forumError.code === TYPE_404) {
        uni.redirectTo({
          url: '/pages/home/index',
        });
      }
    },
    handleLoginClick() {
      this.$store.getters['session/get']('auth').open();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';

.page-message {
  display: flex;
  align-items: center;
  justify-content: center;
  &--icon {
    height: 140rpx;
    margin: 140rpx 0 40rpx;
  }
  &--inner {
    position: relative;
    margin-top: 140rpx;
    text-align: center;
  }
  &--title {
    max-width: 510rpx;
    margin: 0 auto 20rpx;
    font-size: $fg-f34;
    font-weight: bold;
    line-height: 45rpx;
    color: rgba(51, 51, 51, 1);
  }
  &--subtitle {
    max-width: 510rpx;
    margin: 0 auto 50rpx;
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 37rpx;
    color: rgba(170, 170, 170, 1);
  }
}
.out {
  height: 90rpx;
  .page-message--exit {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 1;
    width: 510rpx;
    height: 90rpx;
    margin: 0 auto;
    opacity: 0;
    transform: translateX(-50%);
  }
}
.navigator-hover {
  background-color: rgba(0, 0, 0, 0);
}
</style>
