<template>
  <view class="qui-back">
    <view class="qui-back__body">
      <view class="qui-back__body__content">
        <view class="qui-back__body__content-title" @tap="backPage('/pages/home/index', '0')">
          <qui-icon
            name="icon-home-icon"
            size="32"
            :color="theme === $u.light() ? '#333' : '#fff'"
          ></qui-icon>
          <text>{{ title || i18n.t('profile.backhomePage') }}</text>
        </view>
      </view>
      <view class="qui-back_body__right" v-if="slotRight">
        <slot></slot>
      </view>
      <view class="qui-back__body__right" v-if="!slotRight && isLogin">
        <view class="qui-back__body__right-pop">
          <text class="qui-back__body__right-pop-item" @tap="footerOpen">
            <text class="qui-back__body__right-pop-item-add">+</text>
            {{ i18n.t('profile.post') }}
          </text>
          <text
            :class="['qui-back__body__right-pop-item', redCircle ? 'message' : '']"
            @tap="backPage('/pages/home/index', '1')"
          >
            {{ i18n.t('profile.notice') }}
          </text>
          <text class="qui-back__body__right-pop-item" @tap="backPage('/pages/home/index', '2')">
            {{ i18n.t('profile.mine') }}
          </text>
          <!-- 管理员才显示站点管理 -->
          <text
            class="qui-back__body__right-pop-item"
            @tap="backPage('/pages/manage/index')"
            v-show="forums.other && forums.other.can_create_invite"
          >
            {{ i18n.t('topic.management') }}
          </text>
        </view>
      </view>
    </view>
    <!-- 发帖弹框 -->
    <uni-popup ref="popup" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="handleClick(item)">
                <qui-icon class="content-image" :name="item.icon" size="56" color="#777"></qui-icon>
              </view>
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>

<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'QuiBack',
  mixins: [forums, user],
  props: {
    title: {
      type: String,
      default: '',
    },
    slotRight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      bottomData: [],
      isLogin: this.$store.getters['session/get']('isLogin'),
    };
  },

  computed: {
    userId() {
      return this.$store.getters['session/get']('userId');
    },
    userInfo() {
      const userInfo = this.$store.getters['jv/get'](`users/${this.userId}`);
      userInfo.groupsName = userInfo.groups ? userInfo.groups[0].name : '';
      return userInfo;
    },
    redCircle() {
      return this.user.unreadNotifications;
    },
    ...mapState({
      getCategoryId: state => state.session.categoryId,
      getCategoryIndex: state => state.session.categoryIndex,
      footerIndex: state => state.footerTab.footerIndex,
    }),
  },
  methods: {
    backPage(pageUrl, index) {
      if (index) {
        this.setFooterIndex(parseInt(index, 10));
      }
      uni.navigateTo({
        url: pageUrl,
      });
    },
    ...mapMutations({
      setFooterIndex: 'footerTab/SET_FOOTERINDEX',
    }),
    // 首页底部发帖按钮弹窗
    footerOpen() {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      if (this.forums.other.publish_need_real_name) {
        this.$refs.toast.show({ message: this.i18n.t('home.needRealname') });
        return;
      }
      if (this.forums.other.publish_need_bind_phone) {
        this.$refs.toast.show({ message: this.i18n.t('home.needPhone') });
        return;
      }

      if (!this.forums.other.can_create_thread_in_category) {
        this.$refs.toast.show({ message: this.i18n.t('home.noPostingPermission') });
        return;
      }

      if (this.getCategoryId) {
        const category = this.$store.getters['jv/get'](`categories/${this.getCategoryId}`);
        if (!category.canCreateThread) {
          this.$refs.toast.show({ message: this.i18n.t('home.noPostingPermission') });
        }
      }

      if (
        !this.forums.other.can_create_thread &&
        !this.forums.other.can_create_thread_long &&
        !this.forums.other.can_create_thread_video &&
        !this.forums.other.can_create_thread_image
      ) {
        this.$refs.toast.show({ message: this.i18n.t('home.noPostingPermission') });
        return;
      }
      this.bottomData = [];
      if (this.forums.other.can_create_thread) {
        this.bottomData.push({
          text: this.i18n.t('home.word'),
          icon: 'icon-word',
          name: 'text',
          type: 0,
        });
      }
      if (this.forums.other.can_create_thread_long) {
        this.bottomData.push({
          text: this.i18n.t('home.invitation'),
          icon: 'icon-post',
          name: 'post',
          type: 1,
        });
      }
      if (this.forums.other.can_create_thread_video) {
        this.bottomData.push({
          text: this.i18n.t('home.video'),
          icon: 'icon-video',
          name: 'video',
          type: 2,
        });
      }
      if (this.forums.other.can_create_thread_image) {
        this.bottomData.push({
          text: this.i18n.t('home.picture'),
          icon: 'icon-img',
          name: 'image',
          type: 3,
        });
      }
      this.$refs.popup.open();
    },
    // 首页底部发帖点击事件跳转
    handleClick(item) {
      uni.navigateTo({
        url: `/pages/topic/post?type=${item.type}&categoryId=${this.getCategoryId}&categoryIndex=${this.getCategoryIndex}`,
      });
      this.cancel();
    },
    // 取消按钮
    cancel() {
      this.$refs.popup.close();
    },
    close() {
      this.$refs.auth.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.qui-back {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 8px 20px;
  background: --color(--qui-BG-2);
  border-bottom: 2px solid --color(--qui-BG-IT);
  box-sizing: border-box;
  &__body {
    position: relative;
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: space-between;
  }
  &__body__content {
    flex: 1 1 0%;
  }
  &__body__content-title {
    font-size: $fg-f28;
    color: --color(--qui-FC-333);
    transition: $switch-theme-time;
  }
  &__body__right-pop-item {
    margin-left: 20px;
    font-size: $fg-f28;
    color: --color(--qui-FC-333);
  }
  &__body__right-pop-item-add {
    margin-right: 3px;
    font-size: 20px;
  }
}
.icon-home-icon {
  margin-right: 10px;
}
.cell-item__body__right {
  align-items: center;
  justify-content: flex-end;
  font-size: $fg-f28;
  text-align: right;
}
.message {
  position: relative;
}
.message:after {
  position: absolute;
  top: 6px;
  right: -10px;
  width: 7px;
  height: 7px;
  background: --color(--qui-RED);
  border-radius: 50%;
  content: '';
}
</style>
