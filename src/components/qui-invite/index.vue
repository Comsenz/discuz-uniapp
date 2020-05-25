<template>
  <view class="invite-con">
    <!-- 记录数 -->
    <view class="invite-con-total">
      <text>共有 {{ total }} 条记录</text>
    </view>
    <!-- 邀请列表 -->
    <view class="invite-con-list">
      <qui-cell-item
        v-for="(item, index) in list"
        :border="index < list.length - 1"
        :key="item._jv.id"
        :title="item.title"
        :brief="item.time"
        slot-right
      >
        <view class="invite-con-list-invalid" @click="invalid(item._jv.id)">
          {{ i18n.t('manage.setInvalid') }}
        </view>
        <view class="invite-con-list-line"></view>
        <view class="invite-con-list-share" @click="share">
          {{ i18n.t('manage.share') }}
          <qui-icon name="icon-share1" class="share-icon"></qui-icon>
        </view>
      </qui-cell-item>
    </view>
    <!-- 分享弹窗 -->
    <uni-popup ref="popupHead" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content" style="box-sizing: border-box;">
          <button class="popup-share-button__center" open-type="share"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box">
                <qui-icon class="content-image" :name="item.icon" size="46" color="#777"></qui-icon>
              </view>
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    bottomData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  // 唤起小程序原生分享
  onShareAppMessage(res) {
    console.log('唤起小程序原生分享');
    // 来自页面内分享按钮
    if (res.from === 'button') {
      const threadShare = this.$store.getters['jv/get'](`/threads/${this.nowThreadId}`);
      return {
        title: threadShare.type === 1 ? threadShare.title : threadShare.firstPost.summary,
      };
    }
    return {
      title: this.forums.set_site.site_name,
    };
  },
  methods: {
    // 设为无效
    invalid(id) {
      this.$emit('setInvalid', id);
    },
    // 分享
    share() {
      if (parseInt(this.status, 10) === 1) {
        console.log('跳转到分享页面');
        this.$refs.popupHead.open();
      }
    },
    cancel() {
      this.$refs.popupHead.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.invite-con {
  font-size: $fg-f28;
  background: --color(--qui-BG-1);

  .invite-con-total {
    margin: 40rpx 0 20rpx 20rpx;
    font-size: $fg-f24;
    color: --color(--qui-FC-7D7979);
  }

  .invite-con-list {
    padding: 20rpx;
    margin: 20rpx;
    color: --color(--qui-FC-777);
    background: --color(--qui-BG-2);
    border-radius: 6rpx;
    box-shadow: 0rpx 4rpx 8rpx rgba(0, 0, 0, 0.05);

    .cell-item {
      height: 100rpx;
    }

    &-invalid {
      display: inline-block;
      margin: 0rpx 29rpx 0rpx 0rpx;
      vertical-align: middle;
    }

    &-line {
      display: inline-block;
      width: 0rpx;
      height: 26rpx;
      vertical-align: middle;
      border: 2rpx solid --color(--qui-BG-ED);
    }

    &-share {
      display: inline-block;
      margin: 0rpx 0rpx 0rpx 25rpx;
      vertical-align: middle;

      .share-icon {
        margin: 0rpx 0rpx 0rpx 8rpx;
      }
    }
  }
}
</style>
