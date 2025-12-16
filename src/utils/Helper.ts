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
import moment from 'moment';
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

export function NumberFormat(num: any, joinChar = ',') {
  try {
    let numString = String(num).trim();

    // Kiểm tra âm
    const negative = numString.startsWith('-');

    // Xóa ký tự không phải số hoặc dấu chấm
    numString = numString.replace(/[^0-9.]/g, '');

    // Tách phần nguyên và phần thập phân
    const numberPart = numString.split('.');
    let beforeDot = numberPart[0];
    let afterDot = numberPart.length > 1 ? numberPart.slice(1).join('') : '';
    const hasDot = afterDot.length > 0;

    // Format phần nguyên (beforeDot)
    const arr: string[] = [];
    while (beforeDot.length > 0) {
      if (beforeDot.length > 3) {
        arr.push(beforeDot.slice(beforeDot.length - 3));
        beforeDot = beforeDot.slice(0, beforeDot.length - 3);
      } else {
        arr.push(beforeDot);
        beforeDot = '';
      }
    }

    return (
      (negative ? '-' : '') +
      arr.reverse().join(joinChar) +
      (hasDot ? '.' + afterDot : '')
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
  TRANSACTION_TYPE_BY_KEY: {
    point_buy: 'Mua điểm',
    point_sale: 'Bán điểm',
    sell_points: 'Bán điểm',
    buy_points: 'Mua điểm',

    trip_buy: 'Mua chuyến',
    trip_sale: 'Bán chuyến',
    buy_trip: 'Mua chuyến',
    sell_trip: 'Bán chuyến',
  },
  STATUS: {
    1: 'đã bán',
    0: 'chưa bán',
    2: 'đã huỷ chuyến',
  },
  TYPE_CAR_LIST: [
    { id: 1, key: 'car5', name: 'Xe 5 chỗ' },
    { id: 2, key: 'car7', name: 'Xe 7 chỗ' },
    { id: 3, key: 'car9', name: 'Xe 9 chỗ' },
    { id: 4, key: 'car16', name: 'Xe 16 chỗ' },
    { id: 5, key: 'car35', name: 'Xe 35 chỗ' },
    { id: 6, key: 'car45', name: 'Xe 45 chỗ' },
  ],
  QUIKCK_NOTE: [
    'Có thú cưng',
    'Không hút thuốc',
    'Xin ghế đầu',
    'Cần chở hàng nhỏ',
    'Đi chung trẻ em',
    'Khách mang nhiều hành lý',
    'Không ngồi ghế cuối',
    'Không cần gấp',
    'Ưu tiên đi nhanh',
    'Đi chậm, an toàn',
    'Khách không dùng điện thoại',
    'Khách khó tìm đường',
    'Đón ở cổng chính',
    'Đón ở cổng phụ',

    'Cần hỗ trợ lên/xuống xe',
  ],

  DIRECTIONS: {
    1: 'Chiều đi',
    0: 'Chiều về',
  },
};
export function getDateRange(
  selectedTime: 'now' | 'today' | 'tomorrow' | 'custom',
  customDate?: { start: Date; end: Date },
) {
  console.log('selectedTime: ', selectedTime);
  const now = moment();

  switch (selectedTime) {
    case 'now':
      return {
        start_date: now.format('YYYY-MM-DD HH:mm:ss'),
        end_date: now.format('YYYY-MM-DD HH:mm:ss'),
      };
    case 'today':
      return {
        start_date: now.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end_date: now.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      };
    case 'tomorrow':
      return {
        start_date: now
          .clone()
          .add(1, 'day')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
        end_date: now
          .clone()
          .add(1, 'day')
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
      };
    case 'custom':
      if (customDate) {
        return {
          start_date: moment(customDate.start).format('YYYY-MM-DD HH:mm:ss'),
          end_date: moment(customDate.end).format('YYYY-MM-DD HH:mm:ss'),
        };
      }
      return {
        start_date: now.format('YYYY-MM-DD HH:mm:ss'),
        end_date: now.format('YYYY-MM-DD HH:mm:ss'),
      };
    default:
      return {
        start_date: now.format('YYYY-MM-DD HH:mm:ss'),
        end_date: now.format('YYYY-MM-DD HH:mm:ss'),
      };
  }
}
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
  if (parseInt(cleaned, 10) < 1) {
    return 'Số tiền phải lớn hơn hoặc bằng 1 K';
  }

  // Nếu > 10 tỷ (giới hạn tuỳ chọn)
  if (parseInt(cleaned, 10) > 100000) {
    return 'Nhập dưới 100 000';
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
export const validateExperienceYears = (value: string) => {
  const num = Number(value);
  if (isNaN(num)) return 'Giá trị phải là số';
  if (num <= 0) return 'Số năm phải lớn hơn 0';
  if (num > 60) return 'Số năm không hợp lệ (quá lớn)';
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
export const validateYear = (text: string) => {
  // Chỉ cho phép nhập số
  if (!/^\d*$/.test(text)) {
    return 'Chỉ được nhập số';
  }

  // Nếu đủ 4 ký tự thì kiểm tra hợp lệ
  if (text.length === 4) {
    const yearNumber = parseInt(text, 10);
    const currentYear = new Date().getFullYear();

    if (yearNumber < 1900 || yearNumber > currentYear) {
      return `Năm phải từ 1900 đến ${currentYear}`;
    } else {
      return '';
    }
  } else {
    return 'Năm phải gồm 4 chữ số';
  }
};
export const validateConfirmPassword = ({
  value,
  password,
}: {
  value: string;
  password: string;
}) => {
  if (value !== password) {
    return 'Mật khẩu nhập lại không khớp';
  }
  return ''; // Nếu không có lỗi thì trả về chuỗi rỗng
};

export function validatePlateVN(input: string): string {
  if (!input || typeof input !== 'string') {
    return 'Không được để trống';
  }

  const raw = input.trim().toUpperCase().replace(/\s+/g, '');
  const normalized = raw.replace(/_/g, '-').replace(/—/g, '-');

  const provinceCodes = [
    '11',
    '12',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '43',
    '47',
    '48',
    '49',
    '50',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '57',
    '58',
    '59',
    '60',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '70',
    '71',
    '72',
    '73',
    '74',
    '75',
    '76',
    '77',
    '78',
    '79',
    '80',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '88',
    '89',
    '90',
    '92',
    '93',
    '94',
    '95',
    '97',
    '98',
    '99',
  ];

  const pattern = /^(\d{2})([A-Z]{1,2})-?(\d{3,5})(\.\d{2})?$/;
  const match = normalized.match(pattern);

  if (!match) return 'Định dạng không hợp lệ (vd: 30A-123.45, 59B1-12345)';

  const province = match[1];
  const numbers = match[3];

  if (!provinceCodes.includes(province))
    return `Mã tỉnh (${province}) không hợp lệ`;

  if (numbers.length < 4 || numbers.length > 5)
    return 'Số thứ tự phải có 4–5 chữ số';

  return 'Biển số hợp lệ';
}

export const openMapSmart = (trip: any) => {
  const { lat_start, lng_start, lat_end, lng_end, place_start, place_end } =
    trip;

  // Ưu tiên dùng tọa độ nếu có
  if (lat_start && lng_start && lat_end && lng_end) {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${lat_start},${lng_start}&destination=${lat_end},${lng_end}&travelmode=driving`;
    Linking.openURL(url);
    return;
  }

  // Nếu không có tọa độ thì fallback sang địa chỉ
  if (place_start && place_end) {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      place_start,
    )}&destination=${encodeURIComponent(place_end)}&travelmode=driving`;
    Linking.openURL(url);
  } else {
    Alert.alert('Thiếu dữ liệu', 'Không có thông tin để mở Google Maps');
  }
};
export const DRIVER_STATUS = {
  READY: 1,
  MAINTENANCE: 0,
} as const;

export const DRIVER_STATUS_LABELS: Record<number, string> = {
  [DRIVER_STATUS.READY]: 'Sẵn sàng',
  [DRIVER_STATUS.MAINTENANCE]: 'Đang bảo trì',
};
export const parseTime = value => {
  // Nếu là dạng số và dài 10 → timestamp giây
  if (typeof value === 'number' && value.toString().length === 10) {
    return moment(value * 1000);
  }

  // Nếu là string dạng timestamp "1763950404"
  if (typeof value === 'string' && /^\d{10}$/.test(value)) {
    return moment(Number(value) * 1000);
  }

  // Còn lại → xem như datetime string bình thường
  return moment(value);
};
