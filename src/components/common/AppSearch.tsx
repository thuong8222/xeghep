import { View, TextInput, StyleSheet } from 'react-native'
import React from 'react'

import { ColorsGlobal } from '../../stylesGlobal/color';


import IconSearch from '../../assets/icons/IconSearch';

import { DEVICE_WIDTH } from '../../utils/Helper';

interface AppSearchProps {
    changeText?: (text: string) => void;
    keysearch?: number | string | undefined;
 

}
const AppSearch: React.FC<AppSearchProps> = ({
    changeText,
    keysearch,
    
}) => {
 
    return (
        <View style={styles.groupSearch} >
            <IconSearch />
            <TextInput value={keysearch?.toString()} onChangeText={changeText} placeholder='Where are you traveling?' placeholderTextColor={ColorsGlobal.placeSearch}  style={{ flex: 1, paddingRight: 20 }} />
        </View>
    )
}
export default AppSearch;
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6, flex: 1, width: DEVICE_WIDTH,
        shadowOffset: { width: 0, height: 3 }
    },
    logo: {
        width: 44,
        height: 44,
        marginRight: 10,
    },
    groupSearch: { width:'100%', paddingRight: 20, backgroundColor: ColorsGlobal.backGroupSearchInput, gap: 10, height: 44, borderRadius: 90, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,},
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#09A1F9',
    },
});