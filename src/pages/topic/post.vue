<template>
  <view class="post-box">
    <view class="post-box__hd">
      <view class="post-box__hd-l">
        <qui-icon
          class="post-box__hd-l__icon"
          name="icon-expression"
          size="40"
          color="#777"
          @click="emojiShow = !emojiShow"
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
        {{ i18n.t('discuzq.post.note', { num: 450 - textAreaValue.length }) }}
      </text>
    </view>
    <view class="emoji-bd">
      <qui-emoji
        :data="allEmoji"
        position="absolute"
        top="20rpx"
        v-if="emojiShow"
        @click="getEmojiClick"
      ></qui-emoji>
    </view>
    <textarea
      id="textarea"
      class="post-box__con-text"
      :placeholder="i18n.t('discuzq.post.placeholder')"
      placeholder-class="textarea-placeholder"
      v-model="textAreaValue"
      auto-height
      maxlength="450"
      @input="textInput"
      @focus="textFocus"
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
      type: 0,
      operating: '',
      emojiShow: false,
    };
  },
  computed: {
    ...mapState({
      getAtMemberData: state => state.atMember.atMemberData,
    }),
    allCategories() {
      return this.$store.getters['jv/get']('categories');
    },
    allEmoji() {
      return this.$store.getters['jv/get']('emoji');
    },
  },
  methods: {
    textInput(e) {
      console.log(e);
    },
    textFocus(e) {
      console.log(e);
    },
    getEmojiClick(num) {
      console.log(num);
      this.emojiShow = false;

      console.log(document.getElementById('textarea'));
      const textarea = document.getElementById('textarea');

      const value = this.textAreaValue;
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const newValue = value.substring(0, startPos) + num + value.substring(endPos, value.length);
      this.textAreaValue = newValue;
      if (textarea.setSelectionRange) {
        setTimeout(() => {
          const index = startPos + num.length;
          textarea.setSelectionRange(index, index);
        }, 0);
      }
    },
    callClick() {
      uni.navigateTo({ url: '/components/qui-at-member-page/qui-at-member-page' });
    },
    checkClass(e, index) {
      // 单选功能
      this.checkClassData = {};
      this.$set(this.checkClassData, index, e);

      // 多选功能
      /* if (!this.checkClassData[index]) {
        this.$set(this.checkClassData, index, e);
      } else {
        this.$delete(this.checkClassData, index);
      } */
    },
    postClick() {
      this.postThread();
    },
    getCategories() {
      this.$store.dispatch('jv/get', ['categories', {}]).then(res => {
        this.$set(this.checkClassData, 1, res[1]);
      });
    },
    postThread() {
      const params = {
        _jv: {
          type: 'threads',
          relationships: {
            category: {
              data: {
                type: 'categories',
                id: Object.keys(this.checkClassData)[0],
              },
            },
          },
        },
        content: this.textAreaValue,
        type: this.type,
      };
      this.$store.dispatch('jv/post', params).then(res => {
        console.log(res);
      });
    },
  },
  onLoad(option) {
    this.getCategories();
    if (option.type) this.type = option.type;
    if (option.operating) this.operating = option.operating;

    this.$store.dispatch('jv/get', ['emoji', {}]).then(res => {
      console.log(res);
    });
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
.emoji-bd {
  position: relative;
  width: 100%;
}
/deep/ textarea .textarea-placeholder {
  font-size: $fg-f28;
  color: --color(--qui-FC-B5);
}
</style>
