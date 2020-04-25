/**
 * 计算指定时间到当前时间的时间间隔
 * @param {*} time 指定时间
 * @return 时间间隔(分钟)
 *
 * example:
 * time2MinuteBefore('2020-04-25T13:42:00.000Z')
 */
export const time2MinuteBefore = time => {
  const now = new Date();
  const pass = new Date(time);
  const result = now - pass;
  return parseInt(parseInt(result / 1000, 0) / 60, 0);
};
