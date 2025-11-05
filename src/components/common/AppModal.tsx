import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { _screen_height } from '../../utils/Helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';

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
  const insets = useSafeAreaInsets(); 
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      propagateSwipe
      style={[styles.modal]}
    >
      <View
        style={[
          styles.modalContent,
          { height: _screen_height * heightPercent ,
            paddingBottom: insets.bottom
           },
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
    margin:0,
      paddingBottom: 0, 
  },
  modalContent: {
    backgroundColor:ColorsGlobal.backgroundWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    gap: 16,
    margin:0,
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
