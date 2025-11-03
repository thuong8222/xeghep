import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { _screen_height } from '../../utils/Helper';

interface AppModalProps {
  isVisible: boolean;
  onClose: () => void;
  heightPercent?: number; // cho phép custom chiều cao
  children?: React.ReactNode; // ✅ phần nội dung tuỳ ý
}

export default function AppModal({
  isVisible,
  onClose,
  heightPercent = 0.8,
  children,
}: AppModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      propagateSwipe
      style={styles.modal}
    >
      <View
        style={[
          styles.modalContent,
          { height: _screen_height * heightPercent },
        ]}
      >
        <View style={styles.handleBar} />
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    gap: 16,
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
