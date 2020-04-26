/**
 * 时间转换为带有上午或下午的时间
 * @param {*} originTime 原始时间
 * @return time
 *
 * example:
 * time2MorningOrAfternoon('2020-04-25T11:54:17+08:00')
 */
export const time2MorningOrAfternoon = originTime => {
  const time = originTime.replace(/T/, ' ').replace(/Z/, '');
  if (time.substring(11, 13) <= 12) {
    return `${time.substring(0, 10)} 上午 ${time.substring(11, 16)}`;
  }
  return `${time.substring(0, 10)} 下午 ${time.substring(11, 16)}`;
};
