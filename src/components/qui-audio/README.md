# qui-audio 音频

## 使用

在 `template` 中使用组件

```html
<qui-audio></qui-audio>
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| name | 标题 | string | '' |
| src | 音频地址 | string| ''|
| poster | 封面图 | string| ''|
| autoplay | 是否自动开始播放 | Boolean| false|
| obeyMuteSwitch | 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音 | Boolean| true|