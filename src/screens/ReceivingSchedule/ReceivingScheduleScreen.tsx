import { FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import AppView from '../../components/common/AppView';
import TripHistory from '../../components/component/TripHistory';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import AppText from '../../components/common/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/data/store';
import {
  fetchReceivedTrips,
  FetchReceivedTripsParams,
  fetchSoldTrips,
  fetchMyTrips,
  Trip,
} from '../../redux/slices/tripsSlice';
import { useAppContext } from '../../context/AppContext';
import moment from 'moment';
import TypeFilterBar from '../../components/component/TypeFilterBar';
import { scale } from '../../utils/Helper';
import ModalEditTrip from '../../components/component/modals/ModalEditTrip';

const TYPES = ['chuyến nhận', 'chuyến bán', 'chuyến của tôi'];

export default function ReceivingScheduleScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { updateTrips } = useAppContext();
  const { receivedTrips, soldTrips, myTrips, loading, error } = useSelector(
    (state: RootState) => state.trips,
  );

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [fromDate, setFromDate] = useState('');  // DD/MM/YYYY
  const [toDate, setToDate] = useState('');      // DD/MM/YYYY
  const [selectedDateType, setSelectedDateType] = useState<'from' | 'to' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('chuyến nhận');
  const [editTripItem, setEditTripItem] = useState<any | null>(null);

  const toggleFilter = (type: string) => setSelectedType(type);

  // ✅ Ref để tránh stale closure trong loadTrips
  const fromDateRef = useRef(fromDate);
  const toDateRef   = useRef(toDate);
  const typeRef     = useRef(selectedType);

  useEffect(() => { fromDateRef.current = fromDate; }, [fromDate]);
  useEffect(() => { toDateRef.current   = toDate;   }, [toDate]);
  useEffect(() => { typeRef.current     = selectedType; }, [selectedType]);

  // ✅ Build params: start = startOfDay, end = endOfDay
  const buildParams = (from: string, to: string): FetchReceivedTripsParams => {
    const params: FetchReceivedTripsParams = {};
    if (from) params.start_date = moment(from, 'DD/MM/YYYY').startOf('day').unix();
    if (to)   params.end_date   = moment(to,   'DD/MM/YYYY').endOf('day').unix();
    return params;
  };

  const dispatchFetch = useCallback((type: string, params: FetchReceivedTripsParams) => {
    console.log('FETCH:', type, params);
    if (type === 'chuyến nhận') return dispatch(fetchReceivedTrips(params));
    if (type === 'chuyến bán')  return dispatch(fetchSoldTrips(params));
    return dispatch(fetchMyTrips(params));
  }, [dispatch]);

  // Load khi đổi tab
  useEffect(() => {
    dispatchFetch(selectedType, buildParams(fromDateRef.current, toDateRef.current));
  }, [selectedType, updateTrips]);

  // ✅ Load ngay khi chọn xong ngày (fromDate hoặc toDate thay đổi)
  useEffect(() => {
    if (fromDate || toDate) {
      dispatchFetch(typeRef.current, buildParams(fromDate, toDate));
    }
  }, [fromDate, toDate]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setFromDate('');
    setToDate('');
    setErrorMessage('');
    await dispatchFetch(typeRef.current, {});
    setRefreshing(false);
  }, [dispatchFetch]);

  const handleConfirmDate = useCallback((selectedDate: Date) => {
    const formatted = moment(selectedDate).format('DD/MM/YYYY');
    const selected  = moment(selectedDate);

    if (selectedDateType === 'from') {
      if (toDate) {
        const toMoment = moment(toDate, 'DD/MM/YYYY');
        if (toMoment.isValid() && selected.isAfter(toMoment, 'day')) {
          setErrorMessage('Ngày bắt đầu không thể sau ngày kết thúc.');
          setIsDatePickerVisible(false);
          setSelectedDateType(null);
          return;
        }
      }
      setFromDate(formatted);
      setErrorMessage('');
    } else {
      if (fromDate) {
        const fromMoment = moment(fromDate, 'DD/MM/YYYY');
        if (fromMoment.isValid() && selected.isBefore(fromMoment, 'day')) {
          setErrorMessage('Ngày kết thúc không thể trước ngày bắt đầu.');
          setIsDatePickerVisible(false);
          setSelectedDateType(null);
          return;
        }
      }
      setToDate(formatted);
      setErrorMessage('');
    }

    setIsDatePickerVisible(false);
    setSelectedDateType(null);
  }, [selectedDateType, fromDate, toDate]);

  const renderItem = useCallback(({ item }: { item: Trip }) => (
    <TripHistory
      data={item}
      onEdit={
        selectedType === 'chuyến của tôi'
          ? (trip: any) => setEditTripItem(trip)
          : undefined
      }
    />
  ), [selectedType]);

  const renderEmpty = useCallback(() => {
    if (loading && !refreshing) {
      return <AppView paddingTop={32} alignItems="center"><ActivityIndicator /></AppView>;
    }
    return <AppView paddingTop={32} alignItems="center"><AppText title="Không có dữ liệu" /></AppView>;
  }, [loading, refreshing]);

  const currentData =
    selectedType === 'chuyến nhận' ? receivedTrips :
    selectedType === 'chuyến bán'  ? soldTrips :
    myTrips;

  return (
    <AppView flex={1} backgroundColor="#fff" padding={16} position="relative" gap={8}>
      {!!error && (
        <AppView paddingBottom={8}>
          <AppText color="red">{error}</AppText>
        </AppView>
      )}

      {/* ── Bộ lọc ngày ── */}
      <AppView row justifyContent="space-between" gap={12}>
        <AppButton flex={1} onPress={() => { setSelectedDateType('from'); setIsDatePickerVisible(true); }}>
          <AppInput
            keyboardType="numeric"
            maxLength={10}
            editable={false}
            value={fromDate}
            onChangeText={setFromDate}
            label="Từ ngày"
            placeholder="Chọn ngày"
            type="calendar"
            onCalendarPress={() => { setSelectedDateType('from'); setIsDatePickerVisible(true); }}
          />
        </AppButton>

        <AppButton flex={1} onPress={() => { setSelectedDateType('to'); setIsDatePickerVisible(true); }}>
          <AppInput
            keyboardType="numeric"
            maxLength={10}
            editable={false}
            value={toDate}
            onChangeText={setToDate}
            label="Đến ngày"
            placeholder="Chọn ngày"
            type="calendar"
            onCalendarPress={() => { setSelectedDateType('to'); setIsDatePickerVisible(true); }}
          />
        </AppButton>
      </AppView>

      {!!errorMessage && (
        <AppText fontStyle="italic" fontSize={14} style={{ color: 'red', marginBottom: 8 }}>
          {'! ' + errorMessage}
        </AppText>
      )}
<AppView>
      {/* ── Tab lọc loại ── */}
      <TypeFilterBar
        types={TYPES}
        selectedType={selectedType}
        toggleFilter={toggleFilter}
        loading={loading && !refreshing}
      />
</AppView>
      {/* ── Danh sách ── */}
      <AppView flex={1}>
        <FlatList
          data={currentData}
          keyExtractor={(item, index) => {
            const id = item.id_trip ?? (item as any).id;
            return id ? `${id}_${index}` : String(index);
          }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <AppView height={scale(16)} />}
          removeClippedSubviews
          windowSize={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={renderEmpty}
        />
      </AppView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => { setIsDatePickerVisible(false); setSelectedDateType(null); }}
      />

      <ModalEditTrip
        visible={!!editTripItem}
        onRequestClose={() => setEditTripItem(null)}
        trip={editTripItem}
      />
    </AppView>
  );
}