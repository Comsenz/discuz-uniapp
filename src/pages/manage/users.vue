<template>
  <qui-page>
    <view class="manage-users">
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
      <scroll-view
        class="scroll-Y"
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDown"
        style="height: 100vh;"
      >
        <view class="manage-users-wrap">
          <view v-if="userListShow && userListShow.length > 0">
            <view class="manage-users-wrap-list" v-for="user in userListShow" :key="user.id">
              <qui-avatar-cell
                center
                right-color="#aaa"
                :mark="user.id"
                :title="user.username"
                :value="user.groups[Object.keys(user.groups || {})[0]].name"
                :icon="user.avatarUrl || '/static/noavatar.gif'"
                @click="getNameId(user)"
              ></qui-avatar-cell>
            </view>
            <qui-load-more :status="loadingType"></qui-load-more>
          </view>
          <qui-no-data :tips="i18n.t('manage.noContent')" v-else></qui-no-data>
        </view>
      </scroll-view>
    </view>
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
    };
  },
  onLoad() {
    this.searchUser();
  },
  computed: {
    userListShow() {
      return this.isSearch ? this.searchUserList : this.userList;
    },
  },
  methods: {
    // 跳转到个人主页
    getNameId(key) {
      console.log('key', key);
      uni.navigateTo({
        url: `/pages/profile/index?userId=${this.userList[key].id}`,
      });
    },
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
  },
};
</script>

<style lang="scss" scope>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.manage-users {
  min-height: 100vh;
  background-color: --color(--qui-BG-1);

  &-search {
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

  &-wrap {
    margin-top: 130rpx;

    &-list {
      background: --color(--qui-BG-2);
    }
  }
}
</style>
