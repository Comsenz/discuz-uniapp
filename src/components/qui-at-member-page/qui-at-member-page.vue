<template>
  <view class="qui-at-member-page-box">
    <view class="qui-at-member-page-box__hd">
      <view class="qui-at-member-page-box__hd__sc">
        <qui-icon class="icon-search" name="icon-search" size="30"></qui-icon>
        <input
          type="text"
          placeholder-class="input-placeholder"
          confirm-type="search"
          :placeholder="i18n.t('discuzq.atMember.selectedMember')"
          @input="searchInput"
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
        <checkbox-group @change="changeCheck" v-if="followStatus">
          <label v-for="item in allFollow" :key="item.id">
            <qui-avatar-cell
              :mark="item.toUser.id"
              :title="item.toUser.username"
              :icon="item.toUser.avatarUrl ? item.toUser.avatarUrl : '@/assets/noavatar.gif'"
              :value="getGroups(item.toUser.groups)"
              :label="item.toUser.label"
            >
              <checkbox slot="rightIcon" :value="JSON.stringify(item)"></checkbox>
            </qui-avatar-cell>
          </label>
        </checkbox-group>
        <checkbox-group @change="changeCheck" v-else>
          <label v-for="item in allSiteUser" :key="item.id">
            <qui-avatar-cell
              :mark="item.id"
              :title="item.username"
              :icon="item.avatarUrl ? item.avatarUrl : '@/assets/noavatar.gif'"
              :value="getGroups(item.groups)"
              :label="item.label"
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
      <qui-button
        size="large"
        :type="Boolean(checkAvatar.length < 1) ? 'default' : 'primary'"
        :disabled="Boolean(checkAvatar.length < 1)"
        @click="getCheckMember"
      >
        {{
          checkAvatar.length &lt; 1
            ? i18n.t('discuzq.atMember.notSelected')
            : i18n.t('discuzq.atMember.selected') + '(' + checkAvatar.length + ')'
        }}
      </qui-button>
    </view>
  </view>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'QuiAtMemberPage',
  data() {
    return {
      allSiteUser: [],
      followStatus: true, // 第一次进来显示follow列表
      checkAvatar: [],
      loadingText: 'discuzq.list.loading',
      searchValue: '',
      pageNum: 1,
      meta: {},
    };
  },
  computed: {
    allFollow() {
      return this.$store.getters['jv/get']('follow');
    },
    getGroups() {
      const that = this;
      return data => {
        Object.keys(data).forEach((item, index) => {
          if (item[index]) {
            return item[index].name;
          }
          return that.i18n.t('discuzq.role.noRole');
        });
      };
    },
  },
  methods: {
    ...mapMutations({
      setAtMember: 'atMember/SET_ATMEMBER',
    }),

    changeCheck(e) {
      this.checkAvatar = [];
      e.detail.value.forEach(item => {
        this.checkAvatar.push(JSON.parse(item));
      });
    },
    getCheckMember() {
      this.setAtMember(this.checkAvatar);
      uni.navigateBack({
        delta: 1,
      });
    },
    searchInput(e) {
      this.followStatus = false;
      this.searchValue = e.detail.value;

      if (this.pageNum !== 1) {
        this.pageNum = 1;
      }

      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getSiteMember(1);
      }, 250);
    },
    lower() {
      if (this.followStatus) {
        if (this.meta.total > Object.keys(this.allFollow).nv_length) {
          this.pageNum += 1;
          this.getFollowMember(this.pageNum);
        } else {
          this.loadingText = 'discuzq.list.noMoreData';
        }
      } else if (this.meta.total > Object.keys(this.allSiteUser).nv_length) {
        this.pageNum += 1;
        this.getSiteMember(this.pageNum);
      } else {
        this.loadingText = 'discuzq.list.noMoreData';
      }
    },
    getFollowMember(number) {
      const params = {
        include: ['toUser', 'toUser.groups'],
        'page[size]': 20,
        'page[number]': number,
      };
      this.$store.dispatch('jv/get', ['follow', { params }]).then(res => {
        /* eslint no-underscore-dangle: ["error", { "allow": ["_jv"] }] */
        this.meta = res._jv.json.meta;
        if (Object.keys(res) === 0) {
          this.loadingText = 'discuzq.list.noData';
        }
        if (res._jv.json.meta.total <= 20) {
          this.loadingText = 'discuzq.list.noData';
        }
      });
    },
    getSiteMember(number) {
      const params = {
        'filter[username]': `*${this.searchValue}*`,
        'filter[status]': 'normal',
        'page[size]': 20,
        'page[number]': number,
      };
      this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
        this.meta = res._jv.json.meta;

        const data = JSON.parse(JSON.stringify(res));
        delete data._jv;
        this.allSiteUser = data;

        if (Object.keys(res) === 0) {
          this.loadingText = 'discuzq.list.noData';
        }
        if (res._jv.json.meta.total <= 20) {
          this.loadingText = 'discuzq.list.noData';
        }
      });
    },
  },
  onLoad() {
    uni.setNavigationBarTitle({
      title: this.i18n.t('discuzq.atMember.atTitle'),
    });
    this.getFollowMember(1);
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
