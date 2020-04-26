<template>
  <view class="themeCount">
    <image
      class="addFine"
      src="@/static/essence.png"
      alt
      v-if="themeEssence && themeType == '1'"
    ></image>
    <view class="themeItem">
      <view class="themeItem__header">
        <view class="themeItem__header__img">
          <image
            :src="
              themeImage != '' && themeImage != null
                ? themeImage
                : 'https://discuz.chat/static/images/noavatar.gif'
            "
            alt
          ></image>
        </view>
        <view class="themeItem__header__title">
          <view class="themeItem__header__title__top">
            <span class="themeItem__header__title__username">{{ userName }}</span>
            <span v-if="isAdmin && themeType == '1'" class="themeItem__header__title__isAdmin">
              {{ themeTypes }}
            </span>
            <span v-if="themeType !== '1'" class="themeItem__header__title__isAdmin">
              <!-- {{ themeType === '2' ? '回复了我' : '@了我' }} -->
              {{ themeStatus }}
            </span>
            <view v-if="themeType !== '1'" class="themeItem__header__title__jumpBtn"></view>
            <qui-icon
              class="themeItem__header__title__deleteBtn"
              :name="themeBtn"
              size="28"
              color="#AAA"
              @click="handleClick"
            ></qui-icon>
            <view class="themeItem__header__title__reward">{{ themeReward }}</view>
          </view>
          <view class="themeItem__header__title__time">{{ themeTime }}</view>
        </view>
      </view>

      <view class="themeItem__content">
        <view class="themeItem__content__text">
          <rich-text :nodes="themeContent"></rich-text>
        </view>
        <!-- <view class="themeItem__content__reply">223344</view> -->
        <!-- <view class="themeItem__content__img">
          <image class="themeItem__content__img__item" src="@/static/my.jpeg" alt></image>
          <image class="themeItem__content__img__item" src="@/static/me.jpeg" alt></image>
        </view> -->
        <view v-if="imagesList.length == 1">
          <view class="themeItem__content__imgone">
            <image
              class="themeItem__content__imgone__item"
              v-for="(image, index) in imagesList"
              :key="index"
              :src="image"
              alt
            ></image>
          </view>
        </view>
        <view v-if="imagesList.length == 2">
          <view class="themeItem__content__imgtwo">
            <image
              class="themeItem__content__imgtwo__item"
              v-for="(image, index) in imagesList"
              :key="index"
              :src="image"
              alt
            ></image>
          </view>
        </view>
        <view v-if="imagesList.length >= 3">
          <view class="themeItem__content__imgmore">
            <image
              class="themeItem__content__imgmore__item"
              v-for="(image, index) in imagesList"
              :key="index"
              :src="image"
              alt
            ></image>
            <image
              class="themeItem__content__imgmore__item"
              v-if="imagesList.length % 3 != 0"
            ></image>
          </view>
        </view>

        <view class="themeItem__content__tags" v-if="themeType === '1'">
          <view class="themeItem__content__tags__item" v-for="(item, index) in tags" :key="index">
            {{ item.tagName }}
          </view>
        </view>
      </view>

      <view class="themeItem__comment"></view>

      <view class="themeItem__footer">
        <view v-if="themeType === '1'" class="themeItem__footer__themeType1">
          <view
            :class="[
              'themeItem__footer__themeType1__item',
              'themeItem__footer__themeType1__great',
              isGreat && 'themeItem__footer__themeType1__greated',
            ]"
            @click="handleIsGreat"
          >
            <qui-icon class="qui-icon" name="icon-like" size="28"></qui-icon>
            {{ isGreat ? '已赞' : '赞' }}
            {{ themeLike }}
          </view>

          <view class="themeItem__footer__themeType1__item themeItem__footer__themeType1__comment">
            评论
            {{ themeComment }}
          </view>

          <view
            class="themeItem__footer__themeType1__item themeItem__footer__themeType1__share"
            @click="handleClickShare"
          >
            <qui-icon class="qui-icon" name="icon-share" size="28" color="#AAA"></qui-icon>
            分享
          </view>
        </view>

        <view v-if="themeType === '2'" class="themeItem__footer__themeType2">
          <view class="themeItem__footer__themeType2__item">
            <qui-icon
              class="qui-icon"
              :name="themeReplyBtn"
              size="28"
              color="#AAA"
              @click="handleClick"
            ></qui-icon>
            {{ themeDeleteBtn }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    themeType: {
      validator: value => {
        // 1 首页  2 回复  3 @  4 我的收藏
        return ['1', '2', '3'].indexOf(value) !== -1;
      },
      default: '1',
    },
    userName: {
      type: String,
      default: '',
    },
    themeImage: {
      type: String,
      default: '',
    },
    themeEssence: {
      type: Boolean,
      default: true,
    },
    themeStatus: {
      type: String,
      default: '',
    },
    themeBtn: {
      type: String,
      default: '',
    },
    themeReplyBtn: {
      type: String,
      default: '',
    },
    themeDeleteBtn: {
      type: String,
      default: '',
    },
    themeReward: {
      type: String,
      default: '',
    },
    themeTypes: {
      type: String,
      default: '',
    },
    themeContent: {
      type: String,
      default: '',
    },
    imagesList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    themeTime: {
      type: String,
      default: '',
    },
    themeLike: {
      type: Number,
      default: 0,
    },
    themeComment: {
      type: Number,
      default: 0,
    },
    tagName: {
      type: String,
      default: '',
    },
    tags: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isGreat: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      isAdmin: true,
      // isGreat: false,
    };
  },
  methods: {
    handleClick() {
      console.log('是分享哦');
    },
    // 分享按钮点击事件
    handleClickShare(evt) {
      this.$emit('click', evt);
    },
    // 点赞按钮点击事件
    handleIsGreat(evt) {
      this.$emit('handleIsGreat', evt);
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
  // width: 100%;
  padding: 30rpx;
  margin: 0 20rpx 30rpx;
  background: --color(--qui-BG-2);
  border-radius: 6rpx;
  box-sizing: border-box;

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
        margin-left: 13rpx;
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
      &__deleteBtn {
        float: right;
      }
      &__reward {
        float: right;
        font-size: 28rpx;
        font-weight: bold;
        color: --color(--qui-RED);
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
    &__reply {
      width: 670rpx;
      height: 145rpx;
      background: --color(--qui-BOR-ED);
      border-radius: 10rpx;
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

    // &__img {
    //   display: flex;
    //   justify-content: space-between;
    //   margin-top: 22rpx;
    //   line-height: 0;

    //   &__item {
    //     display: block;
    //     width: 48%;
    //     height: 211rpx;
    //     margin-bottom: 20rpx;
    //     background: #fff;
    //   }
    // }

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

      .qui-icon {
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
      .qui-icon {
        margin-right: 15rpx;
      }
    }
  }
}
</style>
