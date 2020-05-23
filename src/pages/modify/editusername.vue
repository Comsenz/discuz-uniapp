<template>
  <qui-page>
    <view class="chagepas">
      <view class="chagepas-pas">
        <input
          type="text"
          class="chagepas-pas-inpa"
          :placeholder="i18n.t('modify.numbermodifitions')"
          placeholder-style="color:rgba(221,221,221,1)"
          maxlength="15"
        />
        <view class="chagepas-erro-test" v-if="edit">
          {{ test }}
        </view>
      </view>
      <view class="chagepas-pas-btn">
        <qui-button type="primary" size="large" :disabled="disab" @click="submission">
          {{ i18n.t('modify.submission') }}
        </qui-button>
      </view>
    </view>
  </qui-page>
</template>
<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  data() {
    return {
      fun: true,
      valueused: '',
      edit: false,
      judge: false,
      myname: '',
      test: '',
      userid: '',
      nametitle: { icon: 'none', duration: 2000 },
    };
  },
  onLoad() {
    this.userid = this.usersid;
  },
  computed: {
    forums() {
      return this.$store.getters['jv/get']('forums/1');
    },
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
  },
  methods: {
    submission() {
      if (this.sername) {
        this.changname();
      } else {
        uni.showToast({
          icon: this.nametitle.icon,
          title: this.i18n.t('modify.emptyname'),
          duration: this.nametitle.duration,
        });
      }
    },
    changname() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        username: this.sername,
      };
      const patchname = status.run(() => this.$store.dispatch('jv/patch', params));
      patchname
        .then(res => {
          if (res) {
            uni.showToast({
              title: this.i18n.t('modify.modifysucc'),
              duration: 2000,
            });
            uni.navigateBack({
              delta: 1,
            });
          }
        })
        .catch(err => {
          if (err.statusCode === 500) {
            this.edit = true;
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.test = sun;
            uni.showToast({
              icon: this.nametitle.icon,
              title: this.test,
              duration: 2000,
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.chagepas {
  width: 100vw;
  height: 100vh;
  background-color: --color(--qui-BG-2);
}
.chagepas-pas {
  width: 100%;
  padding: 31rpx 0 0 40rpx;
  box-sizing: border-box;
}
.chagepas-erro-test {
  margin-top: 20rpx;
  font-size: $fg-f24;
  font-weight: 400;
  color: --color(--qui-RED);
}
.chagepas-pas-inpa {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f34;
  font-weight: 400;
  line-height: 100rpx;
  text-align: left;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.chagepas-pas-btn {
  width: 670rpx;
  margin: 50rpx auto 0;
}
</style>
