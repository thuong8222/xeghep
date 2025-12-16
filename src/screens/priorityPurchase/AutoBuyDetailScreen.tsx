import { StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch } from '../../redux/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { fetchAutoBuyDetail } from '../../redux/slices/requestAutoBuyTrip';
import AppText from '../../components/common/AppText';
import AppView from '../../components/common/AppView';
import IconLocation from '../../assets/icons/iconLocation';
import IconArrowDown from '../../assets/icons/IconArowDown';
import IconClock from '../../assets/icons/IconClock';
import moment from 'moment';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import Container from '../../components/common/Container';
import { NumberFormat } from '../../utils/Helper';

export default function AutoBuyDetailScreen() {
    const route = useRoute();
    const { id } = route.params;
    const dispatch = useAppDispatch();
    const { detail, loading } = useSelector(state => state.requestAutoBuyTrip);

    useEffect(() => {
        dispatch(fetchAutoBuyDetail(id));
    }, [id]);
console.log('detail: ', detail)
    if (loading || !detail) {
        return (
            <AppView flex={1} justifyContent="center" alignItems="center">
                <ActivityIndicator size="large" color="#000" />
            </AppView>
        );
    }

    return (
        <Container   padding={16}style={{gap:16}} >
            <AppText  bold>Mã yêu cầu: {detail.id}</AppText>

            {/* Địa điểm */}
            <AppView backgroundColor={ColorsGlobal.backgroundLight} padding={8} radius={8} gap={16}>
            <AppView row alignItems="center" gap={4} flexWrap='wrap'>
                <IconLocation />
                <AppText fontSize={14} >
                    {Array.isArray(detail.pickup_location)
                        ? detail.pickup_location.join(", ")
                        : detail.pickup_location || "Chưa có địa điểm"}
                </AppText>
            </AppView>

            <AppView row gap={4}flexWrap='wrap' >
                <IconLocation />
                <AppText fontSize={14} >
                    {Array.isArray(detail.dropoff_location)
                        ? detail.dropoff_location.join(", ")
                        : detail.dropoff_location || "Chưa có địa điểm"}
                </AppText>
            </AppView>
            </AppView>
           

            {/* Điểm & giá */}
            <AppView row justifyContent="space-between" alignItems="center" backgroundColor={ColorsGlobal.backgroundLight} padding={8} radius={8}>
                <AppText color={ColorsGlobal.main}>Tối đa: {detail.maximum_point || 0} điểm</AppText>
                <AppText color={ColorsGlobal.main2}>Giá mong muốn: {NumberFormat(parseInt(detail.desired_price))}K</AppText>
            </AppView>

            {/* Thời gian */}
            <AppView row alignItems="center" gap={8} backgroundColor={ColorsGlobal.backgroundLight} padding={8} radius={8}>
                <IconClock />
                <AppText>
                    {moment(detail.time_receive_start).format('HH:mm, DD/MM/YYYY')}
                    {" - "}
                    {moment(detail.time_receive_end).format('HH:mm, DD/MM/YYYY')}
                </AppText>
            </AppView>

            {/* Các thông tin khác nếu có */}
            {detail.other_field && <AppText>Thông tin thêm: {detail.other_field}</AppText>}
        </Container>
    );
}

const styles = StyleSheet.create({});
