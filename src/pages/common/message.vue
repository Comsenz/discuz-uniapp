<template>
  <qui-page-message :type="status"></qui-page-message>
</template>

<script>
const TYPE_404 = '404';
export default {
  data() {
    return {
      status: '', // success, fail, 404
    };
  },
  onLoad(params) {
    const { status } = params;
    if (!status) this.status = TYPE_404;
    else this.status = status;
  },
};
</script>
