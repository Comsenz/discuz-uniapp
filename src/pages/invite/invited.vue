<template>
  <qui-page :data-qui-theme="theme" class="search">
    <view class="search-box">
      <view class="search-box__content">
        <view class="icon-content-search">
          <qui-icon name="icon-search" size="30" color="#bbb"></qui-icon>
        </view>
        <input
          type="text"
          class="search-box__content-input"
          placeholder-class="input-placeholder"
          :placeholder="i18n.t('search.userssearch')"
          @input="searchInput"
          :value="searchValue"
        />
        <view @tap="clearSearch" v-if="searchValue" class="search-box__content-delete">
          <qui-icon name="icon-close1" size="32" color="#ccc"></qui-icon>
        </view>
      </view>
      <view class="search-box__cancel" v-if="searchValue" @tap="clearSearch">
        <text>{{ i18n.t('search.cancel') }}</text>
      </view>
    </view>
    <view class="search-total">
      {{ i18n.t('profile.total') }}
      <text class="search-total__detail">{{ totalNum }}</text>
      {{ i18n.t('topic.persenUnit') }}
    </view>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y search-item"
    >
      <view
        class="search-item__users"
        v-for="(item, index) in data"
        :key="index"
        @tap="toProfile(item.user)"
      >
        <qui-avatar
          class="search-item__users__avatar"
          :user="item.user"
          size="70"
          :is-real="item.isReal"
        />
        <qui-cell-item
          :title="item.user.username"
          arrow
          :brief="timeHandle(item.created_at)"
        ></qui-cell-item>
      </view>
      <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
    </scroll-view>
    <view class="invite-button" @tap="share">
      <button class="btn" open-type="share">
        {{ i18n.t('profile.inviteFriends') }}
      </button>
    </view>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';
import { time2MinuteOrHour } from '@/utils/time';
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  mixins: [
    forums,
    // #ifdef H5
    wxshare,
    appCommonH,
    // #endif
  ],
  data() {
    return {
      searchValue: '',
      loadingType: '',
      data: [],
      code: '',
      totalNum: 0,
      pageSize: 20,
      pageNum: 1, // 当前页数
    };
  },
  onLoad() {
    this.getUserList();
    this.getInviteCode();
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    // #endif
  },
  // 唤起小程序原生分享
  onShareAppMessage(res) {
    // 来自页面内分享按钮
    if (res.from === 'button') {
      return {
        title: this.forums.set_site.site_name,
        path: `/pages/site/partner-invite?code=${this.code}`,
      };
    }
    return {
      title: this.forums.set_site.site_name,
      path: `/pages/site/partner-invite?code=${this.code}`,
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
    share() {
      // #ifdef H5
      this.h5Share({
        title: this.forums.set_site.site_name,
        url: `pages/site/partner-invite?code=${this.code}`,
      });
      // #endif
    },
    // 处理时间
    timeHandle(time) {
      return time2MinuteOrHour(time);
    },
    searchInput(e) {
      this.searchValue = e.target.value;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.data = [];
        this.pageNum = 1;
        this.getUserList(e.target.value);
      }, 250);
    },
    getUserList(key, type) {
      this.loadingType = 'loading';
      const params = {
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        sort: '-created_at',
      };
      if (this.searchValue) {
        params['filter[username]'] = `*${this.searchValue}*`;
      }
      this.$store.dispatch('jv/get', ['invite/users', { params }]).then(res => {
        if (res._jv) {
          this.totalNum = res._jv.json.meta.total;
          delete res._jv;
        }
        this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        if (type && type === 'clear') {
          this.data = res;
        } else {
          this.data = [...this.data, ...res];
        }
      });
    },
    clearSearch() {
      this.searchValue = '';
      this.pageNum = 1;
      this.getUserList('', 'clear');
    },
    // 点击到用户明细
    toProfile(user) {
      uni.navigateTo({
        url: `/pages/invite/user?id=${user.id}&name=${user.username}`,
      });
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getUserList(this.searchValue);
    },
    // 邀请朋友
    getInviteCode() {
      this.$store.dispatch('jv/get', 'userInviteCode').then(res => {
        this.code = res._jv.code;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
/* #ifdef H5 */
$height: calc(100vh - 500rpx);
/* #endif */

/* #ifdef MP-WEIXIN */
$height: calc(100vh - 410rpx);
/* #endif */

.search /deep/ {
  /* #ifdef H5 */
  height: 100vh;
  min-height: auto;
  overflow: hidden;
  /* #endif */
  .search-item {
    background-color: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .search-box {
    background: --color(--qui-BG-2);
  }
}
.search-total {
  padding: 10rpx 40rpx 24rpx;
  margin-bottom: 30rpx;
  font-size: $fg-f2;
  background-color: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.search-total__detail {
  margin: 0 5rpx;
  font-weight: bold;
}

.invite-button {
  position: fixed;
  right: 0;
  bottom: 40rpx;
  left: 0;
  width: 670rpx;
  height: 90rpx;
  margin: auto;

  .btn {
    font-size: $fg-f4;
    line-height: 90rpx;
    color: --color(--qui-FC-333);
    background: --color(--qui-BG-2);
  }
}

// 用户
/deep/ .cell-item__body__right {
  padding-right: 40rpx;
  font-size: $fg-f4;
  color: --color(--qui-FC-AAA);
}
.search-item__users__avatar {
  position: absolute;
  top: 16rpx;
  left: 40rpx;
}
.search-item__users {
  position: relative;
  padding-left: 130rpx;
}
.scroll-y {
  max-height: $height;
  padding-top: 20rpx;
}
</style>
