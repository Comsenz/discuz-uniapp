<template>
  <view class="popup-report">
    <view class="popup-report__title">
      <view class="popup-report__title-headline">{{ r.reportTitle }}</view>
      <view class="popup-report__title-subhead">{{ r.pleaseClickReasons }}</view>
    </view>
    <view class="popup-report__content">
      <radio-group @change="reportRadioChange">
        <label class="popup-report__content-cell" v-for="item in reportData" :key="item.value">
          <view>{{ item.name }}</view>
          <view>
            <radio :value="item.value" :checked="item.value === currentReport" />
          </view>
        </label>
      </radio-group>
      <view class="popup-report__content-textarea" v-if="currentReport === 'other'">
        <textarea
          placeholder-class="textarea-placeholder"
          :placeholder="r.otherReason"
          :maxlength="200"
          :value="otherReasonValue"
          @input="reportTextareaInput"
          fixed="true"
          @touchmove.stop="touchStop"
        />
      </view>
    </view>
    <view class="popup-report__btn">
      <button class="popup-report__btn-confirm" @click="reportConfirmClick">
        {{ r.confirm }}
      </button>
      <view class="popup-report__btn-cancel" @click="reportCancelClick">
        {{ r.cancel }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 当前登录id
    currentLoginId: {
      default: 0,
      type: Number,
    },
    // 主题id
    threadId: {
      default: '',
      type: String,
    },
    // 回复id
    commentId: {
      default: '',
      type: String,
    },
    // 举报类型
    reportType: {
      default: 0,
      type: Number,
    },
  },
  data: () => {
    return {
      reportData: [
        {
          // 举报理由
          value: 'advertisingRubbish',
          name: '广告垃圾',
        },
        {
          value: 'illegalContent',
          name: '违规内容',
        },
        {
          value: 'maliciousIrrigation',
          name: '恶意灌水',
        },
        {
          value: 'repeatPost',
          name: '重复发帖',
        },
        {
          value: 'other',
          name: '其他',
        },
      ],
      currentReport: '', // 当前举报理由
      otherReasonValue: '', // 其他理由
    };
  },
  computed: {
    // report举报语言包
    r() {
      return this.i18n.t('report');
    },
  },
  methods: {
    // 切换举报理由
    reportRadioChange(e) {
      this.currentReport = e.target.value;
    },
    // 监听其他理由输入
    reportTextareaInput(e) {
      this.otherReasonValue = e.detail.value;
    },
    // 确认举报
    reportConfirmClick() {
      if (!this.currentReport) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('report.pleaseClickReasons'),
        });
        return;
      }
      let reason = '';
      if (this.currentReport === 'other') {
        if (!this.otherReasonValue) {
          uni.showToast({
            icon: 'none',
            title: this.i18n.t('report.enterOtherReason'),
          });
          return;
        }
        reason = this.otherReasonValue;
      } else {
        this.reportData.forEach(item => {
          if (item.value === this.currentReport) {
            reason = item.name;
          }
        });
      }
      let params = null;
      if (this.reportType === 1) {
        params = {
          _jv: {
            type: 'reports',
          },
          user_id: this.currentLoginId,
          thread_id: parseInt(this.threadId, 10),
          type: this.reportType,
          reason: `${reason}`,
        };
      } else {
        params = {
          _jv: {
            type: 'reports',
          },
          user_id: this.currentLoginId,
          thread_id: parseInt(this.threadId, 10),
          post_id: parseInt(this.commentId, 10),
          type: this.reportType,
          reason: `${reason}`,
        };
      }
      this.$store.dispatch('jv/post', params).then(res => {
        if (res._jv) {
          this.$emit('reportClose');
          uni.showToast({
            icon: 'none',
            title: this.i18n.t('report.reportSucceed'),
          });
        }
      });
    },
    // 取消举报
    reportCancelClick() {
      this.otherReasonValue = '';
      this.currentReport = '';
      this.$emit('reportClose');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

// 举报弹框
.popup-report {
  background: --color(--qui-BG-2);
  border-radius: 10rpx 10rpx 0rpx 0rpx;

  &__title {
    padding: 40rpx 0rpx;
    text-align: center;

    &-headline {
      font-size: $fg-f4;
      color: --color(--qui-FC-333);
    }

    &-subhead {
      margin-top: 20rpx;
      font-size: $fg-f2;
      color: --color(--qui-FC-AAA);
    }
  }

  &__content {
    padding-left: 40rpx;

    &-cell {
      display: flex;
      padding-right: 40rpx;
      line-height: 100rpx;
      border-bottom: 1px solid var(--qui-BOR-ED);
      align-items: center;
      justify-content: space-between;
    }

    &-cell:last-child {
      border-bottom: 0;
    }

    &-textarea {
      padding-right: 40rpx;

      textarea {
        width: 100%;
        height: 180rpx;
        padding: 20rpx;
        font-size: $fg-f4;
        background-color: --color(--qui-BG-1);
        border: 1px solid var(--qui-BOR-DDD);
        box-sizing: border-box;
      }
    }
  }

  &__btn {
    margin-top: 30rpx;
    background: --color(--qui-BG-ED);

    &-confirm {
      width: 100%;
      height: 100rpx;
      margin-bottom: 10rpx;
      font-size: $fg-f4;
      font-weight: normal;
      line-height: 100rpx;
      color: --color(--qui-FC-FFF);
      text-align: center;
      background: --color(--qui-MAIN);
      border-radius: 0;
    }

    &-cancel {
      width: 100%;
      height: 100rpx;
      font-size: $fg-f4;
      font-weight: normal;
      line-height: 100rpx;
      text-align: center;
      background: --color(--qui-FC-FFF);
    }
  }

  .textarea-placeholder {
    font-size: $fg-f4;
    color: --color(--qui-FC-B5);
  }
}
</style>
