<template>
  <!-- 列表 -->
  <view class="det-person-box" :style="{ paddingBottom: btnShow ? '80rpx' : '50rpx' }">
    <view class="det-per-number" v-if="personNum != 0">
      {{ personNum }}{{ t.persenUnit }}{{ type }}
    </view>
    <view class="det-per-list" v-if="personRes.length > 0">
      <view class="det-person" v-for="(person, index) in personRes" :key="index">
        <image
          :src="person.avatarUrl ? person.avatarUrl : '/static/noavatar.gif'"
          class="det-per-head"
          v-if="person.showAvatar"
          @click="personJump(person.id)"
          @error="imageError(person)"
        ></image>
        <image
          v-else
          src="/static/noavatar.gif"
          class="det-per-head"
          @click="personJump(person.id)"
        ></image>
      </view>
    </view>
    <view class="fold-box" :style="{ transform: transform }" v-if="personNum > limitCount">
      <qui-icon name="icon-unfold" class="unfold" @click="foldClick"></qui-icon>
    </view>

    <button class="det-per-btn" v-if="btnShow" :style="{ background: btnBg }" @click="btnClick">
      <qui-icon
        :name="'icon-' + btnIconName"
        :color="btnTextColor"
        class="qui-icon"
        v-if="btnIconShow"
      ></qui-icon>
      <view :style="{ color: btnTextColor }">{{ btnText }}</view>
    </button>
  </view>
</template>

<script>
export default {
  props: {
    // 类型
    type: {
      default: '类型',
      type: String,
    },
    // list总数
    personNum: {
      default: '0',
      type: [Number, String],
    },
    // 初始化显示数量
    limitCount: {
      default: '10',
      type: [Number, String],
    },
    // list列表
    personList: {
      default: () => {
        return [];
      },
      type: Array,
    },
    // 是否显示按钮
    btnShow: {
      default: true,
      type: Boolean,
    },
    // 按钮背景色
    btnBg: {
      default: '#fa5151',
      type: String,
    },
    // 按时是否显示icon
    btnIconShow: {
      default: true,
      type: Boolean,
    },
    // icon的name值
    btnIconName: {
      default: '',
      type: String,
    },
    // 按钮text
    btnText: {
      default: '按钮',
      type: String,
    },
    // 按钮text颜色
    btnTextColor: {
      default: '#ffffff',
      type: String,
    },
  },
  data: () => {
    return {
      personRes: [],
      foldStatus: false,
      transform: '',
    };
  },
  onLoad() {},
  computed: {
    t() {
      return this.i18n.t('topic');
    },
  },
  watch: {
    // 监听得到的数据
    personList: {
      handler(newVal) {
        newVal.map(item => {
          item.showAvatar = true;
          return item;
        });
        this.personRes = newVal;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 数组取前几条数据
    limitArray(obj, limit) {
      const arr = [];
      Object.values(obj).forEach((item, index) => {
        if (index >= limit) {
          return;
        }
        arr.push(item);
      });
      return arr;
    },
    // 展开 折叠
    foldClick() {
      this.foldStatus = !this.foldStatus;
      // this.$emit('btnClick', param);
      if (this.foldStatus) {
        this.transform = 'rotate(180deg)';
        this.personRes = this.limitArray(this.personList, this.personNum);
      } else {
        this.transform = '';
        this.personRes = this.limitArray(this.personList, this.limitCount);
      }
    },
    personJump(param) {
      this.$emit('personJump', param);
    },
    btnClick(param) {
      this.$emit('btnClick', param);
    },
    // 头像失效
    imageError(person) {
      person.showAvatar = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.det-person-box {
  display: flex;
  flex-direction: column;
  padding: 0 0 80rpx;
  text-align: center;
  background: --color(--qui-BG-2);
  .det-per-number {
    font-size: $fg-f28;
    color: --color(--qui-FC-AAA);
    text-align: center;
  }
  .det-per-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: 30rpx 0;
  }
  .det-person {
    width: 50rpx;
    height: 50rpx;
    margin: 0 3rpx 10rpx 4rpx;
    border-radius: 50%;
    .det-per-head {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .det-per-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 465rpx;
    height: 90rpx;
    font-size: $fg-f28;
    line-height: 90rpx;
    .qui-icon {
      margin-right: 13rpx;
      font-size: 36rpx;
      line-height: 90rpx;
    }
  }
}
.fold-box {
  padding: 0 0 30rpx;
  transition: transform 200ms;
  transform-origin: 50% 50%;
  .unfold {
    font-size: 34rpx;
    color: --color(--qui-FC-B5);
  }
}
</style>
