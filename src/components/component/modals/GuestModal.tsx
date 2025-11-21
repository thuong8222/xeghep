import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AppModal from '../../common/AppModal';
import AppText from '../../common/AppText';
import { ColorsGlobal } from '../../base/Colors/ColorsGlobal';
import AppView from '../../common/AppView';


interface GuestOption {
  label: string;
  value: number;
  type: 'normal' | 'car5' | 'car7' | 'car16' | 'car35' | 'car45';
}

interface GuestModalProps {
  isVisible: boolean;
  onClose: () => void;
  guestType: 'normal' | 'car5' | 'car7' | 'car16' | 'car35' | 'car45';
  numGuests: number;
  setGuestType: React.Dispatch<React.SetStateAction<'normal' | 'car5' | 'car7' | 'car16' | 'car35' | 'car45'>>;
  setNumGuests: React.Dispatch<React.SetStateAction<number>>;
}

export default function GuestModal({
  isVisible,
  onClose,
  guestType,
  numGuests,
  setGuestType,
  setNumGuests,
}: GuestModalProps) {
  const guestOptions: GuestOption[] = [
    { label: '1 khách', value: 1, type: 'normal' },
    { label: '2 khách', value: 2, type: 'normal' },
    { label: '3 khách', value: 3, type: 'normal' },
    { label: '4 khách', value: 4, type: 'normal' },
    { label: '5 khách', value: 5, type: 'normal' },
    { label: '6 khách', value: 6, type: 'normal' },
    { label: 'Bao xe 5 chỗ', value: 7, type: 'car5' },
    { label: 'Bao xe 7 chỗ', value: 8, type: 'car7' },
    { label: 'Bao xe 16 chỗ', value: 8, type: 'car16' },
    { label: 'Bao xe 35 chỗ', value: 8, type: 'car35' },
    { label: 'Bao xe 45 chỗ', value: 8, type: 'car45' },
  ];

  const handleSelect = (item: GuestOption) => {
    if (item.type === 'normal') {
      setGuestType('normal');
      setNumGuests(item.value);
    } else {
      setGuestType(item.type);
    }
    onClose();
  };

  return (
    <AppModal isVisible={isVisible} onClose={onClose} heightPercent={0.6}>
      <AppText fontWeight={700} style={styles.title}>
        Chọn số khách
      </AppText>

      <AppView>
    {guestOptions.map((item, index) => {
      const isSelected =
        (guestType === item.type && numGuests === item.value) ||
        (guestType === item.type && item.type !== 'normal');

      return (
        <React.Fragment key={item.type + '-' + item.value}>
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={styles.option}
          >
            <AppText
              style={[
                styles.optionText,
                isSelected && { color: ColorsGlobal.main, fontWeight: '700' },
              ]}
            >
              {item.label}
            </AppText>
          </TouchableOpacity>
          {/* Separator */}
          {index < guestOptions.length - 1 && (
            <AppView height={1} backgroundColor={ColorsGlobal.borderColor} />
          )}
        </React.Fragment>
      );
    })}
  </AppView>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  option: {
    paddingVertical: 12,

  },
  optionText: {
    textAlign: 'center',
    color: ColorsGlobal.textDark,
  },
});
