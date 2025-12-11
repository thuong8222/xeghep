import { Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import AppView from '../../components/common/AppView';
import AppButton from '../../components/common/AppButton';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import AppText from '../../components/common/AppText';
import AppInput from '../../components/common/AppInput';
import AppModal from '../../components/common/AppModal';
import DateTimePicker from 'react-native-modal-datetime-picker';
import SelectProvinceDistrictModal from '../../components/component/modals/ModalSelectWard';
import IconTickCircle from '../../assets/icons/IconTickCircle';
import IconNoneTickCircle from '../../assets/icons/IconNoneTickCircle';
import Container from '../../components/common/Container';

export default function PriorityPurchaseScreen() {
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
    const formatTime = (date) => {
        if (!date) return '';
        return date.toLocaleString('vi-VN'); // => "10/12/2025, 14:30"
    };

    const onConfirmTime = (date) => {
        if (openPickerType === 'start') {
            setStartTime(date);
        } else {
            setEndTime(date);
        }
        setPickerVisible(false);
    };

    const sendToBackend = () => {
        const payload = {
            pickup_from: placeFrom,
            pickup_to: placeTo,
            time_start: startTime ? startTime.toISOString() : null,
            time_end: endTime ? endTime.toISOString() : null,
        };

        console.log("DATA SEND:", payload);

        // ---- CALL API ----
        // await api.post("/priority-purchase", payload);
    };
    const selectCommuneWard = () => {
        setIsCommuneWard(true); // mở modal chọn xã/phường
    };
    const selectCommuneWardTo = () => {
        setIsCommuneWardTo(true); // mở modal chọn xã/phường
    };

    return (
        <ScrollView style={{ flex: 1, gap: 8,backgroundColor:"#fff" }} contentContainerStyle={{flex:1}}>
            <AppView flex={1} backgroundColor="#fff" padding={16} gap={24}>
                <AppView gap={8} flex={1} >
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
                    <AppView gap={8} >
                        {/*  <AppInput
                    multiline
                        value={placeFrom}
                        onChangeText={setPlaceFrom}
                        label="Điểm đón"
                        placeholder="Nhập điểm đón / bấm chọn địa chỉ"
                        type='select'
                        toggleSelect={selectCommuneWardTo}
                    /> */}
                        {/* Điểm đón */}
                        <AppView>
                            <AppText bold marginBottom={4}>Điểm đón</AppText>

                            <AppButton
                                onPress={selectCommuneWard}
                                backgroundColor={ColorsGlobal.backgroundGray}
                                padding={12}
                                radius={8}
                            >
                                <AppText color="#666">
                                    {placeFrom ? placeFrom : "Nhấn để chọn địa chỉ"}
                                </AppText>
                            </AppButton>

                            {/* {placeFrom !== "" && (
                            <AppView marginTop={8} padding={12} backgroundColor="#f7f7f7" radius={8}>
                                <AppText>{placeFrom}</AppText>
                            </AppView>
                        )} */}
                        </AppView>
                        <AppView>
                            <AppText bold marginBottom={4}>Điểm trả</AppText>

                            <AppButton
                                onPress={selectCommuneWardTo}
                                backgroundColor={ColorsGlobal.backgroundGray}
                                padding={12}
                                radius={8}
                            >
                                <AppText color="#666">
                                    {placeTo ? placeTo : "Nhấn để chọn địa chỉ"}
                                </AppText>
                            </AppButton>

                            {/* {placeTo !== "" && (
                            <AppView marginTop={8} padding={12} backgroundColor="#f7f7f7" radius={8}>
                                <AppText>{placeTo}</AppText>
                            </AppView>
                        )} */}
                        </AppView>

                        {/* <AppInput
                       multiline
                    
                        value={placeTo}
                        onChangeText={setPlaceTo}
                        label="Điểm trả"
                        placeholder="Nhập điểm trả / bấm chọn địa chỉ"
                        type='select'
                        toggleSelect={selectCommuneWardTo}
                    /> */}

                    </AppView>
                    <AppView row justifyContent={'space-between'} alignItems='center' gap={24}>
                        {/* <AppView flex={1}>
                    <AppText bold>{'Giá tối thiểu:'}</AppText>
                    </AppView> */}
                        <AppView flex={1}>
                            <AppInput
                                value={price}
                                onChangeText={setPrice}
                                label="Giá tối thiểu"
                                placeholder="...K/chuyến"
                            />

                        </AppView>

                    </AppView>
                    <AppInput
                        value={point}
                        onChangeText={setPoint}
                        label="Điểm trừ tối đa"
                        placeholder="Nhập điểm trừ tối đa"

                    />

                    <AppView paddingTop={12} gap={8}>


                        <AppText bold>{'Khoảng thời gian có thể mua được:'}</AppText>
                        <AppView row justifyContent={'space-around'} >
                            <AppButton gap={8} alignItems='center' backgroundColor={ColorsGlobal.backgroundGray} padding={8} radius={10} onPress={() => { setOpenPickerType('start'); setPickerVisible(true); }}>
                                <AppText fontSize={14} color={ColorsGlobal.textLight}>Thời gian từ: </AppText>
                                <AppText>{formatTime(startTime) || 'Chọn thời gian'}</AppText>
                            </AppButton>

                            {/* --- Chọn thời gian kết thúc --- */}
                            <AppButton gap={8} alignItems='center' backgroundColor={ColorsGlobal.backgroundGray} padding={8} radius={10} onPress={() => { setOpenPickerType('end'); setPickerVisible(true); }}>
                                <AppText fontSize={14} color={ColorsGlobal.textLight}>Thời gian kết thúc: </AppText>
                                <AppText>{formatTime(endTime) || 'Chọn thời gian'}</AppText>
                            </AppButton>
                        </AppView>
                    </AppView>
                    <AppButton
                    onPress={sendToBackend}
                    backgroundColor={ColorsGlobal.main}
                    paddingVertical={12}
                    radius={8}
                >
                    <AppText color="white" fontWeight={700} textAlign="center">
                        Gửi yêu cầu
                    </AppText>
                </AppButton>

                </AppView>
                {/* Nút gửi backend */}
               
                {/* ---- PICKER chung cho iOS & Android ---- */}
                <DateTimePicker
                    isVisible={isPickerVisible}
                    mode="datetime"
                    onConfirm={onConfirmTime}
                    onCancel={() => setPickerVisible(false)}
                />
                <SelectProvinceDistrictModal
                    isVisible={isCommuneWard}
                    onClose={() => {
                        setIsCommuneWard(false);
                    }}
                    // onSelected={(value) => {
                    //     const wardName = `${value.province.name} - ${value.district.name}`;



                    //     // NỐI THÊM VÀO placeTo
                    //     setPlaceTo(prev => prev ? `${prev} - ${wardName}` : wardName);

                    //     setIsCommuneWard(false);
                    // }}
                    onSelected={(value) => {
                        const list = value.districts
                            .map(d => `${value.province.name} - ${d.name}`)
                            .join('\n');
                        // .join(' | ');  // hoặc xuống dòng tuỳ bạn

                        setPlaceFrom(prev => prev ? `${prev} | ${list}` : list);

                        setIsCommuneWard(false);
                    }}


                />
                <SelectProvinceDistrictModal
                    isVisible={isCommuneWardTo}
                    onClose={() => {
                        setIsCommuneWardTo(false);
                    }}
                    // onSelected={(value) => {
                    //     const wardName = `${value.province.name} - ${value.district.name}`;


                    //     // NỐI THÊM VÀO placeFrom
                    //     setPlaceFrom(prev => prev ? `${prev} - ${wardName}` : wardName);

                    //     setIsCommuneWardTo(false);
                    // }}
                    onSelected={(value) => {
                        const list = value.districts
                            .map(d => `${value.province.name} - ${d.name}`)
                            .join('\n');
                        // .join(' ; ');  // hoặc xuống dòng tuỳ bạn
                        setPlaceTo(prev => prev ? `${prev} | ${list}` : list);
                        setIsCommuneWardTo(false);
                    }}

                />
            </AppView>
           
        </ScrollView>

    );
}
