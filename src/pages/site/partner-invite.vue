<template>
  <qui-page :data-qui-theme="theme" class="site">
    <qui-header
      head-img="/static/logo.png"
      :theme="i18n.t('home.theme')"
      :theme-num="forums.other && forums.other.count_users"
      :post-num="forums.other && forums.other.count_threads"
      :share-btn="shareBtn"
      :share-show="shareShow"
      :iconcolor="theme === $u.light() ? '#333' : '#fff'"
      @click="open"
      @closeShare="closeShare"
    ></qui-header>
    <uni-popup ref="popupHead" type="bottom">
      <qui-share @close="cancel"></qui-share>
    </uni-popup>
    <view class="site-item">
      <qui-cell-item
        class="cell-item--auto cell-item--left"
        :title="i18n.t('site.circleintroduction')"
        :addon="forums.set_site && forums.set_site.site_introduction"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.creationtime')"
        :addon="forums.set_site && forums.set_site.site_install"
      ></qui-cell-item>
      <qui-cell-item :title="i18n.t('site.circlemode')" :addon="handleMode()"></qui-cell-item>
      <qui-cell-item :title="i18n.t('site.circlemaster')" slot-right>
        <view class="site-item__owner">
          <image
            class="site-item__owner-avatar"
            :src="(forums.set_site && forums.set_site.site_author.avatar) || '/static/noavatar.gif'"
            @tap="toProfile(forums.set_site && forums.set_site.site_author.id)"
            lazy-load
          ></image>
          <text class="site-item__owner-name">
            {{ forums.set_site && forums.set_site.site_author.username }}
          </text>
        </view>
      </qui-cell-item>
      <qui-cell-item :title="i18n.t('home.theme')" slot-right>
        <view class="site-item__person">
          <view
            v-for="(item, index) in forums.users"
            :key="index"
            class="site-item__person__content"
          >
            <image
              class="site-item__person__content-avatar"
              :src="item.avatarUrl || '/static/noavatar.gif'"
              lazy-load
              @tap="toProfile(item.id)"
            ></image>
          </view>
        </view>
      </qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.myauthority')"
        slot-right
        :border="false"
        class="cell-item--auto cell-item--left "
      >
        <view v-for="(item, index) in permission" :key="index" class="site-item__permission">
          <text>{{ i18n.t(`permission.${item.permission}`) }}</text>
        </view>
      </qui-cell-item>
    </view>
    <view class="site-invite">
      <view class="site-invite__detail">
        <text class="site-invite__detail__bold">
          {{ inviteData.user && inviteData.user.username }}
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
      <view class="site-invite__button">
        <qui-button type="primary" size="large" @click="submit">
          {{ i18n.t('site.accepttheinvitationandbecome') }}
          {{ inviteData.group && inviteData.group.name }}
        </qui-button>
      </view>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
      code: '', // 邀请码
      permission: [],
      shareBtn: 'icon-share1',
      shareShow: false, // h5内分享提示信息
      inviteData: {}, // 邀请的相关信息
    };
  },
  onLoad(params) {
    this.code = params.code;
    this.getInviteInfo(params.code);
  },
  onReady() {
    // 处理站点模式
    this.handleMode();
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
  methods: {
    // 首页头部分享按钮弹窗
    open() {
      // #ifdef MP-WEIXIN
      this.$refs.popupHead.open();
      // #endif
      // #ifdef H5
      this.shareShow = true;
      // #endif
    },
    closeShare() {
      this.shareShow = false;
    },
    // 取消按钮
    cancel() {
      this.$refs.popupHead.close();
    },
    handleMode() {
      if (!this.forums.set_site) {
        return;
      }
      if (this.forums.set_site.site_mode === 'pay') {
        const siteMode = `${this.i18n.t('site.paymentmode')}，¥${
          this.forums.set_site.site_price
        }，`;
        const siteExpire = this.forums.set_site.site_expire
          ? this.i18n.t('site.periodvalidity') +
            this.forums.set_site.site_expire +
            this.i18n.t('site.day')
          : this.i18n.t('site.permanent');
        return siteMode + siteExpire;
      }
      const siteMode = this.i18n.t('site.publicmode');
      return siteMode;
    },
    // 点击头像到个人主页
    toProfile(userId) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${userId}`,
      });
    },
    // 调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
    submit() {
      uni.navigateTo({
        url: '/pages/home/index',
      });
    },
    getInviteInfo(code) {
      status
        .run(() => this.$store.dispatch('jv/get', `invite/${code}`))
        .then(res => {
          this.inviteData = res;
          this.permission = res.group.permission;
        });
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.site /deep/ {
  .header {
    height: auto;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .header .circleDet {
    padding: 60rpx 40rpx 50rpx;
    opacity: 1;
  }
  .header .circleDet-txt {
    color: --color(--qui-FC-333);
    opacity: 1;
  }
  .header .logo {
    height: 75rpx;
    padding-top: 71rpx;
  }
  .cell-item__body__content-title {
    width: 112rpx;
    margin-right: 40rpx;
    color: --color(--qui-FC-777);
  }
  .header .circleDet-num,
  .header .circleDet-share {
    color: --color(--qui-FC-333);
  }
  .site-invite {
    padding-bottom: 20rpx;
    text-align: center;
  }
  .cell-item--auto .cell-item__body {
    height: auto;
    padding: 35rpx 0;
    align-items: flex-start;
  }
}
//下面部分样式
.site-item {
  padding-left: 40rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.site .cell-item {
  padding-right: 40rpx;
}
.site-invite__detail__bold {
  margin: 0 5rpx;
  font-weight: bold;
}
.site-invite__detail {
  width: 85%;
  padding: 0 20rpx;
  margin: 50rpx auto 30rpx;
  font-size: 28rpx;
}
.site-item__person__content-avatar,
.site-item__owner-avatar {
  width: 60rpx;
  height: 60rpx;
  margin-left: 8rpx;
  border-radius: 50%;
  will-change: transform;
}
.site-item__person__content-avatar {
  margin-left: 8rpx;
}
.site-item__owner {
  display: flex;
  align-items: center;
}
.site-item__owner-avatar {
  margin-right: 20rpx;
}
.site-item__person {
  height: 60rpx;
  overflow: hidden;
  font-size: 0;
}
.site-item__person__content {
  display: inline-block;
}
.site-item__permission {
  display: inline-block;
  height: 60rpx;
  padding: 0 28rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  font-size: $fg-f26;
  line-height: 60rpx;
  border: 2rpx solid --color(--qui-BOR-ED);
  border-radius: 7rpx;
}
.cell-item--left .cell-item__body__right {
  text-align: left;
}
</style>
