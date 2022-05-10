// @flow
import React from 'react';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { DateFormats } from 'UI/constants/defaults';
import GenericContents from 'UI/constants/strings';

const language = localStorage.getItem('language');

/**
 * Fuse two or more style objects into one.
 * @param {Array} stylesArray array of objects with inline style key values.
 * @return {Object} an object containing all the style key values.
 */

export const removePercentageFromStringNumber = (number: string) => {
  return number.includes('%') ? number.replace('%', '') : number;
};

export const fuseStyles = (styleObjectsArray: Array<Object>) => {
  let newStyle = {};
  styleObjectsArray.forEach(style => {
    newStyle = {
      ...newStyle,
      ...style
    };
  });
  return newStyle;
};

/**
 * It calculates the decimal value between 0 and 255 departing from a string of chars (initials).
 * @param {string} initialsString is the string of initials.
 * @return {string} a string with HEX color format ready for styles.
 */

export const calculateRgbColorFromInitials = (initialsString: string) => {
  const charArrayOfInitials = initialsString.split('');
  const ColorArray = [255, 255, 255];
  let hash = 0;

  charArrayOfInitials.forEach((initial, i) => {
    ColorArray[i] = initialsString.charCodeAt(i).toString(8);
    // eslint-disable-next-line no-bitwise
    hash = initialsString.charCodeAt(i) + ((hash << 5) - hash);
  });
  // eslint-disable-next-line no-bitwise
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  const color = `#${'00000'.substring(0, 6 - c.length)}${c}`;
  return color;
};

/**
 * It helps avoiding nested ternary expressions.
 * @param {boolean} condition that must be evaluated.
 * @param {any} then if true.
 * @param {any} otherwise if is false.
 * @return {any}
 */

export const nestTernary = (condition: boolean, then: any, otherwise: any) =>
  condition ? then : otherwise;

/**
 * Round to a specified number of decimals
 * @param {number} number number to be rounded.
 * @param {number} n number of decimals.
 */
export const roundDecimals = (number: number, n: number) => {
  const multiplier = 10 ** n;
  return Math.floor(number * multiplier) / multiplier;
};

/**
 * Calculate the relative difference between two numbers
 * @param {number} a first number.
 * @param {number} b second number.
 */
export const relDiff = (a: number, b: number) => {
  return 100 * Math.abs((a - b) / ((a + b) / 2));
};

/**
 * Returns an url starting with https if no protocol was provided in the URL. For instance, www.linkedin.com becomes https://www.linkedin.com
 * @param {number} url first number.
 */
export const normalizeUrl = (url: string): string => {
  if (!url) {
    return '';
  }
  return !url.startsWith('http') ? `https://${url}` : url;
};

export const getFeatureFlags = (): string[] => {
  const featureFlagsSetting = `${(window.PICOLIN_ENV &&
    window.PICOLIN_ENV.FEATURE_FLAGS) ||
    process.env.REACT_APP_FEATURE_FLAGS}`;

  return featureFlagsSetting ? featureFlagsSetting.split('|') : [];
};

export const VALIDATION_REGEXS = {
  // eslint-disable-next-line no-useless-escape
  URL: /^(?:[A-Za-z0-9]+:\/\/)?(?:(?:(?:[A-Za-z0-9])|(?:[A-Za-z0-9](?:[A-Za-z0-9\-]+)?[A-Za-z0-9]))+(\.))+([A-Za-z]{2,})([\/?])?([\/?][A-Za-z0-9\-%._~:\/?#\[\]@!\$&\'\(\)\*\+,;=]+)?$/,
  // eslint-disable-next-line no-useless-escape
  EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,13})+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
};

export const PHONE_VALIDATION = {
  minLength: {
    value: 10,
    message: 'Min length is 10'
  },
  maxLength: {
    value: 10,
    message: 'Max length is 10'
  }
};

export const EXT_PHONE_VALIDATION = {
  maxLength: {
    value: 16,
    message: 'Max length is 16'
  }
};

export const PERCENT_VALIDATION = {
  min: {
    value: 20,
    message: 'Min percent is 20%'
  },
  max: {
    value: 100,
    message: 'Max percent is 100%'
  }
};

export const WARRANTY_VALIDATION = {
  min: {
    value: 30,
    message: 'Min warranty is 30'
  },
  max: {
    value: 365,
    message: 'Max warranty is 365'
  }
};

const nameMaxLength = 128;
export const PRODUCT_DESCRIPTION_VALIDATION = {
  required: 'Este es un campo obligatorio',
  maxLength: {
    value: nameMaxLength,
    message: `La longitud maxima es de ${nameMaxLength} caracteres`
  }
};

export const OBSERVATIONS_VALIDATION = {
  maxLength: {
    value: nameMaxLength,
    message: `La longitud maxima es de ${nameMaxLength} caracteres`
  }
};

export const PRODUCT_SIZE_VALIDATION = {
  required: 'La Talla es requerida',
  min: {
    value: 0,
    message: 'La talla minima permitida es 0'
  },
  max: {
    value: 100,
    message: 'La talla máxima permitida es 100'
  }
};

const titleMaxLength = 512;
export const TITLE_VALIDATION = {
  maxLength: {
    value: titleMaxLength,
    message: `Max length is ${titleMaxLength}`
  }
};

const achievementMaxLength = 1024;
export const ACHIEVEMENT_VALIDATION = {
  maxLength: {
    value: achievementMaxLength,
    message: `Max length is ${achievementMaxLength}`
  }
};

const urlMaxLength = 512;
export const URL_VALIDATION = {
  pattern: {
    value: VALIDATION_REGEXS.URL,
    message: 'The link must be valid'
  },
  maxLength: {
    value: urlMaxLength,
    message: `Max length is ${urlMaxLength}`
  }
};
/**
 * This function receives a string and it normalize it to NFD Unicode normal form decomposes combined graphemes into the combination of simple ones.
 * @param {string} str string to capitalize first letter
 */

export const normalizeStrToNFD = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase();
};

/**
 * Make uppercase the first letter of a string
 * @param {string} str string to capitalize first letter
 */

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Make a filtering function for the Autocomplete component that allow to look up every word into many fields
 * @param {string[]} fieldsToLookupInto array of fields/properties of an object to look up into.
 */
export const makeMultiFieldFiltering = (fieldsToLookupInto: string[]) => (
  options: any[],
  event: any
): any[] => {
  const term = event.inputValue.toLowerCase();
  const words = term.split(' ').filter(word => word);

  return options.filter(
    option =>
      option[fieldsToLookupInto[0]].toLowerCase().startsWith(term) ||
      words.every(word =>
        fieldsToLookupInto.some(field =>
          option[field].toLowerCase().includes(word)
        )
      )
  );
};

/**
 * Extracts the first message of a response with errors (could be an object or array payload)
 * @param {Error} error Error catched in an Exception
 */
export const getErrorData = (error: any) => {
  if (
    error === undefined ||
    !error ||
    !error.request ||
    !error.response ||
    error.request.responseType !== 'json'
  ) {
    return GenericContents[language].error;
  }
  const errorData = {
    severity: error?.response?.status === 500 ? 'error' : 'warning',
    message: error?.response?.data?.length
      ? error.response.data[0].message
      : nestTernary(
          error?.response?.data?.message,
          error?.response?.data?.message,
          GenericContents[language].error.message
        ),
    title: error?.response?.data?.length
      ? error.response.data[0].title
      : nestTernary(
          error?.response?.data?.title,
          error?.response?.data?.title,
          GenericContents[language].error.title
        )
  };
  return (
    errorData ||
    nestTernary(errorData.message, errorData.message, errorData.error?.message)
  );
};

export const phoneFormatter = (value: ?string) => {
  return React.createElement(NumberFormat, {
    displayType: 'text',
    format: '(###)-###-####',
    value: value || ''
  });
};

export const currencyFormatter = (inputNumber: number) =>
  new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
    inputNumber
  );

export const numberFormatter = (inputNumber: number) =>
  new Intl.NumberFormat('en').format(inputNumber);

export const compensationFormatter = (
  min: number,
  mid: number,
  max: number
): string =>
  `${currencyFormatter(max)} - ${currencyFormatter(mid)} - ${currencyFormatter(
    min
  )}`;

export const phoneNumberFormatter = (phoneNumber: ?string): string => {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/^(\d{3})(\d{3})(\d{1})/, '($1)-$2-$3');
};

export const industrySpecialtyOptionLabel = (item: any) =>
  `${item.industry_title || item.industry?.title || ''}: ${item.title}`;

export const titleOptionLabel = (item: any) => item.title;

export const idOptionSelected = (option: any, value: any) =>
  option.id === value.id;

/**
 * Builds a formatted string that represents a period, considering if the period crosses a month or year change, i.e.:
 * 01/Aug/2020 - 03/Aug/2020 => Aug 01 - 03, 2020
 * 31/Jul/2020 - 02/Aug/2020 => Jul 31 - Aug 02, 2020
 * 31/Dec/2020 - 02/Ene/2021 => Dec 31, 2020 - Ene 02, 2020
 * @param {Metric} metric Metric object with start and end date
 */
export const formatMetricPeriod = (metric: any) => {
  const startDate = moment.utc(metric.start_date).local();
  const endDate = moment.utc(metric.end_date).local();
  const isPeriodInSameMonth = startDate.month() === endDate.month();
  const isPeriodInSameYear = startDate.year() === endDate.year();
  return isPeriodInSameMonth
    ? `${startDate.format(
        DateFormats.International.MonthDay
      )} - ${endDate.format('DD, YYYY')}`
    : nestTernary(
        isPeriodInSameYear,
        `${startDate.format(
          DateFormats.International.MonthDay
        )} - ${endDate.format(DateFormats.International.MonthDayYear)}`,
        `${startDate.format(
          DateFormats.International.MonthDayYear
        )} - ${endDate.format(DateFormats.International.MonthDayYear)}`
      );
};

export const toLocalTime = (dateTime: string) => {
  if (!dateTime) return null;
  return moment.utc(dateTime).local();
};

// Seleep to delay time
export const sleep = (time: any) => {
  return new Promise<any>(resolve => setTimeout(resolve, time));
};
