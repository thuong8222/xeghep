import { verticalScale, moderateScale } from 'react-native-size-matters';
import {
  Alert,
  Dimensions,
  DimensionValue,
  Linking,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { ColorsGlobal } from '../components/base/Colors/ColorsGlobal';
type ScaleType = 'scale' | 'v' | 'm';

export const autoScale = (
  value?: number | 'auto',
  type: ScaleType = 'm',
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

export { scale, _screen_width, _screen_height, isAndroid, navbarHeight };

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
    if (obj === '' || obj === null || typeof obj === 'undefined')
      return defaultValue;
    if (
      obj[prop] === '' ||
      obj[prop] === null ||
      typeof obj[prop] === 'undefined'
    )
      return defaultValue;
    return obj[prop];
  } catch (err) {}
  return defaultValue;
}
export const CONSTANT = {
  ORDER_STATUS: {
    all: { label: 'All ', color: ColorsGlobal.placeholder },
    processing: { label: 'Processing', color: '#3D9EFF' },
    completed: { label: 'Completed', color: '#4CAF50' },
    cancelled: { label: 'Cancelled', color: '#F44336' },
    pending: { label: 'Pending', color: '#FFA500' },
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
    /<del[^>]*><span[^>]*><bdi>([\d,\.]+)&nbsp;<span[^>]*>(.*?)<\/span><\/bdi>/,
  );
  const salePriceMatch = html.match(
    /<ins[^>]*><span[^>]*><bdi>([\d,\.]+)&nbsp;<span[^>]*>(.*?)<\/span><\/bdi>/,
  );

  return {
    regularPrice: regularPriceMatch?.[1] || null,
    salePrice: salePriceMatch?.[1] || null,
    currencySymbol: salePriceMatch?.[2] || regularPriceMatch?.[2] || null,
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
  if (!str) return '';

  return str
    .split(' ')
    .map(word =>
      word.length > 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : '',
    )
    .join(' ');
};

export const removeVietnameseTones = (str: string) => {
  return str
    .normalize('NFD') // tách dấu
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};
export const validatePrice = (value: string) => {
  // Loại bỏ dấu chấm hoặc khoảng trắng nếu có
  const cleaned = value.replace(/[.,\s]/g, '');

  // Nếu rỗng
  if (!cleaned) {
    return 'Vui lòng nhập số tiền';
  }

  // Không phải số
  if (!/^\d+$/.test(cleaned)) {
    return 'Giá tiền không hợp lệ. Chỉ được nhập số.';
  }

  // Nếu < 1.000
  if (parseInt(cleaned, 10) < 1000) {
    return 'Số tiền phải lớn hơn hoặc bằng 1.000 VNĐ';
  }

  // Nếu > 10 tỷ (giới hạn tuỳ chọn)
  if (parseInt(cleaned, 10) > 10000000000) {
    return 'Số tiền quá lớn';
  }

  return '';
};
export const formatCurrency = (value: string) => {
  const cleaned = value.replace(/[^\d]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
export const validatePoint = (value: string, currentPoints: number) => {
  if (!value) return 'Vui lòng nhập số điểm';

  if (!/^\d+$/.test(value)) return 'Số điểm chỉ được chứa số';

  if (parseInt(value, 10) <= 0) return 'Số điểm phải lớn hơn 0';

  if (parseInt(value, 10) > currentPoints) {
    return `Số điểm không được lớn hơn số điểm hiện tại (${currentPoints})`;
  }

  return '';
};
export const validatePhoneNumber = (value: string) => {
  // Biểu thức chính quy kiểm tra số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 03-09)
  const phonePattern = /^(03|05|07|08|09)\d{8}$/;

  // Kiểm tra nếu không có giá trị
  if (!value) {
    return 'Vui lòng nhập số điện thoại';
  }

  // Kiểm tra nếu có ký tự không phải số (bao gồm chữ cái và ký tự đặc biệt)
  if (!/^\d+$/.test(value)) {
    return 'Số điện thoại chỉ được chứa số';
  }

  // Kiểm tra nếu số điện thoại không khớp với pattern
  if (!phonePattern.test(value)) {
    return 'Số điện thoại không hợp lệ';
  }

  // Nếu hợp lệ, trả về chuỗi rỗng
  return '';
};

export const validatePassword = (value: string) => {
  // Kiểm tra nếu không có giá trị
  if (!value) {
    return 'Vui lòng nhập mật khẩu';
  }

  // Kiểm tra độ dài mật khẩu
  if (value.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  // Kiểm tra chứa ít nhất một chữ cái viết hoa
  if (!/[A-Z]/.test(value)) {
    return 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa';
  }

  // Kiểm tra chứa ít nhất một chữ cái viết thường
  if (!/[a-z]/.test(value)) {
    return 'Mật khẩu phải chứa ít nhất một chữ cái viết thường';
  }

  // Kiểm tra chứa ít nhất một chữ số
  if (!/\d/.test(value)) {
    return 'Mật khẩu phải chứa ít nhất một chữ số';
  }

  // Kiểm tra chứa ít nhất một ký tự đặc biệt
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*)';
  }

  // Kiểm tra không chứa khoảng trắng
  if (/\s/.test(value)) {
    return 'Mật khẩu không được chứa khoảng trắng';
  }

  // Nếu mật khẩu hợp lệ, trả về chuỗi rỗng
  return '';
};

export const validateConfirmPassword = ({ value, password }: { value: string, password: string }) => {
  if (value !== password) {
    return 'Mật khẩu nhập lại không khớp';
  }
  return ''; // Nếu không có lỗi thì trả về chuỗi rỗng
};
export   const openMapSmart = (trip:any) => {
        const {
            lat_start,
            lng_start,
            lat_end,
            lng_end,
            place_start,
            place_end,
        } = trip;

        // Ưu tiên dùng tọa độ nếu có
        if (lat_start && lng_start && lat_end && lng_end) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${lat_start},${lng_start}&destination=${lat_end},${lng_end}&travelmode=driving`;
            Linking.openURL(url);
            return;
        }

        // Nếu không có tọa độ thì fallback sang địa chỉ
        if (place_start && place_end) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(place_start)}&destination=${encodeURIComponent(place_end)}&travelmode=driving`;
            Linking.openURL(url);
        } else {
            Alert.alert('Thiếu dữ liệu', 'Không có thông tin để mở Google Maps');
        }

    };