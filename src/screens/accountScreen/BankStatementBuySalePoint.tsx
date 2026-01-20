import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AppView from '../../components/common/AppView';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import { scale } from 'react-native-size-matters';
import AppText from '../../components/common/AppText';
import { FlatList } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import PointHistory from '../../components/component/PointHistory';
import Container from '../../components/common/Container';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/data/store';
import { FetchHistoryPointParams, fetchPointHistory } from '../../redux/slices/pointSlice';
import { useTransactionHistoryRealtime } from '../../hooks/useTransactionHistoryRealtime';
import { useAppContext } from '../../context/AppContext';
import { useAppDispatch } from '../../redux/hooks/useAppDispatch';
import moment from 'moment';
import TypeFilterBar from '../../components/component/TypeFilterBar';

export default function BankStatementBuySalePoint() {
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



  // ✅ Kích hoạt real-time updates
  useTransactionHistoryRealtime(currentDriver?.id);

  useEffect(() => {
    if (!currentDriver?.id) return;

    const start_date = fromDate ? dateToTimestamp(fromDate, false) : undefined;
    const end_date = toDate ? dateToTimestamp(toDate, true) : undefined;

    const params: FetchHistoryPointParams = { page: 1 };
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    if (selectedType) params.related_type = selectedType;

    dispatch(fetchPointHistory(params));
  }, [selectedType, fromDate, toDate, currentDriver?.id]);

  // ✅ Hàm chuyển dd/mm/yyyy thành timestamp (startOfDay)
  const dateToTimestamp = useCallback((dateString: string, endOfDay = false): number | null => {
    if (!dateString) return null;
    const momentDate = moment(dateString, 'DD/MM/YYYY');
    return endOfDay ? momentDate.endOf('day').unix() : momentDate.startOf('day').unix();
  }, []);

  // ✅ Hàm format Date thành dd/mm/yyyy
  const formatDate = useCallback((date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  // ✅ Hàm chuyển đổi dd/mm/yyyy sang Date object
  const parseDate = useCallback((dateString: string): Date | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }, []);




  // ✅ Xử lý khi chọn ngày
  const handleConfirmDate = useCallback(
    (selectedDate: Date) => {
      const vnDate = moment(selectedDate).utcOffset(7); // ➜ ép về giờ VN

      const formattedDate = vnDate.format("DD/MM/YYYY");
      // const formattedDate = formatDate(selectedDate);
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
        setFromDate(formattedDate);
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
        setToDate(formattedDate);
        setErrorMessage('');
      }

      setIsDatePickerVisible(false);
      setSelectedDateType(null);

      // ✅ Gọi filter ngay sau khi chọn ngày
      setTimeout(() => {
        const start = selectedDateType === 'from'
          ? moment(selectedDate).startOf('day').unix()
          : fromDate ? dateToTimestamp(fromDate, false) : null;

        const end = selectedDateType === 'to'
          ? moment(selectedDate).endOf('day').unix()
          : toDate ? dateToTimestamp(toDate, true) : null;

        const params: FetchHistoryPointParams = { page: 1 };
        if (start) params.start_date = start;
        if (end) params.end_date = end;
        if (selectedType) params.type = selectedType;


        dispatch(fetchPointHistory(params));
      }, 100);
    },
    [selectedDateType, toDate, fromDate, formatDate, parseDate, selectedType, dateToTimestamp, dispatch]
  );

  const openSelectFromDate = () => {

    setSelectedDateType('from');
    setIsDatePickerVisible(true);
  }

  const openSelectFromTo = () => {

    setSelectedDateType('to');
    setIsDatePickerVisible(true);
  }

  // ✅ LoadMore với timestamp
  const loadMore = () => {
    if (page >= lastPage || loading) return;

    const start_date = dateToTimestamp(fromDate, false);
    const end_date = dateToTimestamp(toDate, true);

    const params: FetchHistoryPointParams = { page: page + 1 };
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    if (selectedType) params.type = selectedType;

    dispatch(fetchPointHistory(params));
  };

  const renderItem_trip = ({ item }) => {
    return <PointHistory data={item} />;
  };

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
      {error && (
        <AppText color="red">{error}</AppText>
      )}
      <AppView row justifyContent={'space-between'} gap={12} alignItems={'center'} >
        <AppButton
          flex={1}
          onPress={openSelectFromDate}
        >
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

        <AppButton
          flex={1}
          onPress={openSelectFromTo}
        >
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
        <AppText
          fontStyle='italic'
          fontSize={14}
          style={{ color: 'red', marginBottom: 8 }}
        >
          {"! " + errorMessage}
        </AppText>
      )}
      <AppView >
        <TypeFilterBar
          types={types}
          selectedType={selectedType}
          toggleFilter={(type) => setSelectedType(prev => (prev === type ? null : type))}
        />
      </AppView>
      <AppView flex={1}>
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem_trip}
          ItemSeparatorComponent={() => <AppView height={scale(6)} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() => loading && <SkeletonItem />}
          refreshing={loading}
          onRefresh={() => dispatch(fetchPointHistory({ page: 1 }))}
          ListEmptyComponent={() => !loading ? <AppView alignItems='center' justifyContent='center'><AppText>{'Chưa có lịch sử mua/bán điểm'}</AppText></AppView> : null}
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
