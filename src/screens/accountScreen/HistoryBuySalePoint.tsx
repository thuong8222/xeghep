import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import AppView from '../../components/common/AppView';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import { scale } from 'react-native-size-matters';
import AppText from '../../components/common/AppText';
import { FlatList } from 'react-native-gesture-handler';
import { historyBuySalePoint, listHistoryTrips } from '../../dataDemoJson';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TripHistory from '../../components/component/TripHistory';
import Point from '../../components/component/Point';
import IconFilterRight from '../../assets/icons/IconFilterRight';
import PointHistory from '../../components/component/PointHistory';
import QuickNoteButton from '../../components/component/QuickNoteButton';
import { CONSTANT } from '../../utils/Helper';
import TypeFilterBar from '../../components/component/TypeFilterBar';

export default function HistoryBuySalePoint() {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDateType, setSelectedDateType] = useState<'from' | 'to' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const renderItem_trip = ({ item }) => {
    return <PointHistory data={item} />;
  };

  // ✅ Hàm chuyển đổi dd/mm/yyyy sang Date object
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // ✅ Hàm format Date thành dd/mm/yyyy
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ✅ Xử lý khi chọn ngày
  const handleConfirmDate = (selectedDate: Date) => {
    const formattedDate = formatDate(selectedDate);

    if (selectedDateType === 'from') {
      // Kiểm tra nếu "Từ ngày" > "Đến ngày" (khi đã có toDate)
      if (toDate) {
        const toDateObj = parseDate(toDate);
        if (toDateObj && selectedDate > toDateObj) {
          setErrorMessage('Ngày bắt đầu không thể sau ngày kết thúc.');
          closeDatePicker()
          return;
        }
      }

      setFromDate(formattedDate);
      setErrorMessage('');


    } else if (selectedDateType === 'to') {
      // Kiểm tra nếu "Đến ngày" < "Từ ngày" (khi đã có fromDate)
      if (fromDate) {
        const fromDateObj = parseDate(fromDate);
        if (fromDateObj && selectedDate < fromDateObj) {
          setErrorMessage('Ngày kết thúc không thể trước ngày bắt đầu.');
          closeDatePicker()
          return;
        }
      }

      setToDate(formattedDate);
      setErrorMessage('');

    }

    setIsDatePickerVisible(false);
    setSelectedDateType(null);
  };
  const openSelectFromDate = () => {
    console.log('openSelectFromDate')
    setSelectedDateType('from');
    setIsDatePickerVisible(true);
  }
  const openSelectFromTo = () => {
    console.log('openSelectFromDate')
    setSelectedDateType('to');
    setIsDatePickerVisible(true);
  }
  const closeDatePicker = () => {
    setIsDatePickerVisible(false);
    setSelectedDateType(null);
  };


  const types = [...new Set(historyBuySalePoint.map(item => item.type))];
  console.log(types);
  // Lọc dữ liệu theo selectedType
  const filteredHistory = useMemo(() => {
    if (!selectedType) return historyBuySalePoint;
    return historyBuySalePoint.filter((item) => item.type === selectedType);
  }, [selectedType, historyBuySalePoint]);

  const toggleFilter = (type: string) => {
    // Chọn lại cùng 1 type thì bỏ lọc
    setSelectedType((prev) => (prev === type ? null : type));
  };
  return (
    <AppView flex={1} backgroundColor='#fff' padding={16} position='relative' gap={12}>
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
      <AppView>
        <TypeFilterBar
          types={types}
          selectedType={selectedType}
          toggleFilter={(type) => setSelectedType(prev => (prev === type ? null : type))}
        />
      </AppView>

      <AppView flex={1}>
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem_trip}
          ItemSeparatorComponent={() => <AppView height={scale(6)} />}
        />
      </AppView>


      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setIsDatePickerVisible(false)}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({})