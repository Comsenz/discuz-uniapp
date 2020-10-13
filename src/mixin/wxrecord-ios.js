const wx = require('jweixin-module');

module.exports = {
  data() {
    return {
      localId: '',
    };
  },
  methods: {
    wxRecord() {
      // 这里使用 urlencode 编码下
      const url = this.getUrl();
      const forums = this.$store.getters['jv/get']('forums/1');
      if (forums.passport && !forums.passport.offiaccount_close) {
        return;
      }
      this.$store
        .dispatch('jv/get', [`offiaccount/jssdk?url=${encodeURIComponent(url)}`, {}])
        .then(data => {
          console.log('参数：', data);
          const { appId, nonceStr, signature, timestamp } = data;
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId, // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature, // 必填，签名，见附录1
            jsApiList: ['startRecord', 'stopRecord', 'uploadVoice'],
          });
          wx.ready(() => {
            wx.checkJsApi({
              jsApiList: ['startRecord'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
              success: () => {},
            });
            wx.startRecord({
              success: () => {
                wx.onVoiceRecordEnd({
                  // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                  complete: () => {
                    console.log('最多只能录制一分钟');
                  },
                });
              },
              cancel: () => {
                console.log('用户拒绝授权录音');
                return false;
              },
            });
          });
        });
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
