/* eslint-disable */
import { http } from '@/api/api-request';

export default class Upload {
  constructor() {
    this.postComponent = null;
  }
  upload(params) {
    const { type } = params;
    return this.uploadType[type];
  }
  uploadImage() {
    const _that = this;
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        success(res) {
          if (res.errMsg !== 'chooseImage:ok') return;
          res.tempFilePaths.forEach((tmpFile, index) => {
            let order = index;
            http
              .upload('attachments', {
                formData: {
                  type: 1,
                  order: order++,
                },
                filePath: tmpFile,
              })
              .then(data => {
                if(data.statusCode === 201) {
                  _that._insertImage({ name: res.tempFiles[index].name, path: tmpFile, id: data.data.data.id });
                  return resolve(data, res, index);
                }
                return reject(data.data);
              })
              .catch(err => {
                return reject(err);
              });
          });
        },
      });
    });
  }

  uploadAttach(event) {
    const _that = this;
    const files = event.target.files;
    return new Promise((resolve, reject) => {
      files.forEach((tmpFile, index) => {
        http
          .upload('attachments', {
            formData: {
              type: 0,
            },
            file: tmpFile,
          })
          .then(data => {
            if(data.statusCode === 201) {
              _that._insertAttach({ attributes: {
                fileName: data.data.data.attributes.fileName,
                url: data.data.data.attributes.url,
              }, id: data.data.data.id });
              return resolve(data, files, index);
            }
            return reject(data.data);
          })
          .catch(err => {
            return reject(err);
          });
      });
    });
  }

  _insertImage(item) {
    document.execCommand(
      'insertHTML',
      false,
      `<img alt="${item.name}" src="${item.path}" title="${item.id}"></img>`,
    );
  }

  _insertAttach(item) {
    this.postComponent.uploadFile.push(item);
    document.execCommand(
      'insertHTML',
      false,
      `<a href="${item.attributes.url}" title="${item.id}">${item.attributes.fileName}</a>`,
    );
  }
}
