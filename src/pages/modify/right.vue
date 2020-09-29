<template>
  <qui-page :data-qui-theme="theme" class="power-box">
    <view class="power-box__package">
      <view class="power-box__package-head">
        <view
          :class="
            typenum1
              ? 'power-box__package-head-smore boder-bottom'
              : 'power-box__package-head-smore'
          "
          @click="powerlist(1)"
        >
          {{ i18n.t('modify.powerlist') }}
        </view>
        <view
          :class="
            typenum2
              ? 'power-box__package-head-smore boder-bottom'
              : 'power-box__package-head-smore'
          "
          @click="powerlist(2)"
        >
          {{ i18n.t('modify.purchasepower') }}
        </view>
      </view>
      <view class="power-box__package-foot" v-if="typenum1">
        <view
          class="power-box__package-foot-list"
          v-for="(item, index) in paidusergroup"
          :key="index"
          @click="godetails(1, item._jv.id)"
        >
          <qui-cell-item :title="item.name" slot-right :arrow="false" :border="false">
            <view class="money">¥{{ item.fee.toFixed(2) }}</view>
          </qui-cell-item>
        </view>
      </view>
      <view class="power-box__package-foots" v-if="typenum2">
        <view
          class="power-box__package-foots-list"
          v-for="(sitem, index) in privilegeUserGroup"
          :key="index"
          @click="godetails(2, sitem.group_id)"
        >
          <qui-cell-item :title="sitem.group.name" slot-right :arrow="false" :border="false">
            <view class="time">
              {{ fun(sitem.expiration_time) }}
              {{ i18n.t('modify.termout') }}
            </view>
          </qui-cell-item>
        </view>
      </view>
    </view>
  </qui-page>
</template>

<script>
import user from '@/mixin/user';

export default {
  mixins: [user],
  data() {
    return {
      typenum1: true,
      typenum2: false,
      paidusergroup: [],
      privilegeUserGroup: [], // 已购买用户组权限
    };
  },
  onLoad() {
    this.allusergroups();
    this.allusergroupsusers();
    // this.allusergroupsuser();
  },
  computed: {
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
  },
  methods: {
    fun(sun) {
      const time = sun.replace(/T/, ' ').replace(/Z/, '');
      return time.substring(0, 10);
    },
    allusergroups() {
      const params = {
        'filter[isPaid]': 1,
      };
      this.$store.dispatch('jv/get', ['groups', { params }]).then(res => {
        this.paidusergroup = res;
      });
    },
    allusergroupsusers() {
      const params = {
        sort: 'created_at',
        'filter[user]': this.usersid,
        'filter[delete_type]': 0,
        include: 'group',
      };
      this.$store.dispatch('jv/get', ['groups/paid', { params }]).then(res => {
        this.privilegeUserGroup = res;
      });
    },
    powerlist(index) {
      if (index === 1) {
        this.typenum1 = true;
        this.typenum2 = false;
      } else {
        this.typenum1 = false;
        this.typenum2 = true;
      }
    },
    godetails(index, group) {
      uni.navigateTo({
        url: `/pages/modify/rightdetails?sice=${index}&groups=${group}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.power-box {
  background: --color(--qui-BG-1);
  box-sizing: border-box;
  &__package {
    width: 100vw;
    /* #ifndef H5 */
    height: 100vh;
    /* #endif */
    background-color: --color(--qui-BG-1);
    box-sizing: border-box;
    &-head {
      display: flex;
      width: 100%;
      height: 108rpx;
      background: --color(--qui-BG-2);
      border-bottom: 2rpx solid --color(--qui-BG-777);
      &-smore {
        width: 240rpx;
        height: 100%;
        font-size: 28rpx;
        font-weight: bold;
        line-height: 108rpx;
        color: --color(--qui-FC-333);
        text-align: center;
      }
      .boder-bottom {
        border-bottom: 4rpx solid --color(--qui-BG-HIGH-LIGHT);
      }
    }
    &-foot {
      padding-left: 40rpx;
      margin-top: 40rpx;
      background: --color(--qui-BG-2);
      box-sizing: border-box;
      &-list {
        // height: 150rpx;
        padding-right: 40rpx;
        border-bottom: 2rpx solid --color(--qui-BG-777);
      }
    }
    &-foots {
      padding-left: 40rpx;
      margin-top: 40rpx;
      background: --color(--qui-BG-2);
      box-sizing: border-box;
      &-list {
        // height: 150rpx;
        padding-right: 40rpx;
        border-bottom: 2rpx solid --color(--qui-BG-777);
      }
    }
  }
}
// /deep/.cell-item__body__content-title {
//   margin-top: 40rpx;
//   font-size: 28rpx;
//   color: --color(--qui-FC-333);
// }
.money {
  font-size: 28rpx;
  font-weight: bold;
  color: --color(--qui-RED);
}
.time {
  font-size: 28rpx;
  font-weight: 400;
  color: --color(--qui-FC-TAG);
}
</style>
