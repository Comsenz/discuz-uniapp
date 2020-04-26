<template>
  <view class="like-page">
    <uni-popup ref="popup" type="bottom">
      <qui-drawer :bottom-data="bottomData"></qui-drawer>
    </uni-popup>
    <qui-content
      v-for="(item, index) in data"
      :key="index"
      :user-name="item.userName"
      :theme-image="item.themeImage"
      :theme-status="item.themeStatus"
      :theme-btn="item.themeBtn"
      :theme-reward="item.themeReward"
      :theme-reply-btn="item.themeReplyBtn"
      :theme-delete-btn="item.themeDeleteBtn"
      :theme-types="item.themeTypes"
      :theme-time="item.themeTime"
      :theme-content="item.themeContent"
      :theme-like="item.themeLike"
      :theme-comment="item.themeComment"
      :tags="item.tags"
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
      data: [
        {
          userName: '佟掌柜',
          themeImage: 'https://discuz.chat/static/images/noavatar.gif',
          themeTypes: '(管理员)',
          themeStatus: '打赏了我',
          // themeBtn: 'icon-delete',
          // themeReward: '1150.50',
          themeDeleteBtn: '删除',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          themeReplyBtn: 'icon-delete',
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
        {
          userName: '佟掌柜',
          themeImage: 'https://discuz.chat/static/images/noavatar.gif',
          themeTypes: '(管理员)',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
        {
          userName: '佟掌柜',
          themeImage: 'https://discuz.chat/static/images/noavatar.gif',
          themeTypes: '(管理员)',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
        },
        {
          userName: '佟掌柜',
          themeImage: 'https://discuz.chat/static/images/noavatar.gif',
          themeTypes: '(管理员)',
          themeTime: '16分钟前 ..',
          themeContent:
            '福布斯 2019美国最具创新力领袖 :贝佐斯与马斯克并列榜首（全榜单）】美国知名商业杂志《福布斯》发 布2019美国最具创...',
          themeLike: 123,
          themeComment: 317,
          tags: [
            {
              tagName: '女神',
            },
            {
              tagName: '女神经',
            },
            {
              tagName: '女神经病',
            },
          ],
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
          'firstPost',
          'user.groups',
          'firstPost.images',
          'lastThreePosts',
          'lastThreePosts.user',
          'lastThreePosts.replyUser',
          'firstPost.likedUsers',
          'rewardedUsers',
          'threadVideo',
        ],
        'page[number]': 1,
        'page[limit]': 20,
        'filter[userId]': this.userId,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads', { params }]))
        .then(res => {
          console.log(res);
          // const data = JSON.parse(JSON.stringify(res));
          // // eslint-disable-next-line no-underscore-dangle
          // delete data._jv;
          // this.followingList = data;
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
