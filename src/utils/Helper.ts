import { verticalScale, moderateScale } from 'react-native-size-matters';
import { Dimensions, DimensionValue, Platform, StatusBar, useWindowDimensions } from 'react-native';
import { ColorsGlobal } from '../components/base/Colors/ColorsGlobal';
type ScaleType = 'scale' | 'v' | 'm';

export const autoScale = (
  value?: number | 'auto',
  type: ScaleType = 'm'
): DimensionValue => {
  if (typeof value === 'number') {
    switch (type) {
      case 'v':
        return verticalScale(value);
      case 'scale':
        return scale(value);
      case 'm':
      default:
        return moderateScale(value);
    }
  }
  if (value === 'auto') return 'auto';
  return undefined;
};
const _screen_width = Dimensions.get('window').width;
const _screen_height = Dimensions.get('window').height;

const navbarHeight =
  Dimensions.get('screen').height -
  Dimensions.get('window').height -
  (StatusBar.currentHeight || 0);
const scale = (size: number) => {
  const w = _screen_width < _screen_height ? _screen_width : _screen_height;
  return (size * w) / (Platform.OS === 'ios' ? 440 : 440);
};

const isAndroid = Platform.OS === 'android';

export { scale, _screen_width, _screen_height, isAndroid, navbarHeight, };


export function NumberFormat(num, joinChar = ',') {
  try {
    let hasDot = false;
    let numString = num + '';
    let negative = false;
    if (numString[0] === '-') negative = true;
    numString = numString.replace(/[^0-9.]/g, '');
    let numberPart = numString.split('.');
    let beforeDot = numberPart[0];
    let afterDot = '';
    if (numberPart.length >= 2) {
      numberPart.splice(0, 1);
      afterDot += numberPart.join('');
    }

    var arr = [];
    while (beforeDot.length > 0) {
      if (beforeDot.length > 3) {
        arr.push(beforeDot.slice(beforeDot.length - 3, beforeDot.length));
        beforeDot = beforeDot.slice(0, beforeDot.length - 3);
      } else {
        arr.push(beforeDot);
        beforeDot = '';
      }
    }
    return (
      (negative === true ? '-' : '') +
      arr.reverse().join(joinChar) +
      (hasDot === true ? '.' : '') +
      afterDot
    );
  } catch (ex) {
    return '';
  }
}
export function GetObjectProperty(obj: any, prop: any, defaultValue = '') {
  try {
    if (obj === '' || obj === null || typeof obj === 'undefined') return defaultValue;
    if (obj[prop] === '' || obj[prop] === null || typeof obj[prop] === 'undefined') return defaultValue;
    return obj[prop];
  }
  catch (err) { }
  return defaultValue;
}
export const CONSTANT = {

  ORDER_STATUS: {
    'all': { label: 'All ', color: ColorsGlobal.placeholder },
    'processing': { label: 'Processing', color: '#3D9EFF' },
    'completed': { label: 'Completed', color: '#4CAF50' },
    'cancelled': { label: 'Cancelled', color: '#F44336' },
    'pending': { label: 'Pending', color: '#FFA500' },
    'on-hold': { label: 'On hold', color: 'pink' },
    'on hold': { label: 'On hold', color: 'pink' },
  },
  ORDER_STATUS_BY_KEY: {
    all: ColorsGlobal.placeholder,
    processing: '#3D9EFF',
    completed: '#4CAF50',
    cancelled: '#F44336',
    pending: '#FFA500',
  },
};


export type PriceInfo = {
  regularPrice: string | null;
  salePrice: string | null;
  currencySymbol: string | null;
};

/**
 * Extracts price and currency symbol from WooCommerce HTML price block
 * @param html - HTML string containing product price block
 * @returns {PriceInfo}
 */
export const extractPriceFromHTML = (html: string): PriceInfo => {
  const regularPriceMatch = html.match(
    /<del[^>]*><span[^>]*><bdi>([\d,\.]+)&nbsp;<span[^>]*>(.*?)<\/span><\/bdi>/
  );
  const salePriceMatch = html.match(
    /<ins[^>]*><span[^>]*><bdi>([\d,\.]+)&nbsp;<span[^>]*>(.*?)<\/span><\/bdi>/
  );

  return {
    regularPrice: regularPriceMatch?.[1] || null,
    salePrice: salePriceMatch?.[1] || null,
    currencySymbol: salePriceMatch?.[2] || regularPriceMatch?.[2] || null
  };
};
export const parseApiResponse = (raw: string) => {
  try {
    const jsonStart = raw.indexOf('{');
    if (jsonStart === -1) {
      return { success: false, message: 'Invalid response format' };
    }
    const jsonString = raw.slice(jsonStart);
    const parsed = JSON.parse(jsonString);
    return {
      success: parsed.success ?? false,
      message: parsed.message ?? '',
    };
  } catch (error) {
    return { success: false, message: 'Error parsing server response' };
  }
};

export const capitalizeWords = (str: string): string => {
  if (!str) return "";

  return str
    .split(" ")
    .map(word =>
      word.length > 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : ""
    )
    .join(" ");
};

