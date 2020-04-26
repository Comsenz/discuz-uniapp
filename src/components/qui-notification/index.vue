<template>
  <view>
    <view class="list-box">
      <view class="list-box__header">
        <view class="">
          <view v-if="x">头像</view>
          <view>
            <view>
              <text>用户名</text>
              <text>角色</text>
              <text class="gray-text" v-if="type === 'related'">@了我</text>
              <text class="gray-text" v-if="type === 'replied'">回复了我</text>
              <text class="gray-text" v-if="type === 'liked'">点赞了我</text>
              <text class="gray-text" v-if="type === 'rewarded'">打赏了我</text>
            </view>
            <view>时间</view>
          </view>
        </view>
        <view class="">
          <uni-icons
            v-if="dialog.recipient_read_at === null"
            class="red-circle"
            type="smallcircle-filled"
            color="red"
            size="7"
          ></uni-icons>
          <text v-if="d">￥999</text>
          <uni-icons :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
        </view>
      </view>
      <view class="list-box__content">
        <view class="" v-if="a">发言</view>
        <view class="" v-if="b">图片</view>
        <view class="" v-if="c">文字</view>
      </view>
      <view class="list-box__footer">
        <uni-icons :size="20" class="uni-icon-wrapper" color="#bbb" type="trash" />
        <text>删除</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.list-box {
  width: 100%;
  min-height: 188rpx;
  margin: 30rpx 0 10rpx;
  background: rgba(255, 255, 255, 1);
}
</style>
