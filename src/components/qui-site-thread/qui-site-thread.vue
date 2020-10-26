<template>
  <view class="site-wrap">
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
      @logoClick="logoClick"
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
            username:
              forums.set_site && forums.set_site.site_author
                ? forums.set_site.site_author.username
                : '',
            avatarUrl:
              forums.set_site && forums.set_site.site_author
                ? forums.set_site.site_author.avatar
                : '',
          }"
          size="60"
        />
        <view class="site-info__owner-detail">
          <view>
            {{
              `${i18n.t('site.circlemaster')} : ${
                forums.set_site && forums.set_site.site_author
                  ? forums.set_site.site_author.username
                  : ''
              }`
            }}
          </view>
          <view class="site-info__owner-detail-days">
            {{
              i18n.t('site.createdDays', {
                num: setDays(forums.set_site && forums.set_site.site_install),
              })
            }}
          </view>
        </view>
      </view>
      <view class="site-info__person">
        <view v-for="(item, index) in forums.users" :key="index" class="site-info__person__content">
          <qui-avatar :user="item" size="60" />
        </view>
      </view>
    </view>
    <view class="site-theme" v-if="data.length > 0">
      <view class="site-theme__title">{{ i18n.t('site.partialcontentpreview') }}</view>
      <view
        v-for="(item, index) in data"
        :key="index"
        :class="data.length - 1 == index ? 'site-theme__last' : 'site-theme__wrap'"
      >
        <qui-thread-item
          :key="index"
          :currentindex="index"
          :thread="item"
          :can-click="false"
        ></qui-thread-item>
        <view class="site-theme__mask" @tap="openTips"></view>
      </view>
    </view>
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>

<script>
import forums from '@/mixin/forums';
import { mapState, mapMutations } from 'vuex';
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  mixins: [
    forums,
    // #ifdef  H5
    wxshare,
    appCommonH,
    // #endif
  ],
  props: {
    shareUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      shareBtn: 'icon-share1',
      shareShow: false, // h5内分享提示信息
      isWeixin: '', // 是否是微信浏览器内
      data: [],
      pageSize: 10,
      pageNum: 1, // 当前页数
    };
  },
  computed: {
    ...mapState({
      footerIndex: state => state.footerTab.footerIndex,
    }),
  },
  watch: {
    // 监听得到的数据
    shareUrl: {
      handler(newVal) {
        this.shareUrl = newVal;
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
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
  methods: {
    ...mapMutations({
      setFooterIndex: 'footerTab/SET_FOOTERINDEX',
    }),
    logoClick() {
      const url = this.shareUrl;
      if (url.indexOf('partner-invite') !== -1) {
        this.setFooterIndex(parseInt(0, 10));
        uni.redirectTo({
          url: `/pages/home/index`,
        });
      }
    },
    openTips() {
      this.$refs.toast.show({ message: this.i18n.t('site.jointosee') });
    },
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
          url: this.shareUrl,
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
    // 获取主题列表
    getThemeList() {
      this.loadingType = 'loading';
      const params = {
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'firstPost.postGoods',
          'category',
          'threadVideo',
          'threadAudio',
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
    setDays(time) {
      if (!time) {
        return;
      }
      const oldTimeFormat = new Date(time.replace(/-/g, '/'));
      const nowDate = new Date();
      const times = nowDate.getTime() - oldTimeFormat.getTime();
      const days = parseInt(times / (60 * 60 * 24 * 1000), 10);
      return days;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.site-info {
  padding: 50rpx 30rpx 80rpx;
  font-size: $fg-f3;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  &__title {
    font-size: $fg-f4;
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
.site-theme {
  padding-left: 30rpx;
  margin-top: 20rpx;
  background: --color(--qui-BG-2);
  border-top: 2rpx solid --color(--qui-BOR-ED);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  &__title {
    margin-top: 50rpx;
    margin-bottom: 10rpx;
    font-size: $fg-f4;
    font-weight: bold;
    color: --color(--qui-FC-333);
  }
  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 90;
    width: 100%;
    height: 100%;
  }
  &__wrap,
  &__last {
    position: relative;
  }
}
</style>
