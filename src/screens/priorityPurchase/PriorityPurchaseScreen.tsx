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
import { createAutoBuy, fetchAutoBuyList, updateAutoBuy } from '../../redux/slices/requestAutoBuyTrip';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch } from '../../redux/hooks/useAppDispatch';
import { NumberFormat } from '../../utils/Helper';
import IconDotHorizonal from '../../assets/icons/IconDotHorizonal';

export default function PriorityPurchaseScreen() {
    const route = useRoute();
    const { editData } = route?.params ?? {};


    const dispatch = useAppDispatch();
    const navigation = useNavigation();
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
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editData) {
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

    const sendToBackend = async () => {
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

        try {
            setSubmitting(true); // 🔥 BẬT LOADING

            if (editData) {
                await dispatch(updateAutoBuy({ id: editData.id, data: payload })).unwrap();
                await dispatch(fetchAutoBuyList());

                Alert.alert(
                    "Thành công",
                    "Cập nhật thành công!",
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            } else {
                await dispatch(createAutoBuy(payload)).unwrap();
                await dispatch(fetchAutoBuyList());

                Alert.alert(
                    "Thành công",
                    "Tạo mới thành công!",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                navigation.getParent()?.setParams({ refresh: Date.now() });
                                navigation.goBack();
                            }
                        }
                    ]
                );
            }
        } catch (err: any) {
            Alert.alert(
                "Lỗi",
                err?.message || (editData ? "Cập nhật thất bại" : "Gửi yêu cầu thất bại")
            );
        } finally {
            setSubmitting(false); 
        }
    };

    return (
        <ScrollView style={{ flex: 1, gap: 8, backgroundColor: "#fff" }} contentContainerStyle={{ flex: 1 }}>
            <AppView flex={1} backgroundColor="#fff" padding={16} gap={24}>
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


                <AppButton onPress={() => setIsCommuneWard(true)}>
                    <AppText bold marginBottom={4}>Điểm đón</AppText>
                    <AppButton onPress={() => setIsCommuneWard(true)} radius={8} row gap={8}>
                        <TextInput value={placeFrom} multiline onChangeText={(text) => setPlaceFrom(text)} placeholder='Nhấn để chọn địa chỉ' style={{ color: "#666", borderWidth: 1, borderRadius: 10, borderColor: ColorsGlobal.borderColor, flex: 1, paddingLeft: 10 }} />
                        <AppButton onPress={() => setIsCommuneWard(true)} borderColor={ColorsGlobal.borderColor} borderWidth={1} radius={10} alignItems='center' justifyContent='center' paddingHorizontal={10}>
                            <IconDotHorizonal />
                        </AppButton>
                    </AppButton>
                </AppButton>



                <AppButton onPress={() => setIsCommuneWardTo(true)} radius={8} row gap={8}>
                    <TextInput value={placeTo} multiline onChangeText={(text) => setPlaceTo(text)} placeholder='Nhấn để chọn địa chỉ' style={{ color: "#666", borderWidth: 1, borderRadius: 10, borderColor: ColorsGlobal.borderColor, flex: 1, paddingLeft: 10 }} />
                    <AppButton onPress={() => setIsCommuneWardTo(true)} borderColor={ColorsGlobal.borderColor} borderWidth={1} radius={10} alignItems='center' justifyContent='center' paddingHorizontal={10}>
                        <IconDotHorizonal />
                    </AppButton>
                </AppButton>


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


                <AppButton
                    onPress={sendToBackend}
                    disabled={submitting}
                    backgroundColor={ColorsGlobal.main}
                    paddingVertical={12}
                    radius={8}
                >
                    <AppText color="white" fontWeight={700} textAlign="center">
                        {submitting
                            ? 'Đang xử lý...'
                            : editData
                                ? 'Cập nhật yêu cầu'
                                : 'Gửi yêu cầu'}
                    </AppText>
                </AppButton>


                <DateTimePicker isVisible={isPickerVisible} mode="datetime" onConfirm={onConfirmTime} onCancel={() => setPickerVisible(false)} />


                <SelectProvinceDistrictModal
                    multiSelect={true}
                    isVisible={isCommuneWard}
                    onClose={() => setIsCommuneWard(false)}
                    onSelected={(value) => {

                        const list = value.districts.map(d => `${value.province.name} - ${d.name}`).join(' | ');
                        setPlaceFrom(list);
                        setIsCommuneWard(false);
                    }}
                />
                <SelectProvinceDistrictModal
                    multiSelect={true}
                    isVisible={isCommuneWardTo}
                    onClose={() => setIsCommuneWardTo(false)}
                    onSelected={(value) => {

                        const list = value.districts.map(d => `${value.province.name} - ${d.name}`).join(' | ');
                        setPlaceTo(list);
                        setIsCommuneWardTo(false);
                    }}
                />
            </AppView>
        </ScrollView>
    );
}