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
        :list="allEmoji"
        position="absolute"
        top="20rpx"
        v-if="emojiShow"
        border-radius="10rpx"
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
    ></textarea>
    <qui-uploader
      url="https://dq.comsenz-service.com/api/attachments"
      :header="header"
      :form-data="formData"
      async-clear
      ref="upload"
      v-if="type === 1 || type === 3"
      @change="uploadChange"
      @clear="uploadClear"
    ></qui-uploader>
    <qui-cell-item
      :class="price > 0 ? 'cell-item-right-text' : ''"
      :title="i18n.t('discuzq.post.paymentAmount')"
      :addon="showPrice"
      arrow
      v-if="type !== 0"
      @click="cellClick"
    ></qui-cell-item>
    <view class="post-box__ft">
      <text class="post-box__ft-tit">{{ i18n.t('discuzq.post.chooseCategory') }}</text>
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
    <uni-popup ref="popupBtm" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <text class="popup-title">{{ i18n.t('discuzq.post.selectToViewPaymentAmount') }}</text>
          <view class="popup-content-btn">
            <qui-button
              v-for="(item, index) in payNum"
              :key="index"
              :type="payNumCheck[0].name === item.name ? 'primary' : 'default'"
              plain
              @click="moneyClick(index)"
            >
              {{ item.name }}
            </qui-button>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel()">{{ i18n.t('discuzq.post.cancel') }}</text>
      </view>
    </uni-popup>
    <uni-popup ref="popup" type="center">
      <view class="popup-dialog">
        <view class="popup-dialog__top">
          <text>{{ i18n.t('discuzq.post.enterToViewPaymentAmount') }}</text>
        </view>
        <view class="popup-dialog__cont">
          <qui-icon class="popup-dialog__cont-rmb" name="icon-rmb" size="40"></qui-icon>
          <input
            class="popup-dialog__cont-input"
            v-model="inputPrice"
            type="digit"
            placeholder="0.0"
            focus
          />
        </view>
        <view class="popup-dialog__ft">
          <button class="popup-btn--close" @click="diaLogClose">
            {{ i18n.t('discuzq.close') }}
          </button>
          <button class="popup-btn--ok" @click="diaLogOk">{{ i18n.t('discuzq.ok') }}</button>
        </view>
      </view>
    </uni-popup>
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
      title: '',
      price: 0,
      inputPrice: 0.0,
      operating: '',
      emojiShow: false,
      header: {},
      formData: {},
      payNum: [
        {
          name: this.i18n.t('discuzq.post.free'),
          pay: 0,
        },
        {
          name: '￥2',
          pay: 2,
        },
        {
          name: '￥5',
          pay: 5,
        },
        {
          name: '￥10',
          pay: 10,
        },
        {
          name: '￥20',
          pay: 20,
        },
        {
          name: '￥50',
          pay: 50,
        },
        {
          name: '￥88',
          pay: 88,
        },
        {
          name: '￥128',
          pay: 128,
        },
        {
          name: this.i18n.t('discuzq.post.customize'),
          pay: 0,
        },
      ],
      payNumCheck: [
        {
          name: this.i18n.t('discuzq.post.free'),
          pay: 0,
        },
      ],
      uploadFile: [],
    };
  },
  provide: {
    popup: 'popup',
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
    showPrice() {
      let pay = this.i18n.t('discuzq.post.free');

      if (this.price <= 0) {
        pay = this.i18n.t('discuzq.post.free');
      } else {
        pay = `￥${this.price + this.i18n.t('discuzq.post.yuan')}`;
      }
      return pay;
    },
  },
  methods: {
    diaLogClose() {
      this.$refs.popup.close();
    },
    diaLogOk() {
      this.price = this.inputPrice;
      this.$refs.popup.close();
    },

    moneyClick(index) {
      this.payNumCheck = [];
      this.payNumCheck.push(this.payNum[index]);

      if (this.payNumCheck[0].name === '自定义') {
        console.log('自定义');
        // this.popupType = 'dialog';
        this.$refs.popupBtm.close();

        this.$nextTick(() => {
          this.$refs.popup.open();
        });
      } else {
        this.price = this.payNumCheck[0].pay;
        this.$refs.popupBtm.close();
      }
    },
    cellClick() {
      this.$refs.popupBtm.open();
    },
    cancel() {
      this.$refs.popupBtm.close();
    },
    uploadChange(e) {
      this.uploadFile = e;
    },
    uploadClear(list, del) {
      this.delAttachments(list.data.id).then(() => {
        this.$refs.upload.clear(del);
      });
    },
    getEmojiClick(num) {
      /* this.emojiShow = false;

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
      } */

      this.textAreaValue += this.allEmoji[num].code;
      this.emojiShow = false;
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

      /* uni.navigateTo({
        url: `/pages/topic/index?id=${res.data.data.id}`,
      }); */
    },

    // 接口请求
    getCategories() {
      this.$store.dispatch('jv/get', ['categories', {}]).then(res => {
        this.$set(this.checkClassData, 1, res[1]);
      });
    },
    getEmoji() {
      this.$store.dispatch('jv/get', ['emoji', {}]);
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

      if (this.type === 3) {
        params._jv.relationships.attachments = {
          data: [],
        };
        this.uploadFile.forEach(item => {
          params._jv.relationships.attachments.data.push({
            type: 'attachments',
            id: item.data.id,
          });
        });
      }

      this.$store.dispatch('jv/post', params).catch(err => {
        console.log(err);
      });
    },
    delAttachments(id) {
      const params = {
        _jv: {
          type: `attachments/${id}`,
        },
      };

      return this.$store
        .dispatch('jv/delete', params)
        .then(res => {
          return res;
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
  onLoad(option) {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIiLCJqdGkiOiI5NTZiYzZhODhiYjUyNzVhMmZmNDU4ZDI5MmU3ZDVkMDExZGYwMDA5YThkZDk5ZjVkMDE4ZjBmMTAzMTdlODI3MTg4OGUzMzJiZDAyNjhlYSIsImlhdCI6MTU4ODczMDY1MiwibmJmIjoxNTg4NzMwNjUyLCJleHAiOjE1OTEzMjI2NTIsInN1YiI6IjEiLCJzY29wZXMiOltudWxsXX0.B0KIIPZVkSkEIWoi6aOny66ttilbWXv45eNkH4hPew_-h3c483qRjVL9K7ncA8S76Kaqq6fLt_kxqU7gehlsOTRbfDEu8_GgouAnn_t6PmYlG9ybS8D8IJnuU_jZCo4WW-PobtM9yl0lXYTooelU6a1Q0Sx6y7IEPjcG6xIQU-9H4J-Cr1fUYw9TtOMds274KgdGAkCTPRNg0qadz3BZwj-qXn6JkL3haEyzEXIfk1arWXhU2LXAZ2ukzpO2XSkw7kDezjbcQ4B3Lx890CeIzdYf4l8cB3WowYJQMtJl0Qnq6wsU2dycJH9cyXVl_wQ6lCXRiDE-lV0X-SiK3qGQvQ';
    this.header = {
      authorization: `Bearer ${token}`,
    };

    this.formData = {
      isGallery: 1,
    };
    this.getCategories();
    this.getEmoji();
    if (option.type) this.type = Number(option.type);
    if (option.operating) this.operating = option.operating;
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
  .popup-content-btn {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    button {
      min-height: 70rpx;
    }
  }
}
.popup-share {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  background: --color(--qui-BG-2);
}
.popup-share-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 477rpx;
  padding: 40rpx 45rpx;
  background: --color(--qui-BG-BTN-GRAY-1);
  .popup-title {
    height: 37rpx;
  }
}
.popup-share-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-FC-DDD);
}
.popup-share-btn {
  height: 100rpx;
  font-size: $fg-f28;
  line-height: 90rpx;
  color: #666;
  text-align: center;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}

/deep/ .qui-button--button {
  width: 200rpx;
  height: 100rpx;
  font-size: 40rpx;
}

.qui-button--button[size='default'] {
  height: 100rpx;
}

.emoji-bd {
  position: relative;
  width: 100%;
}
/deep/ textarea .textarea-placeholder {
  font-size: $fg-f28;
  color: --color(--qui-FC-B5);
}
.cell-item-right-text {
  /deep/ .cell-item__body__right-text {
    color: --color(--qui-RED);
  }
}

.popup-dialog {
  width: 670rpx;
  height: 342rpx;
  background-color: --color(--qui-BG-2);
  border-radius: 14rpx;
  &__top {
    padding-top: 40rpx;
    text-align: center;
    text {
      font-size: 28rpx;
      color: --color(--qui-FC-333);
    }
  }

  &__cont {
    position: relative;
    display: flex;
    align-items: center;
    padding: 24rpx 52rpx 40rpx;
    &-rmb {
      position: absolute;
      margin-left: 25rpx;
    }
    &-input {
      width: 100%;
      height: 100rpx;
      padding: 0 25rpx 0 80rpx;
      text-align: right;
      border: 1px solid --color(--qui-BOR-DDD);
      box-sizing: border-box;
    }
  }

  &__ft {
    display: flex;
    height: 100rpx;
    border-top: 2rpx solid --color(--qui-BOR-DDD);

    button {
      width: 50%;
      font-size: --color(--qui-FC-777);
      background-color: --color(--qui-BG-2);
      border-radius: 0;
      &:after {
        border: none;
      }
      &:last-of-type {
        border-left: 2rpx solid --color(--qui-BOR-DDD);
        border-bottom-right-radius: 10rpx;
      }
      &:first-of-type {
        border-bottom-left-radius: 10rpx;
      }
    }
  }
}
</style>
