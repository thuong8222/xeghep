// redux/hooks/useAreaApi.ts
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { AppDispatch, RootState } from '../data/store';


import { clearAreaMessages, fetchAreaGroups } from '../slices/areasSlice';

export const useAreaApi = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, loading, error, successMessage } = useSelector(
    (state: RootState) => state.areas
  );

  // Lấy danh sách area groups
  const getAreas = useCallback(async () => {
    return dispatch(fetchAreaGroups()).unwrap();
  }, [dispatch]);

  // Clear message / error
  const clear = useCallback(() => {
    dispatch(clearAreaMessages());
  }, [dispatch]);

  return {
    groups, // mảng area groups
    loading,
    error,
    successMessage,
    getAreas,
    clear,
  };
};
