<template>
  <view class="qui-vote-result">
    <view class="qui-vote-result__title">
      {{ optional === 1 ? i18n.t('topic.singleVote') : i18n.t('topic.multipleVote') }}
    </view>
    <view class="qui-vote-result__content">
      <radio-group @change="radioChange" v-if="optional === 1">
        <view
          v-for="(item, index) in voteData"
          :key="item._jv.id"
          class="qui-vote-result__content__item"
        >
          <label class="qui-vote-result__content__item-cell">
            <view class="qui-vote-result__content__item-select" v-if="!isVoted && !isDateEqual">
              <radio :value="item._jv.id" />
            </view>
            <view class="qui-vote-result__content__item-number">{{ `${index + 1}.` }}</view>
            <view>{{ item.content }}</view>
          </label>
          <view class="qui-vote-result__content__item-progress" v-if="isShowResult === 1">
            <progress
              :percent="item.percent"
              border-radius="3"
              stroke-width="6"
              font-size="12"
              backgroundColor="#ccc"
              activeColor="#1e78f3"
              class="qui-vote-result__content__item-step"
              v-if="isShowResult === 1"
            />
            <view>{{ `${item.percent}%(${item.count})` }}</view>
          </view>
        </view>
      </radio-group>
      <checkbox-group @change="checkboxChange" v-if="optional > 1">
        <view
          v-for="(item, index) in voteData"
          :key="item._jv.id"
          class="qui-vote-result__content__item"
        >
          <label class="qui-vote-result__content__item-cell">
            <view class="qui-vote-result__content__item-select" v-if="!isVoted && !isDateEqual">
              <checkbox :value="item._jv.id" />
            </view>
            <view class="qui-vote-result__content__item-number">{{ `${index + 1}.` }}</view>
            <view>{{ item.content }}</view>
          </label>
          <view class="qui-vote-result__content__item-progress" v-if="isShowResult === 1">
            <progress
              :percent="item.percent"
              border-radius="3"
              stroke-width="6"
              font-size="12"
              backgroundColor="#ccc"
              activeColor="#1e78f3"
              class="qui-vote-result__content__item-step"
            />
            <view>{{ `${item.percent}%(${item.count})` }}</view>
          </view>
        </view>
      </checkbox-group>
    </view>
    <view class="qui-vote-result__ft">
      <button class="qui-vote-result__ft-btn" v-if="!isDateEqual && !isVoted" @click="voteClick">
        {{ i18n.t('home.vote') }}
      </button>
      <button class="qui-vote-result__ft-btn noVoteBtn" v-if="isDateEqual && !isVoted">
        {{ i18n.t('home.vote') }}
      </button>
      <view class="qui-vote-result__ft-text" v-if="isVoted">
        {{ i18n.t('topic.youHaveVoted') }}
      </view>
      <view class="qui-vote-result__ft-text" v-if="isDateEqual">
        {{ i18n.t('topic.theVotingIsOver') }}
      </view>
    </view>
    <view class="qui-vote-result__person" v-if="isShowParticipant == 1">
      <view class="qui-vote-result__person-number">
        {{ i18n.t('topic.votersTotal', { total: personRes.length }) }}
      </view>
      <qui-person-list
        :type="i18n.t('topic.votersTotal')"
        :number-show="false"
        :person-num="personRes.length"
        :person-list="personRes"
        list-bg="#f6f6f6"
        :btn-show="false"
        @personJump="personJump"
      ></qui-person-list>
    </view>
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>

<script>
import forums from '@/mixin/forums';
import { getCurUrl } from '@/utils/getCurUrl';
import loginModule from '@/mixin/loginModule';

export default {
  mixins: [forums, loginModule],
  props: {
    // 投票帖
    postVotes: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isVoted: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      voteData: [], // 投票选项数据
      optional: 0, // 投票可选项
      voteId: 0, // 投票ID
      voteIdData: null, // 已选投票ID
      // voteLogs: [], // 投票记录ID
      isShowResult: 0, // 是否展示投票结果
      isShowParticipant: 0, // 是否展示投票人
      personRes: [], // 投票人员
    };
  },
  computed: {
    isDateEqual() {
      const time = new Date().getTime();
      const endTime = new Date(this.postVotes.end_at).getTime();
      if (endTime >= time) {
        return false;
      }
      return true;
    },
  },
  created() {
    let total = 0;
    this.postVotes.options.forEach(item => {
      total += item.count;
    });
    this.voteData = this.postVotes.options;
    this.postVotes.options.forEach((item, index) => {
      if (total === 0 || Number.isNaN(total)) {
        this.voteData[index].percent = 0;
      } else {
        this.voteData[index].percent = this.format(item.count / total);
      }
    });
    this.voteId = Number(this.postVotes._jv.id);
    this.optional = this.postVotes.optional;
    this.isShowResult = this.postVotes.is_show_result;
    this.isShowParticipant = this.postVotes.is_show_participant;
    // if (this.postVotes.actorLogs.length > 0) {
    //   this.postVotes.actorLogs.forEach(item => {
    //     this.voteLogs.push(item.vote_option_id);
    //   });
    // }
    // this.voteData.forEach((item, index) => {
    //   if (this.voteLogs.includes(Number(item._jv.id))) {
    //     this.voteData[index].isChecked = true;
    //   } else {
    //     this.voteData[index].isChecked = false;
    //   }
    // });
    const personData = [];
    this.postVotes.logs.forEach(item => {
      if (!personData.includes(Number(item.user_id))) {
        this.personRes.push(item.user);
      }
      personData.push(Number(item.user_id));
    });
  },
  methods: {
    // 将小数转化为百分数
    format(point) {
      const num = Number(point * 100);
      let len = 0;
      if (num.toString().indexOf('.') !== -1) {
        len = num.toString().replace(/^\d+\./, '').length;
      }
      if (len && len >= 2) {
        return num.toFixed(2);
      }
      return num;
    },
    radioChange(e) {
      this.voteIdData = e.target.value;
      this.voteData.forEach(item => {
        if (item._jv.id === e.target.value) {
          this.$set(item, 'checked', true);
        } else {
          this.$set(item, 'checked', false);
        }
      });
    },
    checkboxChange(e) {
      const values = e.detail.value;
      this.voteIdData = e.detail.value;
      this.voteData.forEach(item => {
        if (values.includes(item._jv.id)) {
          this.$set(item, 'checked', true);
        } else {
          this.$set(item, 'checked', false);
        }
      });
    },
    voteClick() {
      if (!this.$store.getters['session/get']('isLogin')) {
        uni.setStorage({
          key: 'page',
          data: getCurUrl(),
        });
        // #ifdef MP-WEIXIN
        this.mpLoginMode();
        // #endif
        // #ifdef H5
        this.h5LoginMode();
        // #endif
      }
      let voteIds = '';

      if (Array.isArray(this.voteIdData)) {
        if (this.voteIdData.length > this.optional) {
          this.$refs.toast.show({
            message: this.i18n.t('topic.maximumOptions', { num: this.optional }),
          });
          return;
        }
        voteIds = this.voteIdData.join(',');
      } else if (this.voteIdData) {
        voteIds = this.voteIdData;
      } else {
        this.$refs.toast.show({
          message: this.i18n.t('topic.pleaseSelectVoteOptions'),
        });
        return;
      }
      this.$store.dispatch('jv/get', `votes/cast/${this.voteId}/${voteIds}`).then(res => {
        uni.redirectTo({
          url: `/topic/index?id=${res.thread_id}`,
        });
      });
    },
    personJump(id) {
      this.$emit('personJump', id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

.qui-vote-result {
  padding: 20rpx 20px 0;
  margin-bottom: 40rpx;
  background: #f4f5f6;
  border-radius: 5rpx;
  &__title {
    margin-bottom: 20rpx;
    font-size: $fg-f2;
    font-weight: bolder;
    color: --color(--qui-FC-777);
  }
  &__content {
    &__item {
      margin-bottom: 16rpx;
      &-cell {
        display: flex;
        padding: 20rpx 0;
        font-size: $fg-f3;
        line-height: 46rpx;
        color: --color(--qui-FC-333);
      }
      &-select {
        margin-right: 15rpx;
      }
      &-number {
        margin-right: 15rpx;
      }
      &-progress {
        display: flex;
        font-size: $fg-f2;
        color: #1e78f3;
      }
      &-step {
        flex: 1;
        margin-right: 10rpx;
      }
    }
    /deep/ .uni-radio-input {
      width: 36rpx;
      height: 36rpx;
      margin-right: 0;
    }
  }
  &__ft {
    padding: 40rpx 80rpx 30rpx;
    line-height: 90rpx;
    &-btn {
      color: --color(--qui-FC-FFF);
      background: #1e78f3;
    }
    &-text {
      color: --color(--qui-FC-777);
      text-align: center;
    }
    .noVoteBtn {
      color: --color(--qui-FC-AAA);
      background: #ddd;
    }
    .noVoteBtn:after {
      border: none;
    }
  }
  &__person {
    display: flex;
    flex-direction: column;
    padding: 0 0 10rpx;
    text-align: center;
    &-number {
      font-size: $fg-f4;
      color: --color(--qui-FC-777);
      text-align: center;
    }
  }
}
</style>
