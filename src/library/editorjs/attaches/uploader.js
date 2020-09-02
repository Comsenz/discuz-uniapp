import ajax from '@codexteam/ajax';
const { uploadFile } = require('@/mixin/uploadFile').methods;
console.log(uploadFile, 'uploadFile');

/**
 * Module for file uploading.
 */
export default class Uploader {
  /**
   * @param {Object} config
   * @param {function} onUpload - callback for successful file upload
   * @param {function} onError - callback for uploading errors
   */
  constructor({ config, onUpload, onError }) {
    this.config = config;
    this.onUpload = onUpload;
    this.onError = onError;
  }

  /**
   * Handle clicks on the upload file button
   * @fires ajax.transport()
   * @param {function} onPreview - callback fired when preview is ready
   */
  uploadSelectedFile({ onPreview }) {
    console.log(this, 'this');

    ajax
      .selectFiles({
        url: this.config.endpoint,
        accept: this.config.types,
        beforeSend: () => onPreview(),
        fieldName: this.config.field,
        // type: 1
      })
      .then(res => {
        console.log(res[0], 'reds');
        uploadFile(res[0], 0).then(response => {
          const attributes = response.data.attributes;
          this.onUpload({
            body: {
              success: true,
              file: {
                url: attributes.url,
                name: attributes.fileName,
                size: attributes.fileSize,
              },
            },
          });
        });
      })
      .catch(err => {
        const message = err && err.message ? err.message : this.config.errorMessage;
        this.onError(message);
      })
      .finally(() => {});
    // ajax
    //   .transport({
    //     url: this.config.endpoint,
    //     accept: this.config.types,
    //     beforeSend: () => onPreview(),
    //     fieldName: this.config.field,
    //     // type: 1
    //   })
    //   .then(response => {
    //     this.onUpload(response);
    //   })
    //   .catch(error => {
    //     console.log(error, 'errorerrorerrorerror');
    //     const message = error && error.message ? error.message : this.config
    //       .errorMessage;

    //     this.onError(message);
    //   });
  }
}
