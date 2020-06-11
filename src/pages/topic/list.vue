<template>
  <qui-page>
    <view class="qui-topic-page-box">
      <view class="qui-topic-page-box__hd">
        <view class="qui-topic-page-box__hd__sc">
          <qui-icon class="icon-search" name="icon-search" size="30"></qui-icon>
          <input
            class="topicSearchInput"
            type="text"
            placeholder-class="input-placeholder"
            confirm-type="search"
            placeholder="搜索话题"
            @input="searchInput"
          />
        </view>
      </view>
    </view>
    <view class="topic-list-page">
      <view class="topic-list-page-header" v-show="anaData.length > 0">
        <view class="topic-list-page-header_title">话题列表</view>
        <!-- 排序功能后续补上完善 -->
        <view class="topic-list-page-header_sortBox" @click="toggleDropDown">
          <view>
            <qui-icon class="icon-wei" name="icon-wei" size="30"></qui-icon>
            <text>排序</text>
          </view>
          <view class="dropDownBox" v-show="dropDownShow">
            <view @click="switchSort(0)">热度</view>
            <view @click="switchSort(1)">内容数</view>
          </view>
        </view>
      </view>
      <view style="clear: both;"></view>
      <view class="topic-page-list-item" v-for="(item, i) in topicData" :key="i">
        <view class="topic-page-list-item_title">#{{ item.content }}#</view>
        <view class="topic-page-list-item_details">
          <view class="topic-page-list-item_details_text">{{ item.detailsText }}</view>
          <image class="topic-page-list-item_details_image" :src="item.detailsImages"></image>
        </view>
        <text class="topic-page-list-item_heat">
          热度 {{ item.heatNum > 10000 ? Number(item.heatNum / 10000) + '万' : item.heatNum }}
        </text>
        <text class="topic-page-list-item_content">
          内容 {{ item.contentNum > 1000 ? Number(item.contentNum / 1000) + 'k' : item.contentNum }}
        </text>
      </view>
    </view>
    <qui-load-more v-show="anaData.length > 0"></qui-load-more>
  </qui-page>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      dropDownShow: false,
      topicData: [],
      anaData: [
        {
          title: '测试话题数据1',
          detailsText:
            '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta atque dignissimos a suscipit? Quo consequuntur rem accusamus asperiores labore dolorum hic laborum quas quibusdam in. Aliquid ducimus ex vitae voluptas!',
          detailsImages:
            'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4190106429,4270721657&fm=11&gp=0.jpg',
          heatNum: '42000',
          contentNum: '8300',
        },
        {
          title: '测试话题数据2',
          detailsText:
            '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta atque dignissimos a suscipit? Quo consequuntur rem accusamus asperiores labore dolorum hic laborum quas quibusdam in. Aliquid ducimus ex vitae voluptas!',
          detailsImages:
            'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4190106429,4270721657&fm=11&gp=0.jpg',
          heatNum: '54000',
          contentNum: '8300',
        },
        {
          title: '测试话题数据3',
          detailsText:
            '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta atque dignissimos a suscipit? Quo consequuntur rem accusamus asperiores labore dolorum hic laborum quas quibusdam in. Aliquid ducimus ex vitae voluptas!',
          detailsImages:
            'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4190106429,4270721657&fm=11&gp=0.jpg',
          heatNum: '44000',
          contentNum: '800',
        },
        {
          title: '测试话题数据4',
          detailsText:
            '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta atque dignissimos a suscipit? Quo consequuntur rem accusamus asperiores labore dolorum hic laborum quas quibusdam in. Aliquid ducimus ex vitae voluptas!',
          detailsImages:
            'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4190106429,4270721657&fm=11&gp=0.jpg',
          heatNum: '96000',
          contentNum: '8000',
        },
      ],
      newTopic: '',
      topicMsg: [], // 返回的话题信息
      loadingText: 'discuzq.list.loading',
      searchValue: '', // 搜索值
      pageNum: 1, // 页面
      meta: {}, // 接口返回meta值
    };
  },
  methods: {
    ...mapMutations({
      setAtMember: 'atMember/SET_ATMEMBER',
    }),
    toggleDropDown() {
      this.dropDownShow = !this.dropDownShow;
    },
    searchInput(e) {
      this.anaData = [];
      this.anaData = [].concat(this.anaData);
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
            console.log(res);
          });
        }, 600);
      })();
    },
  },
  onLoad() {
    this.$store.dispatch('jv/get', ['threads']).then(res => {
      this.topicData = res;
      console.log(res);
    });
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.dropDownBox {
  position: absolute;
  top: 60rpx;
  right: 0;
  left: -10rpx;
  z-index: 10;
  width: 150rpx;
  text-align: center;
  background: #fff;
  view {
    padding: 15rpx 10rpx;
    color: #999;
    border: 0.5rpx solid #efefef;
  }
  view:first-child {
    border-bottom: 0.5rpx solid #efefef;
  }
}

$otherHeight: 292rpx;
.topicSearchInput {
  font-size: 32rpx;
  color: #333;
}
.topic-list-page-header {
  margin: 24rpx;
  font-weight: 700;
  &_title {
    float: left;
    margin: 20rpx;
    margin-bottom: 8rpx;
    font-size: 28rpx;
  }
  &_sortBox {
    position: relative;
    float: right;
    margin: 20rpx;
    margin-bottom: 8rpx;
    font-size: 28rpx;
    color: #1878f3;
  }
}
.topic-page-list-item {
  padding: 15rpx;
  margin: 20rpx;
  background: #fff;
  box-sizing: border-box;
  &_title {
    font-size: 35rpx;
    font-weight: 700;
  }
  &_details {
    &_text {
      margin: 20rpx 0;
      overflow: hidden;
      font-size: 32rpx;
      color: #333;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
    }
    &_image {
      width: 450rpx;
      height: 350rpx;
    }
  }
  &_heat,
  &_content {
    margin-right: 37rpx;
    font-size: 28rpx;
    color: #aaa;
  }
}
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
