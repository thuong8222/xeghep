import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppView from '../../components/common/AppView'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import { SwipeListView } from 'react-native-swipe-list-view'
import AppButton from '../../components/common/AppButton'
import Trip from '../../components/component/Trip'
import { listTrips, tranferPoints } from '../../dataDemoJson'
import Point from '../../components/component/Point'
import IconPlus from '../../assets/icons/IconPlus'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BuyTripStackParamList } from '../../navigation/menuBottomTabs/BuyTripTabs'
import { BottomTabParamList } from '../../navigation/MenuBottomTabs'
import { PointTabsParamList } from '../../navigation/menuBottomTabs/PointTabs'
type BuyTripProps = NativeStackNavigationProp<PointTabsParamList, 'PointAddScreen'>;
interface Props {
    navigation: BuyTripProps;
}
export default function PointScreen({ navigation }: Props) {
    const renderItem_trip = ({ item }) => {
        return (
            <Point data={item} />
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
        Alert.alert('thanh cong', `Mua diem thanh cong`);


    };
    const renderHiddenItem = (data, rowMap) => {
        return (

            <AppView flex={1} alignItems='center' backgroundColor={ColorsGlobal.backgroundBuyTrip} radius={12} row justifyContent={'flex-end'}>
                <AppButton style={[styles.backBtn, styles.backBtnRight, { backgroundColor: ColorsGlobal.backgroundBuyTrip }]} onPress={() => buyTrip(rowMap, data.item.id)}>
                    <Text style={styles.backBtnText}>{'Mua điểm'}</Text>
                </AppButton>
            </AppView>

        )
    }
    const SaleTrips = () => {
        navigation.navigate('PointAddScreen')
    }
    return (
        <AppView flex={1} padding={16} backgroundColor={ColorsGlobal.backgroundWhite}>
            <SwipeListView
                data={tranferPoints}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem_trip} ItemSeparatorComponent={() => <AppView height={16} />}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-92}
                leftOpenValue={0}              // Tắt vuốt sang phải
                disableRightSwipe={true}       // Chỉ vuốt trái
                swipeToOpenPercent={10}
                directionalDistanceChangeThreshold={2}
                friction={8}
                tension={50}

                onRowDidOpen={rowKey => console.log(`Hàng ${rowKey} đã mở`)} />
            <AppButton onPress={SaleTrips} position={'absolute'} right={36} bottom={34} width={48} height={48} radius={999} backgroundColor={ColorsGlobal.main} justifyContent='center' alignItems='center'>
              <IconPlus size={20} />
            </AppButton>
        </AppView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingTop: 50,
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
        width: 92,
    },
    backBtnRight: {

        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        right: 0,
    },
    backBtnText: {

        fontWeight: 'bold',
    },
});