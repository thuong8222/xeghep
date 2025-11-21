// context/EchoProvider.tsx
import React, { createContext, useEffect } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchPointsForSale } from '../redux/slices/pointSlice';

interface Props {
  children: React.ReactNode;
  sellerId: string;
}

export const EchoContext = createContext<Echo | null>(null);

export const EchoProvider: React.FC<Props> = ({ children, sellerId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const echo = new Echo({
      broadcaster: 'pusher',
      key: 'your_app_key',
      cluster: 'mt1',
      forceTLS: true,
      client: new Pusher('your_app_key', {
        cluster: 'mt1',
        forceTLS: true,
      }),
    });

    echo.channel(`points-for-sale.${sellerId}`)
      .listen('.point.bought', (data: any) => {
        console.log('Point bought:', data);
        Alert.alert('Thông báo', `Có người mua ${data.points_amount} điểm. Xác nhận ngay!`);
        dispatch(fetchPointsForSale());
      });

    return () => {
      echo.leave(`points-for-sale.${sellerId}`);
    };
  }, [sellerId]);

  return (
    <EchoContext.Provider value={null}>
      {children}
    </EchoContext.Provider>
  );
};
