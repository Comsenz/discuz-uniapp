<template>
  <view class="profile-page">
    <view class="person-info">
      <view class="info-wrap">
        <view class="info">
          <text class="avatar"></text>
          <cell-item title="佟掌柜" slot-right brief="管理员" :border="false">
            <view v-if="current !== null">
              <view class="operate-item">
                <text class="quiicons icon-message"></text>
                <text>私信</text>
              </view>
              <view class="operate-item">
                <text class="quiicons icon-follow"></text>
                <text>关注</text>
              </view>
            </view>
          </cell-item>
        </view>
      </view>
      <view class="introduction">
        在崔健的所有歌曲中花房姑娘称得上是最抒情的一首花房姑娘中多了一点柔情的东西。
      </view>
    </view>
    <view class="profile-tabs">
      <qui-tabs
        :current="current"
        :values="items"
        @clickItem="onClickItem"
        :brief="true"
      ></qui-tabs>
      <view class="tab-content">
        <view v-show="current === 0" class="items">
          <topic></topic>
        </view>
        <view v-show="current === 1" class="items">
          <following></following>
        </view>
        <view v-show="current === 2" class="items">
          <followers></followers>
        </view>
        <view v-show="current === 3" class="items">
          <like></like>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import quiTabs from '@/components/qui-tabs';
import cellItem from '@/components/qui-cell-item';
import topic from './topic';
import following from './following';
import followers from './followers';
import like from './like';

export default {
  components: {
    quiTabs,
    cellItem,
    topic,
    following,
    followers,
    like,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      items: [
        { title: '主题', brief: '73' },
        { title: '关注', brief: '12' },
        { title: '粉丝', brief: '31' },
        { title: '点赞', brief: '65' },
      ],
      // 区分是我的还是别人的个人中心
      current: this.type === 'my' ? null : 0,
    };
  },
  methods: {
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
        this.$emit('clickTab', { currentIndex: this.current });
      }
    },
  },
};
</script>
<style lang="scss">
page {
  background-color: #f9fafc;
}
.profile-page {
  .person-info {
    padding: 40rpx;
    font-size: 28rpx;
    background: #fff;
  }
  .info-wrap {
    display: flex;
    justify-content: space-between;
    margin-bottom: 35rpx;
  }
  .info {
    position: relative;
    width: 100%;
    padding-left: 100rpx;
    font-size: 28rpx;
    box-sizing: border-box;
  }
  .info /deep/ .qui-cell-item-body {
    height: 80rpx;
    align-items: flex-start;
  }
  .operate-item {
    display: inline-block;
    margin-left: 42rpx;
    color: #333;
  }
  .quiicons {
    margin-right: 14rpx;
    font-size: 22rpx;
  }
  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 80rpx;
    height: 80rpx;
    background: #a8a8a8;
    border-radius: 50%;
  }
  .content {
    background: #fafafc;
  }
  .tab-content {
    padding: 30rpx 20rpx 0;
  }
  .tabs {
    background: #fff;
  }
}
</style>
