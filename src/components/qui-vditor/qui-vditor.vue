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
    <view ref="input" style="display: none;"></view>
  </view>
</template>
<script>
// eslint-disable
import Vditor from 'vditor';
import {
  AtIcon,
  TopicIcon,
  EmojiIcon,
  ImageIcon,
  // AttachIcon,
} from '@/components/qui-vditor/svg/index';
import { mapState } from 'vuex';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import appCommonH from '@/utils/commonHelper';
import Upload from '@/components/qui-vditor/utils/Upload';

export default {
  data() {
    return {
      searchUserTimeout: null,
      vditor: null,
      emojiShow: false,
      postComponent: null,
      upload: null,
    };
  },
  computed: {
    ...mapState({
      getAtMemberData: state => state.atMember.atMemberData,
    }),
  },
  created() {
    this.upload = new Upload();
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
      this.vditor.insertValue(res.firstPost.content);
    });

    uni.$on('clickImage', item => {
      document.execCommand(
        'insertHTML',
        false,
        `<img alt="${item.name}" src="${item.path}" title="${item.id}"></img>`,
      );
    });

    uni.$on('clickAttach', item => {
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${item.attributes.url}" title="${item.id}">${item.attributes.fileName}</a>`,
      );
    });

    const videoRender = (element, url) => {
      element.insertAdjacentHTML('afterend', `<video controls="controls" src="${url}"></video>`);
      element.remove();
    };

    uni.$on('playVideo', item => {
      const a = document.createElement('a');
      appCommonH.insertElementAtCaret(a);
      videoRender(a, item.path);
    });
  },
  mounted() {
    const _that = this;
    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'vditor-file';
    input.onchange = event => _that.upload.uploadAttach(event);

    this.$refs.input.$el.appendChild(input);
    const toolbar = [
      {
        name: 'at',
        tipPosition: 's',
        tip: '@提醒的人',
        className: 'right',
        icon: AtIcon,
        click() {
          _that.setCursorPosition();
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
          _that.setCursorPosition();
          _that.$refs.topic.open();
        },
      },
      // 'emoji',
      {
        name: 'emojiq',
        tip: 'emojiq',
        icon: EmojiIcon,
        click() {
          _that.setCursorPosition();
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
      {
        name: 'image',
        tip: '上传图片',
        icon: ImageIcon,
        click() {
          _that.setCursorPosition();
          _that.upload.uploadImage();
        },
      },
      'line',
      'code',
      'inline-code',
      'table',
      'undo',
      'redo',
    ];
    this.vditor = new Vditor('editor', {
      mode: 'wysiwyg',
      after: () => {
        uni.$emit('vditor', this.vditor, this);
      },
      cache: {
        enable: false,
      },
      toolbarConfig: {
        pin: true,
      },
      cdn: `${DISCUZ_REQUEST_HOST}assets/js/vditor@3.5.2`,
      height: window.innerHeight / 2,
      placeholder: this.$i18n.t('discuzq.post.placeholder'),
      toolbar,
    });
  },
  destroyed() {
    uni.$off('atUser');
    uni.$off('clickTopic');
    uni.$off('loadedThread');
    uni.$off('clickImage');
    uni.$off('clickAttach');
    uni.$off('playVideo');
    this.vditor.destroy();
  },
  methods: {
    setCursorPosition() {
      const postition = this.vditor.getCursorPosition();
      if (postition.x === 0 && postition.y === 0) {
        this.vditor.focus();
      }
    },
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
    setPostComponent(component) {
      this.postComponent = component;
      this.upload.postComponent = component;
    },
  },
};
</script>
<style lang="scss" scoped>
.emoji-bd {
  position: relative;
  width: 100%;
}
#editor {
  user-select: auto;
}
</style>
