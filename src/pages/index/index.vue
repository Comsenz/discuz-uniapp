<template>
  <qui-page>
    <view class="content" v-for="item in allThreads" :key="item.id">
      <view>{{ item.user.username }}: {{ item.title }}</view>
    </view>
  </qui-page>
</template>

<script>
import quiPage from '@/components/qui-page';

export default {
  components: {
    quiPage,
  },
  data() {
    return {};
  },
  computed: {
    allThreads() {
      return this.$store.getters['jv/get']({ _jv: { type: 'threads' } });
    },
  },
  onLoad() {
    this.getThreads();
  },
  methods: {
    getThreads() {
      const params = {
        'page[size]': 10,
        'page[number]': 1,
      };
      this.$store.dispatch('jv/get', ['threads', { params }]);
    },
  },
};
</script>

<style lang="scss">
// 样式
</style>
