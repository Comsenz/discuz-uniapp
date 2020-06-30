<template>
  <view>
    <u-parse :content="content | formatRichText" @navigate="navigate"></u-parse>
  </view>
</template>
<script>
import uParse from '@/components/feng-parse/parse';
import s9e from '@/utils/s9e';

export default {
  components: {
    uParse,
  },
  filters: {
    // 处理富文本里的图片宽度自适应
    // 1.去掉img标签里的style、width、height属性
    // 2.img标签添加style属性：max-width:100%;height:auto
    // 3.修改所有style里的width属性为max-width:100%
    // 4.去掉<br/>标签			 * @param html			 * @returns {void|string|*}

    formatRichText(html) {
      // eslint-disable-next-line no-param-reassign
      return s9e.parse(html);
      // if (html.indexOf('qq-emotion') !== -1) {
      //   return html;
      // }

      // // 控制小程序中图片大小
      // let newContent = html.replace(/<img[^>]*>/gi, match => {
      //   let matchRes = match;
      //   matchRes = matchRes.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
      //   matchRes = matchRes.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
      //   matchRes = matchRes.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
      //   return matchRes;
      // });
      // newContent = newContent.replace(/style="[^"]+"/gi, match => {
      //   let matchRes = match;
      //   matchRes = matchRes
      //     .replace(/width:[^;]+;/gi, 'max-width:100%;')
      //     .replace(/width:[^;]+;/gi, 'max-width:100%;');
      //   return matchRes;
      // });
      // newContent = newContent.replace(/<br[^>]*\/>/gi, '');
      // newContent = newContent.replace(
      //   /<img/gi,
      //   '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"',
      // );
      // // newContent = newContent.replace(/<h1="[^"]+"/gi, match => {
      // //   let matchRes = match;
      // //   matchRes = matchRes
      // //     .replace(/<h1:[^;]+;/gi, 'max-width:100%;')
      // //   return matchRes;
      // // });
      // return newContent;
    },
  },
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  methods: {
    navigate(e) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      // #ifdef  H5

      // #endif
      uni.navigateTo({
        url: e,
      });
    },
  },
};
</script>
