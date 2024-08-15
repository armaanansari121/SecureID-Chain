"use client";

import React, { createContext, useState, useContext } from 'react';

interface ContractContextType {
  IdContract: string;
  setIdContract: (value: string) => void;
  CheckPointContract: string;
  setCheckPointContract: (value: string) => void;
  GeoLocationContract: string;
  setGeoLocationContract: (value: string) => void;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [IdContract, setIdContract] = useState<string>('');
  const [CheckPointContract, setCheckPointContract] = useState<string>('');
  const [GeoLocationContract, setGeoLocationContract] = useState<string>('');
  return (
    <ContractContext.Provider value={{IdContract, setIdContract, CheckPointContract, setCheckPointContract, GeoLocationContract, setGeoLocationContract}}>
      {children}
    </ContractContext.Provider>
  );

  
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};