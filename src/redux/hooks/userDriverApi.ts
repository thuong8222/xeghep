// redux/hooks/useDriverApi.ts
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { AppDispatch, RootState } from '../data/store';
import { fetchDriver, updateDriver, clearDriverMessages,   changeDriverPassword  } from '../slices/driverSlice';

export const useDriverApi = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { driver, loading, error, successMessage } = useSelector((state: RootState) => state.driver);

  const getDriver = useCallback(async () => {
    return dispatch(fetchDriver()).unwrap();
  }, [dispatch]);

  const editDriver = useCallback(async (payload: Partial<typeof driver>) => {
    return dispatch(updateDriver(payload)).unwrap();
  }, [dispatch]);

  const changePassword = useCallback(
    async (payload: { current_password: string; password: string; confirm_password: string }) => {
      return dispatch(changeDriverPassword(payload)).unwrap();
    },
    [dispatch]
  );
  const clear = useCallback(() => {
    dispatch(clearDriverMessages());
  }, [dispatch]);

  return {
    driver,
    loading,
    error,
    successMessage,
    getDriver,
    editDriver,
    changePassword,
    clear,
  };
};
