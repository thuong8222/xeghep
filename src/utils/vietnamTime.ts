// utils/vietnamTime.ts
// ============================================
// VIETNAM TIME UTILITIES - FIXED VERSION
// Quản lý tập trung thời gian Việt Nam (UTC+7)
// ============================================

import moment from "moment-timezone";

/**
 * Lấy thời gian hiện tại theo múi giờ Việt Nam (UTC+7)
 */
const timezone = 'Asia/Ho_Chi_Minh';
const vietnamNow = moment().tz('Asia/Ho_Chi_Minh');
export const getVietnamNow = (): Date => {
    return new Date(); // Đơn giản vậy thôi!
  };
  
  /**
   * Chuyển đổi timestamp (seconds) sang Date
   */
  export const timestampToVietnamDate = (timestamp: number): Date => {
    return new Date(timestamp * 1000);
  };
  
  /**
   * Chuyển đổi Date sang timestamp (seconds)
   */
  export const vietnamDateToTimestamp = (date: Date): number => {
    return Math.floor(date.getTime() / 1000);
  };
  
  /**
   * Lấy đầu ngày (0h:0m:0s) theo giờ Việt Nam
   */
  export const getStartOfDay = (date?: Date): Date => {
    const targetDate = date || getVietnamNow();
    const newDate = new Date(targetDate);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  
  /**
   * Lấy cuối ngày (23h:59m:59s) theo giờ Việt Nam
   */
  export const getEndOfDay = (date?: Date): Date => {
    const targetDate = date || getVietnamNow();
    const newDate = new Date(targetDate);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };
  
  /**
   * Lấy ngày mai theo giờ Việt Nam
   */
  export const getTomorrow = (): Date => {
    const today = getVietnamNow();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  };
  
  /**
   * Thêm phút vào thời gian
   */
  export const addMinutes = (date: Date, minutes: number): Date => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
  };
  
  /**
   * Thêm ngày vào thời gian
   */
  export const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };
  
  /**
   * Format thời gian thành string
   * @param date - Date object
   * @param format - 'date' | 'time' | 'datetime' | 'full'
   */
  export const formatVietnamTime = (
    date: Date,
    format: 'date' | 'time' | 'datetime' | 'full' = 'datetime'
  ): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    switch (format) {
      case 'date':
        return `${day}/${month}/${year}`;
      case 'time':
        return `${hours}:${minutes}`;
      case 'datetime':
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      case 'full':
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      default:
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
  };
  
  /**
   * Kiểm tra xem date có phải là hôm nay
   */
  export const isToday = (date: Date): boolean => {
    const today = getStartOfDay();
    const checkDate = getStartOfDay(date);
    return today.getTime() === checkDate.getTime();
  };
  
  /**
   * Kiểm tra xem date có phải là ngày mai
   */
  export const isTomorrow = (date: Date): boolean => {
    const tomorrow = getStartOfDay(getTomorrow());
    const checkDate = getStartOfDay(date);
    return tomorrow.getTime() === checkDate.getTime();
  };
  
  /**
   * So sánh 2 dates
   * @returns -1 nếu date1 < date2, 0 nếu bằng, 1 nếu date1 > date2
   */
  export const compareDates = (date1: Date, date2: Date): number => {
    if (date1.getTime() < date2.getTime()) return -1;
    if (date1.getTime() > date2.getTime()) return 1;
    return 0;
  };
  
  /**
   * Lấy khoảng thời gian hôm nay (0h - 23h59)
   */
  export const getTodayRange = (): { start: Date; end: Date } => {
    return {
      start: getStartOfDay(),
      end: getEndOfDay(),
    };
  };
  
  /**
   * Lấy khoảng thời gian ngày mai (0h - 23h59)
   */
  export const getTomorrowRange = (): { start: Date; end: Date } => {
    const tomorrow = getTomorrow();
    return {
      start: getStartOfDay(tomorrow),
      end: getEndOfDay(tomorrow),
    };
  };
  
  /**
   * Lấy khoảng thời gian từ "hiện tại + X phút" đến cuối ngày
   */
  export const getNowPlusMinutesRange = (minutes: number): { start: Date; end: Date } => {
    const now = getVietnamNow();
console.log('getVietnamNow: ', now)
    return {
      start: addMinutes(now, minutes),
      end: getEndOfDay(),
    };
  };
  
  /**
   * Chuyển Date sang ISO string (cho API)
   */
  export const toISOString = (date: Date): string => {
    return date.toISOString();
  };
  
  /**
   * Parse ISO string sang Date
   */
  export const parseISOString = (isoString: string): Date => {
    return new Date(isoString);
  };
  
  /**
   * Hiển thị thời gian tương đối (vừa xong, 5 phút trước, etc.)
   */
  export const getRelativeTime = (date: Date): string => {
    const now = getVietnamNow();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (seconds < 60) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    
    return formatVietnamTime(date, 'date');
  };
  
  /**
   * Helper để debug thời gian
   */
  export const debugTime = (label: string, date: Date) => {
    console.log(`[${label}]`, {
      formatted: formatVietnamTime(date, 'full'),
      timestamp: vietnamDateToTimestamp(date),
      iso: toISOString(date),
      raw: date,
    });
  };