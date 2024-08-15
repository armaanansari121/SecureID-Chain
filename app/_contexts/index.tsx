"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import Web3 from "web3";
import { IDManagement_ABI } from "../web3/abis/idManagement";
import { CheckPoint_ABI } from "../web3/abis/checkpointManagement";
import { GeoLocation_ABI } from "../web3/abis/geoLocation";
import { checkpointManagementAddress, geolocationAddress, idManagementAddress } from "../web3/client";

interface ContractContextType {
  IdContract: any;
  CheckPointContract: any;
  GeoLocationContract: any;
  account: string | null;
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [IdContract, setIdContract] = useState<any>(null);
  const [CheckPointContract, setCheckPointContract] = useState<any>(null);
  const [GeoLocationContract, setGeoLocationContract] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const connectContracts = async () => {
      if (!window.ethereum) {
        console.error("No Ethereum provider found");
        return;
      }

      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);

        // Fetch the account
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

      

        // Instantiate the contracts
        const idContractInstance = new web3.eth.Contract(
          IDManagement_ABI,
          idManagementAddress
        );
        const checkPointContractInstance = new web3.eth.Contract(
          CheckPoint_ABI,
          checkpointManagementAddress
        );
        const geoLocationContractInstance = new web3.eth.Contract(
          GeoLocation_ABI,
          geolocationAddress
        );

        // Set the contracts in the state
        setIdContract(idContractInstance);
        setCheckPointContract(checkPointContractInstance);
        setGeoLocationContract(geoLocationContractInstance);
      } catch (error) {
        console.error("Failed to load web3, accounts, or contracts:", error);
      }
    };

    connectContracts();
  }, []);

  console.log(IdContract, CheckPointContract, GeoLocationContract, account);

  return (
    <ContractContext.Provider
      value={{ IdContract, CheckPointContract, GeoLocationContract, account }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
