import React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import AppModal from '../../common/AppModal';
import AppText from '../../common/AppText';
import { DRIVER_STATUS, DRIVER_STATUS_LABELS } from '../../../utils/Helper';


interface ModalSelectStatusProps {
  isVisible: boolean;
  onClose: () => void;
  selectedStatus: number;
  onSelect: (statusId: number) => void;
}

const statusOptions = Object.values(DRIVER_STATUS); // [1, 0]

export default function ModalSelectStatus({ isVisible, onClose, selectedStatus, onSelect }: ModalSelectStatusProps) {
  return (
    <AppModal isVisible={isVisible} onClose={onClose} heightPercent={0.3}>
      <FlatList
        data={statusOptions}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: item === selectedStatus ? '#eee' : '#fff',
            }}
            onPress={() => {
              onSelect(item);
              onClose();
            }}
          >
            <AppText>{DRIVER_STATUS_LABELS[item]}</AppText>
          </TouchableOpacity>
        )}
      />
    </AppModal>
  );
}
