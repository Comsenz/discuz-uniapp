<template>
  <view>
    <qui-no-data tips="暂无内容" v-if="!list || list.length <= 0"></qui-no-data>
    <view class="list-box" v-for="item in list" :key="item.id" v-else>
      <!-- 除系统通知以外的通知 -->
      <view class="list-box__notice" v-if="item.type !== 'system'">
        <view class="list-box__notice__h">
          <view class="list-box__notice__hl">
            <image
              class="list-box__notice__hl-avatar"
              :src="
                item.user_avatar
                  ? item.user_avatar
                  : 'https://discuz.chat/static/images/noavatar.gif'
              "
            ></image>
            <view class="list-box__notice__hl-info">
              <view>
                <text
                  :class="[
                    item.thread_user_groups ? '' : 'list-box__notice__hl-info-username-space',
                    'list-box__notice__hl-info-username',
                  ]"
                >
                  {{ item.user_name }}
                </text>
                <text class="list-box__notice__hl-info-groupname" v-if="item.thread_user_groups">
                  （{{ item.thread_user_groups }}）
                </text>
                <text class="list-box__notice__hl-info-title" v-if="item.type === 'related'">
                  @了我
                </text>
                <text class="list-box__notice__hl-info-title" v-if="item.type === 'replied'">
                  回复了我
                </text>
                <text class="list-box__notice__hl-info-title" v-if="item.type === 'liked'">
                  点赞了我
                </text>
                <text class="list-box__notice__hl-info-title" v-if="item.type === 'rewarded'">
                  打赏了我
                </text>
              </view>
              <view class="list-box__notice__hl-info-time">{{ item.time }}</view>
            </view>
          </view>
          <view class="list-box__notice__hr">
            <text class="list-box__notice__hr__amount" v-if="item.type === 'rewarded'">
              {{ item.money }}
            </text>
            <qui-icon class="arrow" name="icon-folding-r" size="22" color="#ddd"></qui-icon>
          </view>
        </view>
        <view class="list-box__notice__con">
          <view
            class="list-box__notice__con__text"
            v-html="item.post_content"
            @click="jumpMyComment(item)"
          ></view>
          <view
            class="list-box__notice__con__wrap"
            v-if="item.thread_id"
            @click="jumpOtherTopic(item.thread_id)"
          >
            <view class="list-box__notice__con__wrap-info">
              <text class="list-box__notice__con__wrap-info-username">
                {{ item.thread_user_name }}：
              </text>
              <view v-html="item.thread_title" style="display: inline-block;"></view>
              <view class="list-box__notice__con__wrap-info-time">
                {{ item.thread_created_at }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 系统通知 -->
      <view class="list-box__system-notice" v-else>
        <view class="list-box__system-notice__h">
          <view>
            <view class="list-box__system-notice__hl__title">{{ item.title }}</view>
            <view class="list-box__system-notice__hl__time">{{ item.time }}</view>
          </view>
          <view class="list-box__system-notice__hr">
            <qui-icon class="arrow" name="icon-folding-r" size="22" color="#ddd"></qui-icon>
          </view>
        </view>
        <view class="list-box__system-notice__con">
          <view class="list-box__system-notice__con__text">{{ item.content }}</view>
        </view>
      </view>
      <!-- 删除按钮 -->
      <view class="list-box__ft" @click="deleteNotification(item.id)">
        <qui-icon name="icon-delete" color="#777" size="26"></qui-icon>
        <text class="list-box__ft__text">删除</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},

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

    jumpMyComment(item) {
      console.log('跳转到评论页面：', item);
      uni.navigateTo({
        url: `/pages/topic/index?threadId=${item.thread_id}&commentId=${item.post_id}`,
      });
    },

    jumpOtherTopic(topicId) {
      console.log('跳转到帖子详情页面：', topicId);
      uni.navigateTo({
        url: `/pages/topic/index?id=${topicId}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.list-box {
  width: 100%;
  margin: 0 0 20rpx;
  font-size: $fg-f28;
  background-color: --color(--qui-BG-2);

  &__notice {
    padding: 20rpx 40rpx;

    &__h {
      display: flex;
      justify-content: space-between;
    }

    &__hl {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;

      &-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 100rpx;
      }

      &-info {
        margin-left: 20rpx;
      }

      &-info-username {
        font-weight: bold;
        color: #000;
      }

      &-info-username-space {
        margin-right: 13rpx;
      }

      &-info-groupname,
      &-info-title {
        color: #aaa;
      }

      &-info-time {
        font-size: 24rpx;
        color: #aaa;
      }
    }

    &__hr {
      display: flex;
      flex-direction: row;
      align-items: center;

      &__amount {
        margin-right: 20rpx;
        font-weight: bold;
        color: #fa5151;
      }
    }

    &__con {
      &__text {
        margin: 0rpx 0rpx 40rpx;
        color: #333;
      }

      &__wrap {
        padding: 20rpx;
        font-size: 24rpx;
        color: #333;
        background: #ededed;
        border-radius: 10rpx;
      }

      &__wrap-info-username {
        font-weight: bold;
      }

      &__wrap-info-time {
        margin: 10rpx 0rpx 0rpx;
        font-size: 20rpx;
        color: #aaa;
      }
    }
  }

  &__system-notice {
    padding: 25rpx 40rpx 20rpx;

    &__h {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;

      &l__title {
        margin-bottom: 10rpx;
        font-weight: bold;
        color: #000;
      }

      &l__time {
        font-size: 24rpx;
        color: #aaa;
      }
    }

    &__con {
      &__text {
        color: #333;
      }
    }
  }

  &__ft {
    padding: 0rpx 40rpx 40rpx 0rpx;
    text-align: right;

    &__text {
      margin-left: 11rpx;
      color: #777;
    }
  }
}
</style>
