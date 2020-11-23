module.exports = {
  methods: {
    detectionModel() {
      const modelmes = uni.getSystemInfoSync().model;
      // const safeBoottom = uni.getSystemInfoSync().safeAreaInsets.bottom;
      // const modelmes = uni.getSystemInfo();
      // console.log(safeBoottom, 'safeBoottomsafeBoottom');
      // console.log(modelmes, 'modelmesmodelmesmodelmes');
      let tempMoble = false;
      if (!modelmes) return tempMoble;
      const bangsList = [
        'iPhone X',
        'iPhone XR',
        'iPhone XS',
        'iPhone 12',
        'iPhone 12Pro',
        'iPhone 11',
        'iPhone 11Pro',
        'iPhone11',
        'iPhone12',
        'iPhoneXR',
        'iPhoneX',
      ];
      const len = bangsList.length;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < len; i++) {
        if (modelmes.indexOf(bangsList[i]) !== -1) {
          tempMoble = true;
          break;
        }
      }
      return tempMoble;
    },
  },
};
