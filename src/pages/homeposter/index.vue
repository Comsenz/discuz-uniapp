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
import Cardc from '@/wxcomponents/card/cardbasemap'; // 首页海报无底图
import Carde from '@/wxcomponents/card/cardnobasemap'; // 标题单图片文字海报

export default {
  components: { quiButton },
  data() {
    return {
      imagePath: '',
      width: 700,
      template: {},
      themeid: '11', // 数据id
      headerImg: '' || 'https://discuz.chat/static/images/noavatar.gif', // 头像
      headerName: '', // 名字
      themnumber: '', // 人数
      contdata: '', // 内容大小
      introd: '', // 圈子介绍
      type: 0,
    };
  },
  onLoad() {
    uni.showLoading({
      title: '拼命生成中...',
      mask: true,
    });
    // this.$store
    //   .dispatch(
    //     'jv/get',
    //     `threads/${this.themeid}?include=user,firstPost,firstPost.images,category,threadVideo`,
    //   )
    //   .then(data => {
    //     console.log(data);
    //     this.headerName = data.user.username;
    //     this.headerImg = data.user.avatarUrl;
    //     this.postyTepy = data.type;
    //     this.contentTitle = data.title;
    //     this.content = data.firstPost.content;
    //     const arr = Object.values(data.firstPost.images);
    //     arr.forEach(value => {
    //       this.contentImg.push(value.url);
    //     });
    //     this.attachmentsType = data.category.name;
    //     if (this.postyTepy === 2) {
    //       this.video = data.threadVideo.cover_url;
    //       this.videoduc = data.threadVideo.file_name;
    //     }
    //     console.log(this.video, this.videoduc);
    //     this.initData();
    //   });
    this.initData();
  },
  methods: {
    initData() {
      // const obj = {
      //   username: this.headerName, // 名字
      //   userheader: this.headerImg, // 头像
      //   usertitle: this.contentTitle, // 内容标题
      //   usercontent: this.content, // 内容
      //   usercontimg: this.contentImg, // 内容图片
      //   userattname: this.attachmentsName, // 帖子内容名称
      //   useratttype: this.attachmentsType, // 帖子分类
      //   userweixincode: this.weixincode, // 微信二维码
      //   uservideo: this.video,
      //   uservideoduc: this.videoduc,
      // };
      if (this.type === 1) {
        this.template = new Cardc().palette();
        // 没有标题的海报
      } else {
        this.template = new Carde().palette();
      }
    },
    onImgOK(e) {
      this.imagePath = e.detail.path;
      uni.hideLoading();
    },
    imgErr(e) {
      console.log(e);
      uni.hideLoading();
      uni.showModal({
        title: '提示',
        content: '生成海报失败',
        showCancel: false,
      });
    },
    fun() {
      const imgSrc = this.imagePath;
      console.log('this', this);
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
      console.log(1);
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
  width: 670rpx;
  height: 90rpx;
  margin: 151rpx 0 40rpx 40rpx;
  background: rgba(24, 120, 243, 1);
  border-radius: 5rpx;
  opacity: 1;
}
</style>
