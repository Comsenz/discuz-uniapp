<template>
  <qui-page>
    <view class="notification-box">
      <!-- 通知信息 -->
      <scroll-view
        scroll-y="true"
        @scrolltolower="pullDown"
        show-scrollbar="false"
        show-icon="true"
        class="scroll-y"
      >
        <qui-notification :list="noticeList"></qui-notification>
        <qui-load-more
          :status="loadingType"
          v-if="noticeList && noticeList.length > 0"
        ></qui-load-more>
      </scroll-view>
    </view>
  </qui-page>
</template>

<script>
import quiNotification from '@/components/qui-notification';
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  components: {
    quiNotification,
  },
  data() {
    return {
      loadingType: 'more', // 上拉加载状态
      pageSize: 10, // 每页10条数据
      pageNum: 1, // 当前页数
      noticeList: [], // 通知列表
      type: '', // 当前的通知类型
    };
  },
  onLoad(params) {
    console.log('通知列表的params：', params);
    const { title, type, unReadNum } = params;
    this.type = type;
    let navTitle = title;
    if (parseInt(unReadNum, 10) > 0) {
      navTitle = `${title}(${unReadNum}条)`;
    }
    uni.setNavigationBarTitle({
      title: navTitle,
    });
    this.getNotices(type);
  },
  methods: {
    // 根据type的类型发送不同的通知请求
    getNotices(type) {
      const params = {
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[type]': type,
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'notification' } });
      this.$store.dispatch('jv/get', ['notification', { params }]).then(res => {
        console.log('通知列表res', res);
        if (res && res.length > 0) {
          const list = JSON.parse(JSON.stringify(res));
          for (let i = 0; i < list.length; i += 1) {
            list[i].time = time2MorningOrAfternoon(list[i].created_at);
            list[i].money = `￥${list[i].amount}`;
          }
          this.noticeList = list;
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        }
      });
    },
    // 上拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getNotices(this.type);
      console.log('页码', this.pageNum);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.notification-box {
  color: --color(--qui-FC-333);
  background-color: --color(--qui-BG-1);
  transition: $switch-theme-time;
}
</style>
