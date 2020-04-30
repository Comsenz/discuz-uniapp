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
      @change="uploadChange"
      @clear="uploadClear"
    ></qui-uploader>
    <cell-item
      :class="price > 0 ? 'cell-item-right-text' : ''"
      :title="i18n.t('discuzq.post.paymentAmount')"
      :addon="showPrice"
      arrow
      @click="cellClick"
    ></cell-item>
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
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
        type="input"
        mode="input"
        message="成功消息"
        :duration="2000"
        :before-close="true"
        @close="close"
        @confirm="confirm"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import cellItem from '@/components/qui-cell-item';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';

export default {
  name: 'Post',
  components: { cellItem, uniPopupDialog },
  data() {
    return {
      textAreaValue: '',
      checkClassData: {},
      type: 0,
      title: '',
      price: 0,
      operating: '',
      emojiShow: false,
      header: {},
      formData: {},
      payNum: [
        {
          name: '免费',
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
          name: '自定义',
          pay: 0,
        },
      ],
      payNumCheck: [
        {
          name: '免费',
          pay: 0,
        },
      ],
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
      let pay = '免费';

      if (this.price <= 0) {
        pay = '免费';
      } else {
        pay = `￥${this.price}元`;
      }
      return pay;
    },
  },
  methods: {
    close(done) {
      console.log('关闭');
      // done();
      this.$refs.popup.close();
    },
    confirm(done, value) {
      this.$refs.popup.close();
      // done();
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
      console.log(e);
    },
    uploadClear(list, del) {
      console.log(list);
      console.log(del);
      console.log('删除图片中');

      setTimeout(() => {
        this.$refs.upload.clear(list);
      }, 1500);
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
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
  onLoad(option) {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIiLCJqdGkiOiIwYmM0NzlhMDJmNDdiOWIzYmUxYTNlNmZkYWU2MGYxOGQ4NDY4ZGYxYmQ5MGUyNTllZWRlY2JlNzMxMGQ3Njc2OTYwM2E3M2Q2NWU4YjEzYSIsImlhdCI6MTU4NzY0MDc4MiwibmJmIjoxNTg3NjQwNzgyLCJleHAiOjE1OTAyMzI3ODIsInN1YiI6IjI0Iiwic2NvcGVzIjpbbnVsbF19.lvyX8Rs-sueThXVMxQOvEaiqBWLZwhSfBokK6kk7s1eVYwz-gT5TwfeAvJ4waES4tWi_yww4u1u7w1W2Ao_M7SG8860Vm02yG-M2KxXUI2nWrVApPFtdAnxZ5VtDDE9GqhUc1qwaAkL0ovVjP4-odIlxlpM7zCbmEc-R6yTDNQkcq1wimct8JD3_1ouX-JIZFrqdrUGnGEoBAts2U_eNSc3_5jFC6TyiVdBA2vPBGzFfqiu0Vdmj7xPl40Nbv_AFKy0BVldbQrt7j9lpZPqvp5vwfqj-dEVAjTRMXa17AfefAjYBo4WXf-jFW_7el6yMcZDKoPT_8R7SRVsV1-DO9A';
    this.header = {
      authorization: `Bearer ${token}`,
    };

    this.formData = {
      isGallery: 1,
    };
    // this.getCategories();
    // this.getEmoji();
    if (option.type) this.type = option.type;
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
    margin-top: -120rpx;
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
</style>
