<template>
  <qui-page>
    <view class="content">
      <image class="logo" src="https://discuz.chat/static/images/logo.png"></image>
      <view>
        <text class="title">{{ i18n.t('discuzq.hello') }} {{ title }}</text>
      </view>
      <view @tap.stop="switchLang">切换语言</view>
      <view @tap.stop="switchTheme">切换主题</view>
      <view v-for="(item, index) in threadsUsers" :key="index">
        <view>{{ item.attributes.username }}</view>
      </view>
    </view>
  </qui-page>
</template>

<script>
import quiPage from '@/components/qui-page';
import { mapState, mapMutations, mapActions } from 'vuex';
import { SET_THEME } from '@/store/types/theme';
import { THEME_DEFAULT, THEME_DARK, LANG_ZH, LANG_EN, DISCUZ_TITLE } from '@/common/const';

export default {
  components: {
    quiPage,
  },
  data() {
    return {
      curLang: LANG_ZH,
      title: DISCUZ_TITLE,
    };
  },
  computed: {
    ...mapState({
      curTheme: state => state.theme.currentTheme,
    }),
    relatedUser() {
      const threads = this.$store.getters['threads/all'];
      const firstThreadId = threads.length > 0 && threads[0].id;
      if (!firstThreadId) return null;
      const data = this.$store.getters['threads/related']({
        parent: {
          type: 'threads',
          id: firstThreadId,
        },
        relationship: 'user',
      });
      console.log('relatedUser', data);
      return data;
    },
    threadsUsers() {
      const data = this.$store.getters['threads/included']({
        parent: 'threads',
        relationship: 'users',
      });
      console.log('threadsUsers', data);
      return data;
    },
    threadsPosts() {
      const data = this.$store.getters['threads/included']({
        parent: 'threads',
        relationship: 'posts',
      });
      console.log('threadsPosts', data);
      return data;
    },
  },
  onLoad() {
    const options = {
      'page[size]': 20,
      'page[number]': 2,
    };
    this.threadAll(options);
  },
  methods: {
    ...mapMutations({
      setTheme: `theme/${SET_THEME}`,
    }),
    ...mapActions({
      threadAll: 'threads/loadAll',
    }),
    switchLang() {
      this.curLang = this.curLang === LANG_ZH ? LANG_EN : LANG_ZH;
      this.$localeUse(this.curLang);
    },
    switchTheme() {
      const theme = this.curTheme === THEME_DEFAULT ? THEME_DARK : THEME_DEFAULT;
      this.setTheme(theme);
    },
  },
};
</script>

<style lang="scss">
.content {
  height: 400rpx;
  text-align: center;
}

.logo {
  width: 324rpx;
  height: 72rpx;
  margin-top: 200rpx;
}

.title {
  color: #8f8f94;
  font-size: 60rpx;
}
</style>
