const wx = require('jweixin-module');

module.exports = {
  methods: {
    /**
     * @description 微信分享
     * @param {title: string, desc: string, logo: string} shareData
     */
    wxShare(shareData) {
      // 这里使用 urlencode 编码下
      const url = this.getUrl();
      console.log(encodeURIComponent(url), 'url');
      this.$store
        .dispatch('jv/get', [`offiaccount/jssdk?url=${encodeURIComponent(url)}`, {}])
        .then(data => {
          console.log(data, 'data分享');
          const { appId, nonceStr, signature, timestamp } = data;
          console.log(appId, nonceStr, signature, timestamp, '数据');
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId, // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature, // 必填，签名，见附录1
            jsApiList: [
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'hideMenuItems',
              'showMenuItems',
            ],
          });
          wx.ready(() => {
            // 需在用户可能点击分享按钮前就先调用
            const dataInfo = {
              title: shareData.title || 'Discuz!Q', // 分享标题
              desc: shareData.desc || '', // 分享描述
              link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: shareData.logo || '/static/admin-logo-x2.png', // 分享图标
            };
            wx.updateAppMessageShareData(dataInfo); // 分享给朋友
            wx.updateTimelineShareData(dataInfo); // 分享到朋友圈
          });
        });
    },
    /**
     * @description h5分享复制链接
     * @param {string} title 主题title
     */
    h5Share(title) {
      let themeTitle = title || 'Discuz!Q';
      const url = this.getUrl();
      const oInput = document.createElement('input');
      const reTag = /<img(?:.|\s)*?>/g;
      const reTag2 = /(<\/?br.*?>)/gi;
      const reTag3 = /(<\/?p.*?>)/gi;
      themeTitle = themeTitle.replace(reTag, '');
      themeTitle = themeTitle.replace(reTag2, '');
      themeTitle = themeTitle.replace(reTag3, '');
      themeTitle = themeTitle.replace(/\s+/g, '');
      themeTitle = `${themeTitle.substring(0, 17)}...`;
      oInput.value = `${themeTitle}  ${url}`;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      oInput.readOnly = true;
      oInput.id = 'copyInp';
      document.execCommand('Copy');
      oInput.setAttribute('onfocus', this.copyFocus(oInput));
      // 执行浏览器复制命令
      oInput.className = 'oInput';
      oInput.style.display = 'none';

      // this.$toast.success('分享链接已复成功');

      document.body.removeChild(oInput);
    },
    copyFocus(obj) {
      obj.blur();
      document.body.removeChild(obj);
    },
    getUrl() {
      const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      let url = window.location.href.split('#')[0];
      if (isiOS && window.entryUrl && !/wechatdevtools/.test(navigator.userAgent)) {
        // iOS下，URL必须设置为整个SPA的入口URL
        url = window.entryUrl;
      }
      return url;
    },
  },
};
