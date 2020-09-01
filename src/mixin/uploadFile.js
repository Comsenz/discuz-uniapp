module.exports = {
  /**
   * @description 上传图片/附件接口请求
   * @param {Number} type  type:1 上传图片/type:2 上传附件
   */
  methods: {
    uploadFile(file, type) {
      return new Promise(resolve => {
        const fData = new FormData();
        fData.append('file', file);
        fData.append('type', type);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://editor.discuzq.com/api/attachments', true);
        xhr.setRequestHeader(
          'authorization',
          `Bearer ${window.localStorage.getItem('access_token')}`,
        );
        xhr.onload = res => {
          const { status } = res.target;
          const data = JSON.parse(res.target.response);
          if (status >= 200 && status < 300) {
            resolve(data);
          } else {
            // this.$refs.toast.show({ message: data.errors[0].detail[0] });
          }
        };
        xhr.timeout = 30000; // 超时时间，单位是毫秒
        xhr.onerror = res => {
          console.log(res);
          // this.$refs.toast.show({ message: res });
        };
        xhr.send(fData);
      });
    },
  },
};
