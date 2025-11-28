import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import AppText from '../../components/common/AppText';
import { fetchPrivacy, fetchTerms } from '../../redux/slices/termsPolicySlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/data/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HtmlContent from '../../components/component/HtmlContent';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

interface Props {
  route: {
    params: {
      typeScreen: 'terms' | 'privacy';
    };
  };
  navigation: AuthNavProp;
}

export default function BlankScreen({ route, navigation }: Props) {
  const { typeScreen } = route.params;
  const dispatch = useDispatch<AppDispatch>();

  const { termsData, privacyData, loadingTerms, loadingPrivacy, errorTerms, errorPrivacy } =
    useSelector((state: RootState) => state.terms);

  // Chọn data/loading/error dựa vào typeScreen
  const dataToShow = typeScreen === 'terms' ? termsData : privacyData;
  const loading = typeScreen === 'terms' ? loadingTerms : loadingPrivacy;
  const error = typeScreen === 'terms' ? errorTerms : errorPrivacy;

  // Call API khi mount
  useEffect(() => {
    if (typeScreen === 'terms') {
      dispatch(fetchTerms());
    } else {
      dispatch(fetchPrivacy());
    }
  }, [dispatch, typeScreen]);

  // Cập nhật header title
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <AppText fontWeight={700}>{dataToShow?.title || ''}</AppText>,
    });
  }, [navigation, dataToShow]);

  // Render loading / error
  if (loading) return <ActivityIndicator size="large" color={ColorsGlobal.main} style={{ flex: 1 }} />;
  if (error) return <Text style={{ flex: 1, padding: 16 }}>Error: {error}</Text>;

  // Render content
  const insets = useSafeAreaInsets()
  return (
    <ScrollView style={{ flexGrow: 1, backgroundColor: ColorsGlobal.backgroundWhite }} contentContainerStyle={[styles.container, { paddingBottom: insets.bottom }]}>
    <HtmlContent html={dataToShow?.content} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
