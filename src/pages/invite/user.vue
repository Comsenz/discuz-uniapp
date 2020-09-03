<template>
  <qui-page :data-qui-theme="theme" class="search">
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y search-item"
    >
      <view class="search-total">
        {{ i18n.t('profile.total') }}
        <text class="search-total__detail">{{ totalNum }}</text>
        {{ i18n.t('profile.item') }}
        {{ i18n.t('profile.records') }}
        <view class="search-total__invove">
          {{ i18n.t('profile.amountinvolved') }}
          <text class="search-total__invove__detail">{{ `￥${totalMoney}` }}</text>
        </view>
      </view>
      <view class="search-item__users" v-if="data.length > 0">
        <view class="search-item__users__box" v-for="(item, index) in data" :key="index">
          <qui-avatar
            class="search-item__users__box-avatar"
            :user="item.sourceUser || ''"
            size="70"
            :is-real="item.isReal"
          />
          <qui-cell-item
            :title="item.sourceUser && item.sourceUser.username"
            :brief="timeHandle(item.created_at)"
            :addon="`+ ${item.change_available_amount}`"
          ></qui-cell-item>
        </view>
      </view>
      <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
    </scroll-view>
  </qui-page>
</template>

<script>
import { time2MinuteOrHour } from '@/utils/time';

export default {
  data() {
    return {
      totalNum: 0,
      totalMoney: 0,
      loadingType: '',
      userId: '',
      data: [],
      pageSize: 20,
      pageNum: 1, // 当前页数
    };
  },
  onLoad(params) {
    this.userId = params.id;
    this.getUserList();
    uni.setNavigationBarTitle({
      title: params.name,
    });
  },
  methods: {
    timeHandle(time) {
      return time2MinuteOrHour(time);
    },
    // 获取用户列表
    getUserList() {
      this.loadingType = 'loading';
      const params = {
        include: ['sourceUser'],
        'filter[source_user_id]': this.userId,
        'filter[change_type]': [33, 62, 34],
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
      };
      this.$store.dispatch('jv/get', ['wallet/log', { params }]).then(res => {
        if (res._jv) {
          this.totalMoney = res._jv.json.meta.sumChangeAvailableAmount;
          this.totalNum = res._jv.json.meta.total;
          delete res._jv;
        }
        this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        this.data = [...this.data, ...res];
      });
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getUserList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
/* #ifdef H5 */
$height: calc(100vh - 44px);
/* #endif */

/* #ifdef MP-WEIXIN */
$height: 100vh;
/* #endif */
.search-total {
  position: relative;
  padding: 24rpx 40rpx;
  margin-bottom: 30rpx;
  font-size: $fg-f2;
  background-color: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.search-total__detail {
  margin: 0 5rpx;
  font-weight: bold;
}
.search-total__invove {
  position: absolute;
  top: 24rpx;
  right: 40rpx;
}
.search-total__invove__detail {
  margin-left: 10rpx;
  font-weight: bold;
}
/deep/ .cell-item__body__right {
  padding-right: 40rpx;
  font-size: $fg-f4;
  color: --color(--qui-FC-AAA);
}
/deep/ .cell-item .cell-item__body__right-text {
  font-weight: bold;
  color: --color(--qui-RED);
}
.search-item__users__box-avatar {
  position: absolute;
  top: 16rpx;
  left: 40rpx;
}
.search-item__users__box {
  position: relative;
  padding-left: 130rpx;
}
.search-item__users {
  padding-top: 20rpx;
  background: --color(--qui-BG-2);
}
/deep/ .uni-load-more {
  background: --color(--qui-BG-2);
}
.scroll-y {
  max-height: $height;
}
</style>
