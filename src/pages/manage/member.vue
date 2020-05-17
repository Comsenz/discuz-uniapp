<template>
  <view class="qui-at-member-page-box">
    <view class="qui-at-member-page-box__hd">
      <view class="qui-at-member-page-box__hd__sc">
        <qui-icon class="icon-search" name="icon-search" size="30"></qui-icon>
        <input
          type="text"
          placeholder-class="input-placeholder"
          confirm-type="search"
          :placeholder="i18n.t('discuzq.atMember.selectedMember')"
          @input="searchInput"
        />
      </view>
    </view>
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
              :value="user.groups[Object.keys(user.groups || {})[0]].name"
              :icon="
                user.avatarUrl === ''
                  ? user.avatarUrl
                  : 'https://discuz.chat/static/images/noavatar.gif'
              "
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
              :value="user.groups[Object.keys(user.groups || {})[0]].name"
              :icon="
                user.avatarUrl === ''
                  ? user.avatarUrl
                  : 'https://discuz.chat/static/images/noavatar.gif'
              "
            >
              <checkbox slot="rightIcon" :value="JSON.stringify(item)"></checkbox>
            </qui-avatar-cell>
          </label>
        </checkbox-group>
        <view class="loading-text">
          <text>{{ i18n.t(loadingText) }}</text>
        </view>
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
            <view @click="modifyGroupName(item)" v-for="item in allInviteList" :key="item._jv.id">
              <view class="popup-wrap-con-text">{{ item.title }}</view>
              <view class="popup-wrap-con-line"></view>
            </view>
          </view>
          <view class="popup-wrap-space"></view>
          <text class="popup-wrap-btn" @click="cancel">取消</text>
        </view>
      </scroll-view>
    </uni-popup>
  </view>
</template>

<script>
import { mapMutations } from 'vuex';
import { timestamp2day } from '@/utils/time';

export default {
  data() {
    return {
      allSiteUser: [],
      followStatus: true, // 第一次进来显示follow列表
      checkAvatar: [],
      loadingText: 'discuzq.list.loading',
      searchValue: '',
      pageNum: 1,
      meta: {},
    };
  },
  computed: {
    // 获取管理邀请列表（非管理员无的邀请链接无管理）
    allInviteList() {
      const list = [];
      const inviteList = this.$store.getters['jv/get']('invite');
      const groupList = this.$store.getters['jv/get']('groups');
      console.log('会话列表接口的响应：', inviteList);
      console.log('用户组接口的响应：', groupList);
      const inviteListKeys = Object.keys(inviteList);
      const groupListKeys = Object.keys(groupList);
      if (inviteList && inviteListKeys.length > 0) {
        for (let i = 0; i < inviteListKeys.length; i += 1) {
          const inviteListValue = inviteList[inviteListKeys[i]];
          const day = timestamp2day(inviteListValue.endtime);
          inviteListValue.time = `有效期剩余${day}天`;
          if (groupListKeys && groupListKeys.length > 0) {
            for (let j = 0; j < groupListKeys.length; j += 1) {
              const groupListValue = groupList[groupListKeys[j]];
              if (inviteListValue.group_id.toString() === groupListValue._jv.id.toString()) {
                inviteListValue.title = groupListValue.name;
              }
            }
          }
          list.push(inviteListValue);
        }
      }
      console.log('list', list);
      return list;
    },
    allFollow() {
      return this.$store.getters['jv/get']('follow');
    },
    userList() {
      const list = this.$store.getters['jv/get']('users');
      console.log('list', list);
      return list;
    },
    getGroups() {
      const that = this;
      return data => {
        Object.keys(data).forEach((item, index) => {
          if (item[index]) {
            return item[index].name;
          }
          return that.i18n.t('discuzq.role.noRole');
        });
      };
    },
  },
  methods: {
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
      // this.setAtMember(this.checkAvatar);
      // uni.navigateBack({
      //   delta: 1,
      // });
      this.$refs.popup.open();
    },
    searchInput(e) {
      this.followStatus = false;
      this.searchValue = e.detail.value;

      if (this.pageNum !== 1) {
        this.pageNum = 1;
      }

      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getSiteMember(1);
      }, 250);
    },
    lower() {
      if (this.followStatus) {
        if (this.meta.total > Object.keys(this.allFollow).nv_length) {
          this.pageNum += 1;
          this.getFollowMember(this.pageNum);
        } else {
          this.loadingText = 'discuzq.list.noMoreData';
        }
      } else if (this.meta.total > Object.keys(this.allSiteUser).nv_length) {
        this.pageNum += 1;
        this.getSiteMember(this.pageNum);
      } else {
        this.loadingText = 'discuzq.list.noMoreData';
      }
    },
    getFollowMember(number) {
      const params = {
        include: ['toUser', 'toUser.groups'],
        'page[size]': 20,
        'page[number]': number,
      };
      this.$store.dispatch('jv/get', ['follow', { params }]).then(res => {
        /* eslint no-underscore-dangle: ["error", { "allow": ["_jv"] }] */
        this.meta = res._jv.json.meta;
        if (Object.keys(res) === 0) {
          this.loadingText = 'discuzq.list.noData';
        }
        if (res._jv.json.meta.total <= 20) {
          this.loadingText = 'discuzq.list.noData';
        }
      });
    },
    getSiteMember(number) {
      const params = {
        'filter[username]': `*${this.searchValue}*`,
        'filter[status]': 'normal',
        'page[size]': 20,
        'page[number]': number,
      };
      this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
        this.meta = res._jv.json.meta;

        const data = JSON.parse(JSON.stringify(res));
        delete data._jv;
        this.allSiteUser = data;

        if (Object.keys(res) === 0) {
          this.loadingText = 'discuzq.list.noData';
        }
        if (res._jv.json.meta.total <= 20) {
          this.loadingText = 'discuzq.list.noData';
        }
      });
    },
    // 调用 管理邀请列表 接口
    getInviteList(status) {
      const params = {
        'filter[status]': status,
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'invite' } });
      this.$store.dispatch('jv/get', ['invite', { params }]).then(res => {
        this.totalData = res._jv.json.meta.total;
        console.log('获取管理邀请列表', res);
      });
    },

    // 调用 获取所有用户组 接口
    getGroupList() {
      this.$store.commit('jv/clearRecords', { _jv: { type: 'groups' } });
      this.$store.dispatch('jv/get', 'groups');
      console.log('获取所有用户组');
    },

    // 调用 批量修改用户的用户组 接口
    modifyGroupName(item) {
      const data = [];
      if (this.checkAvatar && this.checkAvatar.length > 0) {
        for (let i = 0; i < this.checkAvatar.length; i += 1) {
          data.push({ attributes: { id: this.checkAvatar[i].id, groupId: item.group_id } });
        }
      }
      // const params = {
      //   id
      //   groupId: item.group_id,
      // };
      console.log('this.checkAvatar', this.checkAvatar);
      console.log('item', item);
      // const params = {
      //   'filter[status]': status,
      // };
      // this.$store.dispatch('jv/patch', params);
    },

    // 点击取消按钮
    cancel() {
      console.log('取消');
      this.$refs.popup.close();
    },
  },
  onLoad() {
    this.getInviteList(1);
    this.getGroupList();
    uni.setNavigationBarTitle({
      title: '成员管理',
    });
    this.getFollowMember(1);
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

$otherHeight: 292rpx;
.qui-at-member-page-box {
  width: 100%;
  &__hd {
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 20rpx 40rpx;

    &__sc {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 10rpx;
      background-color: --color(--qui-BG-IT);
      border-radius: 10rpx;

      .icon-search {
        margin: 0 10rpx;
        color: #bbb;
      }
      input {
        width: 100%;
        height: 100%;
      }
      /deep/ input .input-placeholder {
        font-size: $fg-f28;
        color: --color(--qui-FC-C6);
      }
    }
  }
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
