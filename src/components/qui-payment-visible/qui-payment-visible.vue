<template>
  <!--作者向您发起了提问部分-->
  <view class="theme">
    <!-- 回答头部 -->
    <qui-topic-header
      :user-name="userName"
      :avatar-url="avatarUrl"
      :user-id="userId"
      :user-role="userRole"
      :theme-time="themeTime"
    ></qui-topic-header>

    <!-- 回答内容 -->
    <div class="theme-content">
      <qui-uparse :content="answerContent"></qui-uparse>
      <qui-image :images-list="imagesList"></qui-image>
    </div>

    <!-- 已支付列表 -->
    <view>
      <qui-person-list
        :type="i18n.t('topic.paids')"
        :person-num="thread.question.onlooker_number"
        :person-list="thread.onlookers"
        :btn-show="!thread.isOnlooker && thread.question.price === '0'"
        :btn-icon-show="true"
        btn-icon-name="rmb"
        :btn-text="''"
        @personJump="personJump"
      ></qui-person-list>
    </view>
  </view>
</template>
<script>
// import user from '@/mixin/user';
// import forums from '@/mixin/forums';

export default {
  props: {
    // 主题的用户的角色
    userRole: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 用户id
    userId: {
      type: [Number, String],
      default: '',
    },
    // 回答主题的用户头像
    avatarUrl: {
      type: String,
      default: '',
    },
    // 回答主题的用户名
    userName: {
      type: String,
      default: '',
    },
    // 实名认证
    isReal: {
      type: Boolean,
      default: false,
    },
    // 回答内容
    answerContent: {
      type: String,
      default: '',
    },
    // 发布时间
    themeTime: {
      type: String,
      default: '',
    },
    // 回答的图片
    imagesList: {
      type: Array,
      default: () => {
        return [];
      },
    },

    // 已支付人员
    thread: {
      type: Object,
      default: () => {
        return {
          paidCount: 0,
          paidUsers: [],
        };
      },
    },
  },
  data: () => {
    return {};
  },
  methods: {
    // 跳转到用户主页
    personJump(id) {
      if (!this.$store.getters['session/get']('isLogin')) {
        // #ifdef MP-WEIXIN
        this.$store.getters['session/get']('auth').open();
        // #endif
        // #ifdef H5
        this.$store.dispatch('session/setUrl', this.curUrl);
        if (!this.handleLogin()) {
          return;
        }
        // #endif
      }
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.theme {
  margin-bottom: 98rpx;
  background: --color(--qui-BG-ED);

  &-content {
    padding: 0 33rpx 0 21rpx;
  }

  /deep/ .det-person-box {
    margin-top: 86rpx;
    background: --color(--qui-BG-ED);
    .det-per-list {
      padding: 23rpx 0 0rpx;
    }
    .fold-box {
      padding: 0;
    }
  }
}
</style>
