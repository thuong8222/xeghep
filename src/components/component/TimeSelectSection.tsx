import React, { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppView from '../common/AppView';
import AppButton from '../common/AppButton';
import AppText from '../common/AppText';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import IconArrowDown from '../../assets/icons/IconArowDown';
import IconMinus from '../../assets/icons/IconMinus';
import IconPlus from '../../assets/icons/IconPlus';
import AppModal from '../common/AppModal';
import { scale } from '../../utils/Helper';


export default function TimeSelectSection() {
    const [isInstant, setIsInstant] = useState(true);
    const [time, setTime] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);

    const addTime = () => setTime(prev => Math.min(prev + 15, 60)); // ⏫ Giới hạn tối đa 60 phút
    const subTime = () => setTime(prev => Math.max(prev - 15, 0)); 

    const handleSelectOption = (option: string) => {
        setShowDropdown(false);
        if (option === 'Đi ngay') {
            setIsInstant(true);
            setShowPicker(false);
            setTime(0); 
        } else {
            setIsInstant(false);
            setShowPicker(true);
        }
    };

    const onChangeTime = (_: any, date?: Date) => {
        setShowPicker(false);
        if (date) setSelectedTime(date);
    };

    return (
        <AppView row justifyContent="space-between" alignItems="center" paddingVertical={9}>
            <AppText>{'Thời gian :'}</AppText>

            <AppView gap={8} alignItems="center" row>
                {/* Nút dropdown */}
                <AppView>
                    <AppButton
                        row
                        gap={4}
                        onPress={() => setShowDropdown(prev => !prev)}
                        paddingHorizontal={10}
                    >
                        <AppText fontWeight={700}>
                            {isInstant
                                ? 'Đi ngay'
                                : selectedTime
                                    ? `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime
                                        .getMinutes()
                                        .toString()
                                        .padStart(2, '0')}`
                                    : 'Chọn thời gian'}
                        </AppText>
                        <IconArrowDown color={ColorsGlobal.colorIconNoActive} />
                    </AppButton>
                    {/* Menu chọn */}
                    {showDropdown && (
                        <AppView
                            position="absolute"
                            top={25}
                            right={0}
                            backgroundColor="white"
                            borderWidth={1}
                            borderColor={ColorsGlobal.borderColor}
                            radius={8}
                            padding={6}
                            zIndex={10}
                            width={150}
                        >
                            {['Đi ngay', 'Chọn thời gian'].map((item, index) => (
                                <AppButton key={index} onPress={() => handleSelectOption(item)} paddingVertical={6}>
                                    <AppText

                                        color={item === (isInstant ? 'Đi ngay' : 'Chọn thời gian')
                                            ? ColorsGlobal.main
                                            : ColorsGlobal.textDark}
                                    >
                                        {item}
                                    </AppText>
                                </AppButton>
                            ))}
                        </AppView>
                    )}
                </AppView>

                {/* Hiển thị +/- khi không chọn giờ cụ thể */}
                {isInstant && (
                    <AppView row gap={8} alignItems="center">
                        <AppButton onPress={subTime}>
                            <IconMinus size={20} color={ColorsGlobal.colorIconNoActive} />
                        </AppButton>
                        <AppText fontWeight={700}>{`${time}p`}</AppText>
                        <AppButton onPress={addTime}>
                            <IconPlus size={scale(20)} color={ColorsGlobal.textDark} />
                        </AppButton>
                    </AppView>
                )}
            </AppView>

            {/* Bộ chọn giờ */}
            {showPicker && Platform.OS === 'android' && <DateTimePicker
                value={selectedTime || new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onChangeTime}
                style={{ width: '100%' }}
            />}
            <AppModal isVisible={showPicker && Platform.OS === 'ios'} onClose={() => setShowPicker(false)} heightPercent={0.4}  >
                <DateTimePicker
                    value={selectedTime || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={onChangeTime}
                    style={{ width: '100%' }}
                />

                <AppButton
                    onPress={() => setShowPicker(false)}
                    backgroundColor={ColorsGlobal.main}
                    paddingVertical={10}
                    marginHorizontal={16}
                    radius={8}
                    marginTop={8}
                >
                    <AppText color="white" fontWeight={700} textAlign="center">
                        Xác nhận
                    </AppText>
                </AppButton>
            </AppModal>


        </AppView>
    );
}
