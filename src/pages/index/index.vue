<template>
  <qui-page>
    <view class="content" v-for="item in allThreads" :key="item.id">
      <view>{{ item.user.attributes.username }}: {{ item.attributes.title }}</view>
    </view>
    <button @click="click">跳转消息页</button>
  </qui-page>
</template>

<script>
export default {
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
    click() {
      uni.navigateTo({
        url: '../notice/index',
      });
    },
  },
};
</script>

<style lang="scss">
// 样式
</style>
