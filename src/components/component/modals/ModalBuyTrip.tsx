import { Modal, ScrollView, StyleSheet } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
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
import moment from 'moment-timezone';
interface ModalBuyTripProps {
  visible?: boolean;
  onRequestClose?: () => void;
  onApplyFilter?: (
    filters: any,
    dateFilter?: string | null,
    placeStart?: string,
    placeEnd?: string) => void;
}

export default function ModalBuyTrip({ visible, onRequestClose, onApplyFilter }: ModalBuyTripProps) {
  const [selectedDirection, setSelectedDirection] = useState<'all' | 'go' | 'back'>('all');
  const [selectedTime, setSelectedTime] = useState<
    'now' | 'today' | 'tomorrow' | 'custom' | null
  >(null);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [placeStart, setPlaceStart] = useState('');
  const [placeEnd, setPlaceEnd] = useState('');

  const dateValue = useMemo(() => {
    const vietnamNow = moment().tz('Asia/Ho_Chi_Minh');

    switch (selectedTime) {
      case 'now':
        const nowPlus15 = vietnamNow.clone().add(15, 'minutes');
        const endOfToday = vietnamNow.clone().endOf('day');
        return {
          start: nowPlus15.toDate(),
          end: endOfToday.toDate()
        };

      case 'today':
        return {
          start: vietnamNow.clone().startOf('day').toDate(),
          end: vietnamNow.clone().endOf('day').toDate()
        };

      case 'tomorrow':
        const tomorrow = vietnamNow.clone().add(1, 'day');
        return {
          start: tomorrow.clone().startOf('day').toDate(),
          end: tomorrow.clone().endOf('day').toDate()
        };

      case 'custom':
        if (customDate) {
          const customMoment = moment(customDate).tz('Asia/Ho_Chi_Minh');
          return {
            start: customMoment.clone().startOf('day').toDate(),
            end: customMoment.clone().endOf('day').toDate()
          };
        }
        return null;

      default:
        return null;
    }
  }, [selectedTime, customDate]);
  const resetFilter = () => {
    setSelectedDirection("all");
    setSelectedTime(null);
    setCustomDate(null);
    setPlaceStart("");
    setPlaceEnd("");
  };

  const handleOk = () => {
    const payload: any = {
      ...(selectedDirection !== 'all' && {
        direction: selectedDirection === 'go' ? 1 : 0
      }),
      ...(selectedTime && { time: selectedTime }),
      ...(placeStart && { place_start: placeStart }),
      ...(placeEnd && { place_end: placeEnd }),
    };
    console.log('handleApplyFilter selectedTime: ', selectedTime)



    let dateFilter = null;

    if (dateValue && "start" in dateValue) {
      dateFilter = {
        start_date: Math.floor(dateValue.start.getTime() / 1000),
        end_date: Math.floor(dateValue.end.getTime() / 1000)
      };
    }

    onApplyFilter?.(
      payload,
      dateFilter,
      placeStart,
      placeEnd
    );



    resetFilter()
    onRequestClose?.();
  };
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

          <AppButton alignItems="flex-end" onPress={onRequestClose}>
            <IconClose />
          </AppButton>


          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >

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
                <AppButton onPress={() => setSelectedTime(prev => prev === 'now' ? null : 'now')}
                  row justifyContent="space-between" paddingVertical={12}>
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

      
          <ButtonSubmit title="OK" onPress={handleOk} />
        </AppView>
      </AppView>
    </Modal>
  )
}