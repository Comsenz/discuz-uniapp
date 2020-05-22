<template>
  <qui-page class="site">
    <qui-header
      head-img="/static/logo.png"
      :theme="theme"
      :theme-num="siteInfo.other.count_users"
      :post="post"
      :post-num="siteInfo.other.count_threads"
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
                <qui-icon class="content-image" :name="item.icon" size="36" color="#777"></qui-icon>
              </view>
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">取消</text>
      </view>
    </uni-popup>
    <view class="site-item">
      <qui-cell-item
        class="cell-item--left cell-item--auto"
        title="站点介绍"
        :addon="siteInfo.set_site.site_introduction"
      ></qui-cell-item>
      <qui-cell-item title="创建时间" :addon="siteInfo.set_site.createdAt"></qui-cell-item>
      <qui-cell-item
        title="站点模式"
        :addon="siteInfo.set_site.site_mode === 'public' ? '公开模式' : '付费模式'"
      ></qui-cell-item>
      <qui-cell-item title="站长" slot-right>
        <view class="site-item__owner">
          <image
            class="site-item__owner-avatar"
            :src="siteInfo.set_site.site_author.avatar || '/static/noavatar.gif'"
            alt="avatarUrl"
            @tap="toProfile(item.id)"
          ></image>
          <text class="site-item__owner-name">{{ siteInfo.set_site.site_author.username }}</text>
        </view>
      </qui-cell-item>
      <navigator url="/pages/manage/users" hover-class="none">
        <qui-cell-item title="成员" slot-right arrow class="cell-item--auto">
          <view v-for="(item, index) in siteInfo.users" :key="index" class="site-item__person">
            <image
              class="site-item__person-avatar"
              :src="item.avatarUrl || '/static/noavatar.gif'"
              alt="avatarUrl"
              @tap="toProfile(item.id)"
            ></image>
          </view>
        </qui-cell-item>
      </navigator>
      <qui-cell-item title="我的角色" :addon="userInfo.groups[0].name"></qui-cell-item>
      <qui-cell-item
        title="加入时间"
        :addon="userInfo.joinedTime"
        v-if="siteInfo.set_site.site_mode === 'pay'"
      ></qui-cell-item>
      <qui-cell-item
        title="有效期至"
        :addon="userInfo.expiredTime"
        v-if="siteInfo.set_site.site_mode === 'pay'"
      ></qui-cell-item>
      <qui-cell-item class="cell-item--auto" title="我的权限" slot-right>
        <view class="site-permission" v-for="(item, index) in permissionInfo" :key="index">
          {{ item }}
        </view>
      </qui-cell-item>
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
      currentLoginId: parseInt(uni.getStorageSync('user_id'), 10), // 当前用户id
      bottomData: [
        {
          // text: this.i18n.t('home.generatePoster'),
          text: '生成海报',
          icon: 'icon-poster',
          name: 'wx',
        },
        {
          // text: this.i18n.t('home.wxShare'),
          text: '微信分享',
          icon: 'icon-wx-friends',
          name: 'wx',
        },
      ],
    };
  },

  onLoad() {
    this.getSiteInfo();
    this.getPermissions();
  },

  computed: {
    // 获取 站点信息
    siteInfo() {
      const info = this.$store.getters['jv/get']('forums/1');
      if (info && info.set_site && info.set_site.site_install) {
        info.set_site.createdAt = info.set_site.site_install.slice(0, 10);
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
          if (info && Object.keys(info.groups)) {
            if (value._jv && info.groups.length > 0) {
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
        include: ['permission'],
      };
      this.$store.dispatch('jv/get', ['groups', { params }]).then(res => {
        console.log('获取用户组权限：', res);
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
    // 取消按钮
    cancel() {
      this.$refs.popupContent.close();
    },
    // 点击头像到个人主页
    toProfile(userId) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${userId}`,
      });
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
  vertical-align: middle;
}
.cell-item--left .cell-item__body__right {
  text-align: left;
}
.site-permission {
  display: inline-block;
  padding: 13rpx 28rpx 12rpx;
  margin: 0rpx 10rpx 10rpx 0rpx;
  font-size: 26rpx;
  border: 2rpx solid #ededed;
  border-radius: 10px;
}
</style>
