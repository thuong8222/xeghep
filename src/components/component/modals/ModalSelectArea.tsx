import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import AppModal from '../../common/AppModal'
import AppView from '../../common/AppView'
import AppText from '../../common/AppText'
import { ColorsGlobal } from '../../base/Colors/ColorsGlobal'
import Area from '../Area'
import { useAreaApi } from '../../../redux/hooks/useAreaApi'

export default function ModalSelectArea({ isVisible, onClose, onSelected }: any) {
    const renderItem = ({ item }: any) => (
        <Area
            data={item}
            gotoDetailAreaPress={() => {
                onSelected(item);
                onClose();
            }}
        />
    );
    const { groups, loading, getAreas } = useAreaApi();

    const fetchGroups = useCallback(async () => {
        try {
            await getAreas();
        } catch (err) {
            console.log('Lỗi fetch groups:', err);
        }
    }, [getAreas]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    return (
        // ✅ enableAutomaticScroll=false để KeyboardAwareScrollView không conflict
        <AppModal isVisible={isVisible} onClose={onClose} enableAutomaticScroll={false}>
            <FlatList
                data={groups || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                // ✅ Tắt scroll của FlatList, để KeyboardAwareScrollView xử lý
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                    <AppView height={1} backgroundColor={ColorsGlobal.borderColor} />
                )}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    !loading ? (
                        <AppView alignItems="center" padding={20}>
                            <AppText>Không có khu vực nào</AppText>
                        </AppView>
                    ) : null
                }
            />
        </AppModal>
    );
}
