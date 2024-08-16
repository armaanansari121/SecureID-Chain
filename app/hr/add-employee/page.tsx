"use client";

import { FC, useState, useEffect } from "react";
import AddEmployeeForm from "./AddEmployeeForm";
import Web3 from "web3";
import { idManagementAddress } from "../../web3/client";
import idManagementABI from "../../web3/abis/idManagement.json";
import Loader from "@/components/Loader";
import { ethers } from "ethers";
import { keccak256 } from "ethers"; // Ethers.js keccak256

const HR_ROLE = keccak256(ethers.toUtf8Bytes("HR_ROLE")); // Hashing the HR_ROLE

const RolesPage: FC = () => {
  const [isHR, setIsHR] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkHRRole = async () => {
      try {
        if (typeof window !== "undefined" && window.ethereum) {
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(
            idManagementABI,
            idManagementAddress
          );

          const accounts = await web3.eth.requestAccounts();
          const account = accounts[0];

          const hasRole = await contract.methods
            .hasRole(HR_ROLE, account)
            .call();

          setIsHR(hasRole);
        } else {
          console.error("Ethereum wallet is not available");
          setIsHR(false);
        }
      } catch (error) {
        console.error("Error checking HR role:", error);
        setIsHR(false);
      } finally {
        setLoading(false);
      }
    };

    checkHRRole();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!isHR) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
          <p className="text-gray-700">You do not have HR permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-semibold text-gray-700 text-center mb-8 mt-24">
        Add Employee
      </h1>
      <div className="flex justify-center">
        <AddEmployeeForm />
      </div>
    </div>
  );
};

export default RolesPage;
