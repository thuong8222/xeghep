import React, { useState } from 'react';
import { TouchableOpacity, FlatList } from 'react-native';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import IconArrowDown from '../../assets/icons/IconArowDown';
import IconMinus from '../../assets/icons/IconMinus';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import IconPlus from '../../assets/icons/IconPlus';
import AppModal from '../../components/common/AppModal';
import GuestModal from './modals/GuestModal';
import AppInput from '../common/AppInput';
import DateTimePicker from 'react-native-modal-datetime-picker';
import TimeSelectSection from './TimeSelectSection';
import { scale } from '../../utils/Helper';


export default function TripOptionsSection() {
    const [time, setTime] = useState(10);
    const [numGuests, setNumGuests] = useState(1);
    const [guestType, setGuestType] = useState<'normal' | 'car4' | 'car7'>('normal');
    const [price, setPrice] = useState(250);
    const [points, setPoints] = useState(1);
    const [isInstant, setIsInstant] = useState(true);

const [showPicker, setShowPicker] = useState(false);
const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const addTime = () => setTime(prev => Math.min(prev + 5, 60));
    const subTime = () => setTime(prev => Math.max(prev - 5, 5));
    const addPrice = () => setPrice(prev => prev + 10);
    const subPrice = () => setPrice(prev => Math.max(prev - 10, 0));
    const addPoint = () => setPoints(prev => Math.min(prev + 0.5, 10));
    const subPoint = () => setPoints(prev => Math.max(prev - 0.5, 1));

    const addGuest = () => setNumGuests(prev => Math.min(prev + 1, 6));
    const subGuest = () => setNumGuests(prev => Math.max(prev - 1, 1));


    return (
        <>
            <AppView
                borderTopWidth={1}
                paddingTop={18}
                borderTopColor={ColorsGlobal.borderColor}
             
            >
                {/* Thời gian */}
                <TimeSelectSection />

                {/* Số khách */}
                <AppView row justifyContent="space-between" alignItems='center'  paddingVertical={9}>
                    <AppText>{'Số khách :'}</AppText>
                    <AppView row gap={8}>

                        {/* Nút trừ (chỉ hiện khi KHÔNG phải bao xe) */}
                        {guestType === 'normal' && (
                            <AppButton onPress={subGuest}>
                                <IconMinus size={20} color={ColorsGlobal.colorIconNoActive} />
                            </AppButton>
                        )}

                        {/* Nút chọn khách / bao xe */}
                        <AppButton row gap={4} onPress={() => setShowGuestModal(true)}>
                            <AppText fontWeight={700}>
                                {guestType === 'normal'
                                    ? `${numGuests} khách`
                                    : guestType === '4c'
                                        ? 'Bao xe 4 chỗ'
                                        : 'Bao xe 7 chỗ'}
                            </AppText>
                            <IconArrowDown color={ColorsGlobal.colorIconNoActive} />
                        </AppButton>

                        {/* Nút cộng (chỉ hiện khi KHÔNG phải bao xe) */}
                        {guestType === 'normal' && (
                            <AppButton onPress={addGuest}>
                                <IconPlus size={scale(20)} color={ColorsGlobal.textDark} />
                            </AppButton>
                        )}
                    </AppView>
                </AppView>

                {/* Giá tiền */}
                <AppView row justifyContent="space-between" alignItems='center' paddingVertical={2} >
                    <AppText>{'Giá tiền :'}</AppText>
                    <AppView row gap={8} alignItems="center">
                        <AppButton onPress={subPrice}>
                            <IconMinus size={20} color={ColorsGlobal.colorIconNoActive} />
                        </AppButton>

                        {/* Ô nhập giá tiền */}
                        <AppView
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: ColorsGlobal.borderColor,
                                paddingHorizontal: 8,
                                flexDirection: 'row', alignItems: 'flex-end', gap: 4,
                                paddingBottom: 4
                            }}
                        >
                            <AppView >
                                <AppInput
                                    value={price.toString()}
                                    onChangeText={(text) => {
                                        // Chỉ cho phép nhập số
                                        const numericValue = text.replace(/[^0-9]/g, '');
                                        setPrice(numericValue === '' ? 0 : parseInt(numericValue, 10));
                                    }}
                                    keyboardType="numeric"
                                    style={{
                                        textAlign: 'center',
                                        fontWeight: '700',
                                        color: ColorsGlobal.textDark,
                                        fontSize: 16,
                                        padding: 0,
                                       

                                    }}
                                />
                            </AppView>
                            <AppText fontWeight={600}>K</AppText>
                        </AppView>

                        <AppButton onPress={addPrice}>
                            <IconPlus size={scale(20)} color={ColorsGlobal.textDark} />
                        </AppButton>
                    </AppView>
                </AppView>


                {/* Điểm bán */}
                <AppView row justifyContent="space-between" alignItems='center' paddingVertical={2}>
                    <AppText>{'Điểm bán :'}</AppText>
                    <AppView row gap={8}  alignItems="center">
                        <AppButton onPress={subPoint}>
                            <IconMinus size={20} color={ColorsGlobal.colorIconNoActive} />
                        </AppButton>
                        {/* <AppText fontWeight={700}>{`${points} điểm`}</AppText> */}
                        <AppView gap={8}
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: ColorsGlobal.borderColor,
                                paddingHorizontal: 8,
                                flexDirection: 'row', alignItems: 'flex-end', gap: 4,
                                paddingBottom: 4
                            }}
                        >
                            <AppView >
                                <AppInput
                                    value={points.toString()}
                                    onChangeText={(text) => {
                                        // Chỉ cho phép nhập số
                                        const numericValue = text.replace(/[^0-9]/g, '');
                                        setPrice(numericValue === '' ? 0 : parseInt(numericValue, 10));
                                    }}
                                    keyboardType="numeric"
                                    style={{
                                        textAlign: 'center',
                                        fontWeight: '700',
                                        color: ColorsGlobal.textDark,
                                        fontSize: 16,
                                        padding: 0,

                                    }}
                                />
                            </AppView>
                            <AppText fontWeight={600}>{'điểm'}</AppText>
                        </AppView>
                        <AppButton onPress={addPoint} disabled={points == 10}>
                            <IconPlus size={scale(20)} color={ColorsGlobal.textDark} />
                        </AppButton>
                    </AppView>
                </AppView>
            </AppView>

            {/* Modal chọn khách */}
            <GuestModal
                isVisible={showGuestModal}
                onClose={() => setShowGuestModal(false)}
                guestType={guestType}
                numGuests={numGuests}
                setGuestType={setGuestType}
                setNumGuests={setNumGuests}
            />
           
        </>
    );
}
