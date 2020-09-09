<template>
  <view>
    <u-parse :content="content | formatRichText" @navigate="navigate"></u-parse>
  </view>
</template>
<script>
import uParse from '@/components/feng-parse/parse';
import s9e from '@/utils/s9e';

const url2new = {};
// eslint-disable-next-line dot-notation
url2new['details'] = '/pages/topic/index?id={id}';
url2new['home-page'] = '/pages/profile/index?userId={id}';

export default {
  components: {
    uParse,
  },
  filters: {
    formatRichText(html) {
      return s9e.parse(html);
    },
  },
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  methods: {
    navigate(url) {
      let toUrl = url;

      // 适应老h5 地址
      // #ifdef H5
      if (toUrl.indexOf(window.location.host) !== -1) {
        // eslint-disable-next-line no-restricted-syntax
        for (const page in url2new) {
          if (toUrl.indexOf(page) !== -1) {
            const id = toUrl.split('/')[4];
            toUrl = url2new[page].replace('{id}', id);
          }
        }
      }
      window.location.href = toUrl;
      // #endif

      // #ifndef H5
      if (toUrl.indexOf('http') !== -1) {
        toUrl = `/pages/common/view?url=${encodeURIComponent(toUrl)}`;
      }
      uni.navigateTo({
        url: toUrl,
      });
      // #endif
    },
  },
};
</script>
