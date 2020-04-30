<template>
  <view class="themeItem">
    <view class="themeItem__header">
      <view class="themeItem__header__img">
        <image
          :src="
            avatarUrl != '' && avatarUrl != null
              ? avatarUrl
              : 'https://discuz.chat/static/images/noavatar.gif'
          "
          class="det-per-head"
          @click="personJump"
        ></image>
      </view>
      <view class="themeItem__header__title">
        <view class="themeItem__header__title__top">
          <span class="themeItem__header__title__username">{{ userName }}</span>
        </view>
        <view class="themeItem__header__title__time">{{ themeTime }}</view>
      </view>
      <view class="themeItem__header__opera" v-if="managementShow">
        <view class="det-hd-operaCli">
          <view class="det-hd-management" @click="selectClick">
            <qui-icon
              name="icon-management"
              class="icon-management"
              :style="{ color: selectActive }"
            ></qui-icon>
            <view :style="{ color: selectActive }">{{ t.management }}</view>
          </view>
          <qui-drop-down
            posival="absolute"
            :show="seleShow"
            :list="selectList"
            :top="60"
            :right="0"
            :width="180"
            @click="selectChoice"
          ></qui-drop-down>
        </view>
        <image src="@/assets/essence.png" class="essence"></image>
      </view>
    </view>

    <view class="themeItem__content">
      <view class="theme__content_title" v-if="themeType == 1 && themeTitle">{{ themeTitle }}</view>
      <view class="themeItem__content__text" v-if="themeContent">
        <rich-text :nodes="themeContent"></rich-text>
      </view>
      <view class="theme__content__videocover" v-if="!payStatus && coverImage">
        <image class="themeItem__content__coverimg" :src="coverImage" alt></image>
      </view>

      <view v-if="Object.keys(imagesList).length == 1">
        <view class="themeItem__content__imgone">
          <image
            class="themeItem__content__imgone__item"
            v-for="(image, index) in imagesList"
            :key="index"
            :mode="modeVal"
            :src="image.thumbUrl"
            alt
            @click="imageClick(image._jv.id)"
          ></image>
        </view>
      </view>
      <view v-if="Object.keys(imagesList).length == 2">
        <view class="themeItem__content__imgtwo">
          <image
            class="themeItem__content__imgtwo__item"
            v-for="(image, index) in imagesList"
            :key="index"
            :mode="modeVal"
            :src="image.thumbUrl"
            alt
            @click="imageClick(image._jv.id)"
          ></image>
        </view>
      </view>
      <view v-if="Object.keys(imagesList).length >= 3">
        <view class="themeItem__content__imgmore">
          <image
            class="themeItem__content__imgmore__item"
            v-for="(image, index) in imagesList"
            :key="index"
            :mode="modeVal"
            :src="image.thumbUrl"
            alt
            @click="imageClick(image._jv.id)"
          ></image>
          <image
            class="themeItem__content__imgmore__item"
            v-if="Object.keys(imagesList).length % 3 != 0"
          ></image>
        </view>
      </view>
      <view class="themeItem__content__tags" v-if="tags.length > 0">
        <view class="themeItem__content__tags__item" v-for="(tag, index) in tags" :key="index">
          {{ tag.name }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 类型
    themeParts: {
      validator: value => {
        // 0 主题  1 回复
        return ['0', '1'].indexOf(value) !== -1;
      },
      default: '0',
    },
    // 主题类型
    themeType: {
      validator: value => {
        // 0 文字  1 帖子  2 视频 3 图片
        return ['0', '1', '2', '3'].indexOf(value) !== -1;
      },
      default: '1',
    },
    // 是否支付
    payStatus: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: [Number, String],
      default: '',
    },
    // 发布主题的用户头像
    avatarUrl: {
      type: String,
      default: '',
    },
    // 发布主题的用户名
    userName: {
      type: String,
      default: '',
    },
    // 管理菜单
    selectList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 主题标题（当类型是帖子（1）时）
    themeTitle: {
      type: String,
      default: '',
    },
    // 发布内容
    themeContent: {
      type: String,
      default: '',
    },
    // 发布时间
    themeTime: {
      type: String,
      default: '',
    },
    managementShow: {
      type: Boolean,
      default: false,
    },
    // 主题图片
    imagesList: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 图片裁剪、缩放的模式
    modeVal: {
      type: String,
      default: 'center',
    },
    // 主题相关标签
    tags: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data: () => {
    return {
      seleShow: false, // 默认收起管理菜单
      selectActive: '',
    };
  },
  onLoad() {
    console.log(this.tags);
  },
  computed: {
    t() {
      return this.i18n.t('topic');
    },
  },
  methods: {
    // 管理菜单点击事件
    selectClick() {
      this.seleShow = !this.seleShow;
      this.selectActive = this.seleShow ? '#1878F3' : '#333333';
    },
    // 管理菜单选中事件
    selectChoice(param) {
      console.log(param, '类型22222');
      this.$emit('selectChoice', param);
      this.seleShow = false;
    },
    // 点击用户头像以及用户名事件
    personJump() {
      this.$emit('personJume', this.userId);
    },
    // 点击图片事件(默认参数图片id)
    imageClick(imageId) {
      this.$emit('imageClick', imageId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.themeItem {
  width: 100%;

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
      margin-right: 18rpx;
      background: #ccc;
      border-radius: 100%;
      image {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }

    &__title {
      width: 400rpx;
      padding-left: 20rpx;

      &__top {
        height: 37rpx;
        margin-left: 2rpx;
        font-family: $font-family;
        font-size: 28rpx;
        line-height: 37rpx;
      }

      &__username {
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }

      &__isAdmin {
        font-weight: 400;
        color: rgba(170, 170, 170, 1);
      }

      &__time {
        font-size: 24rpx;
        font-weight: 400;
        line-height: 31rpx;
        color: rgba(170, 170, 170, 1);
      }
    }
    &__opera {
      align-self: flex-end;
      flex: 1;
      text-align: right;
      flex-shrink: 0;

      .essence {
        display: inline-block;
        width: 49rpx;
        height: 60rpx;
      }
    }
  }

  &__content {
    padding: 0 40rpx;
    &__text {
      margin-bottom: 12rpx;
      font-family: $font-family;
      font-size: 28rpx;
      font-weight: 400;
      line-height: 45rpx;
      color: rgba(51, 51, 51, 1);
    }

    &__imgone {
      display: flex;
      justify-content: flex-start;
      margin-top: 30rpx;
      line-height: 0;
      &__item {
        max-width: 100%;
        max-height: 100%;
        border-radius: 100%;
      }
    }
    &__imgtwo {
      display: flex;
      justify-content: space-between;
      margin-top: 30rpx;
      line-height: 0;
      &__item {
        display: block;
        width: 48%;
        height: 211rpx;
        margin-bottom: 20rpx;
        background: #fff;
      }
    }
    &__imgmore {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-content: flex-start;
      flex-wrap: wrap;
      margin-top: 30rpx;
      line-height: 0;
      &__item {
        display: block;
        width: 30%;
        height: 211rpx;
        margin-right: 3.33%;
        margin-bottom: 20rpx;
        background: #fff;
      }
    }
    &__tags {
      display: flex;
      flex-wrap: wrap;

      &__item {
        height: 50rpx;
        padding: 0 20rpx;
        margin-right: 10rpx;
        margin-bottom: 8rpx;
        font-family: $font-family;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 50rpx;
        color: rgba(119, 119, 119, 1);
        text-align: center;
        background: rgba(247, 247, 247, 1);
        border-radius: 6rpx;
      }
    }
  }

  &__footer {
    &__themeType1 {
      display: flex;
      justify-content: space-between;
      margin-top: 60rpx;

      &__item {
        font-family: $font-family;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 37rpx;
        color: rgba(170, 170, 170, 1);
      }

      text {
        margin-right: 15rpx;
      }

      &__greated {
        color: rgba(221, 221, 221, 1);
      }
    }

    &__themeType2 {
      &__item {
        font-family: $font-family;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 37rpx;
        color: rgba(170, 170, 170, 1);
        text-align: right;
      }
      text {
        margin-right: 15rpx;
      }
    }
  }
}
.det-hd-operaCli {
  position: relative;
  z-index: 10;
  font-size: $fg-f28;
  line-height: 40rpx;
  .det-hd-management {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .icon-management {
      margin-right: 7rpx;
      font-size: 26rpx;
    }
  }
}
.qq-emotion {
  display: inline-block;
  width: 28rpx;
  height: 28rpx;
}
</style>
