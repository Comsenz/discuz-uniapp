<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="encodeURI(url)"></web-view>
  </view>
</template>
<script>
export default {
  props: {
    // url
    url: {
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
