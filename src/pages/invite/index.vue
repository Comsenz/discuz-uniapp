<template>
  <qui-page :data-qui-theme="theme" class="invite-page">
    <view class="invite-page__list">
      <navigator url="/pages/invite/invited" hover-class="none">
        <qui-cell-item :title="i18n.t('profile.invitedFriends')" arrow></qui-cell-item>
      </navigator>
      <navigator url="/pages/invite/income" hover-class="none">
        <qui-cell-item :title="i18n.t('profile.incomeDetail')" arrow></qui-cell-item>
      </navigator>
    </view>
  </qui-page>
</template>

<script>
export default {
  components: {
    //
  },
  data() {
    return {
      //
    };
  },
  methods: {
    // 私信跳转到聊天页面（传入用户名和会话id）
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.invite-page /deep/ {
  background-color: --color(--qui-BG-2);
  .invite-page__list {
    padding-left: 40rpx;
  }

  .cell-item {
    padding-right: 40rpx;
  }
}
</style>
