<template>
  <qui-page :data-qui-theme="theme" :header="false"></qui-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  onLoad() {
    this.$store.dispatch('session/wxh5Login');
  },
};
</script>
