<template>
  <qui-page :data-qui-theme="theme">
    <img :src="src" />
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      src: '',
    };
  },
  onLoad() {
    this.preview();
  },
  methods: {
    preview() {
      const attachment = this.$store.getters['session/get']('attachment');
      console.log('attachment', attachment);
      if (attachment) {
        this.src = `${attachment.url}&page=1`;
      }
    },
  },
};
</script>
