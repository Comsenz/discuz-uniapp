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
      @input="textInput"
    ></textarea>
    <view class="post-box__ft">
      <text class="post-box__ft-tit">选择分类</text>
      <view class="post-box__ft-categories">
        <qui-button
          v-for="(item, index) in allCategories"
          :key="index"
          :type="checkClassData[index] ? 'primary' : ''"
          :plain="checkClassData[index]"
          @click="checkClass(item, index)"
        >
          {{ item.name }}
        </qui-button>
      </view>
      <qui-button type="primary" size="large" @click="postClick">
        {{ i18n.t('discuzq.post.post') }}
      </qui-button>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Post',
  data() {
    return {
      textAreaValue: '',
      checkClassData: {},
      type: '',
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
    textInput(e) {
      console.log(this.textAreaValue.length);
      console.log(e.detail.value.length);
      console.log('删除文本触发事件');
      console.log(e);
    },
    callClick() {
      uni.navigateTo({ url: '/components/qui-at-member-page/qui-at-member-page' });
    },
    checkClass(e, index) {
      if (!this.checkClassData[index]) {
        this.$set(this.checkClassData, index, e);
      } else {
        this.$delete(this.checkClassData, index);
      }
    },
    postClick() {
      console.log(this.checkClassData);
    },
    getCategories() {
      this.$store.dispatch('jv/get', ['categories', {}]).then(res => {
        this.$set(this.checkClassData, 1, res[1]);
      });
    },
    postThread() {
      this.$store.dispatch('jv/post', ['threads'], {}).then(res => {
        console.log(res);
      });
    },
  },
  onLoad(option) {
    this.getCategories();
    if (option.type) this.type = option.type;
  },
  onShow() {
    this.getAtMemberData.map(item => {
      this.textAreaValue = `${this.textAreaValue}@${item.toUser.username} `;
      return this.textAreaValue;
    });
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
