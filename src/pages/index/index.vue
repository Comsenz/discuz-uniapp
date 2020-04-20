<template>
  <qui-page>
    <view class="content" v-for="item in allThreads" :key="item.id">
      <view>{{ item.user.attributes.username }}: {{ item.attributes.title }}</view>
      <button @click="click">跳转消息页</button>
    </view>
  </qui-page>
</template>

<script>
import quiPage from '@/components/qui-page';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    quiPage,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      allThreads: state => state.dzThreads.all,
    }),
  },
  onLoad() {
    this.loadAllThreads({
      'page[size]': 10,
      'page[number]': 1,
    });
  },
  methods: {
    ...mapActions({
      loadAllThreads: 'dzThreads/loadAll',
    }),
    click() {
      uni.navigateTo({
        url: '../message/index',
      });
    },
  },
};
</script>

<style lang="scss">
// 样式
</style>
