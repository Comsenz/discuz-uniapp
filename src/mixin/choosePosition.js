import forums from '@/mixin/forums';

const wx = require('jweixin-module');

module.exports = {
  mixins: [forums],
  methods: {
    getPosition() {
      const key = this.forums.lbs.qq_lbs_key;
      const geolocation = new qq.maps.Geolocation(key, 'myapp');
      geolocation.getLocation(this.showPosition, this.errorPosition, { timeout: 6000 });
    },
    showPosition(value) {
      const key = this.forums.lbs.qq_lbs_key;
      const coord = `${value.lat},${value.lng}`;
      let { href } = window.location;
      // 过滤掉上次选择后返回的参数
      const index = href.indexOf('&name');
      if (index !== -1) {
        href = href.substr(0, index);
      }
      const currentHref = encodeURIComponent(href);
      window.location.href = `https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=${currentHref}&key=${key}&referer=myapp&coord=${coord}`;
    },
    errorPosition() {
      this.getPosition();
    },
    getPositionWx() {
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
                const coord = `${latitude},${longitude}`;
                const key = that.forums.lbs.qq_lbs_key;
                let { href } = window.location;
                // 过滤掉上次选择后返回的参数
                const index = href.indexOf('&name');
                if (index !== -1) {
                  href = href.substr(0, index);
                }
                const currentHref = encodeURIComponent(href);
                window.location.href = `https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=${currentHref}&key=${key}&referer=myapp&coord=${coord}`;
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
