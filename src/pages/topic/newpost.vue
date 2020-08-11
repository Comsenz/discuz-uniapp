<template>
  <view class="container">
    <view id="editor"></view>
    <qui-button type="primary" size="large" @tap="submit">发布</qui-button>
    <qui-editorjscontent :input="data"></qui-editorjscontent>
  </view>
</template>
<script>
import EditorJS from '@editorjs/editorjs';
import Markdown from '@/library/editorjs/Markdown';

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
      placeholder: 'Let`s write an awesome story!',
      autofocus: true,
      tools: {
        Markdown,
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
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
