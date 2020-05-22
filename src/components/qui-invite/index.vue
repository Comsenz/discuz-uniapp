<template>
  <view class="invite-con">
    <!-- 记录数 -->
    <view class="invite-con-total">
      <text>共有 {{ total }} 条记录</text>
    </view>
    <!-- 邀请列表 -->
    <view class="invite-con-list">
      <qui-cell-item
        v-for="item in list"
        :key="item._jv.id"
        :title="item.title"
        :brief="item.time"
        slot-right
      >
        <view class="invite-con-list-invalid" @click="invalid(item._jv.id)">设为无效</view>
        <view class="invite-con-list-line"></view>
        <view class="invite-con-list-share" @click="share">
          分享
          <qui-icon name="icon-share1" class="share-icon"></qui-icon>
        </view>
      </qui-cell-item>
    </view>
    <!-- 分享弹窗 -->
    <uni-popup ref="popupHead" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareHead(index)">
                <qui-icon class="content-image" :name="item.icon" size="36" color="#777"></qui-icon>
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
  data() {
    return {
      bottomData: [
        {
          text: this.i18n.t('home.wxShare'),
          icon: 'icon-wx-friends',
          name: 'wx',
        },
      ],
    }
  },
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
  },
  methods: {
    // 设为无效
    invalid(id) {
      if (parseInt(this.status, 10) === 1) {
        this.$store.dispatch('jv/delete', `invite/${id}`).then(res => {
          console.log('设为无效', res);
        });
      }
    },
    // 分享
    share(code) {
      console.log('status', this.status);
      if (parseInt(this.status, 10) === 1) {
        console.log('跳转到分享页面');
        this.$refs.popupHead.open();
      }
    },
    // 头部分享海报
    shareHead(index) {
      if (index === 0) {
        this.$store.dispatch('session/setAuth', this.$refs.auth);
        if (!this.$store.getters['session/get']('isLogin')) {
          this.$refs.auth.open();
          return;
        }
        uni.navigateTo({
          url: '/pages/share/site',
        });
      }
    },
    // 取消按钮
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

    &.cell-item.border:last-child {
      border: none;
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
