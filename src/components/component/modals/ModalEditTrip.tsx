import React, { useEffect, useState } from 'react';
import { Modal, Alert, Platform } from 'react-native';
import AppView from '../../common/AppView';
import AppText from '../../common/AppText';
import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';
import ButtonSubmit from '../../common/ButtonSubmit';
import { ColorsGlobal } from '../../base/Colors/ColorsGlobal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/data/store';
import { editTrip, resetEditTrip } from '../../../redux/slices/tripsSlice';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  trip: any | null;
};

export default function ModalEditTrip({ visible, onRequestClose, trip }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const { editTripLoading, editTripSuccess, editTripError } = useSelector(
    (state: RootState) => state.trips,
  );

  const [price, setPrice] = useState('');
  const [points, setPoints] = useState('');
  const [note, setNote] = useState('');
  const [guests, setGuests] = useState('');
  const [timeStartSec, setTimeStartSec] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Điền dữ liệu hiện tại vào form khi mở modal
  useEffect(() => {
    if (trip) {
      setPrice(String(trip?.price_sell ?? ''));
      setPoints(String(trip?.point ?? ''));
      setNote(String(trip?.note ?? ''));
      setGuests(String(trip?.guests ?? ''));

      const raw = trip?.time_start;
      if (typeof raw === 'number') {
        const sec = raw.toString().length > 10 ? Math.floor(raw / 1000) : raw;
        setTimeStartSec(sec);
      } else if (typeof raw === 'string' && /^\d+$/.test(raw)) {
        const num = Number(raw);
        const sec = raw.length > 10 ? Math.floor(num / 1000) : num;
        setTimeStartSec(sec);
      } else {
        const m = moment(raw);
        setTimeStartSec(m.isValid() ? Math.floor(m.valueOf() / 1000) : null);
      }
    } else {
      setPrice('');
      setPoints('');
      setNote('');
      setGuests('');
      setTimeStartSec(null);
    }
  }, [trip]);

  // Lắng nghe kết quả từ slice
  useEffect(() => {
    if (editTripSuccess) {
      Alert.alert('Thành công', 'Cập nhật chuyến thành công');
      dispatch(resetEditTrip());
      onRequestClose();
    }
    if (editTripError) {
      Alert.alert('Lỗi', editTripError);
      dispatch(resetEditTrip());
    }
  }, [editTripSuccess, editTripError]);

  const onSubmit = () => {
    if (!trip) return;

    const tripId = trip.id_trip ?? trip.id;
    if (!tripId) {
      Alert.alert('Lỗi', 'Thiếu mã chuyến để cập nhật');
      return;
    }

    dispatch(editTrip({
      tripId,
      ...(price   ? { price_sell: Number(price) }   : {}),
      ...(points  ? { point: Number(points) }        : {}),
      ...(guests  ? { guests: Number(guests) }       : {}),
      ...(note !== undefined ? { note }              : {}),
      ...(timeStartSec ? { time_start: timeStartSec } : {}),
    }));
  };

  const formattedTime = timeStartSec
    ? moment.unix(timeStartSec).format('DD/MM/YYYY HH:mm')
    : 'Chọn giờ xuất phát';

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onRequestClose}>
      <AppView flex={1} backgroundColor="#00000066" justifyContent="center" alignItems="center">
        <AppView width="92%" backgroundColor="#fff" radius={12} padding={16}>

          <AppView row justifyContent="space-between" alignItems="center" marginBottom={8}>
            <AppText fontWeight={700} fontSize={16}>{'Chỉnh sửa chuyến'}</AppText>
            <AppButton onPress={onRequestClose}>
              <AppText color={ColorsGlobal.main}>{'Đóng'}</AppText>
            </AppButton>
          </AppView>

          <AppView gap={12}>
            <AppButton onPress={() => setShowPicker(true)} borderWidth={1} padding={12} radius={8}>
              <AppView gap={4}>
                <AppText color={ColorsGlobal.textLight}>Giờ xuất phát</AppText>
                <AppText>{formattedTime}</AppText>
              </AppView>
            </AppButton>

            <AppInput
              keyboardType="numeric"
              value={guests}
              onChangeText={setGuests}
              label="Số khách"
              placeholder="Nhập số khách"
            />
            <AppInput
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              label="Giá (K)"
              placeholder="Nhập giá K"
            />
            <AppInput
              keyboardType="numeric"
              value={points}
              onChangeText={setPoints}
              label="Điểm"
              placeholder="Nhập điểm"
            />
            <AppInput
              value={note}
              onChangeText={setNote}
              label="Ghi chú"
              placeholder="Nhập ghi chú"
            />
          </AppView>

          <AppView marginTop={16}>
            <ButtonSubmit
              title="Lưu thay đổi"
              onPress={onSubmit}
              disabled={editTripLoading}
            />
          </AppView>

          <DateTimePickerModal
            isVisible={showPicker}
            mode="datetime"
            display={Platform.OS === 'android' ? 'spinner' : 'default'}
            onConfirm={date => {
              setShowPicker(false);
              setTimeStartSec(Math.floor(date.getTime() / 1000));
            }}
            onCancel={() => setShowPicker(false)}
          />

        </AppView>
      </AppView>
    </Modal>
  );
}