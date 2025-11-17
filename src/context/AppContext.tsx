import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


interface AppContextType {
 
  idArea: string;
  setIdArea: (val: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
};

export const ContextProvider = ({ children }: { children: ReactNode }) => {
const [idArea, setIdArea] = useState('');
  return (
    <AppContext.Provider value={{
      idArea, setIdArea
    }}>
      {children}
    </AppContext.Provider>
  );
};
