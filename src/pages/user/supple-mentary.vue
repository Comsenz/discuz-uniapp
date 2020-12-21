<template>
  <qui-page :data-qui-theme="theme">
    <view class="supple-mentary">
      <view class="supple-mentary-box" v-for="(item, index) in dataList" :key="index">
        <view class="supple-mentary-box__title" v-if="item.status === 1">
          {{ `${index + 1}.${item.name}` }}
          <text
            class="supple-mentary-box__title-checkdes"
            v-if="item.status === 1 && item.type === 3"
          >
            {{ i18n.t('user.checkbox') }}
          </text>
          <text class="supple-mentary-box__title-sign" v-if="item.required === 1">*</text>
          <view class="uploader-add" @tap="uploadFileBtn(index)" v-if="item.type === 5">
            <qui-icon name="icon-fujian" color="#aaa" size="36"></qui-icon>
            <view class="uploader-add__fonts">{{ i18n.t('profile.uploadFile') }}</view>
          </view>
        </view>
        <view class="supple-mentary-box__con">
          <!-- 单行文本 -->
          <input
            class="input"
            maxlength="15"
            v-model="item.fields_detail"
            :placeholder="i18n.t('user.pleaseEnterTheContent')"
            placeholder-style="color: #ddd"
            v-if="item.status === 1 && item.type === 0"
          />
          <!-- 多行文本 -->
          <textarea
            class="textarea"
            placeholder-class="textarea-placeholder"
            :placeholder="i18n.t('user.pleaseEnterTheContent')"
            placeholder-style="color: #ddd"
            :maxlength="200"
            v-model="item.fields_detail"
            v-if="item.status === 1 && item.type === 1"
          />
          <!-- 单选 -->
          <radio-group @change="radioChange" v-if="item.status === 1 && item.type === 2">
            <label
              v-for="(radioItem, radioIndex) in item.fields_options.options"
              :key="radioIndex"
              class="supple-mentary-box__con-item"
            >
              <view>
                <radio :value="`${radioItem.value}-${index}`" />
              </view>
              <view class="item-name">{{ radioItem.value }}</view>
            </label>
          </radio-group>
          <!-- 多选 -->
          <checkbox-group @change="checkboxChange" v-if="item.status === 1 && item.type === 3">
            <label
              v-for="(checkItem, checkIndex) in item.fields_options.options"
              :key="checkIndex"
              class="supple-mentary-box__con-item"
            >
              <view>
                <checkbox :value="`${checkItem.value}-${index}`" />
              </view>
              <view class="item-name">{{ checkItem.value }}</view>
            </label>
          </checkbox-group>
          <!-- 图片上传 -->
          <view v-if="item.status === 1 && item.type === 4">
            <!-- #ifdef MP-WEIXIN -->
            <qui-uploader
              :url="`${url}api/attachments`"
              :form-data="formData"
              :file-preview="filePreview"
              :delete-type="0"
              :login-status="loginStatus"
              :extend-index="index"
              name="file"
              :async-clear="true"
              :ref="`upload-${index}`"
              @change="uploadChange"
              @clear="uploadClear"
              @uploadClick="uploadClick"
            ></qui-uploader>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <qui-uploader
              :url="`${url}api/attachments`"
              :form-data="formData"
              :file-preview="filePreview"
              :delete-type="0"
              :extend-index="index"
              :login-status="loginStatus"
              name="file"
              :async-clear="true"
              :ref="`upload-${index}`"
              @change="uploadChange"
              @clear="uploadClear"
              @uploadClick="uploadClick"
            ></qui-uploader>
            <!-- #endif -->
          </view>
          <!-- 附件上传 -->
          <view v-if="item.status === 1 && item.type === 5">
            <qui-upload-file
              :url="`${url}api/attachments`"
              :ref="`uploadFiles-${index}`"
              :login-status="loginStatus"
              :extend-index="index"
              :file-format="forums.set_attach && forums.set_attach.support_file_ext"
              :file-size="forums.set_attach && forums.set_attach.support_max_size"
              @change="fileChange(index)"
              @setToolTips="setToolTips"
              v-show="false"
            ></qui-upload-file>
            <view class="file-box" v-if="item.fields_detail.length > 0">
              <view
                class="file-box__item"
                v-for="(fileItem, fileIndex) in item.fields_detail"
                :key="fileIndex"
              >
                <view class="attachment-name">
                  <qui-icon
                    class="icon-attachment"
                    :name="fileItem.fileName ? `icon-${fileItem.format}` : `icon-resources`"
                    size="22"
                  ></qui-icon>
                  <text>{{ fileItem.fileName }}</text>
                  <qui-icon
                    class="icon-shanchu"
                    name="icon-shanchu"
                    color="#FB7474"
                    size="22"
                    @click="deleteFile(fileItem.id, index)"
                  ></qui-icon>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="supple-mentary-btn" @click="handleRegister">
        {{ i18n.t('user.register') }}
      </view>
    </view>
    <!-- 删除弹框 -->
    <uni-popup ref="deletePopup" type="center">
      <uni-popup-dialog
        type="warn"
        :content="deleteTip"
        :before-close="true"
        @close="handleDeleteCancel"
        @confirm="handleDeleteOk"
      ></uni-popup-dialog>
    </uni-popup>
    <qui-toast ref="toast"></qui-toast>
  </qui-page>
</template>

<script>
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import forums from '@/mixin/forums';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';

export default {
  components: { uniPopupDialog },
  mixins: [forums],
  data() {
    return {
      dataList: [], // 扩展信息list
      url: DISCUZ_REQUEST_HOST, // 上传url
      formData: {
        type: 1,
      }, // 图片请求data
      filePreview: [], // 服务器上传
      uploadStatus: true, // 图片上传状态
      deleteType: '', // 图片删除类型 0为图片，1为附件
      deleteTip: '', // 删除提示
      deleteId: '', // 当前点击要删除的图片Id
      deleteIndex: '', // 当前点击要删除的图片index
      extendIndex: '', // 当前要删除项在扩展信息中的下标
      loginStatus: 0, // 登陆状态 0 未登陆 1已登录
    };
  },
  computed: {
    userId() {
      return this.$store.getters['session/get']('userId');
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 单选状态改变
    radioChange(e) {
      const val = e.target.value.split('-');
      const fileList = this.dataList[Number(val[1])];
      fileList.fields_detail = fileList.fields_options;
      fileList.fields_detail.options.forEach((v, index) => {
        if (v.value === val[0]) {
          fileList.fields_detail.options[index].checked = true;
        }
      });
    },
    // 多选状态改变
    checkboxChange(e) {
      const val = e.target.value;
      const vIndex = Number(val[0].split('-')[1]);
      const valArr = val.map(v => v.split('-')[0]);
      const fileList = this.dataList[vIndex];
      fileList.fields_detail = fileList.fields_options;
      fileList.fields_detail.options.forEach((v, index) => {
        if (valArr.indexOf(v.value) !== -1) {
          fileList.fields_detail.options[index].checked = true;
        } else {
          fileList.fields_detail.options[index].checked = false;
        }
      });
    },
    // 图片上传
    uploadClick(e) {
      this.uploadStatus = e;
    },
    // 图片列表改变
    uploadChange(e, status, eIndex) {
      this.uploadStatus = status;
      this.dataList[eIndex].fields_detail = e;
    },
    // 删除图片显示弹框
    uploadClear(list, del, eIndex) {
      this.deleteType = 0;
      this.deleteId = list.id;
      this.deleteIndex = del;
      this.extendIndex = eIndex;
      this.$refs.deletePopup.open();
      this.deleteTip = this.i18n.t('core.deleteImgSure');
    },
    // 取消删除
    handleDeleteCancel() {
      this.$refs.deletePopup.close();
    },
    // 删除文件
    handleDeleteOk() {
      this.$refs.deletePopup.close();
      if (this.deleteType === 0) {
        // 删除图片
        const fieldList = this.dataList[this.extendIndex].fields_detail;
        fieldList.forEach((item, index) => {
          if (this.deleteId === item.id) {
            fieldList.splice(index, 1);
          }
        });
        this.$refs[`upload-${this.extendIndex}`][0].clear(this.deleteIndex);
      } else {
        // 删除附件
        const fieldList = this.dataList[this.extendIndex].fields_detail;
        fieldList.forEach((item, index) => {
          if (this.deleteId === item.id) {
            fieldList.splice(index, 1);
            this.$refs[`uploadFiles-${this.extendIndex}`][0].deleteItem(index);
          }
        });
      }
    },
    // 附件上传
    uploadFileBtn(eIndex) {
      this.$refs[`uploadFiles-${eIndex}`][0].uploadBtn();
    },
    // 附件列表改变
    fileChange(eIndex) {
      const fileList = this.$refs[`uploadFiles-${eIndex}`][0].getValue();
      fileList.forEach(v => {
        this.dataList[eIndex].fields_detail.push({
          id: v.id,
          fileName: v.attributes.fileName,
          url: v.attributes.url,
          format: v.attributes.fileName
            .substring(v.attributes.fileName.lastIndexOf('.') + 1)
            .toUpperCase(),
        });
      });
    },
    // 删除附件显示弹框
    deleteFile(id, eIndex) {
      this.deleteType = 1;
      this.deleteId = id;
      this.extendIndex = eIndex;
      this.$refs.deletePopup.open();
      this.deleteTip = this.i18n.t('core.deleteEnclosureSure');
    },
    // 提示信息 - 附件上传
    setToolTips(msg) {
      this.$refs.toast.show({ message: msg });
    },
    // 获取扩展信息
    getData() {
      this.$store.dispatch('jv/get', ['user/signinfields', {}]).then(res => {
        console.log('扩展信息', res);
        const data = res;
        data.forEach(item => {
          const dataItem = item;
          if (item.type === 2 || item.type === 3) {
            dataItem.fields_options = JSON.parse(item.fields_ext);
          }
          if (item.type > 1) {
            dataItem.fields_detail = [];
          } else {
            dataItem.fields_detail = '';
          }
        });
        this.dataList = data;
      });
    },
    // 提交扩展信息
    submitData() {
      const params = {
        data: [],
      };
      this.dataList.forEach(item => {
        const dataItem = item;
        if (item.type === 0 || item.type === 1) {
          dataItem.fields_ext = item.fields_detail;
        } else if (item.type === 2 || item.type === 3) {
          dataItem.fields_ext = JSON.stringify(item.fields_detail);
        } else if (item.type === 4) {
          if (item.fields_detail.length > 0) {
            const fileList = [];
            item.fields_detail.forEach(imgItem => {
              fileList.push({
                id: imgItem.id,
                fileName: imgItem.attributes.fileName,
                url: imgItem.attributes.url,
              });
            });
            dataItem.fields_ext = JSON.stringify(fileList);
          } else {
            dataItem.fields_ext = '';
          }
        } else {
          dataItem.fields_ext =
            item.fields_detail.length > 0 ? JSON.stringify(item.fields_detail) : '';
        }
        // 处理拓展字段
        params.data.push({
          type: 'user_sign_in',
          attributes: {
            aid: item.aid,
            name: item.name,
            id: item.id,
            user_id: this.userId,
            type: item.type,
            fields_desc: item.fields_desc,
            type_desc: item.type_desc,
            required: item.required,
            fields_ext: item.fields_ext,
            remark: item.remark,
            status: item.status,
          },
        });
      });
      console.log(params, '提交数据');
      this.$store
        .dispatch('jv/post', [{ _jv: { type: 'user/signinfields' } }, { data: params }])
        .then(res => {
          this.$router.push('/');
          console.log('提交扩展信息', res);
        });
    },
    // 扩展信息验证
    handleRegister() {
      this.dataList.forEach(item => {
        if (item.required === 1) {
          if (!item.fields_detail || item.fields_detail.length < 1) {
            this.$refs.toast.show({ message: `${item.name}不能为空` });
            return false;
          }
        }
      });
      this.submitData();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.supple-mentary {
  padding-top: 40rpx;
  background-color: --color(--qui-BG-2);

  &-btn {
    width: 670rpx;
    height: 90rpx;
    margin: 50rpx auto 60rpx;
    line-height: 90rpx;
    color: --color(--qui-FC-FFF);
    text-align: center;
    background-color: --color(--qui-MAIN);
    border-radius: 5rpx;
  }
}
.supple-mentary-box {
  padding: 0rpx 30rpx;
  font-size: 28rpx;

  &__title {
    position: relative;
    display: flex;
    line-height: 60rpx;
    color: #999;
    align-items: center;

    &-checkdes {
      margin-left: 15rpx;
      color: #2699fb;
    }

    &-sign {
      margin-left: 10rpx;
      color: #f12c20;
    }
  }

  &__con {
    color: --color(--qui-FC-333);

    &-item {
      display: flex;
      font-size: 32rpx;
      line-height: 80rpx;

      .item-name {
        margin-left: 15rpx;
      }
    }

    .input {
      padding: 20rpx;
      border: 2rpx solid --color(--qui-BOR-DDD);
      border-radius: 10rpx;
    }

    .textarea {
      width: 100%;
      padding: 20rpx;
      border: 2rpx solid --color(--qui-BOR-DDD);
      border-radius: 10rpx;
      box-sizing: border-box;
    }
  }

  .uploader-add {
    position: absolute;
    right: 15rpx;
    display: flex;
  }
}
.file-box {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  &__item {
    position: relative;
    height: 60rpx;
    padding: 0 20rpx;
    margin-bottom: 10rpx;
    overflow: hidden;
    font-size: 24rpx;
    line-height: 60rpx;
    border: 2rpx solid --color(--qui-BOR-ED);
    border-radius: 5rpx;
    box-sizing: border-box;
  }
  .attachment-name {
    max-width: 100%;
    padding-right: 40rpx;
    overflow: hidden;
    font-size: $fg-f2;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .icon-attachment {
    margin-right: 10rpx;
  }
  .icon-shanchu {
    position: absolute;
    right: 20rpx;
    font-weight: bold;
  }
}
</style>
