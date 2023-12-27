import * as moment from 'moment-timezone';


export default class DateUtils {
  // ex) 2023-05-17 15:40:08
  static momentNow(): string {
    return moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  }

  // ex) 2023-05-17T15:40:08.000Z
  static momentNowDate(): Date {
    return new Date(DateUtils.momentNow());
  }

  // ex) 2023-05-17 18:00
  static momentNowSubtractTime(): string {
    return moment().tz('Asia/Seoul').format('YYYY-MM-DD');
  }

  // ex) 20230517165408
  static momentFile(): string {
    return moment().tz('Asia/Seoul').format('YYYYMMDDHHmmss');
  }

  // ex) 20230517165408
  static momentBlockchain(): number {
    return parseInt(moment().tz('Asia/Seoul').format('YYYYMMDDHHmmss'));
  }

  static momentBlockchainD9(): number {
    const nineDaysAgo = moment().tz('Asia/Seoul').subtract(9, 'days');
  const formattedValue = parseInt(nineDaysAgo.format('YYYYMMDD'));
  return formattedValue;
  }

  // 0:일 1:월 ... 6:토
  static momentDay(): number {
    return moment().tz('Asia/Seoul').day();
  }

  // ex) 18:00
  static momentTime(): string {
    return moment().tz('Asia/Seoul').format('HH:mm');
  }

  // 문자 -> 날짜 ex) 2023-05-17T07:54:08.000Z
  static stringToDate(date: string): Date {
    return moment(date).tz('Asia/Seoul').toDate();
  }
}