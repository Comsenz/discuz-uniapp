<template>
  <view :class="currentTheme">
    <view class="dz-page">
      <slot />
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      currentTheme: state => {
        return `theme-${state.theme.currentTheme}`;
      },
    }),
  },
};
</script>

<style lang="scss">
@import '@/assets/theme/mixin.scss';

.dz-page {
  min-height: 100vh;

  @include themeify {
    color: themed('txt-color-primary');
    background-color: themed('bg-color-primary');
  }
}
</style>
