<template>
  <view class="container">
    <view id="editor"></view>
    <qui-button type="primary" size="large" @tap="submit">发布</qui-button>
    <qui-editorjscontent :input="data"></qui-editorjscontent>
  </view>
</template>
<script>
import EditorJS from '@editorjs/editorjs';
import Markdown from '@/library/editorjs/markdown/markdown';
import ImageTool from '@editorjs/image';
import linkTool from '@editorjs/link';
// import At from '@/library/editorjs/At';

export default {
  data() {
    return {
      editor: null,
      data: {},
    };
  },
  onLoad() {
    this.editor = new EditorJS({
      /**
       * Id of Element that should contain Editor instance
       */
      holder: 'editor',
      placeholder: '这里写!',
      autofocus: true,
      tools: {
        // At,
        Markdown: {
          class: Markdown,
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
              byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
            },
          },
        },
        linkTool: {
          class: linkTool,
          config: {
            endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching
          },
        },
      },
      /**
       * Initial Editor data
       */
      data: {},
    });
  },
  methods: {
    submit() {
      this.editor.save().then(data => {
        console.log(data);
        this.data = data;

        const params = {
          _jv: {
            type: 'threads',
            relationships: {
              category: {
                data: {
                  type: 'categories',
                  id: 1,
                },
              },
            },
          },
          content: this.data,
        };

        this.$store
          .dispatch('jv/post', params)
          .then(res => {
            // return res;
            console.log(res, '提交后');
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/library/editorjs/markdown/markdown.scss';
</style>
