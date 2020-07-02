<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="encodeURI(viewUrl)"></web-view>
  </view>
</template>
<script>
export default {
  props: {
    // url
    viewUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      webviewStyles: {
        progress: {
          color: '#FF3333',
        },
      },
    };
  },
};
</script>
