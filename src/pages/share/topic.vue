<template>
  <qui-page>
    <view class="painter">
      <view class="canvas-box" :style="{ paddingTop: paddingtop + 'rpx' }">
        <view class="cent" :style="{ height: constyle + 'rpx' }">
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
            width-pixels="2080"
          />
        </view>
      </view>
      <view class="btn-box">
        <qui-button type="primary" size="large" @click="fun">
          {{ i18n.t('share.savealbum') }}
        </qui-button>
      </view>
    </view>
  </qui-page>
</template>

<script>
// import Carda from '@/wxcomponents/card/cardtposter'; // 标题文字海报 41
import Cardk from '@/wxcomponents/card/cardtpostertwo'; // 标题文字海报 41
import Cardb from '@/wxcomponents/card/cardaitu'; // 标题单图片文字海报 43
import Cardd from '@/wxcomponents/card/cardimg'; // 纯图片海报  164
import Cardf from '@/wxcomponents/card/cardpicture'; // 标题多图片海报 41
import Cardg from '@/wxcomponents/card/cardvideo'; // 视频海报 43
import Cardh from '@/wxcomponents/card/card'; // 文字海报  46
// import Cardi from '@/wxcomponents/card/cardtext';
import forums from '@/mixin/forums';
import { AVATAR_ADDRESS, CODE_ADDRESS } from '@/common/const';

export default {
  mixins: [forums],
  data() {
    return {
      imagePath: '',
      width: 700,
      template: {},
      userid: '',
      slitename: '', // 站点名称
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
      attachmentsType: '', // 话题分类
      themwidth: 180,
      renamewidth: 400,
      reconame: '',
      recoimg: '',
      constyle: 0,
      paddingtop: 43,
      imgtop: 0,
      jurisdiction: true,
      that: '',
    };
  },
  onLoad(arr) {
    uni.showLoading({
      title: this.i18n.t('share.generating'),
      mask: true,
    });
    this.themeid = arr.id;
    this.userid = this.usersid;
    this.slitename = this.forums.set_site.site_name;
    console.log(this.userid, this.slitename);
    this.getusertitle();
    this.getthemdata();
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
        console.log(data);
        this.reconame = data.username;
        this.themwidth = this.reconame.length * 28 + 3;
        if (this.themwidth >= 240) {
          this.themwidth = 240;
        }
        this.renamewidth = 160 + this.themwidth;
        this.recoimg = data.avatarUrl || AVATAR_ADDRESS;
        console.log(this.recoimg);
      });
    },
    // 获取帖子内容信息
    getthemdata() {
      this.$store
        .dispatch(
          'jv/get',
          `threads/${this.themeid}?include=user,firstPost,firstPost.images,category,threadVideo,category`,
        )
        .then(data => {
          console.log(data);
          this.headerName = data.user.username;
          this.headerImg = data.user.avatarUrl || AVATAR_ADDRESS;
          this.postyTepy = data.type;
          this.contentTitle = data.title;
          this.content = data.firstPost.content;
          const arr = Object.values(data.firstPost.images);
          arr.forEach(value => {
            this.contentImg.push(value.thumbUrl);
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
      if (!this.contentTitle) {
        this.imgtop = 80;
      }
      const obj = {
        username: this.headerName, // 名字
        userheader: this.headerImg, // 头像
        usertitle: this.contentTitle, // 内容标题
        usercontent: this.content, // 内容
        usercontimg: this.contentImg, // 内容图片
        userattname: this.attachmentsName, // 帖子内容名称
        useratttype: this.attachmentsType, // 帖子分类
        userweixincode: CODE_ADDRESS, // 微信二维码
        slitename: this.slitename, // 站点名称
        uservideo: this.video,
        uservideoduc: this.videoduc,
        namewidth: this.themwidth,
        renamewidth: this.renamewidth,
        reconame: this.reconame,
        recoimg: this.recoimg,
        imgtop: this.imgtop,
        longpressrecog: this.i18n.t('share.longpressrecog'), // 长按识别
        recomment: this.i18n.t('share.recomment'),
        goddessvideo: this.attachmentsType,
        comefrom: this.i18n.t('share.comefrom'), // 来自
        stay: this.i18n.t('share.stay'), // 在
        published: this.i18n.t('share.published'),
        contents: this.i18n.t('share.contents'),
      };
      if (this.contentTitle) {
        // 有标题有图片海报
        if (this.contentImg.length === 1) {
          this.constyle = 1100;
          this.paddingtop = 43;
          this.template = new Cardb().palette(obj);
          // 多图片海报
        } else if (this.contentImg.length > 1) {
          this.constyle = 1084;
          this.paddingtop = 41;
          this.template = new Cardf().palette(obj);
          // 只有标题文字的海报
        } else if (this.contentImg.length === 0 && this.content) {
          this.constyle = 1083;
          this.paddingtop = 41;
          this.template = new Cardk().palette(obj);
          // 视频贴
        } else if (this.postyTepy === 2) {
          this.constyle = 1100;
          this.paddingtop = 43;
          this.template = new Cardg().palette(obj);
        }
        // 没有标题的海报
      } else if (!this.contentTitle) {
        if (this.content && this.contentImg.length === 1) {
          this.constyle = 1100;
          this.paddingtop = 43;
          this.template = new Cardb().palette(obj);
          // 只有一张图片
        } else if (!this.content && this.contentImg.length === 1) {
          this.constyle = 908;
          this.paddingtop = 164;
          this.template = new Cardd().palette(obj);
          // 多图片没标题内容海报
        } else if (this.content && this.contentImg.length > 1) {
          this.constyle = 1100;
          this.paddingtop = 41;
          this.template = new Cardf().palette(obj);
        } else if (this.postyTepy === 2) {
          this.constyle = 1100;
          this.paddingtop = 43;
          this.template = new Cardg().palette(obj);
        } else {
          this.constyle = 1082;
          this.paddingtop = 46;
          // this.template = new Cardh().palette(obj);
          this.template = new Cardh().palette(obj);
        }
      } else {
        this.constyle = 1082;
        this.paddingtop = 46;
        // this.template = new Cardh().palette();
        this.template = new Cardh().palette(obj);
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
      uni.getSetting({
        success(res) {
          console.log(res.authSetting['scope.writePhotosAlbum']);
          if (!res.authSetting['scope.writePhotosAlbum']) {
            _this.jurisdiction = false;
          } else {
            _this.jurisdiction = res.authSetting['scope.writePhotosAlbum'];
          }
          console.log(_this.jurisdiction);
        },
      });
      if (!this.jurisdiction) {
        uni.openSetting({
          success(res) {
            _this.jurisdiction = res.authSetting['scope.writePhotosAlbum'];
          },
        });
      }
      uni.showModal({
        title: _this.i18n.t('discuzq.msgbox.title'),
        content: _this.i18n.t('share.confirm'),
        success(res) {
          if (res.confirm) {
            uni.saveImageToPhotosAlbum({
              filePath: _this.imagePath,
              success() {
                uni.showToast({
                  title: _this.i18n.t('share.successfully'),
                  icon: 'none',
                  duration: 2000,
                });
              },
              fail(err) {
                if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                  _this.jurisdiction = false;
                }
                uni.showToast({
                  title: _this.i18n.t('share.savefailed'),
                  icon: 'none',
                  duration: 2000,
                });
              },
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
@import '@/styles/base/theme/fn.scss';
.painter {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
  background-color: --color(--qui-BG-2);
}
.canvas-box {
  width: 100%;
  height: 100%;
  margin-bottom: 155rpx;
}
.cent {
  width: 700rpx;
  margin: 0 auto;
  background: --color(--qui-FC-FFF);
  border-radius: 7rpx;
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
