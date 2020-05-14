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
        class="cell-item--left cell-item--auto"
        title="站点介绍"
        :addon="forums.set_site.site_introduction"
      ></qui-cell-item>
      <qui-cell-item title="创建时间" :addon="forums.set_site.site_install"></qui-cell-item>
      <qui-cell-item
        title="付费金额"
        :addon="'¥' + (forums.set_site.site_price || 0)"
        class="site-item__pay"
      ></qui-cell-item>
      <qui-cell-item title="有效期" :addon="forums.set_site.site_expire + '天'"></qui-cell-item>
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
      <qui-cell-item title="成员" slot-right :border="false" class="cell-item--auto">
        <view v-for="(item, index) in forums.users" :key="index" class="site-item__person">
          <image
            class="site-item__person-avatar"
            :src="item.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif'"
            alt="avatarUrl"
            @tap="toProfile(item.id)"
          ></image>
        </view>
      </qui-cell-item>
    </view>
    <view class="site-invite">
      <view class="site-invite__detail">
        <text>只需最后一步，立即加入</text>
        <text class="site-invite__detail__bold">DISCUZQ</text>
        <text>站点</text>
      </view>
      <view class="site-invite__button">
        <qui-button type="primary" size="large" @click="submit">
          立即付费，¥{{ forums.set_site.site_price || 0 }}/有效期
          {{ forums.set_site.site_expire }} 天
        </qui-button>
      </view>
    </view>
  </qui-page>
</template>

<script>
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
    };
  },
  computed: {
    forums() {
      return this.$store.getters['jv/get']('forums/1');
    },
  },
  onLoad() {
    //
  },
  methods: {
    // 首页头部分享按钮弹窗
    handleClickShare() {
      this.$refs.popupContent.open();
    },
    // 取消按钮
    cancel() {
      this.$refs.popupContent.close();
    },
    // 内容部分分享海报,跳到分享海报页面
    shareContent(index) {
      if (index === 0) {
        uni.navigateTo({
          url: '/pages/share/site',
        });
      }
    },
    // 点击头像到个人主页
    toProfile(userId) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${userId}`,
      });
    },
    // 跳支付页面
    submit() {
      // uni.navigateTo({
      //   url: '/pages/topic/post',
      // });
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
.site-item__pay .cell-item__body__right-text {
  color: #fa5151;
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
.cell-item--left .cell-item__body__right {
  text-align: left;
}
</style>
