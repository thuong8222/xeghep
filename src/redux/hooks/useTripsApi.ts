// redux/hooks/useTripsApi.ts
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { AppDispatch, RootState } from '../data/store';
import { fetchTrips, clearTripsMessages } from '../slices/tripsSlice';
import { FetchTripsPayload, Trip, DriverArea } from '../slices/tripsSlice';

export const useTripsApi = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { trips, driver_areas, input_area_id, trips_count, loading, error, successMessage } =
    useSelector((state: RootState) => state.trips);

  // Lấy danh sách trips
  const getTrips = useCallback(async (payload: FetchTripsPayload) => {
    return dispatch(fetchTrips(payload)).unwrap();
  }, [dispatch]);

  // Clear message / error
  const clear = useCallback(() => {
    dispatch(clearTripsMessages());
  }, [dispatch]);

  return {
    trips,
    driver_areas,
    input_area_id,
    trips_count,
    loading,
    error,
    successMessage,
    getTrips,
    clear,
  };
};
