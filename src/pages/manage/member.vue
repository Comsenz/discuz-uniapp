<template>
  <view class="qui-at-member-page-box">
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
        @scrolltolower="lower"
      >
        <checkbox-group @change="changeCheck" v-if="userList">
          <label v-for="item in userList" :key="item.id">
            <qui-avatar-cell
              center
              right-color="#aaa"
              :mark="item.id"
              :title="item.username"
              :value="item.groups[Object.keys(item.groups || {})[0]].name"
              :icon="item.avatarUrl || '/static/noavatar.gif'"
            >
              <checkbox slot="rightIcon" :value="JSON.stringify(item)"></checkbox>
            </qui-avatar-cell>
          </label>
        </checkbox-group>
        <checkbox-group @change="changeCheck" v-else>
          <label v-for="item in userList" :key="item.id">
            <qui-avatar-cell
              center
              right-color="#aaa"
              :mark="item.id"
              :title="item.username"
              :value="item.groups[Object.keys(item.groups || {})[0]].name"
              :icon="item.avatarUrl || '/static/noavatar.gif'"
            >
              <checkbox slot="rightIcon" :value="JSON.stringify(item)"></checkbox>
            </qui-avatar-cell>
          </label>
        </checkbox-group>
        <view class="loading-text">
          <text>{{ i18n.t(loadingText) }}</text>
        </view>
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
  </view>
</template>

<script>
import { mapMutations } from 'vuex';
import { debounce } from 'lodash';

export default {
  data() {
    return {
      checkAvatar: [],
      loadingType: 'more', // 上拉加载状态
      pageSize: 20, // 每页20条数据
      pageNum: 1, // 当前页数
      searchText: '',
    };
  },
  onLoad() {
    this.getGroupList();
    uni.setNavigationBarTitle({
      title: '成员管理',
    });
    this.searchUser();
  },
  computed: {
    // 获取用户组列表
    groupList() {
      const groups = this.$store.getters['jv/get']('groups');
      console.log('groups', groups);
      return groups;
    },
    allFollow() {
      return this.$store.getters['jv/get']('follow');
    },
    userList() {
      const list = this.$store.getters['jv/get']('users');
      console.log('list', list);
      return list;
    },
  },
  methods: {
    // eslint-disable-next-line
    searchInput: debounce(function(e) {
      if (e && e.target) {
        this.searchUser(e.target.value);
      }
    }, 800),
    clearSearch() {
      this.searchInput();
      this.searchUser();
    },
    // 调用 获取所有用户组 接口
    getGroupList() {
      this.$store.commit('jv/clearRecords', { _jv: { type: 'groups' } });
      this.$store.dispatch('jv/get', 'groups');
      console.log('获取所有用户组');
    },
    // 调用 搜索 接口
    searchUser(val = '') {
      this.searchText = val;
      const params = {
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[username]': `*${this.searchText}*`,
      };
      if (this.searchText === '') {
        this.$store.commit('jv/clearRecords', { _jv: { type: 'users' } });
        this.$store.dispatch('jv/get', ['users', {}]).then(res => {
          console.log('搜索res', res);
          if (res) {
            this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          }
        });
      } else {
        this.$store.commit('jv/clearRecords', { _jv: { type: 'users' } });
        this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
          console.log('搜索res', res);
          if (res) {
            this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          }
        });
      }
    },
    // 调用 批量修改用户的用户组 接口
    modifyGroupName(key) {
      const data = [];
      if (this.checkAvatar && this.checkAvatar.length > 0) {
        for (let i = 0; i < this.checkAvatar.length; i += 1) {
          data.push({
            attributes: {
              id: this.checkAvatar[i].id,
              groupId: this.groupList[key]._jv.id,
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
          this.searchUser();
          this.checkAvatar = [];
          this.$refs.popup.close();
        }
      });
    },
    ...mapMutations({
      setAtMember: 'atMember/SET_ATMEMBER',
    }),
    changeCheck(e) {
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
