<template>
  <view class="pages-topic">
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
    <view class="qui-at-member-page-box__lst">
      <scroll-view
        class="scroll-Y"
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="lower"
      >
        <view class="topic-content-item" @tap="returnToPost(-1)" v-if="shouldShow">
          <view class="topic-content-item_title">#{{ searchValue }}#</view>
          <view class="topic-content-item_heat">{{ i18n.t('topic.newTopic') }}</view>
        </view>
        <view
          class="topic-content-item"
          v-for="(item, i) in topics"
          :key="i"
          @tap="returnToPost(i)"
        >
          <view class="topic-content-item-box">
            <view class="topic-content-item_title">#{{ item.content }}#</view>
            <view class="topic-content-item_recoment" v-if="item.recommended === 1 ? true : false">
              <qui-icon name="icon-tuijian" color="#1878f3" size="34"></qui-icon>
            </view>
          </view>
          <view class="topic-content-item_heat">
            {{ item.view_count }}{{ i18n.t('topic.hot') }}
          </view>
          <!-- </view> -->
          <!-- <view class="topic-content-item_title">#{{ item.content }}#</view>
        <view class="topic-content-item_heat">
          {{ item.view_count }}
          <text>{{ i18n.t('topic.hot') }}</text>
        </view> -->
        </view>
        <view class="loading-text">
          <qui-icon
            v-if="loadingText === 'search.norelatedTopicfound'"
            name="icon-noData"
          ></qui-icon>
          <text class="loading-text__cont">{{ i18n.t(loadingText) }}</text>
        </view>
      </scroll-view>
    </view>
    <view class="qui-at-member-page-box__ft">
      <qui-button size="large" @click="topicCancel">取消</qui-button>
    </view>
  </view>
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
      loadingText: 'discuzq.list.loading',
    };
  },
  created() {
    this.loadTopics();
  },
  methods: {
    // 话题搜索
    searchInput() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.pageNum = 1;
        this.loadingText = 'discuzq.list.loading';
        this.loadTopics();
      }, 300);
    },
    returnToPost(index = 0) {
      const topicMsg = {};
      topicMsg.keywords = index === -1 ? this.searchValue : this.topics[index].content;
      uni.$emit('clickTopic', topicMsg);
    },
    loadTopics() {
      const params = {
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        // sort: '-viewCount',
        sort: 'recommended',
      };
      if (this.searchValue) {
        params['filter[content]'] = this.searchValue;
      }
      this.$store.dispatch('jv/get', ['topics', { params }]).then(data => {
        console.log(data, '这是话题数据');
        this.meta = data._jv.json.links;
        if (Object.keys(data).nv_length - 1 === 0) {
          this.loadingText = 'search.norelatedTopicfound';
        } else if (data._jv.json.meta.total <= 20 && Object.keys(data).nv_length - 1 !== 0) {
          this.loadingText = 'discuzq.list.noMoreData';
        }
        // eslint-disable-next-line no-param-reassign
        delete data._jv;
        if (this.pageNum > 1) {
          this.topics = this.topics.concat(data);
        } else {
          this.topics = data;
        }
        if (this.topics === []) {
          this.shouldShow = false;
        }

        if (!data.length) {
          this.shouldShow = true;
        } else {
          this.shouldShow = false;
        }
      });
    },
    // 上划加载更多
    lower() {
      if (this.followStatus) {
        if (this.meta.total > this.topics.length) {
          this.pageNum += 1;
          this.loadTopics(this.pageNum);
        } else {
          this.loadingText = 'discuzq.list.noMoreData';
        }
      } else if (this.meta.total > this.topics.length) {
        this.pageNum += 1;
        this.loadTopics(this.pageNum);
      } else {
        this.loadingText = 'discuzq.list.noMoreData';
      }
    },
    // 取消at选择
    topicCancel() {
      this.$emit('topicCancel');
    },
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
$otherHeight: 230rpx;
.pages-topic {
  height: 100%;
  background: --color(--qui-BG-2);
}
.topic-content-item {
  display: flex;
  // position: relative;
  padding: 35rpx 0;
  margin: 0 40rpx;
  justify-content: space-between;
  border-bottom: 0.5rpx solid --color(--qui-BOR-ED);
  &-box {
    display: flex;
    max-width: 500rpx;
  }
  &_title {
    // padding-right: 150rpx;
    max-width: 420rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: --color(--qui-FC-333);
    word-break: break-all;
  }
  &_recoment {
    top: 35rpx;
    left: 253rpx;
    width: 34rpx;
    height: 34rpx;
    margin-left: 20rpx;
    font-size: 22rpx;
    line-height: 34rpx;
    color: #fff;
    text-align: center;
    align-self: center;
    // background: rgba(15, 157, 245, 1);
  }
  &_heat {
    // position: absolute;
    top: 35rpx;
    left: 15rpx;
    // right: 15rpx;
    font-size: 24rpx;
    color: --color(--qui-BOR-AAA);
    white-space: nowrap;
  }
}
.qui-topic-page-box {
  width: 100%;
  // height: 100%;
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
        font-size: $fg-f4;
        color: --color(--qui-FC-C6);
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
.qui-at-member-page-box__ft {
  display: flex;
  justify-content: space-between;
}
</style>
