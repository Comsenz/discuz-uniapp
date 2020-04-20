<template>
  <view class="qui-at-member-page-box">
    <view class="qui-at-member-page-box__hd">
      <view class="qui-at-member-page-box__hd__sc">
        <qui-icon class="icon-search" name="icon-search" size="15"></qui-icon>
        <input
          type="text"
          placeholder-class="input-placeholder"
          confirm-type="search"
          :placeholder="i18n.t('discuzq.atMember.selectedMember')"
        />
      </view>
    </view>
    <view class="qui-at-member-page-box__lst">
      <scroll-view
        class="scroll-Y"
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="lower"
      >
        <checkbox-group @change="changeCheck">
          <label v-for="item in avatarData" :key="item.id">
            <qui-avatar-cell
              :mark="item.id"
              :key="item.id"
              :title="item.title"
              :value="item.value"
              :label="item.label"
              :icon="item.icon"
            >
              <checkbox slot="rightIcon" :value="JSON.stringify(item)"></checkbox>
            </qui-avatar-cell>
          </label>
        </checkbox-group>
        <view class="loading-text">
          <text>{{ i18n.t(loadingText) }}</text>
        </view>
      </scroll-view>
    </view>
    <view class="qui-at-member-page-box__ft">
      <button
        :type="Boolean(checkAvatar.length < 1) ? 'default' : 'primary'"
        :disabled="Boolean(checkAvatar.length < 1)"
        @click="getCheckMember"
      >
        {{
          checkAvatar.length &lt; 1
            ? i18n.t('discuzq.atMember.notSelected')
            : i18n.t('discuzq.atMember.selected') + '(' + checkAvatar.length + ')'
        }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'QuiAtMemberPage',
  data() {
    return {
      avatarData: [],
      checkAvatar: [], // 已选成员列表
      loadingText: 'discuzq.list.loading',
    };
  },
  methods: {
    changeCheck(e) {
      this.checkAvatar = [];
      e.detail.value.forEach(item => {
        this.checkAvatar.push(JSON.parse(item));
      });
    },
    getCheckMember() {
      // 需要考虑，从哪个页面跳回来，带上参数或者存起来，再跳回去
      console.log(this.checkAvatar);
    },
    lower() {
      // 模拟接口数据请求
      const setAdd = setTimeout(() => {
        this.avatarData.push({
          id: this.avatarData.length + 1,
          icon: 'https://profile.csdnimg.cn/B/1/5/3_weixin_39703839',
          title: '叶良辰',
          value: '圈主',
        });
      }, 500);
      if (this.avatarData.length > 30) {
        clearTimeout(setAdd);
        this.loadingText = 'discuzq.list.noMoreData';
      }
    },
  },
  onLoad() {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    });
    uni.setNavigationBarTitle({
      title: this.i18n.t('discuzq.atMember.atTitle'),
    });

    // 模拟数据初始化
    this.avatarData = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 25; i++) {
      this.avatarData.push({
        id: i,
        icon: 'https://profile.csdnimg.cn/B/1/5/3_weixin_39703839',
        title: '叶良辰',
        value: '圈主',
      });
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

$otherHeight: 292rpx;
.qui-at-member-page-box {
  width: 100%;
  &__hd {
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 20rpx 40rpx;

    &__sc {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 10rpx;
      background-color: --color(--qui-BG-IT);
      border-radius: 10rpx;

      .icon-search {
        margin: 0 10rpx;
        color: #bbb;
      }
      input {
        width: 100%;
        height: 100%;
      }
      /deep/ input .input-placeholder {
        font-size: $fg-f28;
        color: --color(--qui-FC-C6);
      }
    }
  }
  &__lst {
    .scroll-Y {
      height: calc(100vh - #{$otherHeight});
      .loading-text {
        height: 100rpx;
        font-size: 28rpx;
        line-height: 100rpx;
        text-align: center;
      }
    }
  }
  &__ft {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 40rpx;
    box-sizing: border-box;
  }
}
</style>
