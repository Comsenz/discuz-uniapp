<template>
  <qui-page :data-qui-theme="theme" class="qui-at-member-page-box">
    <!-- 搜索成员 -->
    <view class="manage-users-search">
      <view class="search">
        <view class="search-box">
          <view class="search-box__content">
            <qui-icon
              class="icon-content-search"
              name="icon-search"
              size="30"
              color="#bbb"
            ></qui-icon>
            <input
              type="text"
              class="search-box__content-input"
              placeholder-class="input-placeholder"
              :placeholder="i18n.t('manage.searchMembers')"
              @input="searchInput"
              :value="searchText"
            />
            <view @tap="clearSearch" v-if="searchText" class="search-box__content-delete">
              <qui-icon name="icon-close1" size="32" color="#ccc"></qui-icon>
            </view>
          </view>
          <view class="search-box__cancel" v-if="searchText" @tap="clearSearch">
            <text>{{ i18n.t('home.cancel') }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 成员列表 -->
    <view class="qui-at-member-page-box__lst">
      <scroll-view
        class="scroll-Y"
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDown"
      >
        <checkbox-group @change="changeCheck">
          <label v-for="item in userListShow" :key="item.id">
            <qui-avatar-cell
              center
              right-color="#aaa"
              :mark="item.id"
              :title="item.username"
              :value="item.groups[Object.keys(item.groups || {})[0]].name"
              :icon="item.avatarUrl || '/static/noavatar.gif'"
            >
              <checkbox
                slot="rightIcon"
                :value="JSON.stringify(item)"
                :disabled="item.id === currentLoginId ? true : false"
                :checked="checkAvatar.find(value => value.id === item.id)"
              ></checkbox>
            </qui-avatar-cell>
          </label>
        </checkbox-group>
        <qui-load-more :status="loadingType"></qui-load-more>
      </scroll-view>
    </view>
    <view class="qui-at-member-page-box__ft">
      <qui-button
        size="large"
        :type="Boolean(checkAvatar.length < 1) ? 'default' : 'primary'"
        :disabled="Boolean(checkAvatar.length < 1)"
        @click="getCheckMember"
      >
        {{
          checkAvatar.length &lt; 1
            ? i18n.t('manage.notSelected')
            : i18n.t('manage.selected') + '（' + checkAvatar.length + '）'
        }}
      </qui-button>
    </view>
    <!-- 成员管理弹窗 -->
    <uni-popup ref="popup" type="bottom">
      <scroll-view style="height: 968rpx;" scroll-y="true">
        <view class="popup-wrap">
          <view class="popup-wrap-con">
            <view @click="modifyGroupName(item)" v-for="item in groupList" :key="item._jv.id">
              <view class="popup-wrap-con-text">{{ item.name }}</view>
              <view class="popup-wrap-con-line"></view>
            </view>
          </view>
          <view class="popup-wrap-space"></view>
          <text class="popup-wrap-btn" @click="cancel">{{ i18n.t('home.cancel') }}</text>
        </view>
      </scroll-view>
    </uni-popup>
  </qui-page>
</template>

<script>
import { debounce } from 'lodash';

export default {
  data() {
    return {
      searchText: '', // 输入的用户名
      loadingType: 'more', // 上拉加载状态
      pageSize: 20, // 每页20条数据
      pageNum: 1, // 当前页数
      searchPageNum: 1, // 搜索的当前页数
      userList: [], // 用户数据
      searchUserList: [], // 搜索的用户数据
      isSearch: false, // 是否搜索
      groupList: [], // 用户角色
      checkAvatar: [], // 选择的用户
    };
  },
  onLoad() {
    this.searchUser();
    this.getGroupList();
    uni.setNavigationBarTitle({
      title: '成员管理',
    });
  },
  computed: {
    // 获取当前登录的id
    currentLoginId() {
      const userId = this.$store.getters['session/get']('userId');
      console.log('获取当前登录的id', userId);
      return parseInt(userId, 10);
    },
    userListShow() {
      return this.isSearch ? this.searchUserList : this.userList;
    },
  },
  methods: {
    // eslint-disable-next-line
    searchInput: debounce(function(e) {
      if (e && e.target) {
        this.isSearch = true;
        this.searchPageNum = 1;
        this.searchUserList = [];
        this.searchUser(e.target.value);
      }
    }, 800),
    clearSearch() {
      this.isSearch = false;
      this.searchText = '';
      this.searchUser();
      this.checkAvatar = [];
    },
    // 调用 获取所有用户组 接口
    getGroupList() {
      this.$store.dispatch('jv/get', 'groups').then(res => {
        console.log('获取所有用户组：', res);
        if (res._jv) {
          delete res._jv;
          this.groupList = res;
        }
      });
    },
    // 调用 搜索 接口
    searchUser(val = '') {
      this.searchText = val;
      const params = {
        include: 'groups',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[username]': `*${this.searchText}*`,
      };
      if (this.searchText === '') {
        this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
          console.log('内容为空的搜索：', res);
          if (res && res._jv) {
            delete res._jv;
            if (this.isSearch) {
              this.searchUserList = [...this.searchUserList, ...res];
            } else {
              this.userList = [...this.userList, ...res];
            }
            this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          }
        });
      } else {
        params['page[number]'] = this.searchPageNum;
        this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
          console.log('搜索res：', res);
          if (res && res._jv) {
            delete res._jv;
            this.searchUserList = [...this.searchUserList, ...res];
            this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          }
        });
      }
    },
    // 上拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      if (this.isSearch) {
        this.searchPageNum += 1;
      } else {
        this.pageNum += 1;
      }
      this.searchUser(this.searchText);
      console.log('页码', this.pageNum);
    },
    // 调用 批量修改用户的用户组 接口
    modifyGroupName(item) {
      console.log('item', item);
      const data = [];
      if (this.checkAvatar && this.checkAvatar.length > 0) {
        for (let i = 0; i < this.checkAvatar.length; i += 1) {
          data.push({
            attributes: {
              id: this.checkAvatar[i].id,
              groupId: parseInt(item._jv.id, 10),
            },
          });
        }
      }
      const params = [
        {
          _jv: {
            type: 'users',
          },
        },
        {
          data: {
            data,
          },
        },
      ];
      this.$store.dispatch('jv/patch', params).then(res => {
        console.log('修改用户组res', res);
        if (res) {
          this.getGroupList();
          this.pageNum = 1;
          this.getList();
          this.$refs.popup.close();
        }
      });
    },
    getList() {
      this.searchText = '';
      this.isSearch = false;
      const params = {
        include: 'groups',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[username]': `*${this.searchText}*`,
      };
      this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
        console.log('第一页的数据：', res);
        if (res && res._jv) {
          delete res._jv;
          this.userList = res;
          this.checkAvatar.splice(0, this.checkAvatar.length);
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        }
      });
    },
    changeCheck(e) {
      console.log('eeeeee', e);
      this.checkAvatar = [];
      e.detail.value.forEach(item => {
        this.checkAvatar.push(JSON.parse(item));
      });
    },
    getCheckMember() {
      this.$refs.popup.open();
    },
    // 点击取消按钮
    cancel() {
      console.log('取消');
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

.mamage-users-search {
  .search {
    position: fixed;
    top: 0rpx;
    z-index: 99;
    width: 100%;
  }

  .search-box {
    background-color: --color(--qui-BG-2);
  }
}

$otherHeight: 292rpx;
.qui-at-member-page-box {
  width: 100%;

  &__lst {
    .scroll-Y {
      height: calc(100vh - #{$otherHeight});
      .loading-text {
        height: 100rpx;
        font-size: 28rpx;
        line-height: 100rpx;
        text-align: center;
      }
    }
  }
  &__ft {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 40rpx;
    box-sizing: border-box;
  }
}

.popup-wrap {
  display: flex;
  flex-direction: column;
  background: --color(--qui-BG-2);
  border-radius: 10rpx 10rpx 0rpx 0rpx;

  &-con {
    border-radius: 10rpx 10rpx 0rpx 0rpx;

    &-text {
      width: 100%;
      height: 100rpx;
      font-size: $fg-f34;
      line-height: 100rpx;
      text-align: center;
    }

    &-line {
      border: 2rpx solid --color(--qui-BG-ED);
    }
  }

  &-space {
    border: 8rpx solid --color(--qui-BG-ED);
  }

  &-btn {
    width: 100%;
    height: 100rpx;
    font-size: $fg-f28;
    line-height: 100rpx;
    text-align: center;
  }
}
</style>
