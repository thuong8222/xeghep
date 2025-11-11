// hooks/useAuthApi.ts
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

import { loginUser, registerUser, forgotPassword, clearMessages } from '../slices/ authSlice';
import { AppDispatch, RootState } from '../data/store';

export const useAuthApi = () => {
    const dispatch = useDispatch<AppDispatch>();
  const { loading, error, successMessage, token } = useSelector((state: RootState) => state.auth);

  // login với unwrap trực tiếp
  const login = useCallback(
    async (payload: { phone: string; password: string }) => {
      return dispatch(loginUser(payload)).unwrap(); // <- dùng dispatch ở đây
    },
    [dispatch]
  );

  const register = useCallback(
    async (payload: { full_name: string; phone: string; password: string; confirm_password: string; area: string }) => {
      const resultAction = await dispatch(registerUser(payload));
      return resultAction;
    },
    [dispatch]
  );

  const forgot = useCallback(
    async (payload: { phone: string }) => {
      const resultAction = await dispatch(forgotPassword(payload));
      return resultAction;
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  return {
    loading,
    error,
    successMessage,
    token,
    login,
    register,
    forgot,
    clear,
  };
};
