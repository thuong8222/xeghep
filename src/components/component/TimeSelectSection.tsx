import React, { useState } from 'react';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppView from '../common/AppView';
import AppButton from '../common/AppButton';
import AppText from '../common/AppText';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import IconArrowDown from '../../assets/icons/IconArowDown';
import IconMinus from '../../assets/icons/IconMinus';
import IconPlus from '../../assets/icons/IconPlus';
import AppModal from '../common/AppModal';
import moment from 'moment';
import ButtonChange from './ButtonChange';

interface TimeSelectSectionProps {
    onTimeChange?: (timestampSeconds: number | null) => void;
}

export default function TimeSelectSection({ onTimeChange }: TimeSelectSectionProps) {
    const [isInstant, setIsInstant] = useState(true);
    const [time, setTime] = useState(15);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const [selectedTime, setSelectedTime] = useState<Date>(new Date());

    // Android: phân biệt date / time
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    /* ================== Đi ngay (+/- phút) ================== */
    const updateInstantTime = (minutes: number) => {
        const now = new Date();
        const future = new Date(now.getTime() + minutes * 60 * 1000);
        onTimeChange?.(Math.floor(future.getTime() / 1000));
    };

    const addTime = () => {
        setTime(prev => {
            const next = Math.min(prev + 5, 60);
            updateInstantTime(next);
            return next;
        });
    };

    const subTime = () => {
        setTime(prev => {
            const next = Math.max(prev - 5, 0);
            updateInstantTime(next);
            return next;
        });
    };

    /* ================== Dropdown ================== */
    const handleSelectOption = (option: string) => {
        setShowDropdown(false);

        if (option === 'Đi ngay') {
            setIsInstant(true);
            setShowPicker(false);
            setTime(0);
            updateInstantTime(0);
        } else {
            setIsInstant(false);

            if (Platform.OS === 'android') {
                setPickerMode('date');
                setShowPicker(true);
            } else {
                setShowPicker(true);
            }
        }
    };

    /* ================== Android onChange ================== */
    const onChangeAndroid = (_: any, date?: Date) => {
        if (!date) {
            setShowPicker(false);
            return;
        }

        if (pickerMode === 'date') {
            const newDate = new Date(selectedTime);
            newDate.setFullYear(date.getFullYear());
            newDate.setMonth(date.getMonth());
            newDate.setDate(date.getDate());

            setSelectedTime(newDate);
            setPickerMode('time');
            setShowPicker(true);
        } else {
            const newDate = new Date(selectedTime);
            newDate.setHours(date.getHours());
            newDate.setMinutes(date.getMinutes());

            setSelectedTime(newDate);
            setShowPicker(false);

            onTimeChange?.(Math.floor(newDate.getTime() / 1000));
        }
    };

    /* ================== iOS onChange ================== */
    const onChangeIOS = (_: any, date?: Date) => {
        if (date) {
            setSelectedTime(date);
            onTimeChange?.(Math.floor(date.getTime() / 1000));
        }
    };

    return (
        <AppView row justifyContent="space-between" alignItems="center" paddingVertical={9}>
            <AppText>Thời gian :</AppText>

            <AppView gap={8} alignItems="center" row>
                {/* Dropdown */}
                <AppView>
                    <AppButton row gap={4} onPress={() => setShowDropdown(p => !p)} paddingHorizontal={10}>
                        <AppText fontWeight={700}>
                            {isInstant
                                ? 'Đi ngay'
                                : moment(selectedTime).format('DD/MM/YYYY HH:mm')}
                        </AppText>
                        <IconArrowDown color={ColorsGlobal.colorIconNoActive} />
                    </AppButton>

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
                            width={150}
                            zIndex={10}
                        >
                            {['Đi ngay', 'Chọn thời gian'].map((item, i) => (
                                <AppButton key={i} onPress={() => handleSelectOption(item)}>
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

                {/* +/- phút */}
                {isInstant && (
                    <AppView row gap={8} alignItems="center">
                        <ButtonChange onPress={subTime} icon={<IconMinus />} />
                        <AppText fontWeight={700}>{time}p</AppText>
                        <ButtonChange onPress={addTime} icon={<IconPlus />} />
                    </AppView>
                )}
            </AppView>

            {/* ================= ANDROID PICKER ================= */}
            {showPicker && Platform.OS === 'android' && (
                <DateTimePicker
                    value={selectedTime}
                    mode={pickerMode}
                    is24Hour
                    display="spinner"
                    onChange={onChangeAndroid}
                />
            )}

            {/* ================= iOS PICKER ================= */}
            <AppModal
                isVisible={showPicker && Platform.OS === 'ios'}
                onClose={() => setShowPicker(false)}
                heightPercent={0.4}
            >
                <DateTimePicker
                    value={selectedTime}
                    mode="datetime"
                    is24Hour
                    display="spinner"
                    onChange={onChangeIOS}
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
