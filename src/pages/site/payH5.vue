<template>
  <qui-page :data-qui-theme="theme"></qui-page>
</template>
<script>
export default {
  data() {
    return {
      userId: uni.getStorageSync('user_id') || 0,
    };
  },
  onShow() {
    this.refresh();
  },
  methods: {
    refresh() {
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/site/info',
        });
      }, 1000);
      this.$u.event.$emit('refresh');
    },
  },
};
</script>
