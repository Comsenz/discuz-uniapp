<template>
  <view>
    <view class="list-box" v-for="item in list" :key="item.id">
      <view class="list-box__header">
        <view class="list-box__header__info">
          <image
            class="list-box__header__info__user-avatar"
            v-if="item.type !== 'system'"
            :src="
              item.user_avatar ? item.user_avatar : 'https://discuz.chat/static/images/noavatar.gif'
            "
          ></image>
          <view>
            <view class="list-box__header__info__box">
              <text class="list-box__header__info__username">{{ item.user_name }}</text>
              <text class="list-box__header__info__groupname" v-if="item.thread_user_groups">
                （{{ item.thread_user_groups }}）
              </text>
              <text class="list-box__header__info__title" v-if="item.type === 'related'">
                @了我
              </text>
              <text class="list-box__header__info__title" v-if="item.type === 'replied'">
                回复了我
              </text>
              <text class="list-box__header__info__title" v-if="item.type === 'liked'">
                点赞了我
              </text>
              <text class="list-box__header__info__title" v-if="item.type === 'rewarded'">
                打赏了我
              </text>
            </view>
            <view class="list-box__header__info__time">{{ item.time }}</view>
          </view>
        </view>
        <view class="list-box__header__r">
          <uni-icons
            class="red-circle"
            v-if="item.recipient_read_at === null"
            type="smallcircle-filled"
            size="7"
            color="red"
          ></uni-icons>
          <text class="list-box__header__r__amount" v-if="item.amount">{{ item.amount }}</text>
          <uni-icons class="uni-icon-wrapper" type="arrowright" :size="20" color="#bbb" />
        </view>
      </view>
      <view class="list-box__con">
        <view class="list-box__con__text" v-html="item.post_content"></view>
        <view class="list-box__con__box" v-if="item.thread_id">
          <view class="list-box__con__box__info">
            <text class="list-box__con__box__info__username">{{ item.thread_user_name }}：</text>
            <text class="list-box__con__box__info__post_content">{{ item.thread_title }}</text>
            <view class="list-box__con__box__info__time">{{ item.thread_created_at }}</view>
          </view>
        </view>
      </view>
      <view class="list-box__footer" @click="deleteNotification(item.id)">
        <uni-icons class="uni-icon-wrapper" type="trash" :size="18" color="#777" />
        <text class="list-box__footer__text">删除</text>
      </view>
    </view>
  </view>
</template>

<script>
import { uniIcons } from '@dcloudio/uni-ui';

export default {
  components: {
    uniIcons,
  },

  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  methods: {
    deleteNotification(id) {
      this.$store.dispatch('jv/delete', `notification/${id}`).then(res => {
        console.log('删除成功', res);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-box {
  width: 100%;
  min-height: 188rpx;
  margin: 30rpx 0 10rpx;
  color: #333;
  background: #fff;

  &__header {
    display: flex;
    justify-content: space-between;

    &__info {
      display: flex;
      justify-content: space-between;

      &__user-avatar {
        width: 80rpx;
        height: 80rpx;
        margin: 20rpx 20rpx 20rpx 40rpx;
        border-radius: 100rpx;
      }

      &__box {
        width: 100%;
        align-items: center;
        margin: 20rpx 0 10rpx;
      }

      &__username {
        margin-right: 6rpx;
        font-weight: bold;
        line-height: 37rpx;
        color: #000;
      }

      &__groupname,
      &__title {
        font-weight: 400;
        line-height: 37rpx;
        color: #aaa;
      }

      &__time {
        font-size: 24rpx;
        line-height: 31rpx;
        color: #aaa;
      }
    }

    &__r {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 30rpx;

      &__amount {
        margin-right: 20rpx;
        font-weight: bold;
        color: #fa5151;
      }
    }
  }

  &__con {
    margin: 20rpx 40rpx 10rpx;

    &__text {
      margin: 20rpx 0 15rpx;
    }

    &__box {
      width: 100%;
      min-height: 145rpx;
      margin: 15rpx 0 0;
      font-weight: normal;
      background: #ededed;
      border-radius: 10rpx;

      &__info {
        padding: 23rpx 16rpx 10rpx 20rpx;
        font-size: 24rpx;
        line-height: 35rpx;
        color: #333;
      }

      &__info__username {
        font-weight: bold;
      }

      &__info__time {
        margin: 10rpx 0 20rpx;
        font-size: 20rpx;
        color: #aaa;
      }
    }
  }

  &__footer {
    padding: 10rpx 30rpx 40rpx 0;
    text-align: right;

    &__text {
      color: #777;
    }
  }
}
</style>
