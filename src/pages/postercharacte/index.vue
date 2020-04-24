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
import Carda from '@/wxcomponents/card/cardtposter'; // 标题文字海报
import Cardb from '@/wxcomponents/card/cardaitu'; // 标题单图片文字海报
import Cardd from '@/wxcomponents/card/cardimg'; // 纯图片海报
import Cardf from '@/wxcomponents/card/cardpicture'; // 标题多图片海报
import Cardg from '@/wxcomponents/card/cardvideo'; // 视频海报
import Cardh from '@/wxcomponents/card/card'; // 文字海报

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
      postyTepy: '', // 帖子类型
      tepyRecon: '' || '推荐', // 帖子（推荐）
      subHeading: '', // 小标题
      contentTitle: '', // 内容标题
      content: '', // 内容
      contentImg: [], // 内容照片
      video: '', // 视频帖子
      videoduc: '', // 视频文件名
      videotime: '', // 视频时间
      weixincode: '', // 微信二维码
      attachmentsType: '', // 话题分类
    };
  },
  onLoad() {
    uni.showLoading({
      title: '拼命生成中...',
      mask: true,
    });
    this.$store
      .dispatch(
        'jv/get',
        `threads/${this.themeid}?include=user,firstPost,firstPost.images,category,threadVideo`,
      )
      .then(data => {
        console.log(data);
        this.headerName = data.user.username;
        this.headerImg = data.user.avatarUrl;
        this.postyTepy = data.type;
        this.contentTitle = data.title;
        this.content = data.firstPost.content;
        const arr = Object.values(data.firstPost.images);
        arr.forEach(value => {
          this.contentImg.push(value.url);
        });
        this.attachmentsType = data.category.name;
        if (this.postyTepy === 2) {
          this.video = data.threadVideo.cover_url;
          this.videoduc = data.threadVideo.file_name;
        }
        console.log(this.video, this.videoduc);
        this.initData();
      });
  },
  methods: {
    initData() {
      const obj = {
        username: this.headerName, // 名字
        userheader: this.headerImg, // 头像
        usertitle: this.contentTitle, // 内容标题
        usercontent: this.content, // 内容
        usercontimg: this.contentImg, // 内容图片
        userattname: this.attachmentsName, // 帖子内容名称
        useratttype: this.attachmentsType, // 帖子分类
        userweixincode: this.weixincode, // 微信二维码
        uservideo: this.video,
        uservideoduc: this.videoduc,
      };
      if (this.contentTitle) {
        // 有标题有图片海报
        console.log(this.contentImg.length);
        if (this.contentImg.length === 1) {
          console.log('有单张图片并且有内容');
          this.template = new Cardb().palette(obj);
          // 多图片海报
        } else if (this.contentImg.length > 1) {
          console.log('有标题有内容有多张图片');
          this.template = new Cardf().palette(obj);
          // 只有标题文字的海报
        } else if (this.contentImg.length === 0 && this.content) {
          console.log('有标题 有文字内容');
          this.template = new Carda().palette(obj);
          // 视频贴
        } else if (this.postyTepy === 2) {
          console.log('视频贴');
          this.template = new Cardg().palette(obj);
        }
        // 没有标题的海报
      } else if (!this.contentTitle) {
        // 有一张图片的海报
        if (this.content && this.contentImg.length === 1) {
          console.log('有一张图片的海报');
          this.template = new Cardb().palette(obj);
          // 只有一张图片
        } else if (!this.content && this.contentImg.length === 1) {
          console.log('纯图片海报');
          this.template = new Cardd().palette(obj);
          // 多图片没标题内容海报
        } else if (this.content && this.contentImg.length > 1) {
          this.template = new Cardf().palette(obj);
        } else if (this.postyTepy === 2) {
          console.log('视频贴');
          this.template = new Cardg().palette(obj);
        } else {
          this.template = new Cardh().palette(obj);
        }
      } else {
        console.log('另类海报');
        this.template = new Cardh().palette();
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
