<template>
  <qui-page :data-qui-theme="theme" class="site" :header="false">
    <qui-header
      :head-img="
        forums.set_site && forums.set_site.site_logo
          ? forums.set_site.site_logo
          : '/static/logo.png'
      "
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
    <view class="site-info">
      <view class="site-info__title">{{ i18n.t('site.circleintroduction') }}</view>
      <view class="site-info__introduction">
        {{ forums.set_site && forums.set_site.site_introduction }}
      </view>
      <view class="site-info__owner">
        <qui-avatar
          class="site-info__owner-avatar"
          :user="{
            username: forums.set_site && forums.set_site.site_author.username,
            avatarUrl: forums.set_site && forums.set_site.site_author.avatar,
          }"
          size="60"
        />
        <view class="site-info__owner-detail">
          <view>
            {{
              `${i18n.t('site.circlemaster')} : ${forums.set_site &&
                forums.set_site.site_author.username}`
            }}
          </view>
          <view class="site-info__owner-detail-days">
            {{ i18n.t('site.createdDays', { num: 812 }) }}
          </view>
        </view>
      </view>
      <view class="site-info__person">
        <view v-for="(item, index) in forums.users" :key="index" class="site-info__person__content">
          <qui-avatar :user="item" size="60" />
        </view>
      </view>
    </view>
    <view class="site-theme">
      <view class="site-theme__title">{{ i18n.t('site.partialcontentpreview') }}</view>
      <qui-thread-item
        v-for="(item, index) in data"
        :key="index"
        :currentindex="index"
        :thread="item"
        :can-click="false"
      ></qui-thread-item>
    </view>
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
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
import appCommonH from '@/utils/commonHelper';
import loginAuth from '@/mixin/loginAuth-h5';
// #endif
// import { getCurUrl } from '@/utils/getCurUrl';

export default {
  components: { uniPopupDialog },
  mixins: [
    forums,
    // #ifdef  H5
    wxshare,
    loginAuth,
    appCommonH,
    // #endif
  ],
  data() {
    return {
      code: '', // 邀请码
      shareBtn: 'icon-share1',
      shareShow: false, // h5内分享提示信息
      isWeixin: '', // 是否是微信浏览器内
      inviteData: {}, // 邀请的相关信息
      codeTips: '',
      data: [],
      pageSize: 10,
      pageNum: 1, // 当前页数
    };
  },
  onLoad(params) {
    this.code = params.code;
    this.getInviteInfo(params.code);
    // #ifdef  H5
    this.isWeixin = appCommonH.isWeixin().isWeixin;
    // #endif
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    // #endif
    this.getThemeList();
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
    // 首页头部分享按钮弹窗
    open() {
      // #ifdef MP-WEIXIN
      this.$refs.popupHead.open();
      // #endif
      // #ifdef H5
      if (this.isWeixin === true) {
        this.shareShow = true;
      } else {
        this.h5Share({
          title: this.forums.set_site.site_name,
          url: `pages/site/partner-invite?code=${this.code}`,
        });
      }
      // #endif
    },
    closeShare() {
      this.shareShow = false;
    },
    // 取消按钮
    cancel() {
      this.$refs.popupHead.close();
    },
    // 调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
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
    submit() {
      // 未登陆的情况
      if (!this.$store.getters['session/get']('isLogin')) {
        uni.setStorage({
          key: 'page',
          data: '/pages/home/index',
        });
        // #ifdef MP-WEIXIN
        this.$store.dispatch('session/setInviteCode', this.code);
        this.$store.getters['session/get']('auth').open();
        // #endif
        uni.setStorage({
          key: 'inviteCode',
          data: this.code,
        });
        // #ifdef H5
        this.handleLogin();
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
    // 获取主题列表
    getThemeList() {
      this.loadingType = 'loading';
      const params = {
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
        'filter[isDeleted]': 'no',
        'filter[isApproved]': 1,
        'filter[isSite]': 'yes',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
      };
      this.$store.dispatch('jv/get', ['threads', { params }]).then(res => {
        if (res._jv) {
          delete res._jv;
        }
        this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        this.data = [...this.data, ...res];
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
    .circleDet {
      padding: 60rpx 30rpx;
      opacity: 1;
    }
    .circleDet-txt {
      color: --color(--qui-FC-333);
      opacity: 1;
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
  .themeCount .themeItem {
    padding-left: 0;
    margin: 0;
    border-top: none;
  }
  .qui-button--button {
    position: absolute;
    top: 20rpx;
    right: 24rpx;
  }
}
.site-info {
  padding: 50rpx 30rpx 80rpx;
  font-size: $fg-f3;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  &__title {
    font-weight: bold;
    color: --color(--qui-FC-333);
  }
  &__introduction {
    margin-top: 20rpx;
    margin-bottom: 40rpx;
    color: --color(--qui-FC-777);
  }
  &__owner-detail-days {
    font-size: $fg-f2;
    color: --color(--qui-FC-777);
  }
  &__owner {
    margin-bottom: 50rpx;
  }
  &__person__content {
    display: inline-block;
    margin-right: 8rpx;
    vertical-align: top;
  }
}
/deep/ .site-info__owner-avatar,
.site-info__owner-detail {
  display: inline-block;
  margin-right: 20rpx;
  vertical-align: middle;
}
.site-invite {
  text-align: center;
  &__detail__bold {
    margin: 0 5rpx;
    font-weight: bold;
  }
  &__detail {
    padding: 30rpx 60rpx;
    font-size: $fg-f4;
  }
}
.site-theme {
  padding-left: 30rpx;
  margin-top: 20rpx;
  background: --color(--qui-BG-2);
  border-top: 2rpx solid --color(--qui-BOR-ED);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  &__title {
    margin-top: 50rpx;
    margin-bottom: 10rpx;
    font-weight: bold;
    color: --color(--qui-FC-333);
  }
}
.site-submit {
  position: relative;
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
