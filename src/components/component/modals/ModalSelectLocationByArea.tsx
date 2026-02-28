import React, { useEffect, useState, useMemo } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import AppModal from '../../common/AppModal';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import AppView from '../../common/AppView';
import IconTickCircle from '../../../assets/icons/IconTickCircle';
import IconNoneTickCircle from '../../../assets/icons/IconNoneTickCircle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../../../context/AppContext';
import { compatibilityFlags } from 'react-native-screens';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSelected: (value: any) => void;
  multiSelect?: boolean;
  areaId: string;
  locationType?: string;
  defaultSelected?: any[]; // ⭐ thêm dòng này
}

export default function ModalSelectLocationByArea({
  isVisible,
  onClose,
  onSelected,
  multiSelect = false,
  areaId,
  locationType = null, defaultSelected
}: Props) {

  const [locations, setLocations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentArea } = useAppContext();
  useEffect(() => {
    if (isVisible) {
      setSelected(defaultSelected || []);
    }
  }, [isVisible]);
  // 🔥 Fetch khi mở modal
  useEffect(() => {
    if (isVisible && areaId) {
      const parentId = locationType === 'pickup' ? currentArea?.level1_pickup_ids : currentArea?.level1_dropoff_ids;
      fetchLocations({ parentId: parentId, locationType: locationType });
    }
  }, [isVisible, areaId]);

  const fetchLocations = async (
    parentIds?: string | string[] | null,
    locationType?: string | null
  ) => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      const params: any = {};

      if (parentIds) {
        params.parent_id = parentIds?.parentId; // có thể là string hoặc array
      }

      if (locationType) {
        params.location_type = locationType;
      }
      console.log('params fetchLocations: ', params)
      const res = await axios.get(
        `https://app.xeghepnd.com/api/areas/${areaId}/locations`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );
      console.log('res locations: ', res);
      setLocations(res.data.data || []);

    } catch (error) {
      console.log('Fetch location error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group pickup / dropoff
  const groupedData = useMemo(() => {
    const pickup = locations.filter(i => i.location_type === 'pickup');
    const dropoff = locations.filter(i => i.location_type === 'dropoff');
    return { pickup, dropoff };
  }, [locations]);

  const toggleSelect = (item: any) => {
    if (multiSelect) {
      const exists = selected.some(
        i => String(i.id) === String(item.id)
      );

      if (exists) {
        setSelected(prev =>
          prev.filter(i => String(i.id) !== String(item.id))
        );
      } else {
        setSelected(prev => [...prev, item]);
      }
    } else {
      onSelected(item);
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  const renderItemTree = (item: any, level = 0) => {
    const isSelected = selected.find(i => i.id === item.id);
    return (
      <AppView key={item.id} style={{ marginLeft: level * 16, marginBottom: 10 }}>
        <AppButton height={40}
          onPress={() => toggleSelect(item)}
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <AppText>{item.name}</AppText>
          {isSelected ? <IconTickCircle /> : <IconNoneTickCircle />}
        </AppButton>

        {item.all_children?.length > 0 &&
          item.all_children.map((child: any) =>
            renderItemTree(child, level + 1)
          )}
      </AppView>
    );
  };

  return (
    <AppModal
      isVisible={isVisible}
      onClose={onClose}
      heightPercent={0.8}
    >
      <AppView style={{ padding: 16, flex: 1 }}>

        {loading && <ActivityIndicator />}

        {!loading && (
          <>
            {groupedData.pickup.length > 0 && (
              <>
                <AppText style={{ fontWeight: 'bold', marginBottom: 10 }}>
                  Điểm đón
                </AppText>
                {groupedData.pickup.map(item => renderItemTree(item))}
              </>
            )}

            {groupedData.dropoff.length > 0 && (
              <>
                <AppText style={{ fontWeight: 'bold', marginVertical: 10 }}>
                  Điểm trả
                </AppText>
                {groupedData.dropoff.map(item => renderItemTree(item))}
              </>
            )}
          </>
        )}

        {multiSelect && (
          <AppButton
            title="Xác nhận"
            onPress={() => {
              onSelected(selected);
              onClose();
            }}
          />
        )}
      </AppView>
    </AppModal>
  );
}