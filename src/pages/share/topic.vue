<template>
  <view class="painter">
    <view class="canvas-box">
      <view class="cent">
        <image :src="imagePath" @tap="previewImage" :show-menu-by-longpress="true"></image>
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
import Carda from '@/wxcomponents/card/cardtposter'; // 标题文字海报
import Cardb from '@/wxcomponents/card/cardaitu'; // 标题单图片文字海报
import Cardd from '@/wxcomponents/card/cardimg'; // 纯图片海报
import Cardf from '@/wxcomponents/card/cardpicture'; // 标题多图片海报
import Cardg from '@/wxcomponents/card/cardvideo'; // 视频海报
import Cardh from '@/wxcomponents/card/card'; // 文字海报

export default {
  data() {
    return {
      imagePath: '',
      width: 700,
      template: {},
      userid: 2,
      themeid: '', // 数据id
      headerImg: '', // 头像
      headerName: '', // 名字
      postyTepy: '', // 帖子类型
      subHeading: '', // 小标题
      contentTitle: '', // 内容标题
      content: '', // 内容
      contentImg: [], // 内容照片
      video: '', // 视频帖子
      videoduc: '', // 视频文件名
      videotime: '', // 视频时间
      weixincode: 'https://dq.comsenz-service.com/api/oauth/wechat/miniprogram/code', // 微信二维码
      attachmentsType: '', // 话题分类
      themwidth: '',
      reconame: '',
      recoimg: '',
      generating: '拼命生成中...',
      title: '提示',
      buildfailed: '生成海报失败',
      successfully: '图片保存成功',
      savefailed: '图片保存失败',
    };
  },
  onLoad(arr) {
    uni.showLoading({
      title: this.generating,
      mask: true,
    });
    this.themeid = arr.id || 2;
    this.$nextTick(() => {
      this.userid = this.usersid;
      this.getusertitle();
      this.getthemdata();
    });
  },
  computed: {
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
  },
  methods: {
    // 获取推荐用户信息
    getusertitle() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: 'groups',
      };
      this.$store.dispatch('jv/get', params).then(data => {
        this.reconame = data.username;
        this.themwidth = this.reconame.length * 28 + 3;
        this.recoimg = data.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif';
      });
    },
    // 获取帖子内容信息
    getthemdata() {
      this.$store
        .dispatch(
          'jv/get',
          `threads/${this.themeid}?include=user,firstPost,firstPost.images,category,threadVideo`,
        )
        .then(data => {
          this.headerName = data.user.username;
          this.headerImg = data.user.avatarUrl || 'https://discuz.chat/static/images/noavatar.gif';
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
          this.initData();
        });
    },
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
        namewidth: this.themwidth,
        reconame: this.reconame,
        recoimg: this.recoimg,
      };
      if (this.contentTitle) {
        // 有标题有图片海报
        if (this.contentImg.length === 1) {
          this.template = new Cardb().palette(obj);
          // 多图片海报
        } else if (this.contentImg.length > 1) {
          this.template = new Cardf().palette(obj);
          // 只有标题文字的海报
        } else if (this.contentImg.length === 0 && this.content) {
          this.template = new Carda().palette(obj);
          // 视频贴
        } else if (this.postyTepy === 2) {
          this.template = new Cardg().palette(obj);
        }
        // 没有标题的海报
      } else if (!this.contentTitle) {
        // 有一张图片的海报
        if (this.content && this.contentImg.length === 1) {
          this.template = new Cardb().palette(obj);
          // 只有一张图片
        } else if (!this.content && this.contentImg.length === 1) {
          this.template = new Cardd().palette(obj);
          // 多图片没标题内容海报
        } else if (this.content && this.contentImg.length > 1) {
          this.template = new Cardf().palette(obj);
        } else if (this.postyTepy === 2) {
          this.template = new Cardg().palette(obj);
        } else {
          this.template = new Cardh().palette(obj);
        }
      } else {
        this.template = new Cardh().palette();
      }
    },
    onImgOK(e) {
      this.imagePath = e.detail.path;
      uni.hideLoading();
    },
    imgErr() {
      uni.hideLoading();
      uni.showModal({
        title: this.title,
        content: this.buildfailed,
        showCancel: false,
      });
    },
    fun() {
      const imgSrc = this.imagePath;
      const _this = this;
      uni.saveImageToPhotosAlbum({
        filePath: imgSrc,
        success(data) {
          if (data) {
            uni.showToast({
              icon: 'none',
              title: _this.successfully,
              duration: 2000,
            });
          }
        },
        fail(err) {
          if (err) {
            uni.showToast({
              icon: 'none',
              title: _this.savefailed,
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
  background: --color(--qui-FC-FFF);
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
