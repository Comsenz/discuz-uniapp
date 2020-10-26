<template>
  <qui-page :data-qui-theme="theme" class="site-management-box">
    <view
      class="site-management-box-list"
      v-if="forums.other && (forums.other.can_edit_user_group || forums.other.can_edit_user_status)"
    >
      <navigator url="/pages/manage/member" hover-class="none">
        <qui-cell-item :title="i18n.t('manage.manageMembers')" arrow :slot-right="true">
          <text>{{ i18n.t('manage.setting') }}</text>
        </qui-cell-item>
      </navigator>
    </view>
    <view class="site-management-box-list" v-if="forums.other && forums.other.can_create_invite">
      <navigator url="/pages/manage/invite" hover-class="none">
        <qui-cell-item :title="i18n.t('manage.inviteMembers')" arrow></qui-cell-item>
      </navigator>
    </view>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
      //
    };
  },
};
</script>

<style lang="scss" scope>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.site-management-box {
  background-color: --color(--qui-BG-2);

  &-list {
    padding: 0rpx 0rpx 0rpx 40rpx;

    .cell-item {
      padding: 0rpx 40rpx 0rpx 0rpx;
    }
  }
}
</style>
