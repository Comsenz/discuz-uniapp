<template>
  <view class="post-box">
    <view class="post-box__hd">
      <view class="post-box__hd-l">
        <qui-icon
          class="post-box__hd-l__icon"
          name="icon-expression"
          size="40"
          color="#777"
        ></qui-icon>
        <qui-icon
          class="post-box__hd-l__icon"
          name="icon-call"
          size="40"
          color="#777"
          @click="callClick"
        ></qui-icon>
      </view>
      <text class="post-box__hd-r">
        {{ `还能输入${450 - textAreaValue.length}个字` }}
      </text>
    </view>
    <textarea
      class="post-box__con-text"
      placeholder="您想说的.."
      placeholder-class="textarea-placeholder"
      v-model="textAreaValue"
      auto-height
      maxlength="450"
    ></textarea>
    <view class="post-box__ft">
      <text class="post-box__ft-tit">选择分类</text>
      <view class="post-box__ft-categories">
        <qui-button
          :type="item.status ? 'primary' : ''"
          :plain="item.status"
          v-for="(item, index) in btnData"
          :key="index"
          @click="checkClass(item, index)"
        >
          {{ item.description }}
        </qui-button>
      </view>
      <qui-button type="primary" size="large" @click="postClick">发布</qui-button>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Post',
  data() {
    return {
      btnData: {
        1: {
          description: '默认分类',
          _jv: {
            id: 1,
          },
          status: true,
        },
        2: {
          description: '默认分类2',
          _jv: {
            id: 2,
          },
          status: false,
        },
        5: {
          description: '默认分类3',
          _jv: {
            id: 3,
          },
          status: false,
        },
        4: {
          description: '默认分类4',
          _jv: {
            id: 4,
          },
          status: false,
        },
      },
      textAreaValue: '',
      checkClassData: {
        1: {
          description: '默认分类',
          _jv: {
            id: 1,
          },
          status: true,
        },
      },
    };
  },
  computed: {
    ...mapState({
      getAtMemberData: state => state.atMember.atMemberData,
    }),
    allCategories() {
      return this.$store.getters['jv/get']('categories');
    },
  },
  methods: {
    callClick() {
      uni.navigateTo({ url: '/components/qui-at-member-page/qui-at-member-page' });
    },
    getCategories() {
      this.$store.dispatch('jv/get', ['categories', {}]).then(res => {
        console.log(res);
      });
    },
    checkClass(e, index) {
      if (!this.checkClassData[index]) {
        this.checkClassData[index] = e;
      } else {
        delete this.checkClassData[index];
      }
      this.btnData[index].status = !this.btnData[index].status;
    },
    postClick() {
      console.log(this.checkClassData);
    },
  },
  onLoad() {
    this.getCategories();
  },
  onBackPress() {
    console.log('页面返回无法触发事件，或使用页面通讯');
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.post-box {
  width: 100vw;
  padding: 40rpx;
  box-sizing: border-box;
  &__hd {
    display: flex;
    justify-content: space-between;
    &-l {
      &__icon {
        margin-right: 54rpx;
      }
    }
    &-r {
      font-size: $fg-f24;
      color: --color(--qui-FC-777);
    }
  }
  &__con-text {
    width: 100%;
    min-height: 400rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    background-color: --color(--qui-BG-1);
    border: 1rpx solid #ddd;
    border-radius: 10rpx;
    box-sizing: border-box;
  }
  &__ft {
    &-tit {
      display: block;
      margin: 30rpx 0;
      font-size: $fg-f28;
      color: --color(--qui-FC-7D7979);
    }
    &-categories {
      margin-bottom: 40rpx;
      /deep/ .qui-button--button {
        margin-top: 10rpx;
        margin-right: 20rpx;
        margin-bottom: 10rpx;
      }
    }
  }
}
/deep/ textarea .textarea-placeholder {
  font-size: $fg-f28;
  color: --color(--qui-FC-B5);
}
</style>
