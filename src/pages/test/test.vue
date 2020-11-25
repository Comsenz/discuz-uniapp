<template>
  <view id="vditor"></view>
</template>
<script>
import Vditor from 'vditor';
import '@/components/qui-vditor/vditor.css';

export default {
  mounted() {
    // eslint-disable-next-line no-new
    new Vditor('vditor');
  },
};
</script>
<style lang="scss" scoped>
#vditor {
  user-select: auto;
}
</style>
