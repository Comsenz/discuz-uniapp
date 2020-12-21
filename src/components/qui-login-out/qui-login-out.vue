<template>
  <view class="logout">
    <!-- 用户名模式和手机号模式展示退出登录按钮，无感模式不展示退出登录按钮 -->
    <view v-if="forums.set_reg && forums.set_reg.register_type !== 2">
      <qui-button size="small" @click="logout">
        {{ i18n.t('user.logout') }}
      </qui-button>
    </view>
    <uni-popup ref="popup" type="center">
      <uni-popup-dialog
        type="warn"
        :content="i18n.t('user.loginOutTips')"
        :before-close="true"
        @close="handleClickCancel"
        @confirm="handleClickOk"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import { SITE_PAY } from '@/common/const';
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';
import { mapState, mapMutations } from 'vuex';

export default {
  components: { uniPopupDialog },
  mixins: [forums, user],
  data() {
    return {
      site_mode: '', // 站点模式
    };
  },
  computed: {
    ...mapState({
      footerIndex: state =>
        state.footerTab.footerIndex ? parseInt(state.footerTab.footerIndex, 10) : 0,
    }),
  },
  created() {
    if (this.forums && this.forums.set_reg) {
      this.site_mode = this.forums.set_site.site_mode;
    }
  },
  methods: {
    ...mapMutations({
      setFooterIndex: 'footerTab/SET_FOOTERINDEX',
    }),
    logout() {
      this.$refs.popup.open();
    },
    handleClickOk() {
      // #ifdef MP-WEIXIN
      this.$store.dispatch('session/logout').then(() => {
        uni.clearStorage();
        if (this.site_mode !== SITE_PAY) {
          this.setFooterIndex(parseInt(0, 10));
        }
        if (this.site_mode === SITE_PAY && this.user && !this.user.isPaid) {
          uni.redirectTo({
            url: '/pages/site/info',
          });
        }
      });
      // #endif
      // #ifdef H5
      this.$store.dispatch('session/logout').then(() => {
        this.handleClickCancel();
        window.location.reload();
      });
      // #endif
    },
    handleClickCancel() {
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.logout {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
}
/deep/ .qui-button--button {
  display: inline-block;
  line-height: 90rpx;
  vertical-align: middle;
}
</style>
