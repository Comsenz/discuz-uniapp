<template>
  <view class="page-message">
    <view class="page-message--inner">
      <!-- 如果不是本地的图片，这里可以改一下，只用一个 image 标签即可，更换 src 的值即可-->
      <image
        class="page-message--icon"
        src="@/static/msg-404.svg"
        mode="aspectFit"
        lazy-load
        v-if="status === '404'"
      ></image>
      <image
        class="page-message--icon"
        src="@/static/msg-warning.svg"
        mode="aspectFit"
        lazy-load
        v-if="status === 'closed'"
      ></image>
      <view class="page-message--title" v-if="message.title">{{ message.title }}</view>
      <view class="page-message--subtitle" v-if="message.subtitle || status === 'closed'">
        {{ message.subtitle | closedError(forumError) }}
      </view>
      <!-- 退出小程序：https://uniapp.dcloud.io/component/navigator?id=navigator 2.1.0+ -->
      <navigator
        class="page-message--exit"
        open-type="exit"
        target="miniProgram"
        v-if="status === 'closed'"
      >
        {{ message.btnTxt }}
      </navigator>
      <qui-button size="medium" @click="handleClick">
        {{ message.btnTxt }}
      </qui-button>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

const TYPE_404 = '404';
const TYPE_CLOSED = 'closed';
const message = {
  [TYPE_404]: {
    title: '页面没有找到',
    subtitle: '您要访问的页面可能已被删除，已更改名称或者暂时不可用',
    btnTxt: '返回首页',
    icon: '@/static/msg-404.svg',
  },
  [TYPE_CLOSED]: {
    title: '站点已关闭',
    subtitle: '', // 从接口读取站点关闭后的提示语
    btnTxt: '点击关闭',
    icon: '@/static/msg-warning.svg',
  },
};
export default {
  filters: {
    closedError(subtitle, err) {
      if (err && err.detail) return err.detail[0];
      return subtitle;
    },
  },
  data() {
    return {
      status: '', // success, fail, 404
      message: {},
    };
  },
  computed: {
    ...mapState({
      forumError: state => state.forum.error,
    }),
  },
  onLoad(params) {
    const { status } = params;
    if (!status) this.status = TYPE_404;
    else this.status = status;
    this.message = message[this.status];
  },
  methods: {
    handleClick() {
      // 404
      if (this.status === TYPE_404) {
        uni.redirectTo({
          url: '/pages/home/index',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';

.page-message {
  display: flex;
  align-items: center;
  justify-content: center;
  &--icon {
    height: 140rpx;
    margin: 140rpx 0 40rpx;
  }
  &--inner {
    position: relative;
    margin-top: 140rpx;
    text-align: center;
  }
  &--title {
    max-width: 510rpx;
    margin: 0 auto 20rpx;
    font-size: $fg-f34;
    font-weight: bold;
    line-height: 45rpx;
    color: rgba(51, 51, 51, 1);
  }
  &--subtitle {
    max-width: 510rpx;
    margin: 0 auto 50rpx;
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 37rpx;
    color: rgba(170, 170, 170, 1);
  }
  &--exit {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 1;
    width: 510rpx;
    height: 90rpx;
    margin: 0 auto;
    opacity: 0;
    transform: translateX(-50%);
  }
}
</style>
