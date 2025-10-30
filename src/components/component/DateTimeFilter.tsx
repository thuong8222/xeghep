import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import IconCalendar from '../../assets/icons/IconCalendar';
import IconClock from '../../assets/icons/IconClock';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import AppButton from '../common/AppButton';


const DateTimeFilter = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const handleConfirmDate = (selectedDate: Date) => {
    setDate(selectedDate);
    setDatePickerVisible(false);
  };

  const handleConfirmTime = (selectedTime: Date) => {
    setTime(selectedTime);
    setTimePickerVisible(false);
  };

  return (
    <View style={styles.container}>
    

      <View style={styles.row}>
        {/* Ô chọn ngày */}
        <AppButton
          style={styles.inputBox}
          onPress={() => setDatePickerVisible(true)}>
          <AppText style={styles.text}>{date ? date.toLocaleDateString() : 'Ngày'}</AppText>
          <IconCalendar/>
        </AppButton>

        {/* Ô chọn giờ */}
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setTimePickerVisible(true)}>
          <AppText >
            {time
              ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Thời gian'}
          </AppText>
          <IconClock />
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
      />

      {/* Time Picker */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisible(false)}
      />
    </View>
  );
};

export default DateTimeFilter;

const styles = StyleSheet.create({

  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorsGlobal.borderColor,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
});
