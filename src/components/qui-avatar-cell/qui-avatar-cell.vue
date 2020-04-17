<template>
  <view>
    <view class="avatar-box" v-for="item in data" :key="item.id" @click="getNameId(item.id)">
      <view class="avatar-box__img">
        <image :src="item.icon"></image>
      </view>
      <view class="avatar-box__r">
        <view class="avatar-box__r__tit">
          <text>
            {{ item.title }}
          </text>
          <text class="avatar-box__r__tit-label" v-if="center">{{ item.label }}</text>
        </view>
        <view class="avatar-box__r__val-box">
          <text class="avatar-box__r__val" :style="`color:${rightColor}`">{{ item.value }}</text>
          <slot name="rightIcon" />
          <view
            class="icon quiicons icon-folding-r"
            v-if="type === 'default' && !$slots.rightIcon"
          ></view>
          <checkbox
            v-if="type === 'check'"
            class="avatar-box__checkbox"
            :value="String(item.id)"
          ></checkbox>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'QuiAvatarCell',
  data() {
    return {};
  },
  props: {
    data: {
      type: Array,
    },
    type: {
      default: 'default',
      type: String,
    },
    center: {
      default: false,
      type: Boolean,
    },
    rightColor: {
      type: String,
    },
  },
  methods: {
    getNameId(id) {
      this.$emit('click', id);
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

    .avatar-box__r__tit {
      display: flex;
      flex-direction: column;
      font-size: 28rpx;
      &-label {
        color: --color(--qui-FC-DDD);
      }
    }

    .avatar-box__r__val-box {
      display: flex;
      align-items: center;
      .avatar-box__r__val {
        margin-right: 20rpx;
        font-size: 24rpx;
        color: --color(--qui-FC-AAA);
      }
    }
  }
}

.icon-folding-r {
  color: --color(--qui-FC-DDD);
  opacity: 1;
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
