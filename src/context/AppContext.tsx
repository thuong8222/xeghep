import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Area {
  id: string;
  name: string;
  code: string;
  province_code: string;
  description: string;
  is_active: number;
  place_start: string;
  place_end: string;
  created_at?: string;
  updated_at?: string;
}
interface AppContextType {
  updatePoints: string;
  setIdArea: (val: string) => void;
  idArea: string;
  setUpdatePoints: (val: string) => void;
  updateTrips: string;
  setUpdateTrips: (val: string) => void;
  currentDriver: string;
  setCurrentDriver: (val: string) => void;
  currentArea: Area | null;
  setCurrentArea: (val: Area | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
};

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [idArea, setIdArea] = useState('');
  const [updatePoints, setUpdatePoints] = useState('');
  const [updateTrips, setUpdateTrips] = useState('');
  const [currentDriver, setCurrentDriver] = useState('');
  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  return (
    <AppContext.Provider value={{
      idArea, setIdArea,
      updatePoints, setUpdatePoints,
      updateTrips, setUpdateTrips,
      currentDriver, setCurrentDriver,
      currentArea, setCurrentArea
    }}>
      {children}
    </AppContext.Provider>
  );
};
