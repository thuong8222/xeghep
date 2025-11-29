import { useEffect } from "react";
import { useDriverNotifications } from "../../redux/hooks/useDriverNotifications";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";

import Container from "../../components/common/Container";
import { ColorsGlobal } from "../../components/base/Colors/ColorsGlobal";
import { clearMessages } from "../../redux/slices/ authSlice";
import AppView from "../../components/common/AppView";
import AppText from "../../components/common/AppText";
import moment from "moment";

export default function NotificationScreen() {
  const {
    items,
    page,
    lastPage,
    loading,
    loadingMore,
    refreshing,
    loadPage,
    refresh,
  } = useDriverNotifications();

  useEffect(() => {
    loadPage(1);
  }, []);
console.log(items);
  const loadMore = () => {
    if (loadingMore || page >= lastPage) return;
    loadPage(page + 1);
  };

  const onRefresh = () => {
    refresh();
  };

  const renderItem = ({ item }) => (
    <AppView style={{ padding: 15, backgroundColor:ColorsGlobal.backgroundLight, marginBottom: 10, borderRadius: 8 }}>
      <AppView>
      <AppText bold>{item.title}</AppText>
      <AppText style={{ marginTop: 4 }}>{item.content}</AppText>
      </AppView>
      <AppText fontSize={12} textAlign="right" color={ColorsGlobal.textLight}>{moment(item.created_at).format('DD/MM/YYYY hh:mm')}</AppText>
     
    </AppView>
  );

  return (
    <Container loading={loading}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 15 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Text>Không có thông báo nào</Text>
            </View>
          ) : null
        }
      />
    </Container>
  );
}
