<template>
  <view>
    <view id="editor"></view>
    <uni-popup ref="atUser" type="center" class="qui-popup-at">
      <qui-popup-at @atCancel="atCancel"></qui-popup-at>
    </uni-popup>
    <uni-popup ref="topic" type="center" class="qui-popup-topic">
      <qui-popup-topic @topicCancel="topicCancel"></qui-popup-topic>
    </uni-popup>
    <view class="emoji-bd" v-show="emojiShow">
      <qui-emoji
        position="fixed"
        top="340rpx"
        left="40rpx"
        right="40rpx"
        border-radius="10rpx"
        @click="getEmojiClick"
      ></qui-emoji>
    </view>
  </view>
</template>
<script>
// eslint-disable
import Vditor from 'vditor';
import './index.css';
import { AtIcon, TopicIcon, EmojiIcon } from '@/components/qui-vditor/svg/index';
import { mapState } from 'vuex';
import { DISCUZ_REQUEST_HOST } from '@/common/const';

export default {
  data() {
    return {
      searchUserTimeout: null,
      vditor: null,
      emojiShow: false,
    };
  },
  computed: {
    ...mapState({
      getAtMemberData: state => state.atMember.atMemberData,
    }),
  },
  created() {
    uni.$on('atUser', () => {
      let atMemberList = '';
      this.getAtMemberData.map(item => {
        atMemberList += `@${item.username} `;
        return atMemberList;
      });
      this.vditor.insertValue(atMemberList);
      this.$refs.atUser.close();
    });
    uni.$on('clickTopic', data => {
      if (data.keywords) this.vditor.insertValue(`#${data.keywords.replace(/\s+/g, '')}# `);
      this.$refs.topic.close();
    });

    uni.$on('loadedThread', res => {
      console.log(123);
      this.vditor.insertValue(res.firstPost.content);
    });
  },
  mounted() {
    const _that = this;
    this.vditor = new Vditor('editor', {
      mode: 'wysiwyg',
      after: () => {
        uni.$emit('vditor', this.vditor);
        this.vditor.focus();
      },
      cache: {
        enable: false,
      },
      toolbarConfig: {
        pin: true,
      },
      hint: {
        // emoji: {
        //   sad: `💔`,
        // },
        emojiPath: `${DISCUZ_REQUEST_HOST}emoji/qq`,
      },
      cdn: `${DISCUZ_REQUEST_HOST}assets/js/vditor@3.5.2`,
      height: window.innerHeight / 2,
      placeholder: this.$i18n.t('discuzq.post.placeholder'),
      toolbar: [
        {
          name: 'at',
          tipPosition: 's',
          tip: '@提醒的人',
          className: 'right',
          icon: AtIcon,
          click() {
            _that.$refs.atUser.open();
          },
        },
        {
          name: 'topic',
          tipPosition: 's',
          tip: '#话题',
          className: 'right',
          icon: TopicIcon,
          click() {
            _that.$refs.topic.open();
          },
        },
        // 'emoji',
        {
          name: 'emojiq',
          tip: 'emojiq',
          icon: EmojiIcon,
          click() {
            _that.emojiShow = !_that.emojiShow;
          },
        },
        'headings',
        'bold',
        'italic',
        'strike',
        'link',
        'list',
        'ordered-list',
        'check',
        'outdent',
        'indent',
        'quote',
        'line',
        'code',
        'inline-code',
        'table',
        'undo',
        'redo',
      ],
    });
  },
  destroyed() {
    uni.$off('atUser');
    uni.$off('clickTopic');
    uni.$off('loadedThread');
    this.vditor.destroy();
  },
  methods: {
    // 点击取消按钮，关闭at
    atCancel() {
      this.$refs.atUser.close();
    },
    // 点击取消按钮，关闭话题
    topicCancel() {
      this.$refs.topic.close();
    },

    // 表情点击事件
    getEmojiClick(code) {
      this.vditor.insertValue(code);
      this.emojiShow = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.emoji-bd {
  position: relative;
  width: 100%;
}
@media screen and (max-width: 520px) {
  .vditor-toolbar__item {
    padding: 0 3px;
  }
}
</style>
