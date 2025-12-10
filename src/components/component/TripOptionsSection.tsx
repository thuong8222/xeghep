import React, { useState } from 'react';
import { TouchableOpacity, FlatList } from 'react-native';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import IconArrowDown from '../../assets/icons/IconArowDown';
import IconMinus from '../../assets/icons/IconMinus';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import IconPlus from '../../assets/icons/IconPlus';

import GuestModal from './modals/GuestModal';
import AppInput from '../common/AppInput';

import TimeSelectSection from './TimeSelectSection';
import { CONSTANT, NumberFormat, scale, validatePrice } from '../../utils/Helper';

import ModalTypeCar from './modals/ModalTypeCar';
import ButtonChange from './ButtonChange';

interface TripOptionsSectionProps {
    onTripOptionsChange?: (
        numGuests: number | null, 
        price?: string, 
        points?: string |number, 
        guestType?: string, 
        timeStart?: number) => void;
        typeCar?: { type: string; name: string } | null
}
export default function TripOptionsSection({ onTripOptionsChange }: TripOptionsSectionProps) {

    const [numGuests, setNumGuests] = useState(1);
    const [guestType, setGuestType] = useState<'normal' | 'car5' | 'car7'>('normal');
    const [price, setPrice] = useState(250);
    const [points, setPoints] = useState(1);
    const [priceError, setPriceError] = useState('');
    const [timeStart, setTimeStart] = useState<number | null>(null);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [showTypeCar, setShowTypeCar] = useState(false)

    const [selectedCar, setSelectedCar] = useState<{ type: string; name: string } | null>(null);

    // ✅ Helper gọi onTripOptionsChange - luôn truyền đầy đủ params
    const notifyChange = (
        newNumGuests?: number,
        newPrice?: number,
        newPoints?: number|string,
        newGuestType?: typeof guestType,
        newTimeStart?: number | null,
        // newTypeCar?: { type: string; name: string } | null
    ) => {
        console.log('points notifyChange: ',points)
        console.log('newPoints notifyChange: ',newPoints)
        if (onTripOptionsChange) {
            onTripOptionsChange(
                newNumGuests ?? numGuests,
                (newPrice ?? price).toString(),
                (newPoints ?? points).toString(),
                newGuestType ?? guestType,
                newTimeStart ?? timeStart,
            );
        }
    };

    // ✅ Handlers
    const addPrice = () => {
        const newPrice = price + 10;
        setPrice(newPrice);
        notifyChange(undefined, newPrice);
    };

    const subPrice = () => {
        const newPrice = Math.max(price - 10, 0);
        setPrice(newPrice);
        notifyChange(undefined, newPrice);
    };

    const addPoint = () => {
        const newPoints = Math.min(points + 0.5, 10);
        setPoints(newPoints);
        notifyChange(undefined, undefined, newPoints);
    };

    const subPoint = () => {
        const newPoints = Math.max(points - 0.5, 1);
        setPoints(newPoints);
        notifyChange(undefined, undefined, newPoints);
    };

    const addGuest = () => {
        const newGuests = Math.min(numGuests + 1, 6);
        setNumGuests(newGuests);
        notifyChange(newGuests);
    };

    const subGuest = () => {
        const newGuests = Math.max(numGuests - 1, 1);
        setNumGuests(newGuests);
        notifyChange(newGuests);
    };
    const guestTypeNameMap: Record<string, string> = {
        normal: `${numGuests} khách`,
        car5: 'Bao xe 5 chỗ',
        car7: 'Bao xe 7 chỗ',
        car16: 'Bao xe 16 chỗ',
        car35: 'Bao xe 35 chỗ',
        car45: 'Bao xe 45 chỗ',
    };

    return (
        <>
            <AppView
                borderTopWidth={1}
                paddingTop={18}
                borderTopColor={ColorsGlobal.borderColor}

            >
                {/* Thời gian */}
                <TimeSelectSection
                    onTimeChange={(time) => {
                        setTimeStart(time);
                        notifyChange(undefined, undefined, undefined, undefined, time);
                    }}
                />

                {/* Số khách */}
                <AppView row justifyContent="space-between" alignItems='center' paddingVertical={9}>
                    <AppText>{'Số khách :'}</AppText>
                    <AppView row gap={8} alignItems='center'>

                        {/* Nút trừ (chỉ hiện khi KHÔNG phải bao xe) */}
                        {guestType === 'normal' && (
                            <ButtonChange
                                onPress={subGuest}
                                icon={<IconMinus size={20} color={ColorsGlobal.colorIconNoActive} />}
                            />
                           
                        )}

                        {/* Nút chọn khách / bao xe */}
                        <AppView>
                            <AppButton row gap={4} onPress={() => setShowGuestModal(true)}>
                                {/* <AppText fontWeight={700}>
                                    {guestType === 'normal'
                                        ? `${numGuests} khách`
                                        :  guestType === '4c'
                                            ? 'Bao xe 4 chỗ'
                                            : 'Bao xe 7 chỗ'}
                                </AppText> */}
                                <AppText fontWeight={700}>
                                    {guestTypeNameMap[guestType] || `${numGuests} khách`}
                                </AppText>
                                <IconArrowDown color={ColorsGlobal.colorIconNoActive} />
                            </AppButton>

                        </AppView>

                        {/* Nút cộng (chỉ hiện khi KHÔNG phải bao xe) */}
                        {guestType === 'normal' && (
                            <ButtonChange
                                onPress={addGuest}
                                icon={<IconPlus size={18} color={ColorsGlobal.colorIconNoActive} />}
                            />

                        )}
                    </AppView>
                </AppView>

                {/* {guestType === 'normal' &&
                    <AppView row justifyContent="space-between" alignItems='center' paddingVertical={6} >
                        <AppText>{'Loại xe:'}</AppText>
                        <AppButton row gap={4} onPress={() => setShowTypeCar(true)}>
                            {selectedCar ?
                                <AppText >{selectedCar.name}</AppText>
                                :
                                <AppText fontWeight={700}>{'Chọn loại xe'}</AppText>
                            }

                            <IconArrowDown color={ColorsGlobal.colorIconNoActive} />
                        </AppButton>
                    </AppView>
                } */}
                {/* Giá tiền */}
                <AppView row justifyContent="space-between" alignItems='center' paddingVertical={2} >
                    <AppText>{'Giá tiền :'}</AppText>
                    <AppView row gap={8} alignItems="center">
                        <ButtonChange
                            onPress={subPrice}
                            icon={<IconMinus size={20} color={ColorsGlobal.colorIconNoActive} />}
                        />

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
                                    value={NumberFormat(price.toString())}
                                    onChangeText={(text) => {
                                        const numericValue = text.replace(/[^0-9]/g, '');
                                        const newVal = numericValue === '' ? 0 : parseInt(numericValue, 10);
                                        setPrice(newVal);
                                        notifyChange(undefined, newVal);
                                        setPriceError(validatePrice(text));
                                    }}
                                    error={priceError}
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
                        <ButtonChange
                            onPress={addPrice}
                            icon={<IconPlus size={18} color={ColorsGlobal.colorIconNoActive} />}
                        />

                    </AppView>
                </AppView>


                {/* Điểm bán */}
                <AppView row justifyContent="space-between" alignItems='center' paddingVertical={2}>
                    <AppText>{'Điểm bán :'}</AppText>
                    <AppView row gap={8} alignItems="center">
                        <ButtonChange
                            onPress={subPoint}
                            icon={<IconMinus size={20} color={ColorsGlobal.colorIconNoActive} />}
                        />
                       
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
                                        const numericValue = text.replace(/[^0-9.]/g, '');
                                        let newVal = numericValue === '' ? 1 : parseFloat(numericValue);
                                        if (newVal < 1) newVal = 1;
                                        if (newVal > 10) newVal = 10;
                                        setPoints(newVal);
                                        notifyChange(undefined, undefined, newVal);
                                    }}
                                    onBlur={() => {
                                        // Khi người dùng rời input, đảm bảo giá trị hợp lệ tối thiểu là 1
                                        if (points === '' || isNaN(points)) {
                                            setPoints(1);
                                        }
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
                        <ButtonChange
                            onPress={addPoint}
                            icon={<IconPlus size={18} color={ColorsGlobal.colorIconNoActive} />}
                        />

                    </AppView>
                </AppView>
            </AppView>

            {/* Modal chọn khách */}
            <GuestModal
                isVisible={showGuestModal}
                onClose={() => setShowGuestModal(false)}
                guestType={guestType}
                numGuests={numGuests}
                setGuestType={(val) => {
                    setGuestType(val);
                    notifyChange(undefined, undefined, undefined, val);
                }}
                setNumGuests={(val) => { setNumGuests(val); notifyChange(val); }}
            />
            <ModalTypeCar
                isVisible={showTypeCar}
                onClose={() => setShowTypeCar(false)}
                onSelect={(car) => {
                    setSelectedCar(car);
                    notifyChange(undefined, undefined, undefined, undefined, undefined, car);
                }}
            />


        </>
    );
}
