<template>
  <view class="qui-vote">
    <view class="qui-vote__title">{{ p.options }}</view>
    <view class="qui-vote__select">
      <view class="qui-vote__options" v-for="(item, index) in voteList" :key="index">
        <input
          class="qui-vote__options-input"
          :placeholder="`${p.writeVotingOptions}`"
          placeholder-class="input-placeholder"
          v-model="item.title"
          @input="voteInput"
        />
        <view class="qui-vote__options-icon">
          <qui-icon name="icon-close1" size="36" color="#ccc" @click="deleteVote(index)"></qui-icon>
        </view>
      </view>
    </view>
    <view class="qui-vote__add" @click="addVote">
      <qui-icon name="icon-add" color="#B5B5B5" size="40" class="icon-add"></qui-icon>
      {{ p.addVotingOptions }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    voteBeforeList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      voteList: [
        {
          title: '',
        },
        {
          title: '',
        },
        {
          title: '',
        },
      ], // 投票选项
      voteData: [], // 投票项数据
    };
  },
  computed: {
    p() {
      return this.i18n.t('discuzq.post');
    },
  },
  watch: {
    // 监听得到的数据
    voteData: {
      handler() {
        this.$emit('change', this.voteData);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    if (this.voteBeforeList.length > 0) {
      this.voteList = [];
      this.voteBeforeList.forEach(item => {
        this.voteList.push({
          title: item.content,
          id: item.id,
        });
      });
      this.voteData = this.voteBeforeList;
    }
  },
  destroyed() {},
  methods: {
    // 增加投票选项
    addVote() {
      this.voteList.push({
        title: '',
      });
    },
    // 删除投票选项
    deleteVote(index) {
      this.voteList.splice(index, 1);
      if (this.voteData.length > 0) {
        this.voteData.forEach((item, vIndex) => {
          const voteIndex = item.id - 1;
          if (voteIndex === index) {
            this.voteData.splice(vIndex, 1);
          }
        });
      }
    },
    voteInput() {
      this.voteData = [];
      this.voteList.forEach(item => {
        if (item.title) {
          if (item.id) {
            this.voteData.push({
              id: item.id,
              content: item.title,
            });
          } else {
            this.voteData.push({
              content: item.title,
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.qui-vote {
  &__title {
    margin-bottom: 40rpx;
    font-size: $fg-f5;
    line-height: 40rpx;
    color: --color(--qui-FC-7D7979);
  }
  &__select {
    margin-bottom: 60rpx;
  }
  &__options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100vw;
    height: 100rpx;
    padding-right: 80rpx;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    box-sizing: border-box;
    &-input {
      width: 100%;
      padding-right: 20rpx;
      font-size: $fg-f5;
    }
    .icon-img {
      margin-right: 30rpx;
    }
  }
  &__add {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100rpx;
    margin-bottom: 60rpx;
    font-size: $fg-f5;
    color: --color(--qui-FC-AAA);
    background: --color(--qui-FC-f7);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    border-radius: 5rpx;
    .icon-add {
      margin-right: 15rpx;
    }
  }
}
</style>
