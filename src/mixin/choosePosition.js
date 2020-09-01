import forums from '@/mixin/forums';

const wx = require('jweixin-module');

module.exports = {
  mixins: [forums],
  methods: {
    getPosition() {
      const url = this.getUrl();
      const that = this;
      this.$store
        .dispatch('jv/get', [`offiaccount/jssdk?url=${encodeURIComponent(url)}`, {}])
        .then(data => {
          const { appId, nonceStr, signature, timestamp } = data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId, // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature, // 必填，签名，见附录1
            jsApiList: ['getLocation'],
          });
          wx.ready(() => {
            wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success(res) {
                const { latitude } = res; // 纬度，浮点数，范围为90 ~ -90
                const { longitude } = res; // 经度，浮点数，范围为180 ~ -180。
                that.choosePosition(`${latitude},${longitude}`);
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
    choosePosition(data) {
      const currentHref = window.location.href;
      window.location.href = `https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=${currentHref}&key=${this.forums.lbs.qq_lbs_key}&referer=myapp&coord=${data}`;
    },
  },
};
