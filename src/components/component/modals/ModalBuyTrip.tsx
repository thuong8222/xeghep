import { Modal, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../common/AppView'
import { ColorsGlobal } from '../../base/Colors/ColorsGlobal'
import AppButton from '../../common/AppButton'
import AppText from '../../common/AppText'
import IconTick from '../../../assets/icons/IconTick'
import IconClose from '../../../assets/icons/IconClose'
import IconArowDown from '../../../assets/icons/IconArowDown'
import DateTimeFilter from '../DateTimeFilter'
import ButtonSubmit from '../../common/ButtonSubmit'
import AppInput from '../../common/AppInput'

interface ModalBuyTripProps {
  visible?: boolean;
  onRequestClose?: () => void;
  onApplyFilter?: (filters: any, customDate?: Date | null) => void; // ✅ Thêm customDate parameter
}

export default function ModalBuyTrip({ visible, onRequestClose, onApplyFilter }: ModalBuyTripProps) {
  const [selectedDirection, setSelectedDirection] = useState<'all' | 'go' | 'back'>('all');
  const [selectedTime, setSelectedTime] = useState<'now' | 'today' | 'tomorrow' | 'custom'>('now');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [placeStart, setPlaceStart] = useState('');
  const [placeEnd, setPlaceEnd] = useState('');

  const handleOk = () => {
    const payload: any = {
      // Chỉ thêm nếu người dùng chọn
      ...(selectedDirection !== 'all' && { direction: selectedDirection === 'go' ? 1 : 0 }),
      time: selectedTime, // ✅ Chỉ truyền selectedTime, không truyền customDate vào đây
      ...(placeStart && { place_start: placeStart }),
      ...(placeEnd && { place_end: placeEnd }),
    };

    // ✅ Truyền customDate như tham số thứ 2
    onApplyFilter?.(payload, selectedTime === 'custom' ? customDate : null);
    onRequestClose?.();
  };

  console.log('customDate: ', customDate)
  
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <AppView
        flex={1}
        backgroundColor="#00000050"
        justifyContent="center"
        alignItems="center"
      >
        <AppView
          width="90%"
          maxHeight="85%"
          backgroundColor="#fff"
          radius={12}
          padding={16}
        >
          {/* Đóng modal */}
          <AppButton alignItems="flex-end" onPress={onRequestClose}>
            <IconClose />
          </AppButton>

          {/* Cuộn nội dung */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* Hướng di chuyển */}
            <AppView>
              <AppView
                paddingVertical={12}
                paddingHorizontal={10}
                borderBottomWidth={1}
                borderBottomColor={ColorsGlobal.borderColor}
              >
                <AppText color={ColorsGlobal.main} fontWeight={700}>
                  {'Hướng di chuyển'}
                </AppText>
              </AppView>

              <AppView paddingHorizontal={10}>
                <AppButton onPress={() => setSelectedDirection('all')} row justifyContent="space-between" paddingVertical={12}>
                  <AppText color={ColorsGlobal.textDark} fontWeight={500}>Tất cả</AppText>
                  {selectedDirection === 'all' && <IconTick />}
                </AppButton>

                <AppButton onPress={() => setSelectedDirection('go')} row justifyContent="space-between" paddingVertical={12}>
                  <AppText color={ColorsGlobal.textDark} fontWeight={500}>Chiều đi</AppText>
                  {selectedDirection === 'go' && <IconTick />}
                </AppButton>

                <AppButton onPress={() => setSelectedDirection('back')} row justifyContent="space-between" paddingVertical={12}>
                  <AppText color={ColorsGlobal.textDark} fontWeight={500}>Chiều về</AppText>
                  {selectedDirection === 'back' && <IconTick />}
                </AppButton>
              </AppView>
            </AppView>

            {/* Thời gian */}
            <AppView marginTop={16}>
              <AppView
                paddingVertical={12}
                paddingHorizontal={10}
                borderBottomWidth={1}
                borderBottomColor={ColorsGlobal.borderColor}
              >
                <AppText color={ColorsGlobal.main} fontWeight={700}>
                  {'Thời gian'}
                </AppText>
              </AppView>

              <AppView paddingHorizontal={10}>
                <AppButton onPress={() => setSelectedTime('now')} row justifyContent="space-between" paddingVertical={12}>
                  <AppText color={ColorsGlobal.textDark} fontWeight={500}>Đi ngay</AppText>
                  {selectedTime === 'now' && <IconTick />}
                </AppButton>

                <AppButton onPress={() => setSelectedTime('today')} row justifyContent="space-between" paddingVertical={12}>
                  <AppText color={ColorsGlobal.textDark} fontWeight={500}>Hôm nay</AppText>
                  {selectedTime === 'today' && <IconTick />}
                </AppButton>

                <AppButton onPress={() => setSelectedTime('tomorrow')} row justifyContent="space-between" paddingVertical={12}>
                  <AppText color={ColorsGlobal.textDark} fontWeight={500}>Ngày mai</AppText>
                  {selectedTime === 'tomorrow' && <IconTick />}
                </AppButton>

                <AppButton onPress={() => setSelectedTime('custom')} row justifyContent="space-between" paddingVertical={12}>
                  <AppText color={ColorsGlobal.textDark} fontWeight={500}>Chọn theo ngày</AppText>
                  <IconArowDown />
                </AppButton>
              </AppView>

              {selectedTime === 'custom' && (
                <DateTimeFilter
                  value={customDate}
                  onChange={setCustomDate}
                />
              )}

              <AppView>
                <AppInput value={placeStart} onChangeText={(text) => setPlaceStart(text)} type={'select'} placeholder='Điểm đón' />
                <AppInput value={placeEnd} onChangeText={(text) => setPlaceEnd(text)} type={'select'} placeholder='Điểm trả' />
              </AppView>
            </AppView>
          </ScrollView>

          {/* Nút OK */}
          <ButtonSubmit title="OK" onPress={handleOk} />
        </AppView>
      </AppView>
    </Modal>
  )
}