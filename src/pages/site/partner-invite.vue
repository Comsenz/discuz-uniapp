<template>
  <qui-page :data-qui-theme="theme" class="site">
    <qui-header
      head-img="/static/logo.png"
      :theme="theme"
      :theme-num="forums.other.count_users"
      :post="post"
      :post-num="forums.other.count_threads"
      :share="share"
      :iconcolor="currentTheme == 'dark' ? '#fff' : '#333'"
      @click="open"
    ></qui-header>
    <uni-popup ref="popupHead" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareHead(index)">
                <qui-icon class="content-image" :name="item.icon" size="46" color="#777"></qui-icon>
              </view>
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <view class="site-item">
      <qui-cell-item
        class="cell-item--auto cell-item--left"
        :title="i18n.t('site.circleintroduction')"
        :addon="forums.set_site.site_introduction"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.creationtime')"
        :addon="forums.set_site.site_install"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.circlemode')"
        :addon="
          forums.set_site.site_mode == 'pay'
            ? i18n.t('site.paymentmode') +
              '，¥' +
              forums.set_site.site_price +
              '，' +
              i18n.t('site.validfromaccession') +
              forums.set_site.site_expire +
              i18n.t('site.day')
            : i18n.t('site.publicmode')
        "
      ></qui-cell-item>
      <qui-cell-item :title="i18n.t('site.circlemaster')" slot-right>
        <view class="site-item__owner">
          <image
            class="site-item__owner-avatar"
            :src="forums.set_site.site_author.avatarUrl || '/static/noavatar.gif'"
            alt="avatarUrl"
            @tap="toProfile(item.id)"
            mode="aspectFill"
          ></image>
          <text class="site-item__owner-name">{{ forums.set_site.site_author.username }}</text>
        </view>
      </qui-cell-item>
      <qui-cell-item :title="i18n.t('home.theme')" slot-right class="cell-item--auto">
        <view>
          <view v-for="(item, index) in forums.users" :key="index" class="site-item__person">
            <image
              class="site-item__person-avatar"
              :src="item.avatarUrl || '/static/noavatar.gif'"
              alt="avatarUrl"
              @tap="toProfile(item.id)"
              mode="aspectFill"
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
        <text class="site-invite__detail__bold">{{ inviteData.user.username }}</text>
        <text>{{ i18n.t('site.inviteyouas') }}</text>
        <text class="site-invite__detail__bold">{{ inviteData.group.name }}</text>
        <text>{{ i18n.t('site.join') }}</text>
        <text class="site-invite__detail__bold">DISCUZQ</text>
        <text>{{ i18n.t('site.site') }}</text>
      </view>
      <view class="site-invite__button">
        <qui-button type="primary" size="large" @click="submit">
          {{ i18n.t('site.accepttheinvitationandbecome') }} {{ inviteData.group.name }}
        </qui-button>
      </view>
    </view>
    <uni-popup ref="auth" type="bottom">
      <qui-auth @login="login" @close="close"></qui-auth>
    </uni-popup>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
      theme: this.i18n.t('home.theme'),
      post: this.i18n.t('home.homecontent'),
      share: this.i18n.t('home.share'),
      bottomData: [
        {
          text: this.i18n.t('home.generatePoster'),
          icon: 'icon-poster',
          name: 'wx',
        },
        {
          text: this.i18n.t('home.wxShare'),
          icon: 'icon-wx-friends',
          name: 'wx',
        },
      ],
      code: '', // 邀请码
      currentTheme: uni.getStorageSync('theme'),
      permission: [],
      inviteData: {}, // 邀请的相关信息
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
  methods: {
    // 首页头部分享按钮弹窗
    open() {
      if (this.forums.set_site.site_mode === 'pay') {
        this.bottomData = [
          {
            text: this.i18n.t('home.generatePoster'),
            icon: 'icon-poster',
            name: 'wx',
          },
        ];
      }
      this.$refs.popupHead.open();
    },
    // 点击头像到个人主页
    toProfile(userId) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${userId}`,
      });
    },
    // 头部分享海报
    shareHead(index) {
      if (index === 0) {
        this.$store.dispatch('session/setAuth', this.$refs.auth);
        if (!this.$store.getters['session/get']('isLogin')) {
          this.$refs.auth.open();
          return;
        }
        uni.navigateTo({
          url: '/pages/share/site',
        });
      }
    },
    // 调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
    // 取消按钮
    cancel() {
      this.$refs.popupHead.close();
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
.site {
  /deep/ .header {
    height: auto;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .header /deep/ .circleDet {
    padding: 60rpx 40rpx 50rpx;
    color: --color(--qui-FC-777);
    opacity: 1;
  }
  .header .logo {
    width: 295rpx;
    height: 56rpx;
    padding-top: 71rpx;
  }
  /deep/ .cell-item__body__content-title {
    width: 112rpx;
    margin-right: 40rpx;
    color: --color(--qui-FC-777);
  }
}
.header .circleDet .circleDet-num,
.header .circleDet .circleDet-share {
  color: --color(--qui-FC-333);
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
.cell-item--auto .cell-item__body {
  height: auto;
  padding: 35rpx 0;
  align-items: flex-start;
}
.site-invite__detail__bold {
  margin: 0 5rpx;
  font-weight: bold;
}
.site-invite__detail {
  margin-top: 50rpx;
  margin-bottom: 30rpx;
}
.site-invite {
  padding-bottom: 20rpx;
  text-align: center;
}
.site-item__person-avatar,
.site-item__owner-avatar {
  width: 60rpx;
  height: 60rpx;
  margin-left: 8rpx;
  border-radius: 50%;
}
.site-item__person-avatar {
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
