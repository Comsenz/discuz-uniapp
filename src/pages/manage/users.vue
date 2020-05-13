<template>
  <view class="manage-users-box">
    <!-- 搜索成员 -->
    <view class="">
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
    </view>
    <!-- 搜索内容列表 -->
    <view class="search-keyword">
      <scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
        <block v-for="(row, index) in keywordList" :key="index">
          <view class="keyword-entry" hover-class="keyword-entry-tap">
            <view class="keyword-text" @tap.stop="doSearch(keywordList[index].keyword)">
              <rich-text :nodes="row.htmlStr"></rich-text>
            </view>
            <!-- <view class="keyword-img" @tap.stop="setKeyword(keywordList[index].keyword)">
              <image src="/static/HM-search/back.png"></image>
            </view> -->
          </view>
        </block>
      </scroll-view>
    </view>

    <!-- 成员列表 -->
    <view v-for="user in userList" :key="user.id">
      <qui-avatar-cell
        center
        right-color="#aaa"
        :mark="user.id"
        :title="user.username"
        :value="user.groupname"
        :icon="
          user.avatarUrl === '' ? 'https://discuz.chat/static/images/noavatar.gif' : user.avatarUrl
        "
      ></qui-avatar-cell>
    </view>
  </view>
</template>

<script>
import quiSearch from '@/components/qui-search';

export default {
  components: {
    quiSearch,
  },

  data() {
    return {
      userList: [
        { id: 1, username: '白展堂', groupname: '圈主', avatarUrl: '' },
        { id: 2, username: '莫小贝', groupname: '合伙人', avatarUrl: '' },
        { id: 3, username: '郭芙蓉', groupname: '好友', avatarUrl: '' },
      ],
      keyword: '',
      keywordList: [],
      isShowKeywordList: false,
    };
  },

  methods: {
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
page {
  background-color: #fff;
}
.manage-items {
  padding-left: 40rpx;
  background: #fff;
  border-bottom: 2rpx solid #ededed;

  .cell-item {
    padding-right: 40rpx;
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
