import { Alert, Platform, ScrollView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import AppView from '../../components/common/AppView';
import AppButton from '../../components/common/AppButton';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import AppText from '../../components/common/AppText';
import AppInput from '../../components/common/AppInput';
import DateTimePicker from 'react-native-modal-datetime-picker';
import SelectProvinceDistrictModal from '../../components/component/modals/ModalSelectWard';
import IconTickCircle from '../../assets/icons/IconTickCircle';
import IconNoneTickCircle from '../../assets/icons/IconNoneTickCircle';
import Container from '../../components/common/Container';
import { createAutoBuy, updateAutoBuy } from '../../redux/slices/requestAutoBuyTrip';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch } from '../../redux/hooks/useAppDispatch';
import { NumberFormat } from '../../utils/Helper';

export default function PriorityPurchaseScreen() {
    const route = useRoute();

    const { editData } = route?.params ?? {};
    console.log('route.params editData: ', editData)
    // nếu có thì là màn edit
    const dispatch = useAppDispatch();

    const [placeFrom, setPlaceFrom] = useState('');
    const [placeTo, setPlaceTo] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [openPickerType, setOpenPickerType] = useState('');
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [isCommuneWard, setIsCommuneWard] = useState(false);
    const [isCommuneWardTo, setIsCommuneWardTo] = useState(false);
    const [point, setPoint] = useState('');
    const [price, setPrice] = useState('');
    const [selectedDirection, setSelectedDirection] = useState(1);

    useEffect(() => {
        if (editData) {
            // Fill dữ liệu khi edit
            setPlaceFrom(Array.isArray(editData.pickup_location) ? editData.pickup_location.join(' | ') : editData.pickup_location || '');
            setPlaceTo(Array.isArray(editData.dropoff_location) ? editData.dropoff_location.join(' | ') : editData.dropoff_location || '');
            setStartTime(
                editData?.time_receive_start
                    ? new Date(editData.time_receive_start)
                    : null
            );
            setEndTime(
                editData?.time_receive_end
                    ? new Date(editData.time_receive_end)
                    : null
            );
            setPoint(editData.maximum_point?.toString() || '');
            setPrice(editData.desired_price?.toString() || '');
            setSelectedDirection(editData.direction === 'round_trip' ? 0 : 1);
        }
    }, [editData]);

    const formatTime = (date) => {
        if (!date || isNaN(date.getTime())) return '';
        return date.toLocaleString('vi-VN');
    };


    const onConfirmTime = (date) => {
        if (openPickerType === 'start') setStartTime(date);
        else setEndTime(date);
        setPickerVisible(false);
    };

    const convertToTimestamp = (date) => date ? Math.floor(new Date(date).getTime() / 1000) : null;

    const sendToBackend = () => {
        if (!placeFrom || !placeTo || !startTime || !endTime || !price || !point) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ dữ liệu.");
            return;
        }

        const payload = {
            pickup_location: placeFrom.split(" | "),
            dropoff_location: placeTo.split(" | "),
            time_receive_start: convertToTimestamp(startTime),
            time_receive_end: convertToTimestamp(endTime),
            desired_price: Number(price),
            maximum_point: Number(point),
            direction: selectedDirection,
        };
        console.log('updateAutoBuy payload: ', payload)
        if (editData) {
            // update
            dispatch(updateAutoBuy({ id: editData.id, data: payload }))
                .unwrap()
                .then(() => Alert.alert("Thành công", "Cập nhật thành công!"))
                .catch((err) => Alert.alert("Lỗi", err?.message || "Cập nhật thất bại"));
        } else {
            // create
            dispatch(createAutoBuy(payload))
                .unwrap()
                .then(() => Alert.alert("Thành công", "Tạo mới thành công!"))
                .catch((err) => Alert.alert("Lỗi", err?.message || "Gửi yêu cầu thất bại"));
        }
    };

    return (
        <ScrollView style={{ flex: 1, gap: 8, backgroundColor: "#fff" }} contentContainerStyle={{ flex: 1 }}>
            <AppView flex={1} backgroundColor="#fff" padding={16} gap={24}>
                {/* Chọn chiều đi/chiều về */}
                <AppView row gap={32}>
                    <AppButton onPress={() => setSelectedDirection(1)} row gap={8}>
                        <AppText>{'Chiều đi'}</AppText>
                        {selectedDirection === 1 ? <IconTickCircle /> : <IconNoneTickCircle />}
                    </AppButton>
                    <AppButton onPress={() => setSelectedDirection(0)} row gap={8}>
                        <AppText>{'Chiều về'}</AppText>
                        {selectedDirection === 0 ? <IconTickCircle /> : <IconNoneTickCircle />}
                    </AppButton>
                </AppView>

                {/* Điểm đón */}
                <AppView>
                    <AppText bold marginBottom={4}>Điểm đón</AppText>
                    <AppButton onPress={() => setIsCommuneWard(true)} backgroundColor={ColorsGlobal.backgroundGray} padding={12} radius={8}>
                        <TextInput value={placeFrom} multiline onChangeText={(text)=>setPlaceFrom(text)} placeholder='Nhấn để chọn địa chỉ' style={{color:"#666"}} />
                    </AppButton>
                </AppView>

                {/* Điểm trả */}
                <AppView>
                    <AppText bold marginBottom={4}>Điểm trả</AppText>
                    <AppButton onPress={() => setIsCommuneWardTo(true)} backgroundColor={ColorsGlobal.backgroundGray} padding={12} radius={8}>
                    <TextInput value={placeTo} multiline onChangeText={(text)=>setPlaceTo(text)} placeholder='Nhấn để chọn địa chỉ' style={{color:"#666"}}  />
                    </AppButton>
                </AppView>

                {/* Giá & điểm */}
                <AppView row justifyContent={'space-between'} alignItems='center' gap={24}>
                    <AppView flex={1}>
                        <AppInput value={(parseInt(price))} onChangeText={setPrice} label="Giá tối thiểu" placeholder="...K/chuyến" keyboardType='numeric' />
                    </AppView>
                </AppView>
                <AppInput value={point} onChangeText={setPoint} label="Điểm trừ tối đa" placeholder="Nhập điểm trừ tối đa" keyboardType='numeric' />

                {/* Thời gian */}
                <AppView paddingTop={12} gap={8}>
                    <AppText bold>{'Khoảng thời gian có thể mua được:'}</AppText>
                    <AppView row justifyContent={'space-around'}>
                        <AppButton gap={8} alignItems='center' backgroundColor={ColorsGlobal.backgroundGray} padding={8} radius={10} onPress={() => { setOpenPickerType('start'); setPickerVisible(true); }}>
                            <AppText fontSize={14} color={ColorsGlobal.textLight}>Thời gian từ: </AppText>
                            <AppText>{formatTime(startTime) || 'Chọn thời gian'}</AppText>
                        </AppButton>
                        <AppButton gap={8} alignItems='center' backgroundColor={ColorsGlobal.backgroundGray} padding={8} radius={10} onPress={() => { setOpenPickerType('end'); setPickerVisible(true); }}>
                            <AppText fontSize={14} color={ColorsGlobal.textLight}>Thời gian kết thúc: </AppText>
                            <AppText>{formatTime(endTime) || 'Chọn thời gian'}</AppText>
                        </AppButton>
                    </AppView>
                </AppView>

                {/* Gửi */}
                <AppButton onPress={sendToBackend} backgroundColor={ColorsGlobal.main} paddingVertical={12} radius={8}>
                    <AppText color="white" fontWeight={700} textAlign="center">
                        {editData ? "Cập nhật yêu cầu" : "Gửi yêu cầu"}
                    </AppText>
                </AppButton>

                {/* DateTime Picker */}
                <DateTimePicker isVisible={isPickerVisible} mode="datetime" onConfirm={onConfirmTime} onCancel={() => setPickerVisible(false)} />

                {/* Modal chọn xã/phường - THAY THẾ địa chỉ cũ */}
                <SelectProvinceDistrictModal
                    isVisible={isCommuneWard}
                    onClose={() => setIsCommuneWard(false)}
                    onSelected={(value) => {
                        // ✅ Thay thế hoàn toàn thay vì nối thêm
                        const list = value.districts.map(d => `${value.province.name} - ${d.name}`).join(' | ');
                        setPlaceFrom(list);
                        setIsCommuneWard(false);
                    }}
                />
                <SelectProvinceDistrictModal
                    isVisible={isCommuneWardTo}
                    onClose={() => setIsCommuneWardTo(false)}
                    onSelected={(value) => {
                        // ✅ Thay thế hoàn toàn thay vì nối thêm
                        const list = value.districts.map(d => `${value.province.name} - ${d.name}`).join(' | ');
                        setPlaceTo(list);
                        setIsCommuneWardTo(false);
                    }}
                />
            </AppView>
        </ScrollView>
    );
}