<template>
  <view :data-qui-theme="currentTheme" class="qui-page">
    <slot />
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      currentTheme: state => state.theme.currentTheme,
    }),
  },
};
</script>

<style lang="scss">
@import '@/styles/base/theme/fn.scss';

.qui-page {
  min-height: 100vh;
  color: --color(--qui-FC-333);
  background-color: --color(--qui-BG-1);
}
</style>
