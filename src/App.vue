<script>
export default {
  onLaunch() {
    this.$store
      .dispatch('jv/get', [
        'forum',
        {
          params: {
            include: 'users',
          },
        },
      ])
      .catch(errs => {
        if (errs.response) {
          const { status } = errs.response;
          if (status.toString === '401' && errs.response.data && errs.response.data.errors) {
            const err = errs.response.data.errors[0];
            this.$store.dispatch('forum/setError', err);
          }
        }
      });
  },
  onShow() {},
  onHide() {},
};
</script>

<style lang="scss">
/* 每个页面公共css */
@import '@/styles/base/reset.scss';
</style>
