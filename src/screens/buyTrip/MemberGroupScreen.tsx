import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../components/common/AppView';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import AppInput from '../../components/common/AppInput';
import { members } from '../../dataDemoJson';
import IconUser from '../../assets/icons/IconUser';
import AppText from '../../components/common/AppText';

export default function MemberGroupScreen({ }) {
    const [keysearch, setKeysearch] = useState('');

    // Lọc các thành viên dựa trên từ khóa tìm kiếm
    const filteredMembers = members.filter(member => {
        return (
            member.full_name.toLowerCase().includes(keysearch.toLowerCase()) ||  // Tìm kiếm theo full_name
            member.user_name.toLowerCase().includes(keysearch.toLowerCase())      // Tìm kiếm theo user_name
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
    const backgroundColor = index % 2 === 0 ? ColorsGlobal.borderColor : ColorsGlobal.backgroundWhite;
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
                <AppText bold>{data.full_name}</AppText>
                <AppText>{data.user_name}</AppText>
            </AppView>
        </AppView>
    );
}
