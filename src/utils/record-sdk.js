import Recorder from '@/utils/recorder';

export default class Record {
  startRecord(param) {
    const self = this;
    try {
      Recorder.get(rec => {
        // console.log('init recorder component now.');
        self.recorder = rec;
        self.recorder.start();
        param.success('record successfully!');
      });
    } catch (e) {
      param.error(`record failed!${e}`);
    }
  }

  stopRecord(param) {
    const self = this;
    try {
      const blobData = self.recorder.getBlob();
      param.success(blobData);
    } catch (e) {
      param.error(`record stop failed!${e}`);
    }
  }

  play(audio) {
    const self = this;
    try {
      self.recorder.play(audio);
    } catch (e) {
      console.log(`play record failed!${e}`);
    }
  }
}
