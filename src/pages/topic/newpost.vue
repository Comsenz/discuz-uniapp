<template>
  <view class="container">
    <view class="content">
      <view id="editor"></view>
    </view>

    <qui-button type="primary" size="large" @tap="submit">发布</qui-button>
    <qui-editorjscontent :input="data"></qui-editorjscontent>
  </view>
</template>
<script>
import EditorJS from '@editorjs/editorjs';
import Markdown from '@/library/editorjs/markdown/Markdown';
import ImageTool from '@/library/editorjs/image';
import AttachesTool from '@/library/editorjs/attaches';
import linkTool from '@editorjs/link';
// import { http } from '@/api/api-request';
import uploadFile from '@/mixin/uploadFile';
// import At from '@/library/editorjs/At';

export default {
  mixins: [uploadFile],
  data() {
    return {
      editor: null,
      data: {},
      imageId: '',
    };
  },
  onLoad() {
    const _that = this;

    // console.log(window.localStorage.getItem('access_token'), '_that.header.authorization');

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
            // endpoints: {
            //   byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
            //   byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
            // },
            uploader: {
              async uploadByFile(file) {
                return _that
                  .uploadFile(file, 1)
                  .then(res => {
                    console.log(res, 'res');
                    _that.imageId = res.data.id;
                    console.log(_that.imageId, 'ididididididi');
                    return {
                      success: 1,
                      file: {
                        url: res.data.attributes.url,
                        fileId: res.data.id,
                      },
                    };
                  })
                  .catch(err => {
                    console.log(err, 'error');
                  });
              },
            },
          },
          multiple: true,
        },
        attaches: {
          class: AttachesTool,
          config: {
            // endpoint: 'https://editor.discuzq.com/api/attachments',
          },
        },
        linkTool: {
          class: linkTool,
          config: {
            // endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching
          },
        },
      },
      /**
       * Initial Editor data
       */
      data: {},
      initialBlock: 'Markdown',
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
          include: [
            'user',
            'user.groups',
            'firstPost',
            'firstPost.images',
            'category',
            'threadVideo',
          ],
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
.content {
  padding: 10rpx 40rpx;
}
</style>
