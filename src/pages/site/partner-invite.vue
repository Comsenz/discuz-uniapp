<template>
  <qui-page :data-qui-theme="theme" class="site" :header="false">
    <qui-site-thread :share-url="`pages/site/partner-invite?code=${code}`"></qui-site-thread>
    <view class="site-invite">
      <view class="site-invite__detail">
        <text class="site-invite__detail__bold" v-if="code.length !== 32">
          {{ inviteData.username || '' }}
        </text>
        <text class="site-invite__detail__bold" v-else>
          {{ inviteData.user ? inviteData.user.username : '' }}
        </text>
        <text>{{ i18n.t('site.inviteyouas') }}</text>
        <text class="site-invite__detail__bold">
          {{ `[ ${inviteData.group && inviteData.group.name} ]` }}
        </text>
        <text>{{ i18n.t('site.join') }}</text>
        <text class="site-invite__detail__bold">
          {{ forums.set_site && forums.set_site.site_name }}
        </text>
        <text>{{ i18n.t('site.site') }}</text>
      </view>
    </view>
    <view class="site-submit">
      <view>
        <view class="site-submit__price">
          {{ `¥${(forums.set_site && forums.set_site.site_price) || 0}` }}
        </view>
        <view class="site-submit__expire">
          {{
            forums.set_site && forums.set_site.site_expire
              ? `${i18n.t('site.periodvalidity')} ${forums.set_site &&
                  forums.set_site.site_expire} ${i18n.t('site.day')}`
              : i18n.t('site.permanent')
          }}
        </view>
      </view>
      <qui-button type="primary" @click="check" size="small">
        {{ i18n.t('site.accepttheinvitation') }}
      </qui-button>
    </view>
    <uni-popup ref="popCode" type="center">
      <uni-popup-dialog
        type="warn"
        :before-close="true"
        :content="codeTips"
        @close="handleInviteCancel"
        @confirm="handleInviteOk"
      ></uni-popup-dialog>
    </uni-popup>
    <qui-toast ref="toast"></qui-toast>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';
import loginModule from '@/mixin/loginModule';

export default {
  components: { uniPopupDialog },
  mixins: [forums, loginModule],
  data() {
    return {
      code: '', // 邀请码
      inviteData: {}, // 邀请的相关信息
      codeTips: '',
    };
  },
  onLoad(params) {
    this.code = params.code;
    this.getInviteInfo(params.code);
  },
  // 唤起小程序原声分享
  onShareAppMessage(res) {
    // 来自页面内分享按钮
    if (res.from === 'button') {
      return {
        title: this.forums.set_site.site_name,
      };
    }
    return {
      title: this.forums.set_site.site_name,
    };
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.forums.set_site.site_name,
      query: '',
    };
  },
  methods: {
    check() {
      // 管理员邀请码32位，区分普通邀请和管理员邀请
      if (this.code && this.code.length !== 32) {
        if (!this.inviteData.id) {
          this.codeTips = this.i18n.t('site.codenotfound');
          this.$refs.popCode.open();
        } else {
          this.submit();
        }
        return;
      }
      // 处理邀请码状态 status 0 失效  1 未使用  2 已使用 3 已过期
      const statusVal =
        this.inviteData.status || this.inviteData.status === 0 ? this.inviteData.status : 'error';
      switch (statusVal) {
        case 0: {
          this.codeTips = this.i18n.t('site.codeinvalid');
          this.$refs.popCode.open();
          break;
        }
        case 1: {
          this.submit();
          break;
        }
        case 2: {
          this.codeTips = this.i18n.t('site.codeused');
          this.$refs.popCode.open();
          break;
        }
        case 3: {
          this.codeTips = this.i18n.t('site.codeexpired');
          this.$refs.popCode.open();
          break;
        }
        case 'error': {
          this.codeTips = this.i18n.t('site.codenotfound');
          this.$refs.popCode.open();
          break;
        }
        default:
          return '';
      }
    },
    getInviteInfo(code) {
      status
        .run(() => this.$store.dispatch('jv/get', `invite/${code}`))
        .then(res => {
          this.inviteData = res;
        });
    },
    handleInviteCancel() {
      this.$refs.popCode.close();
    },
    handleInviteOk() {
      this.$refs.popCode.close();
      this.submit();
    },
    // 调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
    submit() {
      // 未登陆的情况
      if (!this.$store.getters['session/get']('isLogin')) {
        uni.setStorage({
          key: 'page',
          data: '/pages/home/index',
        });
        // #ifdef MP-WEIXIN
        this.$store.dispatch('session/setInviteCode', this.code);
        this.mpLoginMode();
        // #endif
        uni.setStorageSync('inviteCode', this.code);
        // #ifdef H5
        this.h5LoginMode();
        // #endif
      } else {
        // 已经登陆的情况
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: '/pages/home/index',
        });
        // #endif
        // #ifdef H5
        if (this.forums.set_reg.register_type === 2 && this.isWeixin === true) {
          // 无感模式
          uni.navigateTo({
            url: '/pages/home/index',
          });
        } else {
          this.$refs.toast.show({ message: this.i18n.t('site.codeforbid') });
        }
        // #endif
      }
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.site /deep/ {
  padding-bottom: 130rpx;
  .header {
    height: auto;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    .circleDet {
      padding: 60rpx 30rpx;
      opacity: 1;
    }
    .circleDet-txt {
      color: --color(--qui-FC-34);
      opacity: 0.49;
    }
    .logo {
      height: 75rpx;
      padding-top: 71rpx;
    }
    .circleDet-num,
    .circleDet-share {
      color: --color(--qui-FC-333);
    }
  }
  .themeCount .themeItem__footer {
    display: none;
  }
  .themeCount .addAsk {
    top: 0;
  }
  .themeCount .themeItem {
    padding-left: 0;
    margin: 0;
    border-top: none;
  }
  .site-theme__last {
    .themeItem {
      border-bottom: none;
    }
  }
}
.site /deep/ .site-submit .qui-button--button {
  position: absolute;
  top: 20rpx;
  right: 24rpx;
}
.site-invite {
  padding: 30rpx 60rpx;
  text-align: center;
  &__detail__bold {
    margin: 0 5rpx;
    font-weight: bold;
  }
  &__detail {
    font-size: $fg-f4;
  }
}
.site-submit {
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 130rpx;
  padding: 20rpx 24rpx;
  background: --color(--qui-BG-2);
  box-shadow: 0rpx -3rpx 6rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  &__price {
    margin-top: 10rpx;
    font-size: $fg-f5;
    color: --color(--qui-FC-AAA);
    text-decoration: line-through;
  }
  &__expire {
    font-size: $fg-f2;
    color: --color(--qui-FC-333);
  }
}
</style>
