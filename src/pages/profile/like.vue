<template>
  <view class="like-page">
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
      loadingType: 'more',
      data: [],
      flag: true, // 滚动节流
      totalData: 0, // 总数
      pageSize: 20,
      pageNum: 1, // 当前页数
    };
  },
  mounted() {
    this.loadlikes();
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
    // 加载当前点赞数据
    loadlikes() {
      const params = {
        include: [
          'user',
          'firstPost',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'threadVideo',
          'firstPost.likedUsers',
        ],
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[user_id]': this.userId,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads/likes', { params }]))
        .then(res => {
          // 循环帖子
          Object.getOwnPropertyNames(res).forEach(key => {
            // 如果是 _jv 跳过
            if (key === '_jv') {
              return;
            }
            // groups不存在返回
            if (!res[key].user.groups) {
              return;
            }
            // 循环每篇帖子作者的用户组
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
          // eslint-disable-next-line no-underscore-dangle
          this.totalData = res._jv.json.meta.threadCount;
          const data = JSON.parse(JSON.stringify(res));
          // eslint-disable-next-line no-underscore-dangle
          delete data._jv;
          this.loadingType = Object.keys(data).length === this.pageSize ? 'more' : 'nomore';
          this.data = { ...data, ...this.data };
        });
    },
    // 下拉加载
    pullDown() {
      if (this.pageNum * this.pageSize < this.totalData) {
        this.pageNum += 1;
        this.loadlikes();
      } else {
        this.loadingType = 'nomore';
      }
    },
    refresh() {
      this.pageNum = 1;
      this.data = [];
      this.loadlikes();
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
