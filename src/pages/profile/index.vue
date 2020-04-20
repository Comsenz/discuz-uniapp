<template>
  <view class="profile">
    <view class="profile-info">
      <view class="profile-info__box">
        <view class="profile-info__box__detail">
          <text class="profile-info__box__detail-avatar"></text>
          <cell-item title="佟掌柜" slot-right brief="管理员" :border="false">
            <view v-if="current !== null">
              <view class="profile-info__box__detail-operate">
                <text class="quiicons icon-message"></text>
                <text>私信</text>
              </view>
              <view class="profile-info__box__detail-operate">
                <text class="quiicons icon-follow"></text>
                <text>关注</text>
              </view>
            </view>
          </cell-item>
        </view>
      </view>
      <view class="profile-info__introduction">
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
      <view class="profile-tabs__content">
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
.profile {
  .quiicons {
    margin-right: 14rpx;
    font-size: 22rpx;
  }
}
.profile-info {
  padding: 40rpx;
  font-size: 28rpx;
  background: #fff;
}
.profile-info__box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 35rpx;
}
.profile-info__box__detail {
  position: relative;
  width: 100%;
  padding-left: 100rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
.profile-info__box__detail /deep/ .cell-item__body {
  height: 80rpx;
  align-items: flex-start;
}
.profile-info__box__detail-operate {
  display: inline-block;
  margin-left: 42rpx;
  color: #333;
}
.profile-info__box__detail-avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 80rpx;
  height: 80rpx;
  background: #a8a8a8;
  border-radius: 50%;
}
.profile-tabs__content {
  padding: 30rpx 20rpx 0;
}
.qui-tabs {
  background: #fff;
}
</style>
