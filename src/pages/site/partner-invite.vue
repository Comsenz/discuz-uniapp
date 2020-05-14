<template>
  <qui-page class="site">
    <qui-header
      :head-img="forums.set_site.site_logo"
      :theme="theme"
      :theme-num="forums.other.count_users"
      :post="post"
      :post-num="forums.other.count_threads"
      :share="share"
      :share-btn="shareBtn"
      :color="color"
      @click="open"
    ></qui-header>
    <uni-popup ref="popupContent" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareContent()">
                <qui-icon class="content-image" :name="item.icon" size="36" color="#777"></qui-icon>
              </view>
              <!-- <image :src="item.icon" class="content-image" mode="widthFix" /> -->
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
        title="站点介绍"
        :addon="forums.set_site.site_introduction"
      ></qui-cell-item>
      <qui-cell-item title="创建时间" :addon="forums.set_site.site_install"></qui-cell-item>
      <qui-cell-item
        title="站点模式"
        :addon="
          forums.set_site.site_mode == 'pay'
            ? '付费模式，¥' +
              forums.set_site.site_price +
              '，有效期自加入起' +
              forums.set_site.site_expire +
              '天'
            : '公开模式'
        "
      ></qui-cell-item>
      <qui-cell-item title="圈主" slot-right>
        <view class="site-item__owner">
          <image
            class="site-item__owner-avatar"
            :src="
              forums.set_site.site_author.avatarUrl ||
                'https://discuz.chat/static/images/noavatar.gif'
            "
            alt="avatarUrl"
            @tap="toProfile(item.id)"
          ></image>
          <text class="site-item__owner-name">{{ forums.set_site.site_author.username }}</text>
        </view>
      </qui-cell-item>
      <qui-cell-item title="成员" slot-right class="cell-item--auto">
        <view>
          <view v-for="(item, index) in forums.users" :key="index" class="site-item__person">
            <image
              class="site-item__person-avatar"
              :src="item.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'"
              alt="avatarUrl"
              @tap="toProfile(item.id)"
            ></image>
          </view>
        </view>
      </qui-cell-item>
      <qui-cell-item
        title="我的权限"
        slot-right
        :border="false"
        class="cell-item--auto cell-item--left "
      >
        <view
          v-for="(item, index) in inviteData.group.permission"
          :key="index"
          class="site-item__permission"
        >
          <text>{{ permissionlist[item.permission] }}</text>
        </view>
      </qui-cell-item>
    </view>
    <view class="site-invite">
      <view class="site-invite__detail">
        <text class="site-invite__detail__bold">{{ inviteData.user.username }}</text>
        <text>邀请您，作为</text>
        <text class="site-invite__detail__bold">{{ inviteData.group.name }}</text>
        <text>加入</text>
        <text class="site-invite__detail__bold">DISCUZQ</text>
        <text>站点</text>
      </view>
      <view class="site-invite__button">
        <qui-button type="primary" size="large" @click="submit">
          接受邀请，成为{{ inviteData.group.name }}
        </qui-button>
      </view>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  components: {
    //
  },
  data: () => {
    return {
      theme: '成员',
      post: '内容',
      share: '分享',
      shareBtn: 'icon-share1',
      code: '', // 邀请码
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
      inviteData: {}, // 邀请的相关信息
    };
  },
  computed: {
    forums() {
      return this.$store.getters['jv/get']('forums/1');
    },
    permissionlist() {
      return this.i18n.t('permission');
    },
  },
  onLoad(params) {
    this.code = params.code;
    this.getInviteInfo(params.code);
    this.getInfo();
  },
  methods: {
    // 首页头部分享按钮弹窗
    open() {
      this.$refs.popup.open();
    },
    // 取消按钮
    cancel() {
      this.$refs.popup.close();
    },
    // 首页底部发帖点击事件跳转
    handleClick() {
      uni.navigateTo({
        url: '/pages/topic/post',
      });
    },
    // 用户未登陆自动登陆跳转首页，登陆过的直接跳转首页
    submit() {
      const isLogin = !!uni.getStorageSync('access_token');
      if (!isLogin) {
        this.$store.dispatch('session/login', { code: this.code }).then(data => {
          console.log(data);
          uni.navigateTo({
            url: '/pages/home/index',
          });
        });
      } else {
        uni.navigateTo({
          url: '/pages/home/index',
        });
      }
    },
    getInviteInfo(code) {
      status
        .run(() => this.$store.dispatch('jv/get', `invite/${code}`))
        .then(res => {
          this.inviteData = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 邀请链接一些信息请求，有未登陆的情况
    getInfo() {
      this.$store.dispatch('jv/get', ['forum', { params: { include: 'users' } }]);
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
page {
  background-color: #f9fafc;
}
.site {
  /deep/ .header {
    height: auto;
    margin-bottom: 30rpx;
    background: #fff;
    border-bottom: 2rpx solid #ededed;
  }
  .header /deep/ .circleDet {
    color: #777;
  }
  .header .logo {
    padding-top: 99rpx;
  }
}
.header .circleDet .circleDet-num,
.header .circleDet .circleDet-share {
  color: #333;
}
// 分享弹框的样式
.popup-share {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  background: --color(--qui-BG-2);
}
.popup-share-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 250rpx;
  padding-top: 40rpx;
  padding-right: 97rpx;
  padding-left: 98rpx;
  background: --color(--qui-BG-BTN-GRAY-1);
  // padding: 15px;
}
.popup-share-box {
  width: 120rpx;
  height: 120rpx;
  line-height: 120rpx;
  background: --color(--qui-BG-2);
  border-radius: 10px;
}
.popup-share-content-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  width: 120rpx;
  height: 164rpx;
  // background: --color(--qui-BG-2);
}
.popup-share-content-image {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  // align-items: center;
  width: 120rpx;
  height: 120rpx;
  overflow: hidden;
  border-radius: 10rpx;
}
.content-image {
  width: 60rpx;
  height: 60rpx;
  margin: 35rpx;
  line-height: 60rpx;
}
.popup-share-content-text {
  padding-top: 5px;
  font-size: $fg-f26;
  color: #333;
}
.popup-share-btn {
  height: 100rpx;
  font-size: $fg-f28;
  line-height: 90rpx;
  color: #666;
  text-align: center;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}
.popup-share-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-FC-DDD);
}
//下面部分样式
.site-item {
  padding-left: 40rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;
}
.site .cell-item {
  padding-right: 40rpx;
}
.cell-item--auto .cell-item__body {
  height: auto;
  padding: 35rpx 0;
  align-items: flex-start;
}
.cell-item__body__content-title {
  width: 112rpx;
  margin-right: 40rpx;
  color: #777;
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
  font-size: 26rpx;
  line-height: 60rpx;
  border: 2rpx solid #ededed;
  border-radius: 10rpx;
}
.cell-item--left .cell-item__body__right {
  text-align: left;
}
</style>
