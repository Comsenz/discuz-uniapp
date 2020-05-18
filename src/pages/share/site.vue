<template>
  <view class="painter">
    <view class="canvas-box">
      <view class="cent">
        <image
          :src="imagePath"
          mode="widthFix"
          @tap="previewImage"
          :show-menu-by-longpress="true"
          class="cent-image"
        ></image>
      </view>
      <view class="box-img">
        <painter
          custom-style="margin-left: 40rpx; height: 0rpx; position:fixed"
          :palette="template"
          @imgErr="imgErr"
          @imgOK="onImgOK"
          width-pixels="500"
        />
      </view>
    </view>
    <view class="btn-box">
      <qui-button type="primary" size="large" @click="fun">
        {{ i18n.t('share.savealbum') }}
      </qui-button>
    </view>
  </view>
</template>

<script>
import Cardc from '@/wxcomponents/card/cardbasemap'; // 首页海报有底图
import Carde from '@/wxcomponents/card/cardnobasemap'; // 首页海报无底图

export default {
  data() {
    return {
      userid: '',
      imagePath: '',
      width: 700,
      template: {},
      themeid: '11', // 数据id
      headerImg: '', // 头像
      headerName: '', // 名字
      slitename: '', // 站点名称
      slitelogo: '', // 站点logo
      sliteback: '', // 站点背景图
      themnumber: '', // 成员人数
      contdata: '', // 内容大小
      introd: '', // 站点介绍
      weixincode: 'https://dq.comsenz-service.com/api/oauth/wechat/miniprogram/code', // 微信二维码
    };
  },
  onLoad() {
    uni.showLoading({
      title: this.i18n.t('share.generating'),
      mask: true,
    });
    this.$nextTick(() => {
      this.userid = this.usersid;
      this.slitename = this.forums.set_site.site_name;
      this.slitelogo = this.forums.set_site.site_logo;
      this.sliteback = this.forums.set_site.site_background_image;
      this.themnumber = this.forums.other.count_users;
      this.contdata = this.forums.other.count_threads;
      this.introd = this.forums.set_site.site_introduction;
      this.usertitle();
    });
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
    usertitle() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: 'groups',
      };
      this.$store.dispatch('jv/get', params).then(data => {
        this.headerName = data.username;
        this.headerImg = data.avatarUrl || '/static/noavatar.gif';
        this.initData();
      });
    },
    initData() {
      const obj = {
        username: this.headerName, // 名字
        userheader: this.headerImg, // 头像
        slitename: this.slitename, // 站点名称
        slitelogo: this.slitelogo, // 站点logo
        sliteback: this.sliteback, // 站点背景图
        themnumber: this.themnumber, // 成员人数
        contdata: this.contdata, // 内容大小
        introd: this.introd, // 站点介绍
        userweixincode: this.weixincode, // 微信二维码
        longpressrecog: this.i18n.t('share.longpressrecog'), // 长按识别
        recomment: this.i18n.t('share.recomment'),
        siteintroduction: this.i18n.t('share.siteintroduction'),
        comefrom: this.i18n.t('share.comefrom'),
        member: this.i18n.t('share.member'),
        contents: this.i18n.t('share.contents'),
      };
      if (this.sliteback) {
        this.template = new Cardc().palette(obj);
        // 没有标题的海报
      } else {
        this.template = new Carde().palette(obj);
      }
    },
    onImgOK(e) {
      this.imagePath = e.detail.path;
      uni.hideLoading();
    },
    imgErr() {
      uni.hideLoading();
      uni.showModal({
        title: this.i18n.t('discuzq.msgbox.title'),
        content: this.i18n.t('share.buildfailed'),
        showCancel: false,
      });
    },
    fun() {
      const _this = this;
      uni.saveImageToPhotosAlbum({
        filePath: _this.imagePath,
        success(data) {
          if (data) {
            uni.showToast({
              icon: 'none',
              title: _this.i18n.t('share.successfully'),
              duration: 2000,
            });
          }
        },
        fail(err) {
          if (err) {
            uni.showToast({
              icon: 'none',
              title: _this.i18n.t('share.savefailed'),
              duration: 2000,
            });
          }
        },
      });
    },
    previewImage() {
      const currimg = this.imagePath; // 这里获取到的是一张本地的图片
      uni.previewImage({
        current: currimg, // 需要预览的图片链接列表
        urls: [currimg], // 当前显示图片的链接
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
.painter {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
}
.canvas-box {
  width: 100%;
  height: 100%;
  padding-top: 41rpx;
  margin-bottom: 155rpx;
}
.cent {
  width: 700rpx;
  height: 980rpx;
  margin: 0 auto;
  background: --color(--qui-FC-FFF);
  border-radius: 10px;
  box-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.16);
  .cent-image {
    display: block;
    width: 100%;
    height: 100%;
  }
}
#front {
  position: fixed;
  width: 0;
  height: 0;
}
.btn-box {
  margin: 0 0 40rpx 40rpx;
}
</style>
