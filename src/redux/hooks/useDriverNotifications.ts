import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../data/store';
import { fetchDriverNotifications, resetNotifications } from '../slices/driverNotificationSlice';

export const useDriverNotifications = () => {
    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((s: RootState) => s.driverNotifications);

    return {
        ...state,
        loadPage: (page: number) => dispatch(fetchDriverNotifications(page)),
        refresh: () => {
            dispatch(resetNotifications());
            dispatch(fetchDriverNotifications(1));
        }
    };
};
