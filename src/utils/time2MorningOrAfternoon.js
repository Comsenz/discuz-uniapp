/**
 * 时间转换为带有上午或下午的时间
 * @param {*} originTime 原始时间
 * @return 年月日 上午/下午 时分
 *
 * example:
 * time2MorningOrAfternoon('2020-04-25T11:54:17+08:00')
 */
export const time2MorningOrAfternoon = originTime => {
  const time = originTime.replace(/T/, ' ').replace(/Z/, '');
  // 0-12为上午，12-24为下午
  if (parseInt(time.substring(11, 13), 0) < 12) {
    return `${time.substring(0, 10)} 上午 ${time.substring(11, 16)}`;
  }
  return `${time.substring(0, 10)} 下午 ${time.substring(11, 16)}`;
};
