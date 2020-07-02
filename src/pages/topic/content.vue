<template>
  <qui-page :data-qui-theme="theme" class="pages-content">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('topic.topictitle')"></qui-header-back>
    <!-- #endif -->
    <qui-page-message v-if="!query.id"></qui-page-message>
    <view v-else>
      <view class="topic-content-header">
        <view class="topic-content-header_title">#{{ topic.content }}#</view>
        <navigator url="/pages/topic/list">
          <view class="topic-content-header_toAll">{{ i18n.t('topic.allTopics') }} ></view>
        </navigator>
        <view class="topic-content-header_details">
          <view class="details_title">
            {{ i18n.t('topic.hot') }}：
            <text>{{ topic.view_count }}</text>
          </view>
          <view class="details_title">
            {{ i18n.t('topic.contents') }}：
            <text>{{ topic.thread_count }}</text>
          </view>
          <view class="details_title">
            <qui-icon
              class="post-box__hd-l__icon"
              name="icon-share1"
              size="26"
              color="#777"
            ></qui-icon>
            <button open-type="share" plain="true" @click="triggerShare" class="shareBtn">
              {{ i18n.t('topic.share') }}
            </button>
            <view class="mask" v-if="shareShow" @click="triggerShare">
              <view class="wxShareTip">
                <img src="/static/sharePoint.png" alt class="sharePoint" />
                <img src="/static/shareKnow.png" alt class="shareKnow" />
              </view>
            </view>
          </view>
        </view>
      </view>
      <qui-thread-item
        :thread="item"
        v-for="(item, index) in topicData"
        :key="index"
        :currentindex="index"
        @toTopic="toTopic"
      ></qui-thread-item>
      <qui-load-more :status="loadingtype"></qui-load-more>
    </view>
  </qui-page>
</template>

<script>
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  mixins: [
    // #ifdef  H5
    wxshare,
    appCommonH,
    // #endif
  ],
  data() {
    return {
      shareShow: false,
      topicData: [],
      query: {},
      isGreat: false,
      editThreadId: '',
      pageNum: 1,
      pageSize: 20,
      loadingtype: 'more',
    };
  },
  computed: {
    topic() {
      if (this.query.id) {
        return this.$store.getters['jv/get'](`topics/${this.query.id}`);
      }
      return {};
    },
  },
  created() {
    // #ifdef  H5
    this.isWeixin = appCommonH.isWeixin().isWeixin;
    this.isPhone = appCommonH.isWeixin().isPhone;
    // #endif
  },
  onLoad(query) {
    console.log(query);
    this.query = query;
    if (!query.id) {
      this.$store.dispatch('forum/setError', {
        code: 'type_404',
        status: 500,
      });
    } else {
      this.loadThreads();
      this.$store.dispatch('jv/get', `topics/${query.id}`);
    }

    // #ifdef H5
    this.wxShare({
      title: this.topic.content,
    });
    // #endif
  },
  onShow() {
    this.uploadItem();
  },
  methods: {
    toTopic(id) {
      this.editThreadId = id;
    },
    uploadItem() {
      if (!this.editThreadId) {
        return;
      }
      const item = this.$store.getters['jv/get'](`threads/${this.editThreadId}`);
      this.topicData.forEach((data, index) => {
        if (data._jv.id === this.editThreadId) {
          this.editThreadId = '';
          this.$set(this.topicData, index, item);
        }
      });
    },
    loadThreads() {
      const params = {
        'filter[isSticky]': 'no',
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'filter[topicId]': this.query.id,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
      };

      this.$store.dispatch('jv/get', ['threads', { params }]).then(data => {
        if (this.pageNum > 1) {
          this.topicData = this.topicData.concat(data);
        } else {
          this.topicData = data;
          this.loadingtype = 'noMore';
        }
      });
    },
    // #ifdef H5
    triggerShare() {
      console.log('7777777');
      this.shareShow = !this.shareShow;
    },
    // #endif
  },
  // #ifdef MP-WEIXIN
  // 唤起小程序原声分享
  onShareAppMessage() {
    return {
      title: this.topic.content,
      path: `/pages/topic/content?id=${this.topic}`,
    };
  },
  // #endif
  onReachBottom() {
    console.log(this.meta);
    if (this.meta) {
      if (this.meta.next) {
        this.pageNum += 1;
        this.loadThreads();
      }
    } else {
      this.loadingtype = 'noMore';
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

.pages-content /deep/ {
  /* #ifdef H5 */
  padding-top: 88rpx;
  box-sizing: border-box;
  /* #endif */
}
$otherHeight: 292rpx;
.topic-content-header {
  padding: 15rpx;
  margin-bottom: 30rpx;
  font-size: 40rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  box-sizing: border-box;
  &_title {
    margin: 20rpx;
    font-weight: 600;
  }
  &_details {
    display: flex;
    justify-content: space-between;
    padding: 5rpx 0 10rpx 20rpx;
  }
  &_toAll {
    margin-bottom: 15rpx;
    margin-left: 36rpx;
    font-size: 28rpx;
    color: --color(--qui-LINK);
  }
}
.details_title {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 26rpx;
  color: --color(--qui-FC-777);
  text {
    font-size: 28rpx;
    color: --color(--qui-FC-333);
  }
}

.shareBtn {
  width: 100rpx;
  padding: 0;
  margin: 0;
  font-size: 24rpx;
  color: --color(--qui-FC-777);
  background: --color(--qui-BG-2);
  // opacity: 0;
}
.shareBtn[plain] {
  border: 0;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 17;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.6);
}
.wxShareTip {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2222222222222;
  width: 100%;
  height: 100%;
  text-align: right;
  .sharePoint {
    display: inline-block;
    width: 70%;
    margin-top: 10rpx;
    margin-right: 30rpx;
  }
  .shareKnow {
    display: block;
    width: 35%;
    margin: 20vh auto 30rpx;
  }
}
</style>
