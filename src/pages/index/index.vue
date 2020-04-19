<template>
  <qui-page>
    <view class="content" v-for="item in allThreads" :key="item.id">
      <view>{{ item.user.attributes.username }}: {{ item.attributes.title }}</view>
    </view>
    <text @click="pageClick">跳转@成员页面</text>
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
    pageClick() {
      uni.navigateTo({
        url: '/components/qui-at-member-page/qui-at-member-page',
      });
    },
  },
};
</script>

<style lang="scss">
// 样式
</style>
