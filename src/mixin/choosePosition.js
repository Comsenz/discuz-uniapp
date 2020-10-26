import forums from '@/mixin/forums';

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
