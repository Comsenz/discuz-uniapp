<template>
  <qui-page>
    <view class="invite">
      <!-- 标签栏 -->
      <view class="invite-tabs">
        <qui-tabs :current="current" :values="tabList" @clickItem="onClickItem"></qui-tabs>
        <qui-no-data
          tips="暂无内容"
          v-if="!allInviteList || allInviteList.length <= 0"
        ></qui-no-data>
        <view class="profile-tabs__content" v-else>
          <view v-if="current === 0" class="items">
            <!-- 记录数 -->
            <view class="invite-records">
              <text>共有 {{ totalData }} 条记录</text>
            </view>
            <!-- 邀请列表 -->
            <view class="invite-content">
              <qui-cell-item
                v-for="item in allInviteList"
                :key="item._jv.id"
                :title="item.title"
                :brief="item.time"
                slot-right
              >
                <view class="invite-content-invalid" @click="invalid(item._jv.id)">设为无效</view>
                <view class="invite-content-line"></view>
                <view class="invite-content-share" @click="share(item.code)">
                  分享
                  <qui-icon name="icon-share1" class="qui-icon"></qui-icon>
                </view>
              </qui-cell-item>
            </view>
            <!-- 邀请链接按钮 -->
            <view class="invite-button">
              <button class="btn" @click="generate">生成邀请链接</button>
            </view>
          </view>
          <view v-if="current === 1" class="items">
            <!-- 记录数 -->
            <view class="invite-records">
              <text>共有 {{ totalData }} 条记录</text>
            </view>
            <!-- 邀请列表 -->
            <view class="invite-content">
              <qui-cell-item
                v-for="item in allInviteList"
                :key="item._jv.id"
                :title="item.title"
                :brief="item.time"
                slot-right
              >
                <view class="invite-content-invalid" @click="invalid(item._jv.id)">设为无效</view>
                <view class="invite-content-line"></view>
                <view class="invite-content-share" @click="share(item.code)">
                  分享
                  <qui-icon name="icon-share1" class="qui-icon"></qui-icon>
                </view>
              </qui-cell-item>
            </view>
          </view>
          <view v-if="current === 2" class="items">
            <!-- 记录数 -->
            <view class="invite-records">
              <text>共有 {{ totalData }} 条记录</text>
            </view>
            <!-- 邀请列表 -->
            <view class="invite-content">
              <qui-cell-item
                v-for="item in allInviteList"
                :key="item._jv.id"
                :title="item.title"
                :brief="item.time"
                slot-right
              >
                <view class="invite-content-invalid" @click="invalid(item._jv.id)">设为无效</view>
                <view class="invite-content-line"></view>
                <view class="invite-content-share" @click="share(item.code)">
                  分享
                  <qui-icon name="icon-share1" class="qui-icon"></qui-icon>
                </view>
              </qui-cell-item>
            </view>
          </view>
          <view v-if="current === 3" class="items">
            <!-- 记录数 -->
            <view class="invite-records">
              <text>共有 {{ totalData }} 条记录</text>
            </view>
            <!-- 邀请列表 -->
            <view class="invite-content">
              <qui-cell-item
                v-for="item in allInviteList"
                :key="item._jv.id"
                :title="item.title"
                :brief="item.time"
                slot-right
              >
                <view class="invite-content-invalid" @click="invalid(item._jv.id)">设为无效</view>
                <view class="invite-content-line"></view>
                <view class="invite-content-share" @click="share(item.code)">
                  分享
                  <qui-icon name="icon-share1" class="qui-icon"></qui-icon>
                </view>
              </qui-cell-item>
            </view>
          </view>
        </view>
      </view>
      <!-- 邀请链接弹窗 -->
      <uni-popup ref="popup" type="bottom">
        <scroll-view style="height: 968rpx;" scroll-y="true">
          <view class="popup-wrap">
            <view class="popup-wrap-con">
              <view
                @click="generateUrl(item.group_id)"
                v-for="item in allInviteList"
                :key="item._jv.id"
              >
                <view class="popup-wrap-con-text">{{ item.title }}</view>
                <view class="popup-wrap-con-line"></view>
              </view>
            </view>
            <view class="popup-wrap-space"></view>
            <text class="popup-wrap-btn" @click="cancel">取消</text>
          </view>
        </scroll-view>
      </uni-popup>
    </view>
  </qui-page>
</template>

<script>
import { timestamp2day } from '@/utils/time';

export default {
  components: {},
  data() {
    return {
      current: 0, // 当前标签页
      totalData: 3, // 邀请链接列表数量
      tabList: [
        { id: 1, title: '未使用', status: 1 },
        { id: 2, title: '已使用', status: 2 },
        { id: 3, title: '已过期', status: 3 },
        { id: 4, title: '已失效', status: 0 },
      ], // 邀请链接类型列表
    };
  },
  onLoad() {
    this.getInviteList(1);
    this.getGroupList();
  },
  computed: {
    // 获取管理邀请列表（非管理员无的邀请链接无管理）
    allInviteList() {
      const list = [];
      const inviteList = this.$store.getters['jv/get']('invite');
      const groupList = this.$store.getters['jv/get']('groups');
      console.log('会话列表接口的响应：', inviteList);
      console.log('用户组接口的响应：', groupList);
      const inviteListKeys = Object.keys(inviteList);
      const groupListKeys = Object.keys(groupList);
      if (inviteList && inviteListKeys.length > 0) {
        for (let i = 0; i < inviteListKeys.length; i += 1) {
          const inviteListValue = inviteList[inviteListKeys[i]];
          const day = timestamp2day(inviteListValue.endtime);
          inviteListValue.time = `有效期剩余${day}天`;
          if (groupListKeys && groupListKeys.length > 0) {
            for (let j = 0; j < groupListKeys.length; j += 1) {
              const groupListValue = groupList[groupListKeys[j]];
              if (inviteListValue.group_id.toString() === groupListValue._jv.id.toString()) {
                inviteListValue.title = groupListValue.name;
              }
            }
          }
          list.push(inviteListValue);
        }
      }
      console.log('list', list);
      return list;
    },
  },

  methods: {
    // 调用 管理邀请列表 接口
    getInviteList(status) {
      const params = {
        'filter[status]': status,
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'invite' } });
      this.$store.dispatch('jv/get', ['invite', { params }]).then(res => {
        this.totalData = res._jv.json.meta.total;
        console.log('获取管理邀请列表', res);
      });
    },
    // 调用 获取所有用户组 接口
    getGroupList() {
      this.$store.commit('jv/clearRecords', { _jv: { type: 'groups' } });
      this.$store.dispatch('jv/get', 'groups');
      console.log('获取所有用户组');
    },
    // 改变标签页
    onClickItem(e) {
      if (e.currentIndex !== this.current) {
        this.current = e.currentIndex;
        this.getInviteList(this.tabList[e.currentIndex].status);
      }
    },
    // 设为无效
    invalid(id) {
      this.$store.dispatch('jv/delete', `invite/${id}`).then(res => {
        console.log('设为无效', res);
      });
    },
    // 分享
    share(code) {
      console.log('跳转到分享页面');
      uni.navigateTo({
        url: `../site/partner-invite?code=${code}`,
      });
    },
    // 生成邀请链接弹窗
    generate() {
      console.log('生成邀请链接弹窗');
      this.$refs.popup.open();
    },
    // 生成 合伙人/嘉宾/成员 邀请链接
    generateUrl(groupId) {
      console.log('生成邀请链接：', groupId);
      const adminParams = {
        _jv: {
          type: 'invite',
        },
        type: 'invite',
        group_id: groupId,
      };
      const userParams = {
        _jv: {
          type: 'userInviteCode',
        },
      };
      // 角色是管理员
      if (groupId) {
        this.$store
          .dispatch('jv/post', adminParams)
          .then(res => {
            if (res) {
              console.log('管理员生成邀请链接res：', res);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // 角色不是管理员
        this.$store
          .dispatch('jv/post', userParams)
          .then(res => {
            if (res) {
              console.log('生成邀请链接res：', res);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 点击取消按钮
    cancel() {
      console.log('取消');
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.invite {
  font-size: $fg-f28;

  .left-text {
    min-width: 250rpx;
    font-weight: bold;
    color: #343434;
  }
  .invite-records {
    margin: 40rpx 0 20rpx 20rpx;
    font-size: $fg-f24;
    color: --color(--qui-FC-7D7979);
  }

  .user-avatar {
    width: 70rpx;
    height: 70rpx;
    margin: 15rpx 20rpx;
    border-radius: 50%;
  }

  &-content {
    padding: 0rpx 0rpx 20rpx 20rpx;
    margin: 20rpx 20rpx 170rpx;
    background: --color(--qui-BG-2);
    border-radius: 6rpx;
    opacity: 1;
    box-shadow: 0rpx 4rpx 8rpx rgba(0, 0, 0, 0.05);

    .cell-item {
      height: 100rpx;
    }

    &.cell-item.border:last-child {
      border: none;
    }

    &-invalid {
      display: inline-block;
      margin-right: 29rpx;
    }

    &-line {
      display: inline-block;
      width: 0rpx;
      height: 26rpx;
      border: 2rpx solid --color(--qui-BG-ED);
      opacity: 1;
    }

    &-share {
      display: inline-block;
      margin: 0 20rpx 0 25rpx;

      .qui-icon {
        margin-left: 8rpx;
      }
    }
  }

  .invite-button {
    position: fixed;
    right: 0;
    bottom: 40rpx;
    left: 0;
    width: 670rpx;
    height: 90rpx;
    margin: auto;

    .btn {
      background: --color(--qui-BG-2);
    }
  }

  .popup-wrap {
    display: flex;
    flex-direction: column;
    background: --color(--qui-BG-2);
    border-radius: 10rpx 10rpx 0rpx 0rpx;

    &-con {
      border-radius: 10rpx 10rpx 0rpx 0rpx;

      &-text {
        width: 100%;
        height: 100rpx;
        font-size: $fg-f34;
        line-height: 100rpx;
        text-align: center;
      }

      &-line {
        border: 2rpx solid --color(--qui-BG-ED);
      }
    }

    &-space {
      border: 8rpx solid --color(--qui-BG-ED);
    }

    &-btn {
      width: 100%;
      height: 100rpx;
      font-size: $fg-f28;
      line-height: 100rpx;
      text-align: center;
    }
  }
}
</style>
