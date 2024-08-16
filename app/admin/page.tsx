"use client";

import { FC, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Web3 from "web3";
import { idManagementAddress } from "../web3/client";
import idManagementABI from "../web3/abis/idManagement.json";
import Loader from "@/components/Loader";
import { ethers } from "ethers";
import { keccak256 } from "ethers"; // Ethers.js keccak256

const roles = [
  {
    label: "HR",
    value: "HR_ROLE",
  },
  {
    label: "Manager",
    value: "MANAGER_ROLE",
  },
  {
    label: "Admin",
    value: "ADMIN_ROLE",
  },
];

const ADMIN_ROLE = keccak256(ethers.toUtf8Bytes("ADMIN_ROLE")); // Hashing the ADMIN_ROLE

const RolesPage: FC = () => {
  console.log(ADMIN_ROLE);
  const [grantRole, setGrantRole] = useState<string>("");
  const [revokeRole, setRevokeRole] = useState<string>("");
  const [grantAddress, setGrantAddress] = useState<string>("");
  const [revokeAddress, setRevokeAddress] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminRole = async () => {
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
            .hasRole(ADMIN_ROLE, account)
            .call();

          setIsAdmin(hasRole);
        } else {
          console.error("Ethereum wallet is not available");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, []);

  if (loading) {
    return <Loader />; // Replace this with your loader component
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
          <p className="text-gray-700">You are not an admin.</p>
        </div>
      </div>
    );
  }

  const handleGrantRole = async (e: any) => {
    e.preventDefault();
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
          idManagementABI,
          idManagementAddress
        );

        const accounts = await web3.eth.requestAccounts();
        const account = accounts[0];

        await contract.methods
          .addRole(grantRole, grantAddress)
          .send({ from: account });

        console.log("Role granted successfully");
      } else {
        console.error("Ethereum wallet is not available");
      }
    } catch (error) {
      console.error("Error granting role:", error);
    }
  };

  const handleRevokeRole = async (e: any) => {
    e.preventDefault();
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
          idManagementABI,
          idManagementAddress
        );

        const accounts = await web3.eth.requestAccounts();
        const account = accounts[0];

        await contract.methods
          .removeRole(revokeRole, revokeAddress)
          .send({ from: account });

        console.log("Role revoked successfully");
      } else {
        console.error("Ethereum wallet is not available");
      }
    } catch (error) {
      console.error("Error revoking role:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-semibold text-gray-700 text-center mb-8 mt-24">
        Role Management
      </h1>
      <div className="flex space-x-4">
        <Card className="w-1/2 p-6">
          <form onSubmit={handleGrantRole}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Grant Role
              </label>
              <Select onValueChange={(value) => setGrantRole(value)}>
                <SelectTrigger className="mt-1 block w-full">
                  <SelectValue placeholder="Select a Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                User Address
              </label>
              <Input
                type="text"
                placeholder="0x..."
                value={grantAddress}
                onChange={(e) => setGrantAddress(e.target.value)}
                className="mt-1 block w-full"
              />
            </div>
            <Button className="mt-4 w-full" type="submit">
              Grant Role
            </Button>
          </form>
        </Card>
        <Card className="w-1/2 p-6">
          <form onSubmit={handleRevokeRole}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Revoke Role
              </label>
              <Select onValueChange={(value) => setRevokeRole(value)}>
                <SelectTrigger className="mt-1 block w-full">
                  <SelectValue placeholder="Select a Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                User Address
              </label>
              <Input
                type="text"
                placeholder="0x..."
                value={revokeAddress}
                onChange={(e) => setRevokeAddress(e.target.value)}
                className="mt-1 block w-full"
              />
            </div>
            <Button className="mt-4 w-full" type="submit">
              Revoke Role
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RolesPage;
