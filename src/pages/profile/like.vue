<template>
  <view class="like-page">
    <uni-popup ref="popup" type="bottom">
      <qui-drawer :bottom-data="bottomData"></qui-drawer>
    </uni-popup>
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
  </view>
</template>

<script>
import { status } from 'jsonapi-vuex';

export default {
  components: {
    //
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
      data: [],
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
        'page[number]': 1,
        'page[limit]': 20,
        'filter[user_id]': this.userId,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads/likes', { params }]))
        .then(res => {
          console.log(res);
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
          const data = JSON.parse(JSON.stringify(res));
          // eslint-disable-next-line no-underscore-dangle
          delete data._jv;
          this.data = data;
        });
    },
  },
};
</script>
<style lang="scss">
/deep/ .themeItem {
  margin-right: 0;
  margin-left: 0;
}
</style>
