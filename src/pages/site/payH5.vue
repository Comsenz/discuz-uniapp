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
  onReady() {
    this.userInfo();
  },
  methods: {
    userInfo() {
      const params = {
        include: 'groups,wechat',
      };
      this.$store.dispatch('jv/get', [`users/${this.userId}`, { params }]).then(res => {
        if (res.paid) {
          window.location.href = '/pages/home/index';
        } else {
          window.location.href = '/pages/site/info';
        }
      });
    },
  },
};
</script>
