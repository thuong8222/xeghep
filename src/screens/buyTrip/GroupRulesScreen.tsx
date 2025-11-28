import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Container from '../../components/common/Container';
import { AppDispatch, RootState } from '../../redux/data/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegulationsByArea } from '../../redux/slices/regulationSlice';
import AppButton from '../../components/common/AppButton';

export default function GroupRulesScreen() {
  const { idArea } = useAppContext();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.regulations);

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]); // lưu id category đang mở

  useEffect(() => {
    if (idArea) {
      dispatch(fetchRegulationsByArea(idArea));
    }
  }, [dispatch, idArea]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  

  return (
    <Container loading={loading} >
      <FlatList
        data={categories.data} // nếu slice trả về { data: [...] } thì mới dùng .data
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isExpanded = expandedCategories.includes(item.id);
          return (
            <View style={{ marginBottom: 10 }}>
              <AppButton gap={8}
                onPress={() => toggleCategory(item.id)}
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                <Text>{item.description}</Text>
              </AppButton>

              {isExpanded && item.regulations?.length > 0 && (
                <View style={{ marginLeft: 10, marginTop: 5 , }}>
                  {item.regulations.map((reg) => (
                    <View key={reg.id} style={{ marginVertical: 5, }}>
                      <Text style={{ fontSize: 14 }}>- {reg.title}</Text>
                      <Text style={{ fontSize: 12, color: 'gray' }}>{reg.description}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />
    </Container>
  );
}
