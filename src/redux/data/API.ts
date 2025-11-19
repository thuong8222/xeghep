// Route::get('/', [PointsForSaleController::class, 'index']);
//     Route::get('/history_transaction', [PointsForSaleController::class, 'historyTransaction']);

//     Route::post('/create_sale', [PointsForSaleController::class, 'createSale']);
//     Route::post('{id}/buy', [PointsForSaleController::class, 'buy']);
//     Route::post('{id}/transfer_proof', [PointsForSaleController::class, 'uploadTransferProof']);
//     Route::post('{id}/confirm', [PointsForSaleController::class, 'confirm']);
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConfig from '../../services/config';

const api = axios.create({
  baseURL: AppConfig.BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});
const apiFormData = axios.create({
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

// ==== POINT ====
export const getPoints = async () => {
  return api.get('api/points');
};

export const getHistoryTrandsactionPoints = async () => {
  return api.get('api/points/history_transaction');
};
export const createSale = async (data: any) => {
  return api.post('api/points/create_sale', data);
};

export const buyPoint = async (id: string, data: any) => {
  return api.post(`api/points/${id}/buy`, data);
};

export const uploadTransferProof = async (id: string, formData: FormData) => {
  return apiFormData.post(`api/points/${id}/transfer_proof`, formData);
};

export const confirmPoint = async (id: string) => {
  return api.post(`api/points/${id}/confirm`);
};
