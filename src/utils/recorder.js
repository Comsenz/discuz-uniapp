/* eslint-disable no-param-reassign */
export default class Recorder {
  constructor(stream, config) {
    // 兼容
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    config = config || {};
    config.sampleBits = config.sampleBits || 16; // 采样数位 8, 16
    config.sampleRate = config.sampleRate || 8000; // 采样率(1/6 44100)

    this.context = new (window.webkitAudioContext || window.AudioContext)();
    this.audioInput = this.context.createMediaStreamSource(stream);
    this.createScript = this.context.createScriptProcessor || this.context.createJavaScriptNode;
    this.recorder = this.createScript.apply(this.context, [4096, 1, 1]);

    this.audioData = {
      size: 0, // 录音文件长度
      buffer: [], // 录音缓存
      inputSampleRate: this.context.sampleRate, // 输入采样率
      inputSampleBits: 16, // 输入采样数位 8, 16
      outputSampleRate: config.sampleRate, // 输出采样率
      oututSampleBits: config.sampleBits, // 输出采样数位 8, 16
      input(data) {
        this.buffer.push(new Float32Array(data));
        this.size += data.length;
      },
      compress() {
        // 合并压缩
        // 合并
        const data = new Float32Array(this.size);
        let offset = 0;
        for (let i = 0; i < this.buffer.length; i += 1) {
          data.set(this.buffer[i], offset);
          offset += this.buffer[i].length;
        }
        // 压缩
        const compression = parseInt(this.inputSampleRate / this.outputSampleRate, 10);
        const length = data.length / compression;
        const result = new Float32Array(length);
        let index = 0;
        let j = 0;
        while (index < length) {
          result[index] = data[j];
          j += compression;
          index += 1;
        }
        return result;
      },
      encodeWAV() {
        const sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
        const sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
        const bytes = this.compress();
        const dataLength = bytes.length * (sampleBits / 8);
        const buffer = new ArrayBuffer(44 + dataLength);
        const data = new DataView(buffer);

        const channelCount = 1; // 单声道
        let offset = 0;

        const writeString = str => {
          for (let i = 0; i < str.length; i += 1) {
            data.setUint8(offset + i, str.charCodeAt(i));
          }
        };

        // 资源交换文件标识符
        writeString('RIFF');
        offset += 4;
        // 下个地址开始到文件尾总字节数,即文件大小-8
        data.setUint32(offset, 36 + dataLength, true);
        offset += 4;
        // WAV文件标志
        writeString('WAVE');
        offset += 4;
        // 波形格式标志
        writeString('fmt ');
        offset += 4;
        // 过滤字节,一般为 0x10 = 16
        data.setUint32(offset, 16, true);
        offset += 4;
        // 格式类别 (PCM形式采样数据)
        data.setUint16(offset, 1, true);
        offset += 2;
        // 通道数
        data.setUint16(offset, channelCount, true);
        offset += 2;
        // 采样率,每秒样本数,表示每个通道的播放速度
        data.setUint32(offset, sampleRate, true);
        offset += 4;
        // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
        data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
        offset += 4;
        // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
        data.setUint16(offset, channelCount * (sampleBits / 8), true);
        offset += 2;
        // 每样本数据位数
        data.setUint16(offset, sampleBits, true);
        offset += 2;
        // 数据标识符
        writeString('data');
        offset += 4;
        // 采样数据总数,即数据总大小-44
        data.setUint32(offset, dataLength, true);
        offset += 4;
        // 写入采样数据
        if (sampleBits === 8) {
          for (let i = 0; i < bytes.length; i += 1, offset += 1) {
            const s = Math.max(-1, Math.min(1, bytes[i]));
            let val = s < 0 ? s * 0x8000 : s * 0x7fff;
            val = parseInt(255 / (65535 / (val + 32768)), 10);
            data.setInt8(offset, val, true);
          }
        } else {
          for (let i = 0; i < bytes.length; i += 1, offset += 2) {
            const s = Math.max(-1, Math.min(1, bytes[i]));
            data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
          }
        }
        return new Blob([data], { type: 'audio/wav' });
      },
    };
  }

  // 开始录音
  start() {
    this.audioInput.connect(this.recorder);
    this.recorder.connect(this.context.destination);

    // 音频采集
    const self = this;
    this.recorder.onaudioprocess = e => {
      self.audioData.input(e.inputBuffer.getChannelData(0));
    };
  }

  // 停止
  stop() {
    this.recorder.disconnect();
  }

  // 获取音频文件
  getBlob() {
    this.stop();
    return this.audioData.encodeWAV();
  }

  // 回放
  play(audio) {
    audio.src = window.URL.createObjectURL(this.getBlob());
  }

  // 清理缓存的录音数据
  clear() {
    this.audioData.buffer = [];
    this.audioData.size = 0;
  }

  static throwError(message) {
    console.log(`Error:${message}`);
    throw new (() => {
      this.toString = () => {
        return message;
      };
    })();
  }

  static canRecording() {
    return navigator.getUserMedia != null;
  }

  static get(callback, config) {
    if (callback) {
      if (Recorder.canRecording()) {
        navigator.getUserMedia(
          { audio: true }, // 只启用音频
          stream => {
            const rec = new Recorder(stream, config);
            callback(rec);
          },
          error => {
            switch (error.code || error.name) {
              case 'PERMISSION_DENIED':
              case 'PermissionDeniedError':
                Recorder.throwError('用户拒绝提供信息。');
                break;
              case 'NOT_SUPPORTED_ERROR':
              case 'NotSupportedError':
                Recorder.throwError('浏览器不支持硬件设备。');
                break;
              case 'MANDATORY_UNSATISFIED_ERROR':
              case 'MandatoryUnsatisfiedError':
                Recorder.throwError('无法发现指定的硬件设备。');
                break;
              default:
                Recorder.throwError(`无法打开麦克风。异常信息:${error.code || error.name}`);
                break;
            }
          },
        );
      } else {
        Recorder.throwError('当前浏览器不支持录音功能。');
      }
    }
  }
}
