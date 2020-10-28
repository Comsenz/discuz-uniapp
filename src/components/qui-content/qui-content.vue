<template>
  <view ref="themeCount" class="themeCount" v-if="!isDeleted">
    <image
      class="addFine"
      src="@/static/essence.png"
      alt
      v-if="themeEssence && themeType == '1'"
      lazy-load
    ></image>
    <image class="addAsk" src="@/static/yihuida.svg" alt lazy-load v-if="addAsk === 1"></image>
    <view class="themeItem" @click="backgroundClick">
      <view class="themeItem__header">
        <view class="themeItem__header__img">
          <view @click="headClick" @click.stop="">
            <qui-avatar
              v-if="addAsk !== 1"
              :user="{ avatarUrl: themeImage, username: userName }"
              :is-real="isReal"
            />
          </view>
          <view @click="headAnswerClick" @click.stop="">
            <qui-avatar
              v-if="addAsk === 1"
              :user="{ avatarUrl: answerImage, username: beAskName }"
              :is-real="isReal"
            />
          </view>
        </view>
        <view class="themeItem__header__title">
          <view class="themeItem__header__title__top">
            <text class="themeItem__header__title__username" v-if="addAsk !== 1">
              {{ userName }}
            </text>
            <text class="themeItem__header__title__username" v-if="addAsk === 1">
              {{ beAskName }}
            </text>
            <view v-if="isAdmin && themeType == '1'" class="themeItem__header__title__isAdmin">
              <view v-if="addAsk !== 1">
                <text
                  v-for="(item, index) in userGroups"
                  :key="index"
                  :class="item.isDisplay ? 'themeItem__header__title__isAdminColor' : ''"
                >
                  {{ item.isDisplay ? `${item.name}` : '' }}
                </text>
              </view>
              <view v-if="addAsk === 1">
                <text
                  v-for="(item, index) in userAnswerGroups"
                  :key="index"
                  :class="item.isDisplay ? 'themeItem__header__title__isAdminColor' : ''"
                >
                  {{ item.isDisplay ? `${item.name}` : '' }}
                </text>
              </view>
            </view>
            <text v-if="themeType !== '1'" class="themeItem__header__title__isAdmin">
              <!-- {{ themeType === '2' ? '回复了我' : '@了我' }} -->
              {{ themeStatus }}
            </text>
            <view v-if="themeType !== '1'" class="themeItem__header__title__jumpBtn"></view>
            <view class="themeItem__header__title__reward">{{ themeReward }}</view>
          </view>
          <!-- 时间 -->
          <!-- <view class="themeItem__header__title__time" v-if="addAsk !== 1">
            {{ localTime }}
          </view> -->
          <!-- 提问 -->
          <view class="themeItem__header__title__time" v-if="addAsk !== 1">
            {{ localTime }}
            <view class="themeItem_put" v-if="threadType === 5">{{ i18n.t('home.to') }}</view>
            <view class="themeItem_to" v-if="threadType === 5" @click.stop="" @click="beAskClick">
              @{{ beAskName }}
            </view>
            <view class="themeItem_ask" v-if="threadType === 5">
              {{ i18n.t('home.putQuestions') }} :
            </view>
          </view>
          <!-- 回答 -->
          <view class="themeItem__header__title__time" v-if="addAsk === 1">
            {{ localTimeAnswer }}
            <view class="themeItem_put">{{ i18n.t('home.beAnswer') }}</view>
            <view class="themeItem_to" @click.stop="" @click="answeClick">
              @{{ questionsName }}
            </view>
            <view class="themeItem_ask">{{ i18n.t('home.problem') }} :</view>
          </view>
        </view>
      </view>

      <view class="themeItem__content" @click.stop="" @click="contentClick">
        <view
          class="themeItem__content__text"
          :style="{ paddingBottom: threadType === 1 ? '24rpx' : '10rpx' }"
        >
          <view
            class="themeItem__content__text__longessay"
            v-if="threadType === 1 && themeType !== '5'"
          >
            <view class="themeItem__content__text__longessay__publish">
              {{ i18n.t('home.released') }} :
            </view>
            <qui-icon
              name="icon-fufei"
              color="#aaaaaa"
              size="30"
              style="padding-left: 10rpx;"
              v-if="themPayBtn"
            ></qui-icon>
            <navigator class="navPost">
              {{ themeContent }}
            </navigator>
          </view>

          <view class="themeItem__QA" v-if="threadType === 5 && themeType === '5'">
            <view class="themeItem_questions">
              {{ questionsName }}
            </view>
            <view class="themeItem_put">{{ i18n.t('home.beAnswer') }}</view>
            <view class="themeItem_to">{{ beAskName }}</view>
            <view class="themeItem_ask">{{ i18n.t('home.problem') }} ,</view>
          </view>
          <!-- <view class="themeItem__QA" v-if="threadType === 5 && themeType !== '5' && addAsk === 0"> -->
          <!-- <view class="themeItem_questions">@{{ questionsName }}</view> -->
          <!-- <view class="themeItem_put">{{ i18n.t('home.to') }}</view>
            <view class="themeItem_to">@{{ beAskName }}</view>
            <view class="themeItem_ask">{{ i18n.t('home.putQuestions') }} :</view> -->
          <!-- <qui-uparse :content="questionContent"></qui-uparse> -->
          <!-- <navigator class="navPost">
              {{ questionContent }}
            </navigator> -->
          <!-- </view> -->
          <view :class="themPayBtn || threadType === 6 ? 'themeItem__content__uparse' : ''">
            <qui-icon
              name="icon-fufei"
              color="#aaaaaa"
              size="30"
              v-if="themPayBtn && threadType !== 1"
              class="themeItem__content__fufei"
            ></qui-icon>
            <qui-icon
              name="icon-shangpin-1"
              color="#aaaaaa"
              size="30"
              class="themeItem__content__fufei"
              v-if="threadType === 6"
            ></qui-icon>
            <qui-uparse
              :content="themeContent"
              class="themeItem__content__wxParse"
              v-if="threadType !== 1"
            ></qui-uparse>
          </view>
        </view>
        <view
          class="themeItem__content__good"
          v-if="Object.keys(postGoods).length !== 0 && threadType === 6"
        >
          <view>
            <image class="themeItem__content__good__image" lazy-load :src="postGoods.image_path" />
          </view>
          <view class="themeItem__content__good__info">
            <view class="themeItem__content__good__title">
              {{ postGoods.title }}
            </view>
            <view class="themeItem__content__good__ft">
              <view class="themeItem__content__good__price">￥{{ postGoods.price }}元</view>
            </view>
          </view>
        </view>
        <view
          class="theme__content__videocover"
          v-if="threadType == 2 && !payStatus && coverImage != null"
        >
          <view class="theme__mark"></view>
          <image
            class="theme__mark__open"
            :style="{ marginLeft: videoWidth > videoHeight ? '-40rpx' : '-200rpx' }"
            src="/static/video.svg"
          ></image>
          <image
            class="themeItem__content__coverimg"
            :src="coverImage"
            :style="{ width: videoWidth > videoHeight ? '100%' : '50%' }"
            :mode="videoWidth > videoHeight ? 'widthFix' : 'aspectFill'"
            lazy-load
          ></image>
        </view>
        <view
          class="theme__content__videocover"
          v-if="threadType === 2 && payStatus && themeType !== '5'"
        >
          <!-- 封面图 -->
          <view class="theme__content__videocover-img" v-if="threadType === 2 && payStatus && sun">
            <image
              class="theme__mark__open"
              :style="{ marginLeft: videoWidth > videoHeight ? '-40rpx' : '-200rpx' }"
              src="/static/video.svg"
              @click.stop="btn"
            ></image>
            <image
              class="themeItem__content__coverimg"
              :src="coverImage"
              :style="{ width: videoWidth > videoHeight ? '100%' : '50%' }"
              :mode="videoWidth > videoHeight ? 'widthFix' : 'aspectFill'"
              lazy-load
            ></image>
          </view>
          <!-- 视频 -->
          <view class="themeItem__content__covervideo">
            <view v-if="isWeixin">
              <video
                v-show="videoShow"
                :poster="coverImage"
                controls
                :duration="duration"
                :src="mediaUrl"
                :id="'myVideo' + currentindex"
                :ref="'myVideo' + currentindex"
                :show-fullscreen-btn="true"
                :show-play-btn="true"
                :autoplay="autoplay"
                :vslide-gesture-in-fullscreen="false"
                object-fit="contain"
                :direction="videoWidth > videoHeight ? 90 : 0"
                :style="{
                  width: videoWidth > videoHeight ? '100%' : '50%',
                }"
                @play="playVideo"
                @fullscreenchange="fullscreenchanges"
                @click.stop=""
              ></video>
            </view>
            <view v-if="!isWeixin">
              <video
                v-show="videoShow"
                :poster="coverImage"
                controls
                ref="myVideo"
                :id="'myVideo' + currentindex"
                class="isVideo"
                :duration="duration"
                preload="none"
                bindpause="handlepause"
                playsinline
                webkit-playsinline
                x5-playsinline
                :page-gesture="false"
                :show-fullscreen-btn="true"
                :show-play-btn="true"
                :autoplay="autoplay"
                auto-pause-if-open-native
                auto-pause-if-navigate
                :enable-play-gesture="false"
                :vslide-gesture="false"
                :vslide-gesture-in-fullscreen="false"
                object-fit="contain"
                :direction="videoWidth > videoHeight ? 90 : 0"
                x5-video-player-type="h5-page"
                :src="mediaUrl"
                :style="{
                  width: videoWidth > videoHeight ? '100%' : '50%',
                }"
                bindfullscreenchange="fullScreen"
                bindended="closeVideo"
                @play="playVideo"
                @fullscreenchange="fullscreenchanges"
                @click.stop=""
              ></video>
            </view>
          </view>
        </view>
        <view v-if="threadType === 4 && payStatus" @click.stop="">
          <qui-audio-cell
            :src="threadAudio.media_url"
            :name="threadAudio.file_name"
            :audio-id="threadAudio.file_id"
            :ref="'audio' + threadAudio.file_id"
            v-show="threadAudio.media_url"
            @audioPlayer="audioPlayer"
            :is-delete="false"
          ></qui-audio-cell>
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
              @click.stop=""
              lazy-load
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
              @click.stop=""
              lazy-load
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
              @click.stop=""
              lazy-load
              alt
            ></image>
            <view
              class="themeItem__content__imgmore__item"
              v-if="imagesList.length % 3 != 0"
              @click.stop=""
              lazy-load
            ></view>
          </view>
        </view>

        <!-- <view class="themeItem__content__tags" v-if="themeType === '1' && getCategoryId === 0">
          <view class="themeItem__content__tags__item" v-for="(item, index) in tags" :key="index">
            {{ item.name }}
          </view>
        </view> -->
        <view
          class="themeItem__content__tags  themeItem__content__tags--position"
          v-if="threadPosition.length > 0"
        >
          <view class="themeItem__content__tags__item" @click="topicPosition" @click.stop="">
            <qui-icon name="icon-weizhi" size="30" color="#777"></qui-icon>
            <text class="themeItem__content__tags__item-text">
              {{ threadPosition.length > 0 && threadPosition[0] }}
            </text>
          </view>
        </view>
      </view>

      <view class="themeItem__comment" @click.stop=""></view>

      <view class="themeItem__footer" @click.stop="">
        <view v-if="themeType === '1' || themeType === '5'" class="themeItem__footer__themeType1">
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
import { time2DateAndHM } from '@/utils/time';
import { mapState } from 'vuex';
// #ifdef H5
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  // #ifdef H5
  mixins: [appCommonH],
  // #endif
  props: {
    themeType: {
      validator: value => {
        // 1 首页  2 回复  3 @  4 我的收藏 5 我的回答
        return ['1', '2', '3', '4', '5'].indexOf(value) !== -1;
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
      type: [String, Boolean],
      default: '',
    },
    // 头像实名认证加v
    isReal: {
      type: Boolean,
      default: false,
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
      type: [String, Boolean],
      default: '',
    },
    // 回复的图标
    themeReplyBtn: {
      type: [String, Boolean],
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
    // 已回答用户组
    userAnswerGroups: {
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
    // 提问用户名称
    questionsName: {
      type: String,
      default: '',
    },
    // 被提问用户名称
    beAskName: {
      type: String,
      default: '',
    },
    // 提问内容
    questionContent: {
      type: String,
      default: '',
    },
    // 显示付费提问
    paidQuestions: {
      type: Boolean,
      default: false,
    },
    // 已回答提问
    answered: {
      type: Boolean,
      default: false,
    },
    // 已回答图标显示
    addAsk: {
      type: Number,
      default: 0,
    },
    // 围观总人数
    onlookerNumber: {
      type: Number,
      default: 0,
    },
    // 免费的提问
    freeAsk: {
      type: Boolean,
      default: false,
    },
    // 问题价值
    askPrice: {
      type: String,
      default: '',
    },
    // 回答问题的内容
    askContent: {
      type: String,
      default: '',
    },
    // 围观单价
    onlookerUnitPrice: {
      type: String,
      default: '',
    },
    // 是否显示围观单价
    onLooker: {
      type: Boolean,
      default: false,
    },
    // 内容区域图片
    imagesList: {
      type: [Array, Object],
      default: () => {
        return [];
      },
    },
    // 商品
    postGoods: {
      type: [Object, String],
      default: () => {
        return {};
      },
    },
    // 时间
    themeTime: {
      type: String,
      default: '',
    },
    // 已回答的时间
    themeTimeAnswer: {
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
      type: [Number, String],
      default: 0,
    },
    currentindex: {
      type: Number,
      default: 0,
    },
    // 视频显示缩略图
    coverImage: {
      type: String,
      default: '',
    },
    // 是否支付
    payStatus: {
      type: Boolean,
      default: true,
    },
    // 是否删除
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // 滚动高度
    // scrollTop: {
    //   type: Number,
    //   default: 0,
    // },
    // 视频时间
    duration: {
      type: String,
      default: '',
    },
    // 内容是否付费
    themPayBtn: {
      type: Boolean,
      default: false,
    },
    threadPosition: {
      type: Array,
      default: () => {
        return [];
      },
    },
    threadAudio: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 已回答人的头像
    answerImage: {
      type: [String, Boolean],
      default: '',
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
      categoryShow: true,
      imageStatus: true,
      currentTop: 0,
      currentBottom: 0,
      videoShow: false,
      autoplay: false,
      sun: true,
      appear: false,
      date: 1,
      blocKwidth: 224,
      isWeixin: false,
    };
  },
  computed: {
    // 语言包
    t() {
      return this.i18n.t('topic');
    },
    // 时间转化
    localTime() {
      return time2DateAndHM(this.themeTime ? this.themeTime : '');
    },
    localTimeAnswer() {
      return time2DateAndHM(this.themeTimeAnswer ? this.themeTimeAnswer : '');
    },
    ...mapState({
      getCategoryId: state => state.session.categoryId,
      getCategoryIndex: state => state.session.categoryIndex,
    }),
  },
  created() {
    // #ifdef  H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    // #endif
    this.videoContext = uni.createVideoContext(`myVideo${this.$props.currentindex}`, this);
  },
  mounted() {
    this.blocKwidth = (660 / this.videoWidth) * this.videoHeight;
  },
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
    // 点击用户名跳转个人主页
    answeClick(evt) {
      this.$emit('answeClick', evt);
    },
    // 点击
    beAskClick(evt) {
      this.$emit('beAskClick', evt);
    },
    // 点击头像跳转到个人主页
    headClick(evt) {
      this.$emit('headClick', evt);
    },
    // 已回答的用户点击头像跳转到个人主页
    headAnswerClick(evt) {
      this.$emit('headAnswerClick', evt);
    },
    // 点击整个区域, 优先级最低，如果覆盖有别的可点击区域，则此事件不会触发
    backgroundClick(evt) {
      this.$emit('backgroundClick', evt);
    },
    // 当开始/继续播放时触发play事件
    playVideo() {
      this.$emit('videoPlay', this.$props.currentindex, true);
    },
    // 视频不能同时播放
    pauseVideo() {
      this.videoContext.pause();
    },
    // 预览图片
    previewPicture(index) {
      if (this.threadType === 3 && !this.payStatus) {
        this.contentClick();
      } else {
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
      }
    },
    // 头像加载失败,显示默认头像
    imageError() {
      this.imageStatus = false;
    },
    // 地理位置
    topicPosition() {
      const { threadPosition } = this;
      uni.navigateTo({
        url: `/pages/topic/position?longitude=${threadPosition[2]}&latitude=${threadPosition[3]}`,
      });
    },
    btn() {
      this.$emit('scrollsetup');
      this.sun = false;
      this.videoShow = true;
      this.autoplay = true;
      setTimeout(() => {
        this.videoContext.play();
        this.videoContext.requestFullScreen();
      }, 200);
      setTimeout(() => {
        const sun = uni.createSelectorQuery().in(this);
        sun
          .select('.isVideo')
          .boundingClientRect(data => {
            this.$emit('scrollheight', data.top, this.$props.currentindex);
          })
          .exec();
      }, 100);
    },
    audioPlayer(id) {
      this.$refs[`audio${id}`].audioPause();
    },
    fullscreenchanges() {
      this.$emit('fullscreenchange');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.themeCount {
  position: relative;
  padding-top: 20rpx;
  .addFine {
    position: absolute;
    top: 16rpx;
    left: 679rpx;
    width: 36rpx;
    height: 42rpx;
  }
  .addAsk {
    position: absolute;
    top: 20rpx;
    right: 0rpx;
    width: 120rpx;
    height: 120rpx;
  }
}

.themeItem {
  padding: 30rpx;
  margin: 0;
  background: --color(--qui-BG-2);
  // border-radius: 6rpx;
  // box-shadow: 0rpx 4rpx 8rpx rgba(0, 0, 0, 0.05);
  border-top: solid 2rpx --color(--qui-BOR-ED);
  border-bottom: solid 2rpx --color(--qui-BOR-ED);
  box-sizing: border-box;
  &__header {
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
    width: auto;
    padding-bottom: 12rpx;
    box-sizing: border-box;
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
        display: flex;
        height: 37rpx;
        margin-left: 2rpx;
        font-family: $font-family;
        font-size: $fg-f4;
        line-height: 37rpx;
      }
      &__username {
        display: flex;
        max-width: 336rpx;
        overflow: hidden;
        font-weight: bold;
        line-height: 37rpx;
        color: --color(--qui-FC-333);
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: $switch-theme-time;
      }
      &__isAdmin {
        margin-left: 13rpx;
        font-weight: 400;
        color: --color(--qui-FC-AAA);
        transition: $switch-theme-time;
      }
      &__isAdminColor {
        padding: 2rpx 10rpx;
        font-size: $fg-f1;
        vertical-align: top;
        background: --color(--qui-BG-IT);
        border-radius: 18rpx;
        box-sizing: border-box;
      }
      &__time {
        max-width: 600rpx;
        padding-top: 10rpx;
        overflow: hidden;
        font-size: $fg-f2;
        font-weight: 400;
        line-height: 31rpx;
        color: --color(--qui-FC-AAA);
        text-overflow: ellipsis;
        // word-break: break-all;
        white-space: nowrap;
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
        font-size: $fg-f4;
        font-weight: bold;
        color: --color(--qui-RED);
      }
    }
  }
  &__content {
    &__good {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      padding: 20rpx;
      margin-bottom: 30rpx;
      font-size: $fg-f3;
      background: --color(--qui-BG-F6);
      border-radius: 2px;

      &__image {
        width: 160rpx;
        height: 160rpx;
        margin: 0 30rpx 0 0;
        border-radius: 5rpx;
      }

      &__info {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      &__title {
        max-height: 120rpx;
        overflow: hidden;
        font-weight: bold;
        line-height: 40rpx;
        color: --color(--qui-FC-333);
      }

      &__ft {
        position: absolute;
        bottom: 0;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        line-height: 45rpx;
        color: --color(--qui-FC-777);
      }

      &__price {
        display: inline-block;
        font-size: $fg-f5;
        color: --color(--qui-RED);
      }
    }

    &__text {
      min-height: 45rpx;
      padding-bottom: 20rpx;
      overflow: hidden;
      font-family: $font-family;
      font-size: $fg-f4;
      font-weight: 400;
      line-height: 45rpx;
      color: --color(--qui-FC-333);
      word-wrap: break-word;
      &__longessay {
        // display: flex;
        // flex-direction: column;
        // word-break: break-all;
      }
    }
    &__reply {
      width: 670rpx;
      height: 145rpx;
      background: --color(--qui-BOR-ED);
      border-radius: 7rpx;
    }
    &__imgone {
      display: flex;
      justify-content: flex-start;
      margin-top: 10rpx;
      margin-bottom: 30rpx;
      line-height: 0;
      &__item {
        max-width: 80%;
        max-height: 80%;
        border-radius: 5rpx;
      }
    }
    &__imgtwo {
      display: flex;
      justify-content: space-between;
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      line-height: 0;
      &__item {
        display: block;
        width: 49.3%;
        height: 211rpx;
        margin-bottom: 10rpx;
        background: #fff;
        border-radius: 5rpx;
      }
    }
    &__imgmore {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-content: flex-start;
      flex-wrap: wrap;
      margin-top: 30rpx;
      margin-bottom: 20rpx;
      line-height: 0;
      &__item {
        display: block;
        width: 32%;
        height: 211rpx;
        margin-right: 1.33%;
        margin-bottom: 10rpx;
        border-radius: 5rpx;
      }
    }
    &__tags {
      display: flex;
      flex-wrap: wrap;
      &__item {
        height: 50rpx;
        padding: 0 20rpx;
        margin: 0rpx 10rpx 8rpx 0;
        margin-bottom: 8rpx;
        font-family: $font-family;
        font-size: $fg-f2;
        font-weight: 400;
        line-height: 50rpx;
        color: rgba(119, 119, 119, 1);
        text-align: center;
        background: rgba(247, 247, 247, 1);
        border-radius: 6rpx;
      }
    }
    &__tags__item-text {
      margin-left: 10rpx;
    }
  }
  &__footer {
    &__themeType1 {
      display: flex;
      justify-content: space-between;
      margin-top: 60rpx;
      &__item {
        font-family: $font-family;
        font-size: $fg-f4;
        font-weight: 400;
        line-height: 37rpx;
        color: rgba(170, 170, 170, 1);
      }
      .qui-icon {
        margin-right: 15rpx;
      }
    }
    &__themeType2 {
      &__item {
        font-family: $font-family;
        font-size: $fg-f4;
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
  display: inline-block;
}
.navPost {
  display: inline;
  padding-left: 8rpx;
  // font-weight: 900;
  color: var(--qui-LINK);
}
.themeItem__content__coverimg {
  position: relative;
}
.theme__content__videocover {
  position: relative;
  margin-bottom: 20rpx;
  &-img {
    z-index: 1;
    width: 100%;
  }
}
/deep/ .uni-video-cover {
  z-index: 0;
}
.theme__mark__open {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 80rpx;
  height: 80rpx;
  margin-top: -40rpx;
  margin-left: -40rpx;
}
.theme__mark {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
}
.themeItem__QA,
.themeItem_put,
.themeItem_to,
.themeItem_ask,
.themeItem_questions,
.themeItem__header__title__questions,
.themeItem_watch,
.themItem_watch_num,
.themItem_watch_gather,
.themeItem_quemoney,
.themeItem_money,
.themeItem_all,
.themItem_watch_money {
  display: inline-block;
}
.themeItem_questions,
.themeItem_to {
  color: --color(--qui-LINK);
}
// .themeItem_to {
//   max-width: 250rpx;
//   overflow: hidden;
//   line-height: 31rpx;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }
.themeItem_put,
.themeItem_ask {
  margin: 0 8rpx;
}
.themeItem-put,
.themeItem__header__title__questions {
  margin: 0 4rpx;
}
.themeItem_askback {
  width: 690rpx;
  padding: 20rpx;
  margin-top: 20rpx;
  font-size: $fg-f4;
  color: var(--qui-FC-333);
  background-color: --color(--qui-BG-F7);
  border-radius: 5rpx;
}
.themItem_watch_num,
.themItem_watch_money {
  color: --color(--qui-RED);
}
.themeItem__content__uparse {
  position: relative;
}
/deep/ .themeItem__content__uparse .themeItem__content__wxParse {
  text-indent: 40rpx;
}
.themeItem__content__uparse .themeItem__content__fufei {
  position: absolute;
  top: -2rpx;
  color: #aaa;
}
</style>
