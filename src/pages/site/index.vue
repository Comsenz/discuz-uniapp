<template>
  <qui-page :data-qui-theme="theme" class="site">
    <qui-header
      head-img="/static/logo.png"
      :theme="i18n.t('home.theme')"
      :theme-num="siteInfo.count_users"
      :post="i18n.t('home.homecontent')"
      :post-num="siteInfo.count_threads"
      :share="i18n.t('home.share')"
      :iconcolor="theme === $u.light() ? '#333' : '#fff'"
      @click="open"
    ></qui-header>
    <!-- 分享弹窗 -->
    <uni-popup ref="popupHead" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content" style="box-sizing: border-box;">
          <button
            class="popup-share-button"
            open-type="share"
            v-if="siteInfo.set_site && siteInfo.set_site.site_mode !== 'pay'"
          ></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareHead(index)">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="46"
                  :color="theme === $u.light() ? '#aaa' : '#777'"
                ></qui-icon>
              </view>
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <!-- 站点信息 -->
    <view class="site-item">
      <qui-cell-item
        class="cell-item--left cell-item--auto"
        :title="i18n.t('manage.siteintroduction')"
        :addon="siteInfo.site_introduction"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('manage.creationtime')"
        :addon="siteInfo.createdAt"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('manage.circlemode')"
        :addon="
          siteInfo.set_site && siteInfo.set_site.site_mode === 'public'
            ? i18n.t('manage.publicmode')
            : i18n.t('manage.paymentmode')
        "
      ></qui-cell-item>
      <qui-cell-item :title="i18n.t('manage.circlemaster')" slot-right>
        <view class="site-item__owner">
          <image
            class="site-item__owner-avatar"
            :src="siteInfo.avatar || '/static/noavatar.gif'"
            alt="avatarUrl"
            @tap="jumpUserPage(siteInfo.userId)"
          ></image>
          <text class="site-item__owner-name">{{ siteInfo.username }}</text>
        </view>
      </qui-cell-item>
      <navigator url="/pages/manage/users" hover-class="none">
        <qui-cell-item class="member" :title="i18n.t('home.theme')" slot-right arrow>
          <view
            v-for="(item, index) in siteInfo.users"
            :key="index"
            class="site-item__person__content"
          >
            <image
              class="site-item__person__content-avatar"
              :src="item.avatarUrl || '/static/noavatar.gif'"
              alt="avatarUrl"
              @tap="jumpUserPage(item.id)"
              @tap.stop
            ></image>
          </view>
        </qui-cell-item>
      </navigator>
      <qui-cell-item :title="i18n.t('manage.myRole')" :addon="userInfo.groupName"></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('manage.joinedTime')"
        :addon="userInfo.joinedTime"
        v-if="siteInfo.set_site && siteInfo.set_site.site_mode === 'pay' && userInfo.joinedAt"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('manage.periodvalidity')"
        :addon="userInfo.expiredTime"
        v-if="siteInfo.set_site && siteInfo.set_site.site_mode === 'pay'"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.myauthority')"
        slot-right
        :border="false"
        class="cell-item--auto cell-item--left"
      >
        <view v-for="(item, index) in permissionInfo" :key="index" class="site-item__permission">
          <text>{{ i18n.t(`permission.${item}`) }}</text>
        </view>
      </qui-cell-item>
    </view>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
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
  onLoad() {
    // uni.hideHomeButton();
    this.getSiteInfo();
    this.getPermissions();
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
  computed: {
    currentLoginId() {
      const userId = this.$store.getters['session/get']('userId');
      console.log('获取当前登录的id', userId);
      return parseInt(userId, 10);
    },
    // 获取 站点信息
    siteInfo() {
      const info = this.$store.getters['jv/get']('forums/1');
      if (info && info.other) {
        info.count_users = info.other.count_users;
        info.count_threads = info.other.count_threads;
      }
      if (info && info.set_site) {
        info.site_introduction = info.set_site.site_introduction;
        if (info.set_site.site_install) {
          info.createdAt = info.set_site.site_install.slice(0, 10);
        }
      }
      if (info && info.set_site && info.set_site.site_author) {
        info.avatar = info.set_site.site_author.avatar;
        info.username = info.set_site.site_author.username;
        info.userId = info.set_site.site_author.id;
      }
      console.log('站点信息：', info);
      return info;
    },
    // 获取 用户信息
    userInfo() {
      const info = this.$store.getters['jv/get'](`users/${this.currentLoginId}`);
      if (info && info.joinedAt) {
        info.joinedTime = info.joinedAt.slice(0, 10);
      }
      if (info && info.expiredAt) {
        info.expiredTime = info.expiredAt.substr(0, 10);
      } else {
        info.expiredTime = '永久有效';
      }
      if (info && info.groups && info.groups.length > 0) {
        info.groupName = info.groups[0].name;
      }
      console.log('用户信息：', info);
      return info;
    },
    // 获取 用户权限
    permissionInfo() {
      let permissionList = [];
      const info = this.$store.getters['jv/get'](`users/${this.currentLoginId}`);
      const list = this.$store.getters['jv/get']('groups');
      const keys = Object.keys(list);
      if (list && keys.length > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          const value = list[keys[i]];
          if (info && info.groups && Object.keys(info.groups)) {
            if (value._jv && info.groups && info.groups.length > 0) {
              if (value._jv.id === info.groups[0]._jv.id) {
                if (value.permission) {
                  permissionList = Object.keys(value.permission).map(key => {
                    return value.permission[key].permission;
                  });
                }
              }
            } else {
              console.log('用户数据', value);
            }
          }
        }
      }
      console.log('用户权限：', permissionList);
      return permissionList;
    },
  },
  methods: {
    // 调用 获取配置（站点信息） 接口
    getSiteInfo() {
      const params = {
        include: ['users'],
      };
      this.$store.dispatch('jv/get', ['forum', { params }]).then(res => {
        console.log('获取站点信息：', res);
      });
    },
    // 调用 用户组权限 接口
    getPermissions() {
      const params = {
        'filter[type]': 'invite',
        include: ['permission'],
      };
      this.$store.dispatch('jv/get', ['groups', { params }]).then(res => {
        console.log('获取用户组权限：', res);
      });
    },
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
    // 头部分享海报
    shareHead(index) {
      if (index === 0) {
        if (!this.$store.getters['session/get']('isLogin')) {
          this.$store.getters['session/get']('auth').open();
          return;
        }
        uni.navigateTo({
          url: '/pages/share/site',
        });
      }
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
    // 取消按钮
    cancel() {
      this.$refs.popupHead.close();
    },
    // 跳转到个人主页
    jumpUserPage(userId) {
      if (userId) {
        console.log('点击头像到个人主页', userId);
        uni.navigateTo({
          url: `/pages/profile/index?userId=${userId}`,
        });
      }
    },
  },
};
</script>
<style lang="scss" scope>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.site {
  /deep/ .header {
    height: auto;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .header /deep/ .circleDet-txt {
    color: --color(--qui-FC-333);
    opacity: 1;
  }
  .header .logo {
    height: 75rpx;
    padding-top: 71rpx;
  }
  /deep/ .icon-share1 {
    color: --color(--qui-FC-333);
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
.cell-item__body__content-title {
  width: 112rpx;
  margin-right: 40rpx;
  color: --color(--qui-FC-777);
}
.site-item__pay .cell-item__body__right-text {
  color: --color(--qui-RED);
}
.site-item__person__content-avatar,
.site-item__owner-avatar {
  width: 60rpx;
  height: 60rpx;
  margin-left: 8rpx;
  border-radius: 50%;
}
.site-item__owner {
  display: flex;
  align-items: center;
}
.site-item__owner-avatar {
  margin-right: 20rpx;
}
/deep/ .member .cell-item__body__right {
  display: flex;
}
.site-item__person__content {
  display: inline-block;
  height: 60rpx;
  overflow: hidden;
  font-size: 0;
}
.cell-item--left .cell-item__body__right {
  text-align: left;
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
</style>
