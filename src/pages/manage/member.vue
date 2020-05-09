<template>
  <view class="manage-users-box">
    <!-- 搜索成员 -->
    <uni-search-bar
      placeholder="搜索成员"
      :cancel-button="none"
      bg-color="#f6f6f6"
      @confirm="search"
      style="color: #c6c6c6;"
    ></uni-search-bar>
    <!-- 成员列表 -->
    <view v-for="user in userList" :key="user.id">
      <qui-avatar-cell
        center
        right-color="#aaa"
        :mark="user.id"
        :title="user.username"
        :value="user.groupname"
        :icon="
          user.avatarUrl === '' ? 'https://discuz.chat/static/images/noavatar.gif' : user.avatarUrl
        "
      ></qui-avatar-cell>
    </view>
  </view>
</template>

<script>
import { uniSearchBar } from '@dcloudio/uni-ui';

export default {
  components: { uniSearchBar },

  data() {
    return {
      userList: [
        { id: 1, username: '白展堂', groupname: '圈主', avatarUrl: '' },
        { id: 2, username: '莫小贝', groupname: '合伙人', avatarUrl: '' },
        { id: 3, username: '郭芙蓉', groupname: '好友', avatarUrl: '' },
      ],
    };
  },

  methods: {},
};
</script>

<style lang="scss" scope>
page {
  background-color: #fff;
}
.manage-items {
  padding-left: 40rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;

  .cell-item {
    padding-right: 40rpx;
  }
}
</style>
