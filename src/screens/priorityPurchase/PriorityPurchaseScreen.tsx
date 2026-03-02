import { Alert, Platform, ScrollView, TextInput } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
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
import ModalSelectLocationByArea from '../../components/component/modals/ModalSelectLocationByArea';

import ModalSelectArea from '../../components/component/modals/ModalSelectArea';
import { useAppContext } from '../../context/AppContext';

export default function PriorityPurchaseScreen() {
    const route = useRoute();
    const { setCurrentArea } = useAppContext();
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

    const [selectedStartLocation, setSelectedStartLocation] = useState();
    const [selectedEndLocation, setSelectedEndLocation] = useState();
    const [isOpenModalSelectArea, setIsOpenModalSelectArea] = useState(true);
    const [selectedArea, setSelectedArea] = useState();
    const [pickupLocationIds, setPickupLocationIds] = useState<number[]>([]);
    const [pickupManualText, setPickupManualText] = useState('');
    const [dropoffManualText, setDropoffManualText] = useState('');
    const [dropoffLocationIds, setDropoffLocationIds] = useState<number[]>([]);
    useEffect(() => {
        if (editData) {
            setPlaceFrom(Array.isArray(editData.pickup_location_names) ? editData.pickup_location_names.join(' | ') : editData.pickup_location || '');
            setPlaceTo(Array.isArray(editData.dropoff_location_names) ? editData.dropoff_location_names.join(' | ') : editData.dropoff_location || '');
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
            setPrice(
                editData.desired_price
                    ? Number(editData.desired_price).toString()
                    : ''
            );
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
        if (!selectedArea?.id) {
            Alert.alert("Thiếu thông tin", "Vui lòng chọn khu vực.");
            return;
        }

        const payload = {
            area_id: selectedArea?.id,
            pickup_location: pickupLocationIds,        // ✅ đúng tên field backend nhận
            pickup_location_manual: pickupManualText,
            dropoff_location: dropoffLocationIds,      // ✅ đúng tên field backend nhận
            dropoff_location_manual: dropoffManualText,
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
            console.log('mua uu tien error: ', err);
            Alert.alert(
                "Lỗi",
                err?.message || (editData ? "Cập nhật thất bại" : "Gửi yêu cầu thất bại")
            );
        } finally {
            setSubmitting(false);
        }
    };
    const handleChangeDirection = (direction) => {
        if (direction !== selectedDirection) {

            setPlaceFrom(placeTo);
            setPlaceTo(placeFrom);

            // 🔥 ĐẢO ID
            setPickupLocationIds(dropoffLocationIds);
            setDropoffLocationIds(pickupLocationIds);

            // 🔥 ĐẢO MANUAL
            setPickupManualText(dropoffManualText);
            setDropoffManualText(pickupManualText);

            setSelectedDirection(direction);
        }
    };
    const openSelectArea = () => {
        setIsOpenModalSelectArea(!isOpenModalSelectArea);
    }
    const handleSelectArea = useCallback((area: any) => {
        setCurrentArea(area);
        setSelectedArea(area);

        // 🔥 reset location khi đổi khu vực
        setPickupLocationIds([]);
        setDropoffLocationIds([]);
        setPickupManualText('');
        setDropoffManualText('');
        setPlaceFrom('');
        setPlaceTo('');

        setIsOpenModalSelectArea(false);
    }, []);

    return (
        <ScrollView style={{ flex: 1, gap: 8, backgroundColor: "#fff" }} contentContainerStyle={{ flex: 1 }}>
            <AppView flex={1} backgroundColor="#fff" padding={16}>
                <AppButton onPress={openSelectArea}>
                    {selectedArea || editData ? <AppText color={ColorsGlobal.main} bold fontSize={18}>{`Khu vực: ${selectedArea?.name || editData.area_name}`}</AppText> :
                        <AppText bold fontSize={18}>{'Chọn nhóm bạn muốn mua ưu tiên'}</AppText>
                    }
                </AppButton>
                <ModalSelectArea isVisible={isOpenModalSelectArea} onClose={() => setIsOpenModalSelectArea(false)} onSelected={handleSelectArea} />
                <AppView row gap={32}>
                    <AppButton onPress={() => handleChangeDirection(1)} row gap={8} flex={1} paddingVertical={14}>
                        <AppText>{'Chiều đi'}</AppText>
                        {selectedDirection === 1 ? <IconTickCircle /> : <IconNoneTickCircle />}
                    </AppButton>
                    <AppButton onPress={() => handleChangeDirection(0)} row gap={8} flex={1} paddingVertical={14}>
                        <AppText>{'Chiều về'}</AppText>
                        {selectedDirection === 0 ? <IconTickCircle /> : <IconNoneTickCircle />}
                    </AppButton>
                </AppView>


                <AppView marginTop={8} >
                    <AppText bold marginBottom={4}>{'Điểm đón khu ' + (selectedArea?.level1_pickup_names || '')}</AppText>

                    <AppButton onPress={() => setIsCommuneWard(true)} radius={8} row gap={8}>
                        <TextInput
                            value={placeFrom}
                            multiline editable={false}
                            onChangeText={(text) => {
                                setPlaceFrom(text);
                                setPickupManualText(text); // nếu bạn tách manual
                            }}
                            placeholder='Nhấn để chọn địa chỉ' style={{ color: "#666", borderWidth: 1, borderRadius: 10, borderColor: ColorsGlobal.borderColor, flex: 1, paddingLeft: 10 }} />
                        <AppButton onPress={() => setIsCommuneWard(true)} borderColor={ColorsGlobal.borderColor} borderWidth={1} radius={10} alignItems='center' justifyContent='center' paddingHorizontal={10}>
                            <IconDotHorizonal />
                        </AppButton>
                    </AppButton>
                </AppView>

                <AppView marginTop={8}>

                    <AppText bold marginBottom={4}>Điểm trả khu {selectedArea?.level1_dropoff_names || ''}</AppText>
                    <AppButton onPress={() => setIsCommuneWardTo(true)} radius={8} row gap={8}>

                        <TextInput
                            value={placeTo}
                            multiline editable={false}
                            onChangeText={(text) => {
                                setPlaceTo(text);
                                setDropoffManualText(text); // nếu bạn tách manual
                            }}
                            placeholder='Nhấn để chọn địa chỉ' style={{ color: "#666", borderWidth: 1, borderRadius: 10, borderColor: ColorsGlobal.borderColor, flex: 1, paddingLeft: 10 }} />
                        <AppButton onPress={() => setIsCommuneWardTo(true)} borderColor={ColorsGlobal.borderColor} borderWidth={1} radius={10} alignItems='center' justifyContent='center' paddingHorizontal={10}>
                            <IconDotHorizonal />
                        </AppButton>
                    </AppButton>
                </AppView>

                <AppView row justifyContent={'space-between'} alignItems='center' gap={24} marginTop={8}>
                    <AppView flex={1}>
                        <AppInput value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                            label="Giá tối thiểu" placeholder="... K/chuyến" />
                    </AppView>
                </AppView>
                <AppView marginTop={8}>
                    <AppInput value={point} onChangeText={setPoint} label="Điểm trừ tối đa" placeholder="Nhập điểm trừ tối đa" keyboardType='numeric' />
                </AppView>


                {/* Thời gian */}
                <AppView paddingVertical={16} gap={8}>
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
                    radius={8} marginTop={16}
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


                <ModalSelectLocationByArea
                    multiSelect={true}
                    isVisible={isCommuneWard}
                    locationType={selectedDirection === 1 ? 'pickup' : 'dropoff'}
                    areaId={selectedArea?.id || editData?.area_id}
                    defaultSelected={selectedStartLocation}
                    onClose={() => setIsCommuneWard(false)}
                    onSelected={(value) => {
                        setSelectedStartLocation(value);
                        const ids = value.map((item: any) => item.id);
                        const names = value.map((item: any) => item.name);

                        setPickupLocationIds(ids);
                        setPlaceFrom(names.join(" | "));
                    }}
                />
                <ModalSelectLocationByArea
                    multiSelect={true}
                    isVisible={isCommuneWardTo}
                    locationType={selectedDirection === 1 ? 'dropoff' : 'pickup'}
                    areaId={selectedArea?.id || editData?.area_id}
                    defaultSelected={selectedEndLocation}
                    onClose={() => setIsCommuneWardTo(false)}
                    onSelected={(value) => {
                        setSelectedEndLocation(value);
                        const ids = value.map((item: any) => item.id);
                        const names = value.map((item: any) => item.name);
                        const locationNames = value.map((item: any) => item.name);
                        setDropoffLocationIds(ids);
                        setPlaceTo(locationNames.join(" | "));
                    }}
                />
            </AppView>
        </ScrollView>
    );
}