module.exports = {
  computed: {
    user() {
      const userId = this.$store.getters['session/get']('userId');
      return this.$store.getters['jv/get'](`users/${userId}`);
    },
  },
};
