# Uploader 上传功能（图片/视频）

## 使用

在 `template` 中使用 Uploader

**基础功能**

```html
<qui-upload-video
  ref="uploadVideo"
  :url="url"
  :video-before-list="videoBeforeList"
  :controls="controlsStatus"
  :choose-type="chooseType"
  @videoDel="videoDel"
></qui-upload-video>
```

**异步删除**

##### 说明

需要调用接口删除图片情况下使用。使用的时候开启`async-clear="true"`功能。
在子组件上绑定`ref`，然后在绑定`clear`的方法内，使用`this.$refs.upload.clear(del)`触发组件内的`clear`方法。

```html
<qui-upload-video
  ref="uploadVideo"
  :url="url"
  :video-before-list="videoBeforeList"
  :controls="controlsStatus"
  :choose-type="chooseType"
  @videoDel="videoDel"
></qui-upload-video>

methods: { uploadClear(list, del) { this.$refs.upload.clear(del); }, }
```

**使用图标唤醒上传**

##### 说明

不使用组内的`add`按钮，使用组件外部按钮，唤醒上传功能。
触发组件`uploadClick`事件。

```html
methods: { childClick() { // 图标式唤起上传 this.$refs.upload.uploadClick(); }, }
```

### Props 属性说明

| 参数            | 说明                 | 类型    | 默认值 |
| --------------- | -------------------- | ------- | ------ |
| url             | 上传地址             | String  | -      |
| videoBeforeList | 上传数组(video)      | Array   | video  |
| controls        | 是否显示默认播放控件 | Boolean | -      |
| chooseType      | 类型                 | Number  | -      |

### Event 事件说明

### Event 内部事件

| 事件名      | 说明     | 参数           |
| ----------- | -------- | -------------- |
| videoDel    | 删除视频 |                |
| uploadVideo | 上传功能 | 图标式唤起上传 |
