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
        <text class="search-total__detail">4</text>
        {{ i18n.t('profile.item') }}
        {{ i18n.t('profile.records') }}
        <view class="search-total__invove">
          {{ i18n.t('profile.amountinvolved') }}
          <text class="search-total__invove__detail">4</text>
        </view>
      </view>
      <view class="search-item__users">
        <view class="search-item__users__box" v-for="(item, index) in data" :key="index">
          <qui-avatar
            class="search-item__users__box-avatar"
            :user="item"
            size="70"
            :is-real="item.isReal"
          />
          <qui-cell-item
            :title="item.username"
            :brief="item.groupName"
            :addon="`+ ￥15.0`"
          ></qui-cell-item>
        </view>
      </view>
      <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
    </scroll-view>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      searchValue: '',
      loadingType: '',
      data: [],
      pageSize: 20,
      pageNum: 1, // 当前页数
    };
  },
  onLoad(params) {
    this.searchValue = params.userId;
    this.getUserList(params.userId);
  },
  methods: {
    // 获取用户列表
    getUserList(key, type) {
      this.loadingType = 'loading';
      const params = {
        include: 'groups',
        sort: 'createdAt',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[username]': `*${key}*`,
      };
      this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
        if (res._jv) {
          delete res._jv;
        }
        res.forEach((v, i) => {
          res[i].groupName = v.groups[0] ? v.groups[0].name : '';
        });
        this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        if (type && type === 'clear') {
          this.data = res;
        } else {
          this.data = [...this.data, ...res];
        }
      });
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getUserList(this.searchValue);
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
  font-size: $fg-f24;
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
  font-size: $fg-f28;
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
.scroll-y {
  max-height: $height;
}
</style>
