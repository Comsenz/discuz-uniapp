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
            :src="themeImage != '' && themeImage != null ? themeImage : '/static/noavatar.gif'"
            alt
            @click="headClick"
          ></image>
        </view>
        <view class="themeItem__header__title">
          <view class="themeItem__header__title__top">
            <text class="themeItem__header__title__username" @click="headClick">
              {{ userName }}
            </text>
            <text v-if="isAdmin && themeType == '1'" class="themeItem__header__title__isAdmin">
              <text v-for="(item, index) in userGroups" :key="index">
                {{ item.isDisplay ? `(${item.name})` : '' }}
              </text>
            </text>
            <text v-if="themeType !== '1'" class="themeItem__header__title__isAdmin">
              <!-- {{ themeType === '2' ? '回复了我' : '@了我' }} -->
              {{ themeStatus }}
            </text>
            <view v-if="themeType !== '1'" class="themeItem__header__title__jumpBtn"></view>
            <qui-icon
              class="themeItem__header__title__deleteBtn"
              :name="themeBtn"
              size="28"
              color="#AAA"
              @click="deleteClick"
            ></qui-icon>
            <view class="themeItem__header__title__reward">{{ themeReward }}</view>
          </view>
          <view class="themeItem__header__title__time">{{ localTime }}</view>
        </view>
      </view>

      <view class="themeItem__content">
        <view class="themeItem__content__text" @click="contentClick()">
          <view class="themeItem__content__text__longessay" v-if="threadType === 1">
            <view class="themeItem__content__text__longessay__publish">
              {{ i18n.t('home.released') }} :
            </view>
            <qui-icon
              name="icon-link"
              color="#00479B"
              size="28"
              style="padding-left: 8rpx;"
            ></qui-icon>
            <navigator class="navPost">
              {{ themeContent }}
            </navigator>
          </view>
          <rich-text :nodes="themeContent" v-else></rich-text>
        </view>
        <view class="content__video" @click="videoClick">
          <video
            v-if="threadType === 2"
            :id="'myvideo' + currentindex"
            preload="auto"
            bindpause="handlepause"
            playsinline
            webkit-playsinline
            x5-playsinline
            :page-gesture="false"
            show-fullscreen-btn="true"
            show-play-btn="true"
            auto-pause-if-open-native="true"
            auto-pause-if-navigate="true"
            enable-play-gesture="false"
            :vslide-gesture="false"
            :vslide-gesture-in-fullscreen="false"
            object-fit="cover"
            direction="90"
            x5-video-player-type="h5-page"
            :src="mediaUrl"
            :style="videoWidth >= videoHeight ? 'width:100%' : 'max-width: 50%'"
            bindfullscreenchange="fullScreen"
            bindended="closeVideo"
          ></video>
        </view>
        <view v-if="imagesList.length == 1">
          <view class="themeItem__content__imgone">
            <image
              class="themeItem__content__imgone__item"
              v-for="(image, index) in imagesList"
              :key="index"
              :mode="modeVal"
              :src="image.thumbUrl"
              @click="previewPicture(index)"
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
              :mode="modeVal"
              :src="image.thumbUrl"
              @click="previewPicture(index)"
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
              :mode="modeVal"
              :src="image.thumbUrl"
              @click="previewPicture(index)"
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
            {{ item.name }}
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
            <qui-icon class="qui-icon" name="icon-liked" size="28" v-if="isGreat"></qui-icon>
            <qui-icon class="qui-icon" name="icon-like" size="28" v-else></qui-icon>
            {{ isGreat ? t.giveLikeAlready : t.like }}
            {{ themeLike === 0 ? '' : themeLike }}
          </view>

          <view
            class="themeItem__footer__themeType1__item themeItem__footer__themeType1__comment"
            @click="commentClick"
          >
            {{ t.comment }}
            {{ themeComment === 0 ? '' : themeComment }}
          </view>

          <view
            class="themeItem__footer__themeType1__item themeItem__footer__themeType1__share"
            @click="handleClickShare"
          >
            <qui-icon class="qui-icon" name="icon-share" size="28" color="#AAA"></qui-icon>
            {{ t.share }}
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
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  props: {
    themeType: {
      validator: value => {
        // 1 首页  2 回复  3 @  4 我的收藏
        return ['1', '2', '3'].indexOf(value) !== -1;
      },
      default: '1',
    },
    // 用户名
    userName: {
      type: String,
      default: '',
    },
    // 用户头像
    themeImage: {
      type: String,
      default: '',
    },
    // 是否加精
    themeEssence: {
      type: Boolean,
      default: true,
    },
    // 帖子状态（回复了我，@了我）
    themeStatus: {
      type: String,
      default: '',
    },
    // icon图标
    themeBtn: {
      type: String,
      default: '',
    },
    // 回复的图标
    themeReplyBtn: {
      type: String,
      default: '',
    },
    // 删除的图标
    themeDeleteBtn: {
      type: String,
      default: '',
    },
    // 大赏的图标
    themeReward: {
      type: String,
      default: '',
    },
    // 用户组
    userGroups: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 内容
    themeContent: {
      type: String,
      default: '',
    },
    // 内容类型：0 文字 1 帖子 2 视频 3 图片
    threadType: {
      type: Number,
      default: 0,
    },
    // 内容区域图片
    imagesList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 时间
    themeTime: {
      type: String,
      default: '',
    },
    // 点赞数量
    themeLike: {
      type: Number,
      default: 0,
    },
    // 评论数量
    themeComment: {
      type: Number,
      default: 0,
    },
    // 标签
    tagName: {
      type: String,
      default: '',
    },
    // 标签组
    tags: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 是否点赞 (赞，已赞)
    isGreat: {
      type: Boolean,
      default: false,
    },
    // 图片裁剪、缩放的模式
    modeVal: {
      type: String,
      default: 'aspectFill',
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    threadVideo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    videoWidth: {
      type: Number,
      default: 0,
    },
    videoHeight: {
      type: Number,
      default: 0,
    },
    videoId: {
      type: Number,
      default: 0,
    },
    currentindex: {
      type: Number,
      default: 0,
    },
  },
  data: () => {
    return {
      isAdmin: true,
      // threadVideo: '',
      threadWidth: '',
      threadHeight: '',
      videoContext: null, // 用于记录当前播放的视频的索引值
      // isGreat: false,
      preid: 0,
      currentid: 0,
    };
  },
  computed: {
    // 语言包
    t() {
      return this.i18n.t('topic');
    },
    // 时间转化
    localTime() {
      return time2MorningOrAfternoon(this.themeTime);
    },
  },
  mounted() {
    this.videoContext = wx.createVideoContext(`myvideo${this.$props.currentindex}`, this);
    // console.log(this.videoContext, 'inshow')
  },
  // onShow() {
  //   this.videoContext = wx.createVideoContext('myvideo', this);
  //   this.videoContext.requestFullScreen({ direction: 90 });
  // },
  methods: {
    // 点击删除按钮
    deleteClick(evt) {
      this.$emit('deleteClick', evt);
    },
    // 分享按钮点击事件
    handleClickShare(evt) {
      this.$emit('click', evt);
    },
    // 点赞按钮点击事件
    handleIsGreat(evt) {
      this.$emit('handleIsGreat', evt);
    },
    // 点击评论跳转到详情页
    commentClick(evt) {
      this.$emit('commentClick', evt);
    },
    // 点击内容区域跳转到详情页
    contentClick(evt) {
      this.$emit('contentClick', evt);
    },
    // 点击头像跳转到个人主页
    headClick(evt) {
      this.$emit('headClick', evt);
    },
    // 预览图片
    previewPicture(index) {
      const _this = this;
      const preview = [];
      for (let i = 0, len = _this.imagesList.length; i < len; i += 1) {
        preview.push(_this.imagesList[i].url);
      }
      uni.previewImage({
        current: index,
        urls: preview,
        indicator: 'number',
      });
    },
    // 视频的view点击事件
    videoClick() {
      const curIdx = this.$props.currentindex;
      this.$emit('videoPlay', curIdx);
    },
    // 视频不能同时播放
    pauseVideo() {
      this.videoContext.pause();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.themeCount {
  position: relative;
  box-shadow: 0rpx 4rpx 8rpx rgba(0, 0, 0, 0.05);
  .addFine {
    position: absolute;
    top: -10rpx;
    left: 679rpx;
    width: 36rpx;
    height: 42rpx;
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
      // background: #ccc;
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
        font-size: $fg-f28;
        line-height: 37rpx;
      }

      &__username {
        font-weight: bold;
        line-height: 37rpx;
        color: --color(--qui-FC-333);
        transition: $switch-theme-time;
      }

      &__isAdmin {
        margin-left: 13rpx;
        font-weight: 400;
        color: --color(--qui-FC-AAA);
        transition: $switch-theme-time;
      }

      &__time {
        padding-top: 10rpx;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 31rpx;
        color: --color(--qui-FC-AAA);
        transition: $switch-theme-time;
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
        font-size: $fg-f28;
        font-weight: bold;
        color: --color(--qui-RED);
      }
    }
  }

  &__content {
    &__text {
      margin-bottom: 12rpx;
      overflow: hidden;
      font-family: $font-family;
      font-size: $fg-f28;
      font-weight: 400;
      line-height: 45rpx;
      color: --color(--qui-FC-333);
      word-wrap: break-word;
      &__longessay {
        word-break: break-all;
      }
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
        max-width: 80%;
        max-height: 80%;
        // border-radius: 100%;
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
        margin: 20rpx 10rpx 8rpx 0;
        margin-bottom: 8rpx;
        font-family: $font-family;
        font-size: $fg-f24;
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
        font-size: $fg-f28;
        font-weight: 400;
        line-height: 37rpx;
        color: rgba(170, 170, 170, 1);
      }

      .qui-icon {
        margin-right: 15rpx;
      }

      // &__greated {
      //   // color: rgba(221, 221, 221, 1);
      // }
    }

    &__themeType2 {
      &__item {
        font-family: $font-family;
        font-size: $fg-f28;
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
.themeItem__content__text__longessay__publish {
  display: inline;
}
.navPost {
  display: inline;
  padding-left: 8rpx;
  color: #00479b;
}
// .content__video {

// }
</style>
