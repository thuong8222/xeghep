import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


interface AppContextType {
  updatePoints:string;
  setIdArea: (val: string) => void;
  idArea: string;
  setUpdatePoints: (val: string) => void;
  updateTrips:string;
  setUpdateTrips: (val: string) => void;
currentDriver: string;
  setCurrentDriver: (val: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
};

export const ContextProvider = ({ children }: { children: ReactNode }) => {
const [idArea, setIdArea] = useState('');
const [updatePoints,setUpdatePoints] = useState('');
const [updateTrips,setUpdateTrips] = useState('');
const [currentDriver, setCurrentDriver] = useState('');
  return (
    <AppContext.Provider value={{
      idArea, setIdArea,
      updatePoints,setUpdatePoints,
      updateTrips,setUpdateTrips,
      currentDriver, setCurrentDriver
    }}>
      {children}
    </AppContext.Provider>
  );
};
