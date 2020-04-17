<template>
  <view>
    <view class="avatar-box" v-for="(item, index) in data" :key="index">
      <view class="avatar-box__img">
        <image :src="item.img"></image>
      </view>
      <view class="avatar-box__r">
        <text class="avatar-box__r__name">
          {{ item.name }}
        </text>
        <view class="avatar-box__r__tit-box">
          <text class="avatar-box__r__tit">{{ item.title }}</text>
          <checkbox class="avatar-box__checkbox" v-model="checkData" :value="item.name"></checkbox>
        </view>
      </view>
    </view>
    <button @click="btnClick">获取选中</button>
  </view>
</template>

<script>
export default {
  name: 'QuiAvatarCell',
  data() {
    return {
      avatarCheck: '',
      checkData: [],
    };
  },
  props: {
    data: {
      type: Array,
    },
  },
  methods: {
    btnClick() {
      console.log(this.checkData);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';

.avatar-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100rpx;
  padding-left: 40rpx;
  box-sizing: border-box;

  &__img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70rpx;
    height: 70rpx;
    margin-right: 20rpx;
    background-color: --color(--qui-BG-2);
    border-radius: 50rpx;
    image {
      width: 70rpx;
      height: 70rpx;
      border-radius: 50rpx;
    }
  }

  &__r {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    height: 100%;
    padding-right: 40rpx;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);

    .avatar-box__r__name {
      font-size: 28rpx;
    }

    .avatar-box__r__tit-box {
      display: flex;
      align-items: center;
      .avatar-box__r__tit {
        margin-right: 20rpx;
        font-size: 24rpx;
      }
    }
  }
}

//头像单元格--多选框--H5
/deep/ uni-checkbox .uni-checkbox-input {
  width: 44rpx;
  height: 44rpx;
  margin: 0;
  border-radius: 50rpx;
}
/deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
  background: --color(--qui-BG-HIGH-LIGHT);
}
/deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
  color: --color(--qui-FC-FFF);
}
</style>
