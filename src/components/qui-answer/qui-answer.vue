<template>
  <!-- 答案支付 -->
  <view class="themeItem">
    <!-- 答案支付头部 -->
    <qui-topic-header
      :user-name="userName"
      :avatar-url="avatarUrl"
      :user-id="userId"
      :user-role="userRole"
      :theme-time="themeTime"
      @personJump="personJump(thread.question.be_user_id)"
    ></qui-topic-header>
    <!-- 回答内容 -->
    <view class="theme-content" v-if="isOnlooker">
      <qui-uparse :content="answerContent"></qui-uparse>
      <qui-image :images-list="imagesList"></qui-image>
    </view>
    <!-- <view class="themeItem__list"> -->
    <view class="theme-list">
      <qui-person-list
        :type="i18n.t('topic.pay')"
        :person-num="thread.question.onlooker_number"
        :limit-count="10"
        :person-list="thread.onlookers"
        :btn-show="!thread.onlookerState"
        :btn-icon-show="false"
        :list-bg="listBg"
        btn-icon-name="rmb"
        :btn-text="
          `${i18n.t('topic.paymentAnswer')}${thread.question.onlooker_unit_price}${i18n.t(
            'topic.visible',
          )}`
        "
        @personJump="personJump"
        @btnClick="btnClick"
      ></qui-person-list>
    </view>
  </view>
</template>
<script>
import { time2DateAndHM } from '@/utils/time';
import loginModule from '@/mixin/loginModule';

export default {
  mixins: [loginModule],
  props: {
    // 主题的用户的角色
    userRole: {
      type: Array,
      default: () => {
        return [];
      },
    },
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
    // 围观人员是否已支付
    isOnlooker: {
      type: Boolean,
      default: false,
    },
    // 已支付人员
    thread: {
      type: Object,
      default: () => {
        return {
          paidCount: 0,
          paidUsers: [],
          payment: 0,
        };
      },
    },
  },
  data: () => {
    return {
      paymentAnswer: '1', // 支付多少
      payNum: '1234', // 支付人数
      personRes: [], // 头像列表
      payment: 2,
      list: [],
      listBg: '--color(--qui-BG-ED)',
    };
  },
  computed: {
    // 时间转化
    localTime() {
      return time2DateAndHM(this.themeTime ? this.themeTime : '');
    },
  },
  methods: {
    // 跳转到用户主页
    personJump(id) {
      if (!this.$store.getters['session/get']('isLogin')) {
        // #ifdef MP-WEIXIN
        this.mpLoginMode();
        // #endif
        // #ifdef H5
        this.$store.dispatch('session/setUrl', this.curUrl);
        this.h5LoginMode();
        // #endif
      }
      if (id <= 0) {
        return;
      }
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
    btnClick(param) {
      this.$emit('btnClick', param);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.themeItem {
  background: --color(--qui-BG-ED);
}
/deep/ .det-person-box {
  background: --color(--qui-BG-ED);
}
.theme-content {
  padding: 0 36rpx;
}
.theme-list {
  background: --color(--qui-BG-ED);
}
</style>
