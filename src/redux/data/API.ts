// Route::get('/', [PointsForSaleController::class, 'index']);
//     Route::get('/history_transaction', [PointsForSaleController::class, 'historyTransaction']);

//     Route::post('/create_sale', [PointsForSaleController::class, 'createSale']);
//     Route::post('{id}/buy', [PointsForSaleController::class, 'buy']);
//     Route::post('{id}/transfer_proof', [PointsForSaleController::class, 'uploadTransferProof']);
//     Route::post('{id}/confirm', [PointsForSaleController::class, 'confirm']);
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConfig from '../../services/config';

export const api = axios.create({
  baseURL: AppConfig.BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});
export const apiFormData = axios.create({
  baseURL: AppConfig.BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});
apiFormData.interceptors.request.use(async configFormData => {
  const token = await AsyncStorage.getItem('token');
  if (token) configFormData.headers.Authorization = `Bearer ${token}`;
  return configFormData;
});
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const api_hastoken = axios.create({
  baseURL: AppConfig.BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Thêm interceptor
api_hastoken.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==== POINT ====
export const getPoints = async () => {
  return api.get('api/points');
};

interface PointHistoryParams {
  start_date: number;
  end_date: number;
}

export const getHistoryTrandsactionPoints = async (params: PointHistoryParams) => {
  return api.get('api/points/history_transaction', { params });
};
export const createSale = async (data: any) => {
  return api.post('api/points/create_sale', data);
};

export const buyPoint = async (id: string, data: any) => {
  return api.post(`api/points/${id}/buy`, data);
};
export const historyPointAPI = async () => {
  return api.get(`api/points/historyPoint`);
};
export const cancelSalePointAPI = async (id: string) => {
  return api.post(`api/points/${id}/cancel`);
};
export const pauseSalePointAPI = async (id: string) => {
  return api.post(`api/points/${id}/pause`);
};
export const resumeSalePointAPI = async (id: string) => {
  return api.post(`api/points/${id}/resume`);
};

export const confirmPoint = async (id: string) => {
  return api.post(`api/points/${id}/confirm`);
};
