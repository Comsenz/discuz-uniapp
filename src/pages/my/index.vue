<template>
  <view class="my">
    <profile type="my" @clickTab="onClickItem"></profile>
    <view v-if="current === null">
      <view class="my-items">
        <navigator url="./profile" open-type="navigate">
          <cell-item title="我的资料" arrow></cell-item>
        </navigator>
        <navigator url="./wallet" open-type="navigate">
          <cell-item title="我的钱包" arrow></cell-item>
        </navigator>
        <navigator url="./favorite" open-type="navigate">
          <cell-item title="我的收藏" arrow :border="false"></cell-item>
        </navigator>
      </view>
      <view class="my-items">
        <cell-item title="圈子信息" arrow></cell-item>
        <cell-item title="搜索" arrow></cell-item>
        <cell-item title="管理圈子" arrow :border="false"></cell-item>
      </view>
    </view>
  </view>
</template>

<script>
import cellItem from '@/components/qui-cell-item';
import profile from '../profile';

export default {
  components: {
    profile,
    cellItem,
  },
  data() {
    return {
      current: null,
    };
  },
  methods: {
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
  },
};
</script>

<style lang="scss">
.my-items {
  padding-left: 40rpx;
  margin-bottom: 30rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;
  .cell-item {
    padding-right: 40rpx;
  }
}
</style>
