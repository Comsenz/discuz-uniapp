<template>
  <view class="post-box">
    <view class="post-box__title" v-if="type === 1">
      <input
        class="post-box__title-input"
        type="text"
        v-model="postTitle"
        :placeholder="i18n.t('discuzq.post.pleaseEnterAPostTitle')"
      />
    </view>
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
        {{ i18n.t('discuzq.post.note', { num: textAreaLength - textAreaValue.length }) }}
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
      :maxlength="textAreaLength"
      @blur="contBlur"
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
    <view class="post-box__video" v-if="type === 2">
      <view class="post-box__video__play" v-for="(item, index) in videoBeforeList" :key="index">
        <video
          id="video"
          v-if="type === 2"
          class="post-box__video__play__video"
          :src="item.path"
          :controls="controlsStatus"
          @fullscreenchange="fullscreenchange"
        ></video>
        <view class="post-box__video__play__icon-del">
          <qui-icon name="icon-close" class="" color="#fff" size="40" @click="videoDel"></qui-icon>
        </view>
        <view class="controls-play-icon" @click.stop="playVideo">
          <qui-icon name="icon-play" size="50" color="#fff"></qui-icon>
        </view>
      </view>
      <view class="post-box__video__add" @click="uploadVideo" v-if="videoBeforeList.length < 1">
        <qui-icon name="icon-add" color="#B5B5B5" size="40"></qui-icon>
      </view>
    </view>
    <qui-cell-item
      :class="price > 0 ? 'cell-item-right-text' : ''"
      :title="i18n.t('discuzq.post.paymentAmount')"
      :addon="showPrice"
      arrow
      v-if="type !== 0"
      @click="cellClick('pay')"
    ></qui-cell-item>
    <qui-cell-item
      :title="i18n.t('discuzq.post.freeWordCount')"
      :addon="i18n.t('discuzq.post.word', { num: word })"
      v-if="price > 0 && type !== 3"
      arrow
      @click="cellClick('word')"
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
          <text class="popup-title">
            {{
              setType === 'pay'
                ? i18n.t('discuzq.post.selectToViewPaymentAmount')
                : i18n.t('discuzq.post.selectToViewFreeWordCount')
            }}
          </text>
          <view class="popup-content-btn" v-if="setType === 'pay'">
            <qui-button
              class="popup-btn"
              v-for="(item, index) in payNum"
              :key="index"
              :type="payNumCheck[0].name === item.name ? 'primary' : 'post'"
              plain
              size="post"
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
          <text>
            {{
              setType === 'pay'
                ? i18n.t('discuzq.post.enterToViewPaymentAmount')
                : i18n.t('discuzq.post.enterTheWordCount')
            }}
          </text>
        </view>
        <view class="popup-dialog__cont">
          <qui-icon
            class="popup-dialog__cont-rmb"
            name="icon-rmb"
            size="40"
            v-if="setType === 'pay'"
          ></qui-icon>
          <text class="popup-dialog__cont-rmb" v-else>
            {{ i18n.t('discuzq.post.word', { num: '' }) }}
          </text>
          <input
            class="popup-dialog__cont-input"
            v-if="setType === 'pay'"
            v-model="inputPrice"
            type="digit"
            placeholder="0.0"
            focus
          />
          <input
            class="popup-dialog__cont-input"
            v-else
            v-model="inputWord"
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
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import VodUploader from '../../common/cos-wx-sdk-v5.1';

export default {
  name: 'Post',
  data() {
    return {
      textAreaValue: '',
      textAreaLength: 450,
      postTitle: '',
      checkClassData: {},
      type: 0,
      title: '',
      price: 0,
      inputPrice: '',
      inputWord: '',
      operating: '', // 编辑或发布类型
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
      cursor: 0,
      wordCount: [
        {
          name: this.i18n.t('discuzq.post.word', { num: 5 }),
          num: 5,
        },
        {
          name: this.i18n.t('discuzq.post.word', { num: 10 }),
          num: 10,
        },
        {
          name: this.i18n.t('discuzq.post.word', { num: 15 }),
          num: 15,
        },
        {
          name: this.i18n.t('discuzq.post.word', { num: 20 }),
          num: 20,
        },
        {
          name: this.i18n.t('discuzq.post.word', { num: 25 }),
          num: 25,
        },
        {
          name: this.i18n.t('discuzq.post.customize'),
          num: 0,
        },
      ],
      wordCountCheck: [
        {
          name: this.i18n.t('discuzq.post.word', { num: 5 }),
          num: 5,
        },
      ],
      word: 5,
      setType: 'pay',
      controlsStatus: false,
      videoBeforeList: [],
      fullscreenStatus: false,
      videoName: '',
      percent: 0,
      fileId: '',
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
    // 文章类型（0:文字  1:帖子  2:视频  3:图片）

    // video
    videoDel() {
      this.videoBeforeList = [];
    },
    playVideo() {
      this.controlsStatus = true;
      this.videoContext.play();
      this.videoContext.requestFullScreen();
    },
    fullscreenchange(e) {
      this.fullscreenStatus = e.detail.fullScreen;
      if (!e.detail.fullScreen) {
        this.controlsStatus = false;
        this.videoContext.pause();
      }
    },
    uploadVideo() {
      const _this = this;
      uni.chooseVideo({
        count: 1,
        compressed: false,
        sourceType: ['camera', 'album'],
        success(res) {
          _this.videoName = res.name ? res.name : _this.i18n.t('discuzq.post.fromWeChatApplet');
          _this.videoBeforeList.push({
            path: res.tempFilePath,
          });

          VodUploader.start({
            mediaFile: res,
            getSignature: _this.getSignature,

            mediaName: res.name,
            success(result) {
              console.log('success');
              console.log(result);
            },
            error(result) {
              console.log('error');
              console.log(result);
              uni.showModal({
                title: this.i18n.t('uploader.uploadFailed'),
                content: JSON.stringify(result),
                showCancel: false,
              });
            },
            progress(result) {
              console.log('progress');
              console.log(result);
              _this.percent = result.percent;
            },
            finish(result) {
              _this.fileId = result.fileId;
              _this.postVideo(result.fileId);
              uni.showModal({
                title: this.i18n.t('uploader.uploadedSuccessfully'),
                content: this.i18n.t('uploader.videoUploadedSuccessfully'),
                showCancel: false,
              });
            },
          });
        },
      });
    },

    contBlur(e) {
      this.cursor = e.detail.cursor;
    },
    diaLogClose() {
      this.$refs.popup.close();
    },
    diaLogOk() {
      if (this.setType === 'pay') {
        this.price = this.inputPrice;
      } else {
        this.word = this.inputWord;
      }

      this.$refs.popup.close();
    },

    moneyClick(index) {
      this.setType = 'pay';
      this.payNumCheck = [];
      this.payNumCheck.push(this.payNum[index]);

      if (this.payNumCheck[0].name === this.i18n.t('discuzq.post.customize')) {
        this.$refs.popupBtm.close();

        this.$nextTick(() => {
          this.$refs.popup.open();
        });
      } else {
        this.price = this.payNumCheck[0].pay;
        this.$refs.popupBtm.close();
      }
    },
    cellClick(type) {
      this.setType = type;
      if (type === 'word') {
        this.$refs.popup.open();
      } else {
        this.$refs.popupBtm.open();
      }
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
      let text = '';
      text = `${this.textAreaValue.slice(0, this.cursor) +
        this.allEmoji[num].code +
        this.textAreaValue.slice(this.cursor)}`;

      this.textAreaValue = text;
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
      let status = true;
      if (this.textAreaValue.length < 1) {
        this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theContentCanNotBeBlank') });
        status = false;
      } else {
        switch (this.type) {
          case 0:
            break;
          case 1:
            if (this.postTitle.length < 1) {
              this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theTitleCanNotBeBlank') });
              status = false;
            } else {
              status = true;
            }
            break;
          case 2:
            if (this.videoBeforeList.length < 1) {
              this.$refs.toast.show({ message: this.i18n.t('discuzq.post.videoCannotBeEmpty') });
              status = false;
            } else if (this.percent !== 1) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.pleaseWaitForTheVideoUploadToComplete'),
              });
              status = false;
            } else {
              status = true;
            }
            break;
          case 3:
            if (this.uploadFile.length < 1) {
              this.$refs.toast.show({ message: this.i18n.t('discuzq.post.imageCannotBeEmpty') });
              status = false;
            } else {
              status = true;
            }
            break;
          default:
            status = false;
            this.$refs.toast.show({ message: this.i18n.t('core.postTypesDoNotMatch') });
        }
      }

      if (status) {
        this.postThread().then(res => {
          if (res._jv.json.data.id) {
            uni.navigateTo({
              url: `/pages/topic/index?id=${res._jv.json.data.id}`,
            });
          }
        });
      }
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
        price: this.price,
        free_words: this.word,
      };

      const postPromise = new Promise((resolve, reject) => {
        switch (this.type) {
          case 0:
            resolve();
            break;
          case 1:
            params.title = this.postTitle;
            resolve();
            break;
          case 2:
            params.file_id = this.fileId;
            params.file_name = this.videoName;
            resolve();
            break;
          case 3:
            params._jv.relationships.attachments = {
              data: [],
            };
            this.uploadFile.forEach(item => {
              params._jv.relationships.attachments.data.push({
                type: 'attachments',
                id: item.data.id,
              });
            });
            resolve();
            break;
          default:
            reject();
            this.$refs.toast.show({ message: this.i18n.t('core.postTypesDoNotMatch') });
        }
      });

      return postPromise.then(() => {
        return this.$store
          .dispatch('jv/post', params)
          .then(res => {
            return res;
          })
          .catch(err => {
            console.log(err);
          });
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
    getSignature(callback) {
      this.$store.dispatch('jv/get', ['signature', {}]).then(res => {
        if (res.signature) {
          callback(res.signature);
        } else {
          return this.i18n.t('discuzq.post.failedToObtainSignature');
        }
      });
    },
    postVideo(fileId) {
      const params = {
        _jv: {
          type: 'thread/video',
        },
        file_id: fileId,
      };
      this.$store.dispatch('jv/post', params);
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
    if (Object.keys(this.allEmoji).length < 1) {
      this.getEmoji();
    }
    if (option.type) this.type = Number(option.type);
    if (option.operating) this.operating = option.operating;
    this.textAreaLength = Number(option.type) === 1 ? 10000 : 450;
  },
  onShow() {
    let atMemberList = '';
    this.getAtMemberData.map(item => {
      atMemberList += `@${item.username} `;
      return atMemberList;
    });

    this.textAreaValue = `${this.textAreaValue.slice(0, this.cursor) +
      atMemberList +
      this.textAreaValue.slice(this.cursor)}`;
  },
  onReady() {
    this.videoContext = uni.createVideoContext('video');
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.post-box {
  width: 100vw;
  padding: 40rpx;
  overflow: hidden;
  box-sizing: border-box;

  &__title {
    display: flex;
    align-items: center;
    width: 100vw;
    height: 100rpx;
    margin-bottom: 30rpx;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    &-input {
      width: 100%;
      padding-right: 80rpx;
      font-size: $fg-f34;
    }
  }
  &__hd {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    border: 1rpx solid --color(--qui-BOR-DDD);
    border-radius: 10rpx;
    box-sizing: border-box;
  }
  &__video {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    min-height: 160rpx;
    padding: 30rpx 0;

    &__play {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160rpx;
      height: 160rpx;
      margin-right: 13rpx;

      &__video {
        z-index: 0;
        width: 100%;
        height: 100%;
        border: 1px solid #ededed;
        border-radius: 5rpx;
      }
      &__icon-del {
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50rpx;
        height: 50rpx;
        background-color: #dd524d;
        border-radius: 50px;
      }
      .controls-play-icon {
        position: absolute;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(1, 1, 1, 0.5);
      }
    }

    &__add {
      width: 160rpx;
      height: 160rpx;
      line-height: 160rpx;
      text-align: center;
      background-color: #f7f7f7;
      border: 1px solid #ededed;
      border-radius: 5rpx;
    }
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

.popup-content-btn {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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

.emoji-bd {
  position: relative;
  width: 100%;
}
/deep/ textarea .textarea-placeholder {
  font-size: $fg-f28;
  color: --color(--qui-FC-B5);
}
/deep/ input .input-placeholder {
  font-size: $fg-f34;
  color: --color(--qui-FC-AAA);
}

.cell-item-right-text {
  /deep/ .cell-item__body__right-text {
    color: --color(--qui-RED);
  }
}
/deep/ .cell-item__body__right .cell-item__body__right-text {
  font-size: $fg-f34;
}
/deep/ .cell-item__body__content-title {
  color: --color(--qui-FC-777);
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
      font-size: $fg-f28;
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
      font-size: 40rpx;
      text-align: right;
      border: 1px solid --color(--qui-BOR-DDD);
      border-radius: 10rpx;
      box-sizing: border-box;
    }
  }

  &__ft {
    display: flex;
    align-items: center;
    height: 100rpx;
    border-top: 2rpx solid --color(--qui-BOR-DDD);
    box-sizing: border-box;

    button {
      width: 50%;
      color: --color(--qui-FC-777);
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

/deep/ .uni-video-cover {
  display: none;
}
</style>
