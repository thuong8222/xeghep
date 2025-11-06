import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppView from '../../components/common/AppView'
import { listTrips } from '../../dataDemoJson'
import AppButton from '../../components/common/AppButton'
import AppText from '../../components/common/AppText'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import moment from 'moment';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import ModalBuyTrip from '../../components/component/modals/ModalBuyTrip'
import ArrowRight from '../../assets/icons/ArrowRight'
import IconPlus from '../../assets/icons/IconPlus'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { buyTripEmitter, BuyTripStackParamList } from '../../navigation/menuBottomTabs/BuyTripTabs'
import IconChevronLeftDouble from '../../assets/icons/IconChevronLeftDouble'
import Trip from '../../components/component/Trip'
import IconSort from '../../assets/icons/IconSort'
import IconFilterRight from '../../assets/icons/IconFilterRight'
import { scale } from '../../utils/Helper'


type BuyTripProps = NativeStackNavigationProp<BuyTripStackParamList>;
interface Props {
    navigation: BuyTripProps;
}
export default function BuyTripScreen({ navigation, route }: Props) {
    const { nameGroup, countMember } = route.params;
    const [isModalVisible, setIsModalVisible] = useState(false)
    const HeaderRightButton = () => (
        <AppView row gap={6}>
            <AppButton onPress={() => setIsModalVisible(true)} paddingLeft={30}>
                <IconSort />
            </AppButton>
            <AppButton onPress={() => navigation.navigate('InfoGroup', { nameGroup: nameGroup, countMember: countMember })}>
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
                    <AppText fontWeight={700}>{nameGroup}</AppText>
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
    const buyTrip = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        // const newData = [...listData];
        // const prevIndex = listData.findIndex(item => item.key === rowKey);
        // newData.splice(prevIndex, 1);
        // setListData(newData);
        Alert.alert('thanh cong', `Mua Chuyến thanh cong`);


    };
    const SaleTrips = () => {
        navigation.navigate('SaleTrip')
    }
    const renderHiddenItem = (data, rowMap) => {

        if (data.item.Trip.sold === 1) return null;
        return (

            <View style={styles.rowBack}>
                <AppButton style={[styles.backBtn, styles.backBtnRight, { backgroundColor: ColorsGlobal.backgroundBuyTrip }]} onPress={() => buyTrip(rowMap, data.item.Trip.id)}>
                    <Text style={styles.backBtnText}>{'Mua chuyến'}</Text>
                </AppButton>
            </View>

        )
    };
    return (
        <AppView flex={1} backgroundColor='#fff' padding={scale(16)} position='relative'>
            <SwipeListView
                data={listTrips}
                keyExtractor={(item) => item.Trip.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem_trip} ItemSeparatorComponent={() => <AppView height={scale(16)} />}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-116}
                leftOpenValue={0}              // Tắt vuốt sang phải
                disableRightSwipe={true}       // Chỉ vuốt trái
                swipeToOpenPercent={10}
                directionalDistanceChangeThreshold={2}
                friction={8}
                tension={50}
                onRowDidOpen={rowKey => console.log(`Hàng ${rowKey} đã mở`)}
            />
            <AppButton onPress={SaleTrips} position={'absolute'} right={36} bottom={34} width={48} height={48} radius={999} backgroundColor={ColorsGlobal.main} justifyContent='center' alignItems='center'>
                <IconPlus />
            </AppButton>
            <ModalBuyTrip visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} />

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