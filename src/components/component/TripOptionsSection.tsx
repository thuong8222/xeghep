import React, { useState } from 'react';
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
import { NumberFormat, validatePrice } from '../../utils/Helper';
import ModalTypeCar from './modals/ModalTypeCar';
import ButtonChange from './ButtonChange';

interface TripOptionsSectionProps {
    // minutesAdded: số phút cộng thêm (riêng, lưu DB)
    // minutesInstant: phút +/- trong "Đi ngay" (dùng để hiển thị, cũng là minutes_added khi Đi ngay)
    onTripOptionsChange?: (
        numGuests: number | null,
        price?: string,
        points?: string | number,
        guestType?: string,
        timeStart?: number | null,
        minutesAdded?: number,
    ) => void;
    typeCar?: { type: string; name: string } | null;
}

export default function TripOptionsSection({ onTripOptionsChange }: TripOptionsSectionProps) {

    const [numGuests, setNumGuests] = useState(1);
    const [guestType, setGuestType] = useState<'normal' | 'car5' | 'car7'>('normal');
    const [price, setPrice] = useState(250);
    const [points, setPoints] = useState(1);
    const [priceError, setPriceError] = useState('');
    const [timeStart, setTimeStart] = useState<number | null>(null);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [showTypeCar, setShowTypeCar] = useState(false);
    const [selectedCar, setSelectedCar] = useState<{ type: string; name: string } | null>(null);
    // ✅ minutesAdded = số phút từ TimeSelectSection (instant minutes hoặc 0 khi chọn lịch)
    const [minutesAdded, setMinutesAdded] = useState(0);

    const notifyChange = (
        newNumGuests?: number,
        newPrice?: number,
        newPoints?: number | string,
        newGuestType?: typeof guestType,
        newTimeStart?: number | null,
        newMinutesAdded?: number,
    ) => {
        onTripOptionsChange?.(
            newNumGuests ?? numGuests,
            (newPrice ?? price).toString(),
            (newPoints ?? points).toString(),
            newGuestType ?? guestType,
            newTimeStart ?? timeStart,
            newMinutesAdded ?? minutesAdded,
        );
    };

    const addPrice = () => { const v = price + 10; setPrice(v); notifyChange(undefined, v); };
    const subPrice = () => { const v = Math.max(price - 10, 0); setPrice(v); notifyChange(undefined, v); };
    const addPoint = () => { const v = Math.min(points + 0.5, 10); setPoints(v); notifyChange(undefined, undefined, v); };
    const subPoint = () => { const v = Math.max(points - 0.5, 0); setPoints(v); notifyChange(undefined, undefined, v); };
    const addGuest = () => { const v = Math.min(numGuests + 1, 6); setNumGuests(v); notifyChange(v); };
    const subGuest = () => { const v = Math.max(numGuests - 1, 1); setNumGuests(v); notifyChange(v); };

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
            <AppView borderTopWidth={1} paddingTop={18} borderTopColor={ColorsGlobal.borderColor}>

                {/* ✅ Dùng onTimeWithMeta để nhận cả time + minutesInstant */}
                <TimeSelectSection
                    onTimeWithMeta={(sec, minutes) => {
                        setTimeStart(sec);
                        setMinutesAdded(minutes);
                        notifyChange(undefined, undefined, undefined, undefined, sec, minutes);
                    }}
                    // giữ onTimeChange để không break nếu nơi khác dùng
                    onTimeChange={(sec) => {
                        setTimeStart(sec);
                    }}
                />

                {/* Số khách — giữ nguyên */}
                <AppView row justifyContent="space-between" alignItems='center' paddingVertical={9}>
                    <AppText>{'Số khách :'}</AppText>
                    <AppView row alignItems='center'>
                        {guestType === 'normal' && (
                            <ButtonChange onPress={subGuest} icon={<IconMinus size={20} color={ColorsGlobal.colorIconNoActive} />} />
                        )}
                        <AppView>
                            <AppButton row gap={4} onPress={() => setShowGuestModal(true)} paddingHorizontal={4} paddingVertical={8}>
                                <AppText fontWeight={700}>{guestTypeNameMap[guestType] || `${numGuests} khách`}</AppText>
                                <IconArrowDown color={ColorsGlobal.colorIconNoActive} />
                            </AppButton>
                        </AppView>
                        {guestType === 'normal' && (
                            <ButtonChange onPress={addGuest} icon={<IconPlus size={18} color={ColorsGlobal.colorIconNoActive} />} />
                        )}
                    </AppView>
                </AppView>

                {/* Giá tiền — giữ nguyên */}
                <AppView row justifyContent="space-between" alignItems='center' paddingVertical={2}>
                    <AppText>{'Giá tiền :'}</AppText>
                    <AppView row gap={8} alignItems="center">
                        <ButtonChange onPress={subPrice} icon={<IconMinus size={20} color={ColorsGlobal.colorIconNoActive} />} />
                        <AppView style={{ borderBottomWidth: 1, borderBottomColor: ColorsGlobal.borderColor, paddingHorizontal: 8, flexDirection: 'row', gap: 4, paddingBottom: 4 }} alignItems='center'>
                            <AppView alignItems='center' justifyContent='center'>
                                <AppInput marginTop={0}
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
                                    style={{ textAlign: 'center', fontWeight: '700', color: ColorsGlobal.textDark, fontSize: 16, padding: 0, height: 40, alignItems: 'center', justifyContent: 'center', width: 80 }}
                                />
                            </AppView>
                            <AppText fontWeight={600}>K</AppText>
                        </AppView>
                        <ButtonChange onPress={addPrice} icon={<IconPlus size={18} color={ColorsGlobal.colorIconNoActive} />} />
                    </AppView>
                </AppView>

                {/* Điểm bán — giữ nguyên */}
                <AppView row justifyContent="space-between" alignItems='center' paddingVertical={2}>
                    <AppText>{'Điểm bán :'}</AppText>
                    <AppView row gap={8} alignItems="center">
                        <ButtonChange onPress={subPoint} icon={<IconMinus size={20} color={ColorsGlobal.colorIconNoActive} />} />
                        <AppView gap={8} style={{ borderBottomWidth: 1, borderBottomColor: ColorsGlobal.borderColor, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingBottom: 4 }}>
                            <AppView>
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
                                    onBlur={() => { if (points === '' || isNaN(points)) setPoints(1); }}
                                    keyboardType="numeric"
                                    style={{ textAlign: 'center', fontWeight: '700', color: ColorsGlobal.textDark, fontSize: 16, padding: 0 }}
                                />
                            </AppView>
                            <AppText fontWeight={600}>{'điểm'}</AppText>
                        </AppView>
                        <ButtonChange onPress={addPoint} icon={<IconPlus size={18} color={ColorsGlobal.colorIconNoActive} />} />
                    </AppView>
                </AppView>
            </AppView>

            <GuestModal
                isVisible={showGuestModal}
                onClose={() => setShowGuestModal(false)}
                guestType={guestType}
                numGuests={numGuests}
                setGuestType={(val) => { setGuestType(val); notifyChange(undefined, undefined, undefined, val); }}
                setNumGuests={(val) => { setNumGuests(val); notifyChange(val); }}
            />
            <ModalTypeCar
                isVisible={showTypeCar}
                onClose={() => setShowTypeCar(false)}
                onSelect={(car) => { setSelectedCar(car); }}
            />
        </>
    );
}