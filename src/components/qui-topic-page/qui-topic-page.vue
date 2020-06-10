<template>
  <qui-page>
    <view class="qui-topic-page-box">
      <view class="qui-topic-page-box__hd">
        <view class="qui-topic-page-box__hd__sc">
          <qui-icon class="icon-search" name="icon-search" size="30"></qui-icon>
          <input
            type="text"
            placeholder-class="input-placeholder"
            confirm-type="search"
            placeholder="搜索话题"
            @input="searchInput"
          />
        </view>
      </view>
    </view>
    <view class="topic-content-item" @tap="returnToPost(-1)" v-show="shouldShow">
      <view class="topic-content-item_title">#{{ newTopic }}#</view>
      <view class="topic-content-item_heat">新话题</view>
    </view>
    <view class="topic-content-item" v-for="(item, i) in topicMsg" :key="i" @tap="returnToPost(i)">
      <view class="topic-content-item_title">#{{ topicMsg ? item.content : '' }}#</view>
      <view class="topic-content-item_heat">
        {{
          item.view_count / 10000 >= 1
            ? (item.view_count / 10000).toFixed(1) + '万热度'
            : item.view_count + ' 热度'
        }}
      </view>
    </view>
  </qui-page>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      shouldShow: false,
      newTopic: '',
      topicMsg: [], // 返回的话题信息
      loadingText: 'discuzq.list.loading',
      searchValue: '', // 搜索值
      pageNum: 1, // 页面
      meta: {}, // 接口返回meta值
    };
  },
  computed: {
    // 处理角色名称
    getGroups() {
      const that = this;
      let name = '';
      return data => {
        if (data) {
          Object.keys(data).forEach(item => {
            if (data[item]) {
              name = data[item].name;
            } else {
              name = that.i18n.t('discuzq.role.noRole');
            }
          });
        }
        return name;
      };
    },
  },
  methods: {
    ...mapMutations({
      setAtMember: 'atMember/SET_ATMEMBER',
    }),

    // 话题搜索
    searchInput(e) {
      let timer = null;
      this.newTopic = e.detail.value;
      this.shouldShow = false;
      // 去模糊查询输入的话题
      const params = {
        'filter[content]': e.detail.value.trim(),
        'page[number]': '1',
        'page[limit]': '20',
        sort: '-viewCount',
      };
      if (this.pageNum !== 1) {
        this.pageNum = 1;
      }
      this.loadingText = 'discuzq.list.loading';
      return (() => {
        if (timer) clearTimeout(this.timer);
        timer = setTimeout(() => {
          // 为发送请求添加防抖处理
          this.$store.dispatch('jv/get', ['topics', { params }]).then(res => {
            // eslint-disable-next-line no-unused-expressions
            res.length > 0 ? (this.topicMsg = res) : (this.shouldShow = true);
            // eslint-disable-next-line no-unused-expressions
            this.newTopic.length === 0 ? (this.shouldShow = false) : null;
          });
        }, 600);
      })();
    },
    returnToPost(index) {
      // 在跳转之前使用localStorage存储输入的话题关键字
      const topicMsg = {};
      // eslint-disable-next-line eqeqeq
      topicMsg.keywords = index == -1 ? this.newTopic : this.topicMsg[index].content;

      uni.setStorage({
        key: 'topicMsg',
        data: topicMsg,
      });

      uni.navigateTo({ url: '../../pages/topic/post' });
    },
    // 上划加载更多
    lower() {
      if (this.followStatus) {
        if (this.meta.total > this.allFollow.length) {
          this.pageNum += 1;
          this.getFollowMember(this.pageNum);
        } else {
          this.loadingText = 'discuzq.list.noMoreData';
        }
      } else if (this.meta.total > this.allSiteUser.length) {
        this.pageNum += 1;
        this.getSiteMember(this.pageNum);
      } else {
        this.loadingText = 'discuzq.list.noMoreData';
      }
    },
  },
  onLoad() {
    // 请求话题数据
    const params = {
      include: 'user',
      'page[number]': '1',
      'page[limit]': '20',
      sort: '-viewCount',
    };
    this.$store.dispatch('jv/get', ['topics', { params }]).then(res => {
      this.topicMsg = res;
    });
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
