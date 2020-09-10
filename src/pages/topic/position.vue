<template>
  <qui-page :data-qui-theme="theme" class="position">
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y"
    >
      <view class="position-head" v-if="address">
        <view class="position-head__name">{{ location }}</view>
        <view class="position-head__address">{{ address }}</view>
      </view>
      <view class="position-num" v-if="address">
        {{
          `${i18n.t('profile.nearBy')}${i18n.t('profile.total')} ${totalData} ${i18n.t(
            'profile.item',
          )}${i18n.t('core.content')}`
        }}
      </view>
      <view class="position-content">
        <view v-for="(item, index) in data" :key="index" class="position-content__item">
          <qui-thread-item
            :currentindex="index"
            :thread="item"
            @toTopic="toTopic"
            @handleClickShare="handleClickShare"
          ></qui-thread-item>
        </view>
        <qui-load-more
          :status="loadingType"
          :show-icon="false"
          v-if="loadingType"
          :content-text="contentText"
        ></qui-load-more>
      </view>
    </scroll-view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';

export default {
  mixins: forums,
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingType: '',
      data: [],
      totalData: 0, // 总数
      pageSize: 20,
      pageNum: 1, // 当前页数
      editThreadId: '',
      nowThreadId: '',
      longitude: '',
      latitude: '',
      location: '',
      address: '',
      contentText: {
        contentnomore: this.i18n.t('topic.noMoreDataNearby'),
      },
    };
  },
  mounted() {
    this.getList();
  },
  onLoad(params) {
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    // #endif
    this.longitude = params.longitude || '';
    this.latitude = params.latitude || '';
  },
  onShow() {
    this.uploadItem();
  },
  // 唤起小程序原声分享（微信）
  onShareAppMessage(res) {
    // 来自页面内分享按钮
    if (res.from === 'button') {
      const threadShare = this.$store.getters['jv/get'](`/threads/${this.nowThreadId}`);
      return {
        title: threadShare.type === 1 ? threadShare.title : threadShare.firstPost.summaryText,
        path: `/pages/position/index?id=${this.nowThreadId}`,
      };
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.forums.set_site.site_name,
      query: '',
    };
  },
  methods: {
    toTopic(id) {
      this.editThreadId = id;
    },
    handleClickShare(id) {
      this.nowThreadId = id;
    },
    getList() {
      this.loadingType = 'loading';
      const params = {
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[location]': `${this.longitude},${this.latitude}`,
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads', { params }]))
        .then(res => {
          if (res._jv) {
            this.totalData = res._jv.json.meta.threadCount;
            delete res._jv;
          }
          if (!this.address && res.length > 0) {
            this.address = res[0].address;
          }
          if (!this.location && res.length > 0) {
            this.location = res[0].location;
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
      this.getList();
    },
    uploadItem() {
      if (!this.editThreadId) {
        return;
      }
      const item = this.$store.getters['jv/get'](`threads/${this.editThreadId}`);
      this.data.forEach((data, index) => {
        if (data._jv.id === this.editThreadId) {
          this.editThreadId = '';
          this.$set(this.data, index, item);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.scroll-y {
  max-height: 100vh;
}
.position /deep/ {
  .position-head {
    padding: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .position-head__name {
    margin-bottom: 40rpx;
    font-size: $fg-f6;
    font-weight: bold;
  }
  .position-head__address {
    font-size: $fg-f3;
    color: --color(--qui-FC-777);
  }
  .position-num {
    padding: 20rpx 30rpx 0;
    font-size: $fg-f2;
    color: --color(--qui-FC-7D7979);
  }
}
</style>
