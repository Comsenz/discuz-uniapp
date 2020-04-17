<template>
  <view class="content bg">
    <view class="detail-hd">
      <view class="det-hd-per-head-box">
        <image src="" alt="图片" mode="widthFix" class="det-hd-per-head"></image>
      </view>
      <view class="det-hd-per-info">
        <text class="det-hd-per-name">{{ username }}</text>
        <view class="det-hd-post-time">{{ time }}</view>
      </view>
      <view class="det-hd-opera">
        <view class="det-hd-operaCli">
          <view class="icon quiicons icon-management"></view>
          管理
        </view>
        <image src="@/assets/essence.png" mode="widthFix" class="essence"></image>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      username: 'admin',
      time: '16分钟前',
    };
  },
  computed: {
    ...mapState({
      allThreads: state => state.dzThreads.all,
    }),
  },
  onLoad() {
    this.loadAllThreads({
      'page[size]': 10,
      'page[number]': 1,
    });
  },
  methods: {
    ...mapActions({
      loadAllThreads: 'dzThreads/loadAll',
    }),
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: --color(--qui-BG-2);
}
.detail-hd {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 30rpx 40rpx 37rpx;
  box-sizing: border-box;
  .det-hd-per-head-box {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    .det-hd-per-head {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .det-hd-per-info {
    width: 480px;
    padding-left: 20rpx;
    .det-hd-per-name {
      margin-bottom: 10px;
      font-size: $fg-f28;
      font-weight: bold;
      line-height: 37rpx;
    }
    .det-hd-post-time {
      font-size: $fg-f24;
      line-height: 31rpx;
      color: --color(--qui-FC-AAA);
    }
  }
  &-opera {
    align-self: flex-end;
    text-align: right;
    .det-hd-operaCli {
      display: flex;
      flex-direction: row;
      .icon-management {
        margin-right: 7rpx;
        font-size: 26rpx;
      }
      font-size: $fg-f28;
      line-height: 40rpx;
    }
    .essence {
      display: inline-block;
      width: 49rpx;
      height: 60rpx;
    }
  }
}
</style>
