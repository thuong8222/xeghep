import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import IconCalendar from '../../assets/icons/IconCalendar';
import IconClock from '../../assets/icons/IconClock';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import AppButton from '../common/AppButton';

interface DateTimeFilterProps {
  value: Date | null;
  onChange: (date: Date) => void;
  // Optional: Allow partial updates
  requireBoth?: boolean; // If true, only calls onChange when both date and time are set
}

const DateTimeFilter = ({ value, onChange, requireBoth = true }: DateTimeFilterProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  useEffect(() => {
    if (value) {
      setDate(value);
      setTime(value);
    }
  }, [value]);

  const combineDateTime = (dateValue: Date, timeValue: Date): Date => {
    return new Date(
      dateValue.getFullYear(),
      dateValue.getMonth(),
      dateValue.getDate(),
      timeValue.getHours(),
      timeValue.getMinutes()
    );
  };

  const handleConfirmDate = (selectedDate: Date) => {
    console.log('selectedDate:', selectedDate.toString());
    setDate(selectedDate);
    setDatePickerVisible(false);

    if (time) {
      const combined = combineDateTime(selectedDate, time);
      console.log('combined handleConfirmDate:', combined);
      onChange(combined);
    } else if (!requireBoth) {
      // Use current time as default if requireBoth is false
      const combined = combineDateTime(selectedDate, new Date());
      onChange(combined);
    }
  };

  const handleConfirmTime = (selectedTime: Date) => {
    console.log('selectedTime:', selectedTime.toString());
    setTime(selectedTime);
    setTimePickerVisible(false);

    if (date) {
      const combined = combineDateTime(date, selectedTime);
      console.log('combined handleConfirmTime:', combined);
      onChange(combined);
    } else if (!requireBoth) {
      // Use today's date as default if requireBoth is false
      const combined = combineDateTime(new Date(), selectedTime);
      onChange(combined);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Date Picker Button */}
        <AppButton
          style={styles.inputBox}
          onPress={() => setDatePickerVisible(true)}>
          <AppText style={styles.text}>
            {date ? date.toLocaleDateString() : 'Ngày'}
          </AppText>
          <IconCalendar />
        </AppButton>

        {/* Time Picker Button - Now using AppButton for consistency */}
        <AppButton
          style={styles.inputBox}
          onPress={() => setTimePickerVisible(true)}>
          <AppText style={styles.text}>
            {time
              ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Thời gian'}
          </AppText>
          <IconClock />
        </AppButton>
      </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
        date={date || new Date()}
      />

      {/* Time Picker Modal */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisible(false)}
        date={time || new Date()}
      />
    </View>
  );
};

export default DateTimeFilter;

const styles = StyleSheet.create({
  container: {
    // Added missing container style
  },
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