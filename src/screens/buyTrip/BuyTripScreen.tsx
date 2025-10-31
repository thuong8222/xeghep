import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppView from '../../components/common/AppView'
import { listTrips } from '../../dataDemoJson'
import AppButton from '../../components/common/AppButton'
import AppText from '../../components/common/AppText'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import ModalBuyTrip from '../../components/component/modals/ModalBuyTrip'
import ArrowRight from '../../assets/icons/ArrowRight'
import IconPlus from '../../assets/icons/IconPlus'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { buyTripEmitter, BuyTripStackParamList } from '../../navigation/menuBottomTabs/BuyTripTabs'
import IconChevronLeftDouble from '../../assets/icons/IconChevronLeftDouble'
import Trip from '../../components/component/Trip'

type BuyTripProps = NativeStackNavigationProp<BuyTripStackParamList>;
 interface Props {
    navigation:BuyTripProps;
 }
export default function BuyTripScreen({navigation}:Props) {
const [isOpenModalBuyTrip, setIsOpenModalBuyTrip] = useState(false);
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
        return (<Trip data={item} />)
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
        setIsOpenModalBuyTrip(true)

    };
    const SaleTrips = ()=>{
        navigation.navigate('SaleTrip')
    }
    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <AppButton style={[styles.backBtn, styles.backBtnRight]} onPress={() => buyTrip(rowMap, data.item.key)}>
                <Text style={styles.backBtnText}>{'Mua chuyến'}</Text>
            </AppButton>
        </View>
    );
    return (
        <AppView flex={1} backgroundColor='#fff' padding={16} position='relative'>
            <SwipeListView
                data={listTrips}
                renderItem={renderItem_trip} ItemSeparatorComponent={() => <AppView height={16} />}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-131}
                disableRightSwipe={false}
                onRowDidOpen={rowKey => console.log(`Hàng ${rowKey} đã mở`)} />
            <AppButton onPress={SaleTrips} position={'absolute'} right={16} bottom={37} width={48} height={48} radius={999} backgroundColor={ColorsGlobal.main} justifyContent='center' alignItems='center'>
                <IconPlus />
            </AppButton>
            <ModalBuyTrip  visible={isOpenModalBuyTrip} onRequestClose={()=>setIsOpenModalBuyTrip(false)}/>
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
        width: 131,
    },
    backBtnRight: {
        backgroundColor: ColorsGlobal.main,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        right: 0,
    },
    backBtnText: {
        color: 'white',
        fontWeight: 'bold',
    },
});