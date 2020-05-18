<template>
  <qui-page class="site">
    <qui-header
      :head-img="siteInfo.set_site.site_logo || '/static/logo.png'"
      :theme="theme"
      :theme-num="siteInfo.other.count_users"
      :post="post"
      :post-num="siteInfo.other.count_threads"
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
        <!-- <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text> -->
      </view>
    </uni-popup>
    <view class="site-item">
      <qui-cell-item
        class="cell-item--left cell-item--auto"
        title="圈子介绍"
        :addon="siteInfo.set_site.site_introduction"
      ></qui-cell-item>
      <qui-cell-item title="创建时间" :addon="siteInfo.set_site.createdAt"></qui-cell-item>
      <qui-cell-item
        title="圈子模式"
        :addon="siteInfo.set_site.site_mode === 'public' ? '公开模式' : '付费模式'"
      ></qui-cell-item>
      <qui-cell-item title="圈主" slot-right>
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
          <view v-for="(item, index) in forums.users" :key="index" class="site-item__person">
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
      // bottomData: [
      //   {
      //     text: this.i18n.t('home.generatePoster'),
      //     icon: 'icon-poster',
      //     name: 'wx',
      //   },
      //   {
      //     text: this.i18n.t('home.wxShare'),
      //     icon: 'icon-wx-friends',
      //     name: 'wx',
      //   },
      // ],
    };
  },

  onLoad() {
    this.getSiteInfo();
    this.getUserInfo();
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
      const info = this.$store.getters['jv/get']('users/1');
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
      const info = this.$store.getters['jv/get']('users/1');
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
    // 调用 获取配置（圈子信息） 接口
    getSiteInfo() {
      const params = {
        include: ['users'],
      };
      this.$store.dispatch('jv/get', ['forum', { params }]).then(res => {
        console.log('获取圈子信息：', res);
      });
    },

    // 调用 用户资料 接口
    getUserInfo() {
      const id = 1;
      const params = {
        include: ['groups'],
      };
      this.$store.dispatch('jv/get', [`users/${id}`, { params }]).then(res => {
        console.log('获取用户资料：', res);
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

.site {
  /deep/ .header {
    height: auto;
    margin-bottom: 30rpx;
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
.site-permission {
  display: inline-block;
  padding: 13rpx 28rpx 12rpx;
  margin: 0rpx 10rpx 10rpx 0rpx;
  font-size: 26rpx;
  border: 2rpx solid #ededed;
  border-radius: 10px;
}
</style>
