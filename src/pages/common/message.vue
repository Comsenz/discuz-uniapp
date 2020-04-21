<template>
  <view class="page-message">
    <view class="page-message--inner">
      <qui-icon class="page-message--icon" :name="iconName" size="70" color="#39bb13"></qui-icon>
      <view class="page-message--title" v-if="title">{{ title }}</view>
      <view class="page-message--subtitle" v-if="subTitle">{{ subTitle }}</view>
      <qui-button :type="iconType" size="medium" @click="handleClick">
        完成，日常按钮状态
      </qui-button>
    </view>
  </view>
</template>

<script>
/**
 * 需要根据需求进行细化
 *
 * 1. 明确状态 - 页面消息提示状态：成功，失败，404（页面或者啥）
 * 2. 明确文案 - 根据不同的状态显示不同的文案
 * 3. 按钮交互逻辑 - 根据不同的传参进行不同的交互逻辑
 * 4. 提示的 icon 待和设计要
 */
// 这个提示文案暂时这么处理，也是根据需求进行调整的
const message = {
  '404': {
    title: '该页面不存在',
  },
  fail: {
    title: '不好意思，审核失败',
  },
  success: {
    title: '提现申请已提交，等待审核',
    subtitle: '审核成功后将于24小时到账',
  },
};
export default {
  data() {
    return {
      status: '', // success, fail, 404
      title: '', // 提示标题
      subTitle: '', // 提示副标题
      iconType: 'primary', // button 显示样式类型
      from: '', // 从哪个页面进入的
    };
  },
  computed: {
    iconName() {
      if (this.status === 'success') return 'icon-success';
      if (this.status === 'fail') return 'icon-fail';
      return 'icon-waring';
    },
  },
  onLoad(params) {
    // 这里只是例子，待完善
    // 比如在小程序中设置启动参数：s=success&f=home
    // s: 状态；f：来自哪个页面，由该页面的性质进行相应的 button 的交互
    // 参数长度在小程序里是有限制的，所以这里最好是需要定义好
    const { s, f } = params;
    if (!s) this.status = '404';
    else this.status = s;
    this.title = message[this.status].title || '';
    this.subTitle = message[this.status].subtitle || '';
    this.from = f;
    if (f === 'home') this.iconType = 'default';
  },
  methods: {
    handleClick() {
      if (this.from === 'home') {
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
// css
.page-message {
  display: flex;
  align-items: center;
  justify-content: center;
  &--icon {
    margin-bottom: 40rpx;
  }
  &--inner {
    margin-top: 140rpx;
    text-align: center;
  }
  &--title {
    margin-bottom: 20rpx;
    font-size: $fg-f34;
    font-weight: bold;
    line-height: 45rpx;
    color: rgba(51, 51, 51, 1);
  }
  &--subtitle {
    margin-bottom: 50rpx;
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 37rpx;
    color: rgba(170, 170, 170, 1);
  }
}
</style>
