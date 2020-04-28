<template>
  <view class="topic-page">
    <uni-popup ref="popup" type="bottom">
      <qui-drawer :bottom-data="bottomData"></qui-drawer>
    </uni-popup>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      @scrolltoupper="refresh"
      show-scrollbar="false"
      class="scroll-y"
    >
      <qui-content
        v-for="(item, index) in data"
        :key="index"
        :user-name="item.user.username"
        :theme-image="item.user.avatarUrl"
        :theme-btn="item.canHide"
        :theme-reply-btn="item.canReply"
        :theme-types="item.user.showGroups"
        :theme-time="item.createdAt"
        :theme-content="item.type == 1 ? item.title : item.firstPost.contentHtml"
        :theme-like="item.firstPost.likeCount"
        :theme-comment="item.firstPost.replyCount"
        :tags="item.category.name"
        :images-list="item.firstPost.images"
        :theme-essence="item.isEssence"
        @click="handleClickShare"
      ></qui-content>
    </scroll-view>
    <load-more :status="loadingType"></load-more>
  </view>
</template>

<script>
import { status } from 'jsonapi-vuex';
import loadMore from '@/components/qui-load-more';

export default {
  components: {
    loadMore,
  },
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingType: 'more',
      data: [],
      flag: true, // 滚动节流
      totalData: 0, // 总数
      pageSize: 20,
      pageNum: 1, // 当前页数
      bottomData: [
        {
          text: '文字',
          icon: 'icon-word',
          name: 'wx',
        },
        {
          text: '图片',
          icon: 'icon-img',
          name: 'wx',
        },
        {
          text: '视频',
          icon: 'icon-video',
          name: 'qq',
        },
        {
          text: '帖子',
          icon: 'icon-post',
          name: 'sina',
        },
      ],
    };
  },
  mounted() {
    this.loadThreads();
  },
  methods: {
    handleClickShare() {
      this.$refs.popup.open();
      this.bottomData = [
        {
          text: '生成海报',
          icon: 'icon-word',
          name: 'wx',
        },
        {
          text: '微信分享',
          icon: 'icon-img',
          name: 'wx',
        },
      ];
    },
    // 加载当前主题数据
    loadThreads() {
      const params = {
        'filter[isDeleted]': 'no',
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
        'page[number]': 1,
        'page[limit]': 20,
        'filter[userId]': this.userId,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads', { params }]))
        .then(res => {
          Object.getOwnPropertyNames(res).forEach(key => {
            // 如果是 _jv 跳过
            if (key === '_jv') {
              return;
            }
            // groups不存在返回
            if (!res[key].user.groups) {
              return;
            }

            // 循环每个的用户组
            Object.getOwnPropertyNames(res[key].user.groups).forEach(k => {
              // 如果是 _jv 跳过
              if (key === '_jv') {
                return;
              }

              // 是否显示用户组
              const group = res[key].user.groups[k];
              res[key].user.showGroups = group.isDisplay ? `(${group.name})` : '';
            });
          });
          const data = JSON.parse(JSON.stringify(res));
          // eslint-disable-next-line no-underscore-dangle
          delete data._jv;
          this.loadingType = data.length === 10 ? 'more' : 'nomore';
          this.data = Object.assign(data, this.data);
        });
    },
    // 下拉加载
    pullDown() {
      if (this.pageNum * this.pageSize < this.totalData) {
        this.pageNum += 1;
        this.loadThreads();
      } else {
        this.loadingType = 'nomore';
      }
    },
    refresh() {
      this.pageNum = 1;
      this.data = [];
      this.loadThreads();
    },
  },
};
</script>
<style lang="scss">
/deep/ .themeItem {
  margin-right: 0;
  margin-left: 0;
}
.scroll-y {
  max-height: calc(100vh - 297rpx);
}
</style>
