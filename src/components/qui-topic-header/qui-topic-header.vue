<template>
  <view>
    <view class="themeItem__header">
      <view class="themeItem__header__img" @click="personJump">
        <qui-avatar :user="{ username: userName, avatarUrl: avatarUrl }" :is-real="isReal" />
      </view>
      <view class="themeItem__header__title">
        <view class="themeItem__header__title__top" @click="personJump">
          <text class="themeItem__header__title__username">{{ userName }}</text>
          <text
            class="themeItem__header__title__isAdmin"
            v-for="(group, index) in userRole"
            :key="index"
            :class="group.isDisplay ? 'themeItem__header__title__isAdminColor' : ''"
          >
            {{ group.isDisplay ? `${group.name}` : '' }}
          </text>
        </view>
        <view class="themeItem__header__title__time">
          {{ `${localTime} ${i18n.t('home.answer')}` }}
        </view>
      </view>
      <view class="themeItem__header__opera">
        <image v-if="threadIsEssence" src="@/static/essence.png" class="essence"></image>
        <slot name="more"></slot>
      </view>
    </view>
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>

<script>
import { time2DateAndHM } from '@/utils/time';
// import { status } from '@/library/jsonapi-vuex/index';

export default {
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
    // 是否加精
    threadIsEssence: {
      type: Boolean,
      default: false,
    },
    // 发布时间
    themeTime: {
      type: String,
      default: '',
    },
    // 主题id
    themid: {
      type: [Number, String],
      default: 0,
    },
    // 主题相关标签
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data: () => {
    return {
      seleShow: false, // 默认收起管理菜单
      selectActive: false,
      imageStatus: true, // 头像地址错误时显示默认头像
      // topicStatus: '',
      videoShow: false,
      attachMentList: [],
      autoplay: false,
      look: true,
      sun: 1,
      blocKwidth: 224,
    };
  },
  computed: {
    t() {
      return this.i18n.t('topic');
    },
    p() {
      return this.i18n.t('pay');
    },
    // 时间转化
    localTime() {
      return time2DateAndHM(this.themeTime ? this.themeTime : '');
    },
  },
  methods: {
    // 点击用户头像以及用户名事件
    personJump() {
      this.$emit('personJump', this.userId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.themeItem {
  width: 100%;
  background: --color(--qui-BG-2);

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    padding: 30rpx 40rpx 37rpx;
    box-sizing: border-box;
    &__img {
      width: 80rpx;
      height: 80rpx;
      // margin-right: 18rpx;
      background: #ccc;
      border-radius: 100%;
      image {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }

    &__title {
      flex: 1;
      margin-left: 18rpx;
      &__top {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: 37rpx;
        margin-bottom: 10rpx;
        margin-left: 2rpx;
        font-size: $fg-f4;
        line-height: 37rpx;
      }

      &__username {
        display: flex;
        height: 37rpx;
        max-width: 326rpx;
        overflow: hidden;
        font-weight: bold;
        line-height: 37rpx;
        color: --color(--qui-FC-000);
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__isAdmin {
        font-weight: 400;
        color: --color(--qui-FC-AAA);
        white-space: nowrap;
      }

      &__isAdminColor {
        padding: 2rpx 10rpx;
        margin-left: 15rpx;
        font-size: $fg-f1;
        background: --color(--qui-BG-IT);
        border-radius: 18rpx;
        box-sizing: border-box;
      }

      &__time {
        font-size: $fg-f2;
        font-weight: 400;
        line-height: 31rpx;
        color: --color(--qui-FC-AAA);
      }
    }
    &__opera {
      align-self: flex-start;
      width: 100rpx;
      margin-left: 29rpx;
      text-align: right;
      flex-shrink: 0;

      .marginLf {
        margin-right: 6rpx;
      }

      .essence {
        display: inline-block;
        width: 35rpx;
        height: 45rpx;
        margin-bottom: 10rpx;
        vertical-align: top;
      }
      .addAsk {
        position: absolute;
        top: 40rpx;
        left: 590rpx;
        width: 60rpx;
        height: 60rpx;
      }
    }
  }
}
.attachment-name {
  max-width: 100%;
  overflow: hidden;
  font-size: $fg-f2;
  line-height: 31rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.det-hd-operaCli {
  position: relative;
  z-index: 10;
  font-size: $fg-f4;
  line-height: 40rpx;
  .det-hd-management {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: $fg-f4;
    line-height: 1;
    .icon-management {
      margin-right: 7rpx;
      font-size: $fg-f3;
    }
  }
}
.theme__mark {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
}
.theme__mark__open {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: 80rpx;
  height: 80rpx;
  margin-top: -40rpx;
  margin-left: -40rpx;
}
.theme__content__videocover {
  position: relative;
}
.cont-box {
  width: 600rpx;
  height: 400rpx;
  background: brown;
}
.themeItem__ask {
  display: inline-block;
  width: 112.5rpx;
  padding-top: 6rpx;
  border-top: solid 4rpx --color(--qui-BG-777);
}
.themeItem__value {
  display: inline-block;
  width: 364rpx;
  padding: 0 19rpx 60rpx;
  font-size: $fg-f2;
  color: --color(--qui-FC-777);
  &__text {
    color: --color(--qui-RED);
  }
}
.themeItem__btn {
  padding-left: 60rpx;
}
.themeItem__answer {
  width: 616rpx;
  height: 82rpx;
  font-size: $fg-f3;
  color: --color(--qui-FC-333);
}
.theme__put {
  width: 670rpx;
  height: 271rpx;
  text-align: center;
  background: --color(--qui-BG-F7);
  &__ask {
    padding: 30rpx 0;
    font-size: $fg-f3;
    color: --color(--qui-FC-AAA);
    &__user {
      display: inline;
    }
  }
}
</style>
