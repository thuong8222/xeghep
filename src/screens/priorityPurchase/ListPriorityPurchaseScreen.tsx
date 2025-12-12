import { FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Container from '../../components/common/Container'
import AppText from '../../components/common/AppText'
import AppButton from '../../components/common/AppButton'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import IconPlus from '../../assets/icons/IconPlus'
import { useNavigation } from '@react-navigation/native'
import AppView from '../../components/common/AppView'
import IconPencil from '../../assets/icons/iconPencil'
import IconArrowDown from '../../assets/icons/IconArowDown'
import IconClock from '../../assets/icons/IconClock'
import IconLocation from '../../assets/icons/iconLocation'
import IconMinus from '../../assets/icons/IconMinus'

import { fetchAutoBuyList } from '../../redux/slices/requestAutoBuyTrip'
import { useAppDispatch } from '../../redux/hooks/useAppDispatch'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { NumberFormat } from '../../utils/Helper'

export default function ListPriorityPurchaseScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { list, loading } = useSelector((state) => state.requestAutoBuyTrip);

    useEffect(() => {
        dispatch(fetchAutoBuyList());
    }, []);

    const addNewTripAuto = () => {
        navigation.navigate("PriorityPurchaseScreen"); // Tạo mới
    };

    const goToDetail = (item) => {
        navigation.navigate("AutoBuyDetailScreen", { id: item.id });
    };

    const goToEdit = (item) => {
        navigation.navigate("PriorityPurchaseScreen", {
            id: item.id,
            editData: item
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => goToDetail(item)}>
            <AppView row backgroundColor={ColorsGlobal.backgroundLight} padding={10} radius={10} width={'100%'} >
                <AppView flex={1} gap={6}  >
                    {/* Địa điểm */}
                    <AppView  justifyContent={'space-between'} gap={8} >
                        <AppView flex={1}  row gap={3}>
                            <IconLocation />
                            <AppText fontSize={14}>
                                {Array.isArray(item.pickup_location)
                                    ? item.pickup_location.join(", ")
                                    : item.pickup_location || "Chưa có địa điểm"}
                            </AppText>
                        </AppView>
                        <AppView flex={1}  row>
                            <IconArrowDown rotate={-90} color={ColorsGlobal.main2} />
                            <AppText fontSize={14}>
                                {Array.isArray(item.dropoff_location)
                                    ? item.dropoff_location.join(", ")
                                    : item.dropoff_location || "Chưa có địa điểm"}
                            </AppText>
                        </AppView>

                    </AppView>

                    {/* Điểm & giá */}
                    <AppView row justifyContent="space-between" alignItems="center">
                        <AppView row alignItems="center">
                            <AppText fontSize={14}>Tối đa: </AppText>
                            <AppText color={ColorsGlobal.main} bold>
                                {item.maximum_point || 0} điểm
                            </AppText>
                        </AppView>

                        <IconMinus color={ColorsGlobal.main2} />
                        <AppText color={ColorsGlobal.main2} bold>{NumberFormat(parseInt(item.desired_price))}K</AppText>
                    </AppView>

                    {/* Thời gian */}
                    <AppView row gap={4} alignItems='center'>
                        <IconClock />
                        <AppText fontSize={14} color={ColorsGlobal.textLight}>
                            {moment(item.time_receive_start).format('HH:mm, DD/MM/YYYY')}
                            {" - "}
                            {moment(item.time_receive_end).format('HH:mm, DD/MM/YYYY')}
                        </AppText>
                    </AppView>
                </AppView>

                {/* Nút sửa */}
                <AppButton paddingLeft={16} justifyContent="center" onPress={() => goToEdit(item)}>
                    <IconPencil color={ColorsGlobal.main} size={18} />
                </AppButton>
            </AppView>
        </TouchableOpacity>
    );
    return (
        <Container style={{ position: 'relative' }} padding={0} ignoreBottomInset>
            <AppText textAlign='center' color={ColorsGlobal.main2} fontWeight={600}>
                [Danh sách yêu cầu mua chuyến tự động]
            </AppText>

            <AppView flex={1} paddingTop={20} gap={16}>
                {loading && <AppText textAlign="center">Đang tải...</AppText>}

                <FlatList
                    data={list}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ gap: 16, padding: 16 }}
                />
            </AppView>

            {/* Button tạo mới */}
            <AppButton
                onPress={addNewTripAuto}
                position={'absolute'}
                right={36}
                bottom={34}
                width={48}
                height={48}
                radius={999}
                backgroundColor={ColorsGlobal.main}
                justifyContent='center'
                alignItems='center'
            >
                <IconPlus size={20} />
            </AppButton>
        </Container>
    );
}
