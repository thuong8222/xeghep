import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AppView from '../../components/common/AppView';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import { scale } from 'react-native-size-matters';
import AppText from '../../components/common/AppText';
import { FlatList } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


import Container from '../../components/common/Container';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/data/store';
import { FetchHistoryPointParams, historyPoint, resumeSalePoint } from '../../redux/slices/pointSlice';
import { useTransactionHistoryRealtime } from '../../hooks/useTransactionHistoryRealtime';
import { useAppContext } from '../../context/AppContext';
import { useAppDispatch } from '../../redux/hooks/useAppDispatch';
import moment from 'moment';

import PointHis from '../../components/component/PointHis';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryBuySalePoint() {
  const dispatch = useAppDispatch()
  const { history, loading, error, types } = useSelector((state: RootState) => state.point);
  const { currentDriver } = useAppContext();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDateType, setSelectedDateType] = useState<'from' | 'to' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    const fetchDriver = async () => {
      const driverString = await AsyncStorage.getItem("driver");
      if (driverString) setDriver(JSON.parse(driverString));
    };
    fetchDriver();
  }, []);
  console.log('history: ', history);
  useTransactionHistoryRealtime(driver?.id);

  // ✅ FIX 1: Dùng fetchPointHistory thay vì historyPoint để filter hoạt động
  useEffect(() => {
    if (!driver?.id) return;

    const params: FetchHistoryPointParams = { page: 1 };

    if (fromDate) {
      const start = dateToTimestamp(fromDate, false);
      if (start) params.start_date = start;
    }
    if (toDate) {
      const end = dateToTimestamp(toDate, true);
      if (end) params.end_date = end;
    }
    if (selectedType) params.related_type = selectedType;

    dispatch(historyPoint(params));
  }, [selectedType, fromDate, toDate, driver?.id]);


  const dateToTimestamp = useCallback((dateString: string, endOfDay = false): number | null => {
    if (!dateString) return null;
    const momentDate = moment(dateString, 'DD/MM/YYYY');
    return endOfDay ? momentDate.endOf('day').unix() : momentDate.startOf('day').unix();
  }, []);

  const formatDate = useCallback((date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const parseDate = useCallback((dateString: string): Date | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }, []);

  // ✅ FIX 2: Bỏ setTimeout, cập nhật state rồi để useEffect tự dispatch
  const handleConfirmDate = useCallback(
    (selectedDate: Date) => {
      const formattedDate = moment(selectedDate).utcOffset(7).format("DD/MM/YYYY");
      const selectedMoment = moment(selectedDate);

      if (selectedDateType === 'from') {
        if (toDate) {
          const toDateObj = parseDate(toDate);
          if (toDateObj && selectedMoment.isAfter(toDateObj, 'day')) {
            setErrorMessage('Ngày bắt đầu không thể sau ngày kết thúc.');
            setIsDatePickerVisible(false);
            setSelectedDateType(null);
            return;
          }
        }
        setFromDate(formattedDate); // ✅ useEffect sẽ tự trigger
        setErrorMessage('');
      } else if (selectedDateType === 'to') {
        if (fromDate) {
          const fromDateObj = parseDate(fromDate);
          if (fromDateObj && selectedMoment.isBefore(fromDateObj, 'day')) {
            setErrorMessage('Ngày kết thúc không thể trước ngày bắt đầu.');
            setIsDatePickerVisible(false);
            setSelectedDateType(null);
            return;
          }
        }
        setToDate(formattedDate); // ✅ useEffect sẽ tự trigger
        setErrorMessage('');
      }

      setIsDatePickerVisible(false);
      setSelectedDateType(null);
    },
    [selectedDateType, toDate, fromDate, parseDate]
  );

  const openSelectFromDate = () => {
    setSelectedDateType('from');
    setIsDatePickerVisible(true);
  }

  const openSelectFromTo = () => {
    setSelectedDateType('to');
    setIsDatePickerVisible(true);
  }

  // ✅ FIX 3: Dùng lastPage từ Redux thay vì local state
  const { page: reduxPage, lastPage: reduxLastPage } = useSelector((state: RootState) => state.point);

  const loadMore = () => {
    if (reduxPage >= reduxLastPage || loading) return;

    const params: FetchHistoryPointParams = { page: reduxPage + 1 };

    const start_date = dateToTimestamp(fromDate, false);
    const end_date = dateToTimestamp(toDate, true);
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    if (selectedType) params.related_type = selectedType; // ✅ đúng key

    dispatch(historyPoint(params));
  };

  const sellPointContinute = (id: string) => {
    Alert.alert(
      'Xe ghép',
      'Bạn có chắc muốn tiếp tục bán điểm này không?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            dispatch(resumeSalePoint({ id }))
              .unwrap()
              .then(() => Alert.alert('Thành công', 'Đã tiếp tục bán điểm'))
              .catch(msg => Alert.alert('Lỗi', msg || 'Tiếp tục bán thất bại'));
          },
        },
      ]
    );
  };

  const renderItem_trip = ({ item }) => (
    <PointHis props={item} resume={sellPointContinute} />
  );

  const SkeletonItem = () => (
    <View style={{ flexDirection: 'row', padding: 12, gap: 10 }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee' }} />
      <View style={{ flex: 1, gap: 6 }}>
        <View style={{ width: '50%', height: 10, backgroundColor: '#eee', borderRadius: 4 }} />
        <View style={{ width: '80%', height: 10, backgroundColor: '#eee', borderRadius: 4 }} />
      </View>
    </View>
  );

  if (!history) return null;

  return (
    <Container ignoreBottomInset style={{ gap: 6 }} loading={loading}>
      {error && <AppText color="red">{error}</AppText>}

      <AppView row justifyContent={'space-between'} gap={12} alignItems={'center'}>
        <AppButton flex={1} onPress={openSelectFromDate}>
          <AppInput
            keyboardType='numeric'
            maxLength={10}
            editable={false}
            value={fromDate}
            onChangeText={setFromDate}
            label='Từ ngày'
            placeholder='Chọn ngày'
            type='calendar'
            onCalendarPress={openSelectFromDate}
          />
        </AppButton>

        <AppButton flex={1} onPress={openSelectFromTo}>
          <AppInput
            keyboardType='numeric'
            maxLength={10}
            editable={false}
            value={toDate}
            onChangeText={setToDate}
            label='Đến ngày'
            placeholder='Chọn ngày'
            type='calendar'
            onCalendarPress={openSelectFromTo}
          />
        </AppButton>
      </AppView>

      {errorMessage && (
        <AppText fontStyle='italic' fontSize={14} style={{ color: 'red', marginBottom: 8 }}>
          {"! " + errorMessage}
        </AppText>
      )}

      <AppView flex={1}>
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem_trip}
          ItemSeparatorComponent={() => <AppView height={scale(6)} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() => loading ? <SkeletonItem /> : null}
          refreshing={loading}
          // ✅ FIX 4: onRefresh reset về page 1, xóa filter
          onRefresh={() => {
            setFromDate('');
            setToDate('');
            setSelectedType(null);
            dispatch(fetchPointHistory({ page: 1 }));
          }}
          ListEmptyComponent={() =>
            !loading
              ? <AppView alignItems='center' justifyContent='center'>
                <AppText>{'Chưa có lịch sử mua/bán điểm'}</AppText>
              </AppView>
              : null
          }
        />
      </AppView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setIsDatePickerVisible(false)}
        locale="en_GB"
      />
    </Container>
  );
}
