import React, { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import AppModal from '../../common/AppModal';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import AppView from '../../common/AppView';
import IconTickCircle from '../../../assets/icons/IconTickCircle';
import IconNoneTickCircle from '../../../assets/icons/IconNoneTickCircle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../../../context/AppContext';

import { ColorsGlobal } from '../../base/Colors/ColorsGlobal';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSelected: (value: any) => void;
  multiSelect?: boolean;
  areaId: string;
  locationType?: string;
  defaultSelected?: any[];
  editData?: any;
  parentIds?: string | string[] | null;
}

export default function ModalSelectLocationByArea({
  isVisible,
  onClose,
  onSelected,
  multiSelect = false,
  areaId,
  locationType = null, defaultSelected, editData, parentIds
}: Props) {
  console.log('defaultSelected', defaultSelected);

  const [locations, setLocations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentArea, currentAreaAutoTrip } = useAppContext();
  console.log('currentArea: ', currentArea)
  useEffect(() => {
    if (isVisible) {
      setSelected(defaultSelected || []);
    }
  }, [isVisible, defaultSelected]);


  let parent_id = null;

  if (editData) {
    parent_id =
      locationType === 'pickup'
        ? editData?.pickup_level1_ids
        : editData?.dropoff_level1_ids;
  } else {
    parent_id =
      locationType === 'pickup'
        ? currentArea?.level1_pickup_ids
        : currentArea?.level1_dropoff_ids;
  }
  useEffect(() => {
    const ids = parentIds || parent_id;
    if (isVisible && areaId && ids) {
      console.log('ids, locationType: ', ids, locationType);
      fetchLocations(ids, locationType);
    }
  }, [isVisible, areaId, parentIds, locationType]);


  const fetchLocations = async (
    parentIds?: string | string[] | null,
    locationType?: string | null
  ) => {
    try {

      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      const params: any = {};

      if (parentIds) {
        params.parent_id = parentIds;
      }

      if (locationType) {
        params.location_type = locationType;
      }
      console.log('before fetch loation params: ', params)
      console.log('before fetch areaId: ', areaId)
      const areaId_ = areaId || currentArea?.id;
      const res = await axios.get(
        `https://app.xeghepnd.com/api/areas/${areaId_}/locations`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );

      setLocations(res.data.data || []);

    } catch (error) {
      console.log('Fetch location error:', error);
    } finally {
      setLoading(false);
    }
  };

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
      onClose();
    }
  };

  const renderItemTree = (item: any, level = 0) => {
    const isSelected = selected.some(i => String(i.id) === String(item.id));

    return (
      <AppView key={item.id} style={{ marginLeft: level * 16, marginBottom: 10 }}>
        <AppButton height={40} backgroundColor={isSelected ? ColorsGlobal.main + '20' : ColorsGlobal.backgroundLight} paddingHorizontal={12} radius={8} alignItems='center'
          onPress={() => toggleSelect(item)}
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <AppText>{item.name}</AppText>
          {isSelected ? <IconTickCircle /> : <IconNoneTickCircle />}
        </AppButton>

        {item?.all_children?.length > 0 &&
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
      <AppView style={{ flex: 1 }}>

        {loading && <ActivityIndicator />}

        {!loading && (
          <>
            {multiSelect && (
              <AppButton
                onPress={() => {
                  onSelected(selected);
                  onClose();
                }}
                justifyContent='center' alignItems='center' backgroundColor={ColorsGlobal.main} paddingVertical={8} radius={8}
              >
                <AppText color='#fff'>Xác nhận</AppText>
              </AppButton>
            )}
            {groupedData.pickup.length > 0 && (
              <AppView marginTop={multiSelect ? 16 : 0}>

                <AppText style={{ fontWeight: 'bold', marginBottom: 10 }}>
                  Điểm đón
                </AppText>
                {groupedData.pickup.map(item => renderItemTree(item))}
              </AppView>
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


      </AppView>
    </AppModal >
  );
}