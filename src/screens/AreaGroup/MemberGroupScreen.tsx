import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppView from '../../components/common/AppView';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import AppInput from '../../components/common/AppInput';
import { members } from '../../dataDemoJson';
import IconUser from '../../assets/icons/IconUser';
import AppText from '../../components/common/AppText';
import IconCalendar from '../../assets/icons/IconCalendar';
import IconCar from '../../assets/icons/iconCar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/data/store';
import { fetchAreaDriver } from '../../redux/slices/membersGroup';
import { clearTripsMessages } from '../../redux/slices/tripsSlice';
import { useAppContext } from '../../context/AppContext';

export default function MemberGroupScreen({ }) {
    const {idArea} = useAppContext();
    const [keysearch, setKeysearch] = useState('');
    const dispatch = useDispatch<AppDispatch>();

    const { data, loading, error } = useSelector(
      (state: RootState) => state.memberGroup
    );

    useEffect(() => {
      dispatch(fetchAreaDriver({ area_id:idArea }));
  
    
    }, [idArea]);
  
    if (loading) {
      return (
        <View >
          <ActivityIndicator size="large" color={ColorsGlobal.main}/>
        </View>
      );
    }
  
    if (error) {
      return (
        <View >
          <Text >{error}</Text>
        </View>
      );
    }
  

  
    // Lọc các thành viên dựa trên từ khóa tìm kiếm
    const filteredMembers = !data? [] : data.filter(member => {
        return (
            member?.full_name.toLowerCase().includes(keysearch.toLowerCase())
        ); 
    });

    const renderItem_members = ({ item, index }) => {
        return (
            <Member data={item} index={index} />
        )
    }

    return (
        <AppView flex={1} backgroundColor={ColorsGlobal.backgroundWhite} padding={16}>
            {/* Input tìm kiếm */}
            <AppInput
                value={keysearch}
                onChangeText={setKeysearch}
                type='search'
                placeholder="Tìm kiếm theo tên"
            />

            {/* Danh sách thành viên */}
            <AppView paddingVertical={12} paddingTop={20}>
                <FlatList
                    data={filteredMembers}
                    renderItem={renderItem_members}
                    keyExtractor={(item) => item.id.toString()}
                />
            </AppView>
        </AppView>
    );
}

const Member = ({ data, index }) => {
    const backgroundColor = index % 2 === 0 ? ColorsGlobal.backgroundLight : ColorsGlobal.backgroundWhite;
    const isFirstItem = index === 0;

    return (
        <AppView
            row
            gap={12}
            paddingVertical={12}
            alignItems='center'
            backgroundColor={backgroundColor}
            borderTopLeftRadius={isFirstItem ? 10 : 0}
            borderTopRightRadius={isFirstItem ? 10 : 0}
        >
            <IconUser size={40} />
            <AppView justifyContent='center'>
                <AppView row gap={8} alignItems='center'>
                    <AppText bold>{data.full_name}</AppText>
                    {data?.type_car && <IconCar size={16} />}

                </AppView>

                <AppText>{data.type_car}</AppText>
            </AppView>
        </AppView>
    );
}
