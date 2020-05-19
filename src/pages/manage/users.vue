<template>
  <qui-page>
    <view class="manage-users">
      <!-- 搜索成员 -->
      <view class="manage-users-search">
        <view class="search">
          <view class="search-box">
            <view class="search-box__content">
              <qui-icon
                class="icon-content-search"
                name="icon-search"
                size="30"
                color="#bbb"
              ></qui-icon>
              <input
                type="text"
                class="search-box__content-input"
                placeholder-class="input-placeholder"
                placeholder="搜索成员"
                @input="searchInput"
                :value="searchText"
              />
              <view @tap="clearSearch" v-if="searchText" class="search-box__content-delete">
                <qui-icon name="icon-close1" size="32" color="#ccc"></qui-icon>
              </view>
            </view>
            <view class="search-box__cancel" v-if="searchText" @tap="clearSearch">
              <text>取消</text>
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="">
      <qui-search
        class="mSearch-input-box"
        :mode="2"
        button="inside"
        :placeholder="defaultKeyword"
        @search="doSearch(false)"
        @input="inputChange"
        @confirm="doSearch(false)"
        v-model="keyword"
      ></qui-search>
    </view> -->
      <!-- 搜索内容列表 -->
      <!-- <view class="search-keyword">
      <scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
        <block v-for="(row, index) in keywordList" :key="index">
          <view class="keyword-entry" hover-class="keyword-entry-tap">
            <view class="keyword-text" @tap.stop="doSearch(keywordList[index].keyword)">
              <rich-text :nodes="row.htmlStr"></rich-text>
            </view> -->
      <!-- <view class="keyword-img" @tap.stop="setKeyword(keywordList[index].keyword)">
              <image src="/static/HM-search/back.png"></image>
            </view> -->
      <!-- </view>
        </block>
      </scroll-view>
    </view> -->

      <!-- 成员列表 -->
      <view class="manage-users-wrap">
        <view v-if="userList && Object.keys(userList).length > 0">
          <view v-for="user in userList" :key="user.id">
            <qui-avatar-cell
              center
              right-color="#aaa"
              :mark="user.id"
              :title="user.username"
              :value="user.groups[Object.keys(user.groups || {})[0]].name"
              :icon="user.avatarUrl || '/static/noavatar.gif'"
            ></qui-avatar-cell>
          </view>
        </view>
        <qui-no-data tips="暂无内容" v-else></qui-no-data>
      </view>
    </view>
  </qui-page>
</template>

<script>
// import quiSearch from '@/components/qui-search';

export default {
  components: {
    // quiSearch,
  },

  data() {
    return {
      searchText: '', // 输入的用户名
    };
  },

  onLoad() {
    this.searchUser();
  },

  computed: {
    userList() {
      const list = this.$store.getters['jv/get']('users');
      console.log('list', list);
      return list;
    },
  },

  methods: {
    searchInput(e) {
      this.searchText = e.target.value;
      this.searchUser();
    },

    clearSearch() {
      this.searchText = '';
    },

    // 调用 搜索 接口
    searchUser() {
      const params = {
        'filter[username]': `*${this.searchText}*`,
      };
      if (this.searchText === '') {
        this.$store.commit('jv/clearRecords', { _jv: { type: 'users' } });
        this.$store.dispatch('jv/get', ['users', {}]);
      } else {
        this.$store.commit('jv/clearRecords', { _jv: { type: 'users' } });
        this.$store.dispatch('jv/get', ['users', { params }]);
      }
    },

    // 执行搜索
    doSearch(keyword) {
      this.keyword = keyword === false ? this.keyword : keyword;
      this.saveKeyword(keyword); // 保存为历史
      uni.showToast({
        title: this.keyword,
        icon: 'none',
        duration: 2000,
      });
    },
    // 监听输入
    inputChange(event) {
      // 兼容引入组件时传入参数情况
      const keyword = event.detail ? event.detail.value : event;
      if (!keyword) {
        this.keywordList = [];
        this.isShowKeywordList = false;
        return;
      }
      this.isShowKeywordList = true;
      // 以下示例截取淘宝的关键字，请替换成你的接口
      uni.request({
        url: `https://suggest.taobao.com/sug?code=utf-8&q=${keyword}`, // 仅为示例
        success: res => {
          this.keywordList = [];
          this.keywordList = this.drawCorrelativeKeyword(res.data.result, keyword);
        },
      });
    },
    // 高亮关键字
    drawCorrelativeKeyword(keywords, keyword) {
      const len = keywords.length;
      const keywordArr = [];
      for (let i = 0; i < len; i += 1) {
        const row = keywords[i];
        // 定义高亮#9f9f9f
        let html = row[0].replace(keyword, `<span style='color: #9f9f9f;'>${keyword}</span>`);
        html = `<div>${html}</div>`;
        const tmpObj = {
          keyword: row[0],
          htmlStr: html,
        };
        keywordArr.push(tmpObj);
      }
      return keywordArr;
    },
  },
};
</script>

<style lang="scss" scope>
.manage-users {
  min-height: 100vh;
  background-color: #f9fafc;

  &-search {
    .search {
      position: fixed;
      top: 0rpx;
      z-index: 99;
      width: 100%;
    }

    .search-box {
      background-color: #fff;
    }
  }

  &-wrap {
    margin-top: 130rpx;
  }
}

.search-keyword {
  width: 100%;
  background-color: rgb(242, 242, 242);
}
.keyword-list-box {
  height: calc(100vh - 110rpx);
  padding-top: 10rpx;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
}
.keyword-entry-tap {
  background-color: #eee;
}
.keyword-entry .keyword-text,
.keyword-entry .keyword-img {
  display: flex;
  height: 80rpx;
  align-items: center;
}
.keyword-entry .keyword-text {
  width: 90%;
}
</style>
