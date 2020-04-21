<script>
export default {
  onLaunch() {
    this.$store.dispatch('jv/get', ['forum', {params: {
      include: 'users'
    }}]);
  },
  onShow() {
  },
  onHide() {
  },
};
</script>

<style lang="scss">
/* 每个页面公共css */
@import '@/styles/base/reset.scss';
page {
  font-size: 28rpx;
}
</style>
