<template>
  <view class="container">
    <view class="content">
      <view id="editor"></view>
    </view>
    <view id="atList" class="child_list" v-if="atShow">
      <view v-for="(child, index) in allSiteUser" :key="index" @click="userClick(child.username)">
        {{ child.username }}
      </view>
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
      allSiteUser: '', // 站点用户
      userVal: '', // 用户搜索值
      once: 1, // 请求值为1时请求一次接口
      atShow: false, // at列表显示
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
        markdown: {
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
      data: {
        blocks: [
          {
            type: 'markdown',
            data: {
              placeholder: '请输入标题',
              classNames: ['mark-title'],
            },
          },
          {
            type: 'markdown',
            data: {
              placeholder: '您想说的...',
              classNames: ['mark-content'],
            },
          },
        ],
      },
      initialBlock: 'markdown',
    });
    uni.$on('mentionStart', data => {
      console.log(data, '~~~~~');
      this.userVal = data.msg;
      if (data.msg) {
        this.getAtUser();
        // this.once = 2;
      }
    });
  },
  watch: {
    // userVal: {
    //   handler(oldVal, newVal) {
    //     console.log(oldVal, '第一个', newVal, '第二个');
    //     if (oldVal && oldVal !== newVal) {
    //       this.once = 1;
    //       this.getAtUser();
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
  methods: {
    getAtUser() {
      // if (this.once === 1) {
      const params = {
        'filter[username]': `*${this.userVal}*`,
        'filter[status]': 'normal',
        'page[size]': 10,
        'page[number]': 1,
      };
      this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
        // this.meta = res._jv.json.meta;
        // this.allSiteUser = [...this.allSiteUser, ...res];
        delete res._jv;
        console.log(res, '这是res');
        this.allSiteUser = res;
        if (this.allSiteUser.length > 0) {
          console.log('1234');
          this.atShow = true;
        }
        this.once = 1;
      });
      // }
    },
    // 点击at列表
    userClick(name) {
      uni.$emit('userClick', { name });
      this.atShow = !this.atShow;
    },
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

.child_list {
  position: fixed;
  top: 50rpx;
  left: 100rpx;
  z-index: 10;
  padding: 20rpx;
  background: #eee;
  border: 1px solid #ededed;
}
</style>
