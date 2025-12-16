import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import AppView from '../../components/common/AppView';

import TripHistory from '../../components/component/TripHistory';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import AppText from '../../components/common/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/data/store';
import { fetchReceivedTrips, FetchReceivedTripsParams, fetchSoldTrips } from '../../redux/slices/tripsSlice';
import { useAppContext } from '../../context/AppContext';
import moment from 'moment';
import TypeFilterBar from '../../components/component/TypeFilterBar';
import { scale } from '../../utils/Helper';

export default function ReceivingScheduleScreen() {
  // 🔹 All hooks must be at the top level and in consistent order
  const dispatch = useDispatch<AppDispatch>();
  const { updateTrips } = useAppContext();
  const { receivedTrips, soldTrips, loading, error } = useSelector((state: RootState) => state.trips);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDateType, setSelectedDateType] = useState<'from' | 'to' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>('chuyến nhận');
  const types = ['chuyến nhận', 'chuyến bán']

  // console.log('selectedType: ', selectedType)
  const toggleFilter = (type: string) => {
    setSelectedType(prev => {
      if (prev === type) {
        // nếu bấm lại chính nó → chuyển sang loại còn lại
        return types.find(t => t !== type) || type;
      }
      return type;
    });
  };
  // 🔹 Format date
  const formatDate = useCallback((date: Date) => {
    return moment(date).format('DD/MM/YYYY');
  }, []);

  // 🔹 Parse date using moment
  const parseDate = useCallback((dateString: string): moment.Moment | null => {
    if (!dateString) return null;
    const parsed = moment(dateString, 'DD/MM/YYYY', true);
    return parsed.isValid() ? parsed : null;
  }, []);

  // 🔹 Convert dd/mm/yyyy to timestamp
  const dateToTimestamp = useCallback((dateString: string): number | null => {
    if (!dateString) return null;
    return moment(dateString, 'DD/MM/YYYY').startOf('day').unix();
  }, []);

  // 🔹 Load trips function
  const loadTrips = useCallback(() => {
    const start_date = dateToTimestamp(fromDate);
    const end_date = dateToTimestamp(toDate);

    const params: FetchReceivedTripsParams = {};
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    console.log('FETCH PARAMS:', selectedType, params);
    // dispatch(fetchReceivedTrips(params));
    // dispatch(fetchSoldTrips(params));
    if (selectedType == 'chuyến nhận') {
      console.log('chuyến nhận fetchReceivedTrips')
      return dispatch(fetchReceivedTrips(params));
    } else {
      console.log('chuyến nhận fetchSoldTrips')

      return dispatch(fetchSoldTrips(params));
    }

  }, [dispatch, fromDate, toDate, dateToTimestamp, selectedType]);

  // 🔹 Initial load and reload when filters change
  useEffect(() => {
    if (selectedType)
      loadTrips();
  }, [loadTrips]);

  // 🔹 Pull to refresh handler - clear filters and reload
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setFromDate('');
    setToDate('');
    setErrorMessage('');
  
    if (selectedType == 'chuyến nhận') {
      await dispatch(fetchReceivedTrips({}));
    } else {
      await dispatch(fetchSoldTrips({}));
    }
  
    setRefreshing(false);
  }, [dispatch, selectedType]);
  

  // 🔹 Render trip item
  const renderItem_trip = useCallback(
    ({ item }) => <TripHistory data={item} />,
    []
  );

  // 🔹 Handle date confirmation
  const handleConfirmDate = useCallback(
    (selectedDate: Date) => {
      const formattedDate = formatDate(selectedDate);
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
    },
    [selectedDateType, toDate, fromDate, formatDate, parseDate]
  );

  // 🔹 Open date pickers
  const openSelectFromDate = useCallback(() => {
    setSelectedDateType('from');
    setIsDatePickerVisible(true);
  }, []);

  const openSelectFromTo = useCallback(() => {
    setSelectedDateType('to');
    setIsDatePickerVisible(true);
  }, []);

  const closeDatePicker = useCallback(() => {
    setIsDatePickerVisible(false);
    setSelectedDateType(null);
  }, []);

  // 🔹 Empty list component
  const renderEmptyComponent = useCallback(() => {
    if (loading && !refreshing) {
      return (
        <AppView paddingTop={32} alignItems="center">
          <AppText title="Đang tải dữ liệu..." />
        </AppView>
      );
    }
    return (
      <AppView paddingTop={32} alignItems="center">
        <AppText title="Không có dữ liệu" />
      </AppView>
    );
  }, [loading, refreshing]);

  return (
    <AppView flex={1} backgroundColor="#fff" padding={16} position="relative" gap={8}>
      {error && (
        <AppView paddingBottom={8}>
          <AppText color="red">{error}</AppText>
        </AppView>
      )}

      <AppView row justifyContent={'space-between'} gap={12} >
        <AppButton flex={1} onPress={openSelectFromDate}>
          <AppInput
            keyboardType="numeric"
            maxLength={10}
            editable={false}
            value={fromDate}
            onChangeText={setFromDate}
            label="Từ ngày"
            placeholder="Chọn ngày"
            type="calendar"
            onCalendarPress={openSelectFromDate}
          />
        </AppButton>

        <AppButton flex={1} onPress={openSelectFromTo}>
          <AppInput
            keyboardType="numeric"
            maxLength={10}
            editable={false}
            value={toDate}
            onChangeText={setToDate}
            label="Đến ngày"
            placeholder="Chọn ngày"
            type="calendar"
            onCalendarPress={openSelectFromTo}
          />
        </AppButton>
      </AppView>

      {errorMessage ? (
        <AppText
          fontStyle="italic"
          fontSize={14}
          style={{ color: 'red', marginBottom: 8 }}
        >
          {'! ' + errorMessage}
        </AppText>
      ) : null}
      <AppView>
        <TypeFilterBar
          types={types}
          selectedType={selectedType}
          toggleFilter={toggleFilter}
        />
      </AppView>

      <AppView flex={1}>
        <FlatList
          data={selectedType === 'chuyến nhận' ? receivedTrips : soldTrips}
          // keyExtractor={(item) => item?.id.toString()}
          keyExtractor={(item, index) => item.id_trip ?? index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem_trip}
          ItemSeparatorComponent={() => <AppView height={scale(16)} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyComponent}

        />
      </AppView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={closeDatePicker}
      />
    </AppView>
  );
}