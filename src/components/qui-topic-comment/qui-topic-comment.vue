<template>
  <view class="themeCount">
    <view class="themeItem">
      <view class="themeItem__header">
        <view class="themeItem__header__img">
          <image
            :src="
              commentAvatarUrl != '' && commentAvatarUrl != null
                ? commentAvatarUrl
                : 'https://discuz.chat/static/images/noavatar.gif'
            "
            class="det-per-head"
            @click="personJump"
          ></image>
        </view>
        <view class="themeItem__header__title">
          <view class="themeItem__header__title__top">
            <span class="themeItem__header__title__username">{{ userName }}</span>

            <span class="themeItem__header__title__isAdmin">
              {{ userRole }}
            </span>
            <view class="themeItem__header__title__jumpBtn">></view>
          </view>
          <view class="themeItem__header__title__time">{{ commentTime }}</view>
        </view>
      </view>

      <view class="themeItem__content">
        <view class="themeItem__content__text" @click="commentJump">
          <rich-text :nodes="commentContent"></rich-text>
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
      </view>

      <view class="themeItem__comment"></view>

      <view class="themeItem__footer">
        <view class="themeItem__footer__themeType2">
          <view class="themeItem__footer__themeType2__item" @click="deleteComment">
            <qui-icon
              class="text"
              name="icon-delete"
              size="18"
              color="#AAA"
              @click="handleClick"
            ></qui-icon>
            {{ t.delete }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 回复的用户头像
    commentAvatarUrl: {
      type: String,
      default: '',
    },
    // 回复的id
    postId: {
      type: [Number, String],
      default: '',
    },
    // 回复的用户名
    userName: {
      type: String,
      default: '',
    },
    // 回复的用户的角色
    userRole: {
      type: String,
      default: '',
    },
    // 回复的内容
    commentContent: {
      type: String,
      default: '',
    },
    // 回复的时间
    commentTime: {
      type: String,
      default: '',
    },
    // 回复的图片
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
    // 回复的点赞数
    commentLikeCount: {
      type: [Number, String],
      default: '0',
    },
  },
  data: () => {
    return {
      isAdmin: true,
      isGreat: false,
    };
  },
  computed: {
    t() {
      return this.i18n.t('topic');
    },
  },
  methods: {
    // 点击内容事件
    commentJump() {
      this.$emit('commentJump');
    },
    // 点击头像以及用户名事件
    personJump() {
      this.$emit('personJump');
    },
    // 删除事件
    deleteComment() {
      this.$emit('deleteComment');
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
.themeCount {
  position: relative;
  .addFine {
    position: absolute;
    top: -10rpx;
    left: 679rpx;
    width: 31rpx;
    height: 41rpx;
  }
}
.themeItem {
  width: 100%;
  padding: 30rpx 0;

  &__header {
    display: flex;
    width: 100%;
    height: 80rpx;
    margin-bottom: 12rpx;

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
      flex: 1;

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

      &__jumpBtn {
        float: right;
        width: 10rpx;
        height: 37rpx;
        font-size: 10rpx;
        line-height: 37rpx;
        color: #ddd;
      }
    }
  }

  &__content {
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
</style>
