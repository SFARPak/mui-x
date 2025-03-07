/* eslint-disable class-methods-use-this */
import { DateTime } from 'luxon';
import BaseAdapterLuxon from '@date-io/luxon';
import { FieldFormatTokenMap, MuiPickersAdapter } from '../models';

const formatTokenMap: FieldFormatTokenMap = {
  // Year
  y: 'year',
  yy: 'year',
  yyyy: 'year',

  // Month
  L: 'month',
  LL: 'month',
  LLL: { sectionType: 'month', contentType: 'letter' },
  LLLL: { sectionType: 'month', contentType: 'letter' },
  M: 'month',
  MM: 'month',
  MMM: { sectionType: 'month', contentType: 'letter' },
  MMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  d: 'day',
  dd: 'day',

  // Day of the week
  c: 'weekDay',
  ccc: { sectionType: 'weekDay', contentType: 'letter' },
  cccc: { sectionType: 'weekDay', contentType: 'letter' },
  ccccc: { sectionType: 'weekDay', contentType: 'letter' },
  E: 'weekDay',
  EEE: { sectionType: 'weekDay', contentType: 'letter' },
  EEEE: { sectionType: 'weekDay', contentType: 'letter' },
  EEEEE: { sectionType: 'weekDay', contentType: 'letter' },

  // Meridiem
  a: 'meridiem',

  // Hours
  H: 'hours',
  HH: 'hours',
  h: 'hours',
  hh: 'hours',

  // Minutes
  m: 'minutes',
  mm: 'minutes',

  // Seconds
  s: 'seconds',
  ss: 'seconds',
};

export class AdapterLuxon extends BaseAdapterLuxon implements MuiPickersAdapter<DateTime> {
  public isMUIAdapter = true;

  public formatTokenMap = formatTokenMap;

  public escapedCharacters = { start: "'", end: "'" };

  public expandFormat = (format: string) => {
    if (!DateTime.expandFormat) {
      throw Error(
        'Your luxon version does not support `expandFormat`. Consider upgrading it to v3.0.2',
      );
    }
    // Extract escaped section to avoid extending them
    const longFormatRegexp = /''|'(''|[^'])+('|$)|[^']*/g;
    return (
      format
        .match(longFormatRegexp)!
        .map((token: string) => {
          const firstCharacter = token[0];
          if (firstCharacter === "'") {
            return token;
          }
          return DateTime.expandFormat(token, { locale: this.locale });
        })
        .join('')
        // The returned format can contain `yyyyy` which means year between 4 and 6 digits.
        // This value is supported by luxon parser but not luxon formatter.
        // To avoid conflicts, we replace it by 4 digits which is enough for most use-cases.
        .replace('yyyyy', 'yyyy')
    );
  };

  // Redefined here just to show how it can be written using expandFormat
  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format).replace(/(a)/g, '(a|p)m').toLocaleLowerCase();
  };

  public getWeekNumber = (date: DateTime) => {
    return date.weekNumber;
  };
}
