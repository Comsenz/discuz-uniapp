<template>
  <qui-page :data-qui-theme="theme">
    <view class="qui-topic-page-box">
      <view class="qui-topic-page-box__hd">
        <view class="qui-topic-page-box__hd__sc">
          <qui-icon class="icon-search" name="icon-search" size="30"></qui-icon>
          <input
            type="text"
            placeholder-class="input-placeholder"
            confirm-type="search"
            :placeholder="i18n.t('topic.searchTopic')"
            v-model="searchValue"
            @input="searchInput"
          />
        </view>
      </view>
    </view>
    <view class="topic-content-item" @tap="returnToPost()" v-if="shouldShow">
      <view class="topic-content-item_title">#{{ searchValue }}#</view>
      <view class="topic-content-item_heat">{{ i18n.t('topic.newTopic') }}</view>
    </view>
    <view class="topic-content-item" v-for="(item, i) in topics" :key="i" @tap="returnToPost(i)">
      <view class="topic-content-item_title">#{{ item.content }}#</view>
      <view class="topic-content-item_heat">
        {{
          item.view_count / 10000 >= 1
            ? (item.view_count / 10000).toFixed(1) + i18n.t('core.thousand') + i18n.t('topic.hot')
            : item.view_count + i18n.t('topic.hot')
        }}
      </view>
    </view>
  </qui-page>
</template>

<script>
let timer = null;
export default {
  data() {
    return {
      shouldShow: false,
      topics: [], // 返回的话题信息
      searchValue: '', // 搜索值
      pageNum: 1, // 页面
      pageSize: 20,
      meta: {}, // 接口返回meta值
    };
  },
  methods: {
    // 话题搜索
    searchInput() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.loadTopics();
      }, 300);
    },
    returnToPost(index = 0) {
      const topicMsg = {};
      topicMsg.keywords = index === 0 ? this.searchValue : this.topics[index].content;

      uni.setStorage({
        key: 'topicMsg',
        data: topicMsg,
      });

      uni.navigateTo({ url: '/pages/topic/post' });
    },
    loadTopics() {
      const params = {
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        sort: '-viewCount',
      };
      if (this.searchValue) {
        params['filter[content]'] = this.searchValue;
      }
      this.$store.dispatch('jv/get', ['topics', { params }]).then(data => {
        if (this.pageNum > 1) {
          this.topics = this.topic.concat(data);
        } else {
          this.topics = data;
        }

        if (!data.length) {
          this.shouldShow = true;
        } else {
          this.shouldShow = false;
        }
        this.meta = data._jv.json.links;
      });
    },
  },
  onLoad() {
    this.loadTopics();
  },
  onReachBottom() {
    if (this.meta.next) {
      this.pageNum += 1;
      this.loadTopics();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

$otherHeight: 292rpx;
.topic-content-item {
  position: relative;
  height: 99.5rpx;
  margin-left: 40rpx;
  line-height: 99.5rpx;
  border-bottom: 0.5rpx solid #dedede;
  &_title {
    position: absolute;
    left: 0;
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
  }
  &_heat {
    position: absolute;
    right: 15rpx;
    font-size: 24rpx;
    color: #aaa;
  }
}
.qui-topic-page-box {
  width: 100%;
  height: 100%;
  background-color: --color(--qui-BG-2);
  &__hd {
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 20rpx 40rpx;

    &__sc {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 10rpx;
      background-color: --color(--qui-BG-IT);
      border-radius: 7rpx;

      .icon-search {
        margin: 0 10rpx;
        color: #bbb;
      }
      input {
        width: 100%;
        height: 100%;
      }
      /deep/ input .input-placeholder {
        font-size: $fg-f28;
        color: --color(--qui-FC-C6);
      }
    }
  }
  &__lst {
    .scroll-Y {
      height: calc(100vh - #{$otherHeight});
      .loading-text {
        height: 100rpx;
        font-size: 28rpx;
        line-height: 100rpx;
        color: --color(--qui-FC-AAA);
        text-align: center;
      }
      .loading-text__cont {
        margin-left: 20rpx;
      }
    }
  }
  &__ft {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 40rpx;
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
    /deep/ .qui-button--button[size='large'] {
      border-radius: 5rpx;
    }
    /deep/ .qui-button--button[disabled] {
      color: #7d7979;
      background-color: #fff;
    }
  }
}
</style>
