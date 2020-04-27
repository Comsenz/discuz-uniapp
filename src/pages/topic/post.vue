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
    <view class="post-box__vp-upload">
      <image
        v-if="imageList.length > 0"
        v-for="item in imageList"
        :src="item.src"
        :key="item.src"
        @click="previewPicture"
      ></image>
      <view class="post-box__vp-upload__add" @click="uploadClick">+</view>
    </view>
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
      imageList: [],
      imageData: [],
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
    previewPicture() {
      console.log(123);
      uni.previewImage({
        urls: this.imageData,
        longPressActions: {
          itemList: ['发送给朋友', '保存图片', '收藏'],
          success(data) {
            console.log(
              '选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片',
            );
          },
          fail(err) {
            console.log(err.errMsg);
          },
        },
      });
    },
    uploadClick() {
      const that = this;
      uni.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          console.log(res);
          console.log(JSON.stringify(res.tempFilePaths));
          if (res.errMsg === 'chooseImage:ok') {
            that.imageList.push({
              src: res.tempFilePaths[0],
            });
            that.imageData.push(res.tempFilePaths);
            that.upload(res.tempFiles[0], res.tempFilePaths[0]);
          }
        },
      });
    },
    upload(path, pathUrl) {
      console.log(path);

      const token =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIiLCJqdGkiOiIwYmM0NzlhMDJmNDdiOWIzYmUxYTNlNmZkYWU2MGYxOGQ4NDY4ZGYxYmQ5MGUyNTllZWRlY2JlNzMxMGQ3Njc2OTYwM2E3M2Q2NWU4YjEzYSIsImlhdCI6MTU4NzY0MDc4MiwibmJmIjoxNTg3NjQwNzgyLCJleHAiOjE1OTAyMzI3ODIsInN1YiI6IjI0Iiwic2NvcGVzIjpbbnVsbF19.lvyX8Rs-sueThXVMxQOvEaiqBWLZwhSfBokK6kk7s1eVYwz-gT5TwfeAvJ4waES4tWi_yww4u1u7w1W2Ao_M7SG8860Vm02yG-M2KxXUI2nWrVApPFtdAnxZ5VtDDE9GqhUc1qwaAkL0ovVjP4-odIlxlpM7zCbmEc-R6yTDNQkcq1wimct8JD3_1ouX-JIZFrqdrUGnGEoBAts2U_eNSc3_5jFC6TyiVdBA2vPBGzFfqiu0Vdmj7xPl40Nbv_AFKy0BVldbQrt7j9lpZPqvp5vwfqj-dEVAjTRMXa17AfefAjYBo4WXf-jFW_7el6yMcZDKoPT_8R7SRVsV1-DO9A';

      const headers = {
        authorization: `Bearer  ${token}`,
      };

      const uploadTask = uni.uploadFile({
        url: 'https://dq.comsenz-service.com/api/attachments',
        fileType: 'image',
        files: path,
        filePath: pathUrl,
        name: 'file',
        header: headers,
        formData: {
          isGallery: 1,
        },
        success(res) {
          console.log(res);
          let data = res.data;
          console.warn(
            'sunui-upimg - 如发现没有获取到返回值请到源码191行修改后端返回图片路径以便正常使用插件',
            JSON.parse(data),
          );
          try {
            //Tip : 切记->主要修改这里图片的返回值为真实返回路径!!! 详情见示例
            data = JSON.parse(res.data).info;
          } catch (e) {
            throw (e, data);
          }
          // 根据自己的返回数据做相应判断,服务器返回200即代表成功请求
          /*if (res.statusCode == 200) {
            if (success) {
              success(data);
            }
          } else {
            if (fail) {
              fail(data);
            }
          }*/
        },
        fail(res) {
          console.log(res);
          if (fail) {
            fail(res);
          }
        },
      });

      uploadTask.onProgressUpdate(async function(res) {
        const progress = await res.progress;
        console.log(progress);
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
    this.getCategories();
    this.getEmoji();
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
  &__vp-upload {
    display: flex;
    flex-wrap: wrap;
    height: 160rpx;
    margin-top: 30rpx;

    image {
      width: 160rpx;
      height: 160rpx;
      margin-right: 14rpx;
    }
    &__add {
      width: 160rpx;
      height: 160rpx;
      line-height: 160rpx;
      text-align: center;
      background-color: #ededed;
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
