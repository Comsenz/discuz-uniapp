<template>
  <view class="painter">
    <view class="canvas-box">
      <view class="cent">
        <image :src="imagePath" @tap="previewImage"></image>
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
      <view class="btn-box">
        <qui-button type="primary" size="large" @click="fun">保存相册</qui-button>
      </view>
    </view>
  </view>
</template>

<script>
import quiButton from '@/components/qui-button/qui-button';
import Cardc from '@/wxcomponents/card/cardbasemap'; // 首页海报有底图
import Carde from '@/wxcomponents/card/cardnobasemap'; // 首页海报无底图

export default {
  components: { quiButton },
  data() {
    return {
      userid: 4,
      imagePath: '',
      width: 700,
      template: {},
      themeid: '11', // 数据id
      headerImg: '' || 'https://discuz.chat/static/images/noavatar.gif', // 头像
      headerName: '', // 名字
      slitename: '', // 站点名称
      slitelogo: '', // 站点logo
      sliteback: '', // 站点背景图
      themnumber: '', // 成员人数
      contdata: '', // 内容大小
      introd: '', // 圈子介绍
    };
  },
  onLoad() {
    uni.showLoading({
      title: '拼命生成中...',
      mask: true,
    });
    this.usertitle();
    this.$nextTick(() => {
      this.slitename = this.forums.set_site.site_name;
      this.slitelogo = this.forums.set_site.site_logo;
      this.sliteback = this.forums.set_site.site_background_image;
      this.themnumber = this.forums.other.count_users;
      this.contdata = this.forums.other.count_threads;
      this.introd = this.forums.set_site.site_introduction;
      this.initData();
    });
  },
  computed: {
    forums() {
      return this.$store.getters['jv/get']('forums/1');
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
        this.headerImg = data.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif';
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
        introd: this.introd, // 圈子介绍
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
        title: '提示',
        content: '生成海报失败',
        showCancel: false,
      });
    },
    fun() {
      const imgSrc = this.imagePath;
      uni.saveImageToPhotosAlbum({
        filePath: imgSrc,
        success(data) {
          console.log(data);
        },
        fail(err) {
          console.log(err);
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
@import '@/styles/base/reset.scss';
page {
  padding: 0;
  margin: 0;
  font-size: $fg-f28;
  color: --color(--qui-FC-333);
}
.cent {
  width: 700rpx;
  height: 1082rpx;
  margin: 46rpx 25rpx 0;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  box-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.16);
  image {
    width: 100%;
    height: 100%;
  }
}
.icon-unfold {
  display: block;
}
.btn-box {
  margin: 151rpx 0 40rpx 40rpx;
}
</style>
