import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AppView from '../../components/common/AppView'
import { listTrips } from '../../dataDemoJson'
import AppButton from '../../components/common/AppButton'
import AppText from '../../components/common/AppText'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'

import { SwipeListView } from 'react-native-swipe-list-view';
import ModalBuyTrip from '../../components/component/modals/ModalBuyTrip'

import IconPlus from '../../assets/icons/IconPlus'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { buyTripEmitter, BuyTripStackParamList } from '../../navigation/menuBottomTabs/BuyTripTabs'

import Trip from '../../components/component/Trip'
import IconSort from '../../assets/icons/IconSort'
import IconFilterRight from '../../assets/icons/IconFilterRight'
import { getDateRange, scale } from '../../utils/Helper'
import { useTripsApi } from '../../redux/hooks/useTripsApi'
import { useAppContext } from '../../context/AppContext'
import ModalConfirmBuyTrip from '../../components/component/modals/ModalConfirmBuyTrip'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/data/store'
import { buyTrip, FetchTripsPayload } from '../../redux/slices/tripsSlice'
import moment from 'moment'


type BuyTripProps = NativeStackNavigationProp<BuyTripStackParamList>;
interface Props {
    navigation: BuyTripProps;
    route: any;
}
export default function BuyTripScreen({ navigation, route }: Props) {
    const { trips, driver_areas, trips_count, loading, error, getTrips } = useTripsApi();
    const dispatch = useDispatch<AppDispatch>();

    const { buyTripLoading, buyTripError, buyTripSuccess } = useSelector(
        (state: RootState) => state.trips
    );
    const { setIdArea, setUpdateTrips, updateTrips } = useAppContext();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedArea, setSelectedArea] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const { nameGroup, countMember, id_area } = route.params;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalConfirmBuyTrip, setIsModalConfirmBuyTrip] = useState(false);
    const [filters, setFilters] = useState<{ direction: string; time: string } | null>(null);
    const [boughtTrip, setBoughtTrip] = useState();
    const gotoInfoGroup = () => {

        setIdArea(id_area)
        navigation.navigate('InfoGroup', { nameGroup: nameGroup, countMember: countMember })
    }
    const HeaderRightButton = () => (
        <AppView row gap={6}>
            <AppButton onPress={() => setIsModalVisible(true)} paddingLeft={30}>
                <IconSort />
            </AppButton>
            <AppButton onPress={gotoInfoGroup}>
                <IconFilterRight />
            </AppButton>
        </AppView>
    )
    React.useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerBackTitleStyle: { fontSize: 0 },

            headerTitle: () => (
                <AppView justifyContent={'flex-start'} alignItems={'flex-start'}>
                    <AppText fontWeight={700} numberOfLines={1}>{nameGroup}</AppText>
                    <AppText fontSize={12} lineHeight={16} color={ColorsGlobal.textLight}>{countMember + ' thành viên'}</AppText>
                </AppView>
            ),
            headerRight: HeaderRightButton,

        });
    }, [navigation]);

    useEffect(() => {
        const listener = (newFilters: any) => {
            console.log('Filters changed:', newFilters)
            // Xử lý filter ở đây
        }

        buyTripEmitter.on('onFilterChanged', listener)

        return () => {
            buyTripEmitter.off('onFilterChanged', listener)
        }
    }, [])


    useEffect(() => {
        if (id_area) {
            fetchTrips();
        }
    }, [id_area, startDate, endDate, updateTrips]);

    const fetchTrips = useCallback(async () => {
        if (!id_area) return;
        try {
            const model: FetchTripsPayload = {
                area_id: id_area,

            }


            await getTrips(model);


        } catch (err) {
            console.log('Lỗi fetch trips:', err);
        }
    }, [id_area, startDate, endDate, filters, getTrips, updateTrips]);

    // const onRefresh = useCallback(async () => {
    //     setRefreshing(true);
    //     try {
    //         await fetchTrips();
    //     } finally {
    //         setRefreshing(false);
    //     }
    // }, [fetchTrips]);
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchTrips();
        } catch (error) {
            console.log("Lỗi refresh trips:", error);
        }
        setRefreshing(false);
    };

    const renderItem_trip = ({ item }) => {
        return (
            <Trip data={item} />
        )
    }
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };
    const PressBuyTrip = (rowMap: any, rowKey: string, data: any) => {


        dispatch(buyTrip({ tripId: data.item.id }))
            .unwrap()
            .then((res) => {
                setUpdateTrips(moment().unix());
                setBoughtTrip(data.item);
                closeRow(rowMap, data.item.id);
                setIsModalConfirmBuyTrip(true);
            })
            .catch((err) => {
                Alert.alert('Thông báo', err)
                console.log('Mua chuyến thất bại:', err);
            });
    };

    const SaleTrips = () => {
        navigation.navigate('SaleTrip', { id_area: id_area })
    }

    const renderHiddenItem = (data, rowMap) => {

        if (data.item.is_sold === 1) return null;
        return (

            <View style={styles.rowBack}>
                <AppButton style={[styles.backBtn, styles.backBtnRight, { backgroundColor: ColorsGlobal.backgroundBuyTrip }]} onPress={() => PressBuyTrip(rowMap, data.item.area_id, data)}>
                    <Text style={styles.backBtnText}>{'Mua chuyến'}</Text>
                </AppButton>
            </View>

        )
    };
    const handleApplyFilter = (filters: any) => {

        if (!id_area) return;
        // Lấy customDate từ filters
        const customDate = filters.customDate;
        // Chuyển selectedTime thành start_date/end_date
        const { start_date, end_date } = getDateRange(filters.time, customDate);

        const direction = filters.direction;

        const model: any = {
            area_id: id_area,
            start_date,
            end_date,
            direction,
            pick_up: filters?.place_start,
            drop_off: filters?.place_end
        };

        if (filters.place_start) model.place_start = filters.place_start;
        if (filters.place_end) model.place_end = filters.place_end;


        getTrips(model);
        setIsModalVisible(false);
    };


    return (
        <AppView flex={1} backgroundColor='#fff' padding={scale(16)} position='relative'>
            <SwipeListView
                refreshing={refreshing}
                data={trips}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem_trip}
                ItemSeparatorComponent={() => <AppView height={scale(16)} />}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-116}
                leftOpenValue={0}
                disableRightSwipe={true}
                swipeToOpenPercent={10}
                directionalDistanceChangeThreshold={2}
                friction={8}
                tension={50}
                onRefresh={onRefresh}
                onRowDidOpen={rowKey => console.log(`Hàng ${rowKey} đã mở`)}
                ListEmptyComponent={() => <AppView alignItems='center' justifyContent='center'><AppText>{'Chưa có chuyến nào trong khu vực này'}</AppText></AppView>}
            />
            <AppButton onPress={SaleTrips} position={'absolute'} right={36} bottom={34} width={48} height={48} radius={999} backgroundColor={ColorsGlobal.main} justifyContent='center' alignItems='center'>
                <IconPlus size={20} />
            </AppButton>
            <ModalBuyTrip
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
                onApplyFilter={handleApplyFilter} // Không cần arrow function nữa
            />
            <ModalConfirmBuyTrip visible={isModalConfirmBuyTrip}
                onRequestClose={() => setIsModalConfirmBuyTrip(false)} data={boughtTrip} />

        </AppView>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,

    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: ColorsGlobal.backgroundBuyTrip,
        borderRadius: 12,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    backBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 116,
    },
    backBtnRight: {

        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        right: 0,
    },
    backBtnText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 'bold',
    },
});