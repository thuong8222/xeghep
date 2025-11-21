import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppModal from '../../common/AppModal';
import AppText from '../../common/AppText';
import { ColorsGlobal } from '../../base/Colors/ColorsGlobal';
import AppView from '../../common/AppView';
import { CONSTANT } from '../../../utils/Helper';
import AppButton from '../../common/AppButton';


interface TypeCarModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (data: { type: string; name: string }) => void; // truyền lên cha
}

export default function ModalTypeCar({
  isVisible,
  onClose,
  onSelect,
}: TypeCarModalProps) {

  const handleSelect = (item: { key: string; name: string }) => {
    onSelect({
      type: item.key, // car5, car7,...
      name: item.name, // Xe 5 chỗ
    });

    onClose();
  };

  return (
    <AppModal isVisible={isVisible} onClose={onClose} heightPercent={0.6}>
      <AppText fontWeight={700} style={styles.title}>
        Chọn Loại xe
      </AppText>

      {CONSTANT.TYPE_CAR_LIST.map((item) => (
        <AppButton
          key={item.id}
          onPress={() => handleSelect(item)}
          style={styles.option}
        >
          <AppText style={styles.optionText}>{item.name}</AppText>
        </AppButton>
      ))}
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
    borderBottomWidth: 1,
    borderBottomColor: ColorsGlobal.borderColor,
  },
  optionText: {
    textAlign: 'center',
    color: ColorsGlobal.textDark,
  },
});
