"use client";

import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Web3 from "web3";
import { idManagementAddress } from "../web3/client";
import idManagementABI from "../web3/abis/idManagement.json";

const AddCertificationForm: FC = () => {
  const [employeeAddress, setEmployeeAddress] = useState<string>("");
  const [certification, setCertification] = useState<string>("");

  const handleAddCertification = async (e: any) => {
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
          .addCertification(employeeAddress, certification)
          .send({ from: account });

        console.log("Certification added successfully");
      } else {
        console.error("Ethereum wallet is not available");
      }
    } catch (error) {
      console.error("Error adding certification:", error);
    }
  };

  return (
    <Card className="w-1/2 p-6">
      <form onSubmit={handleAddCertification}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Employee Address
          </label>
          <Input
            type="text"
            placeholder="0x..."
            value={employeeAddress}
            onChange={(e) => setEmployeeAddress(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Certification
          </label>
          <Input
            type="text"
            placeholder="Enter certification"
            value={certification}
            onChange={(e) => setCertification(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <Button className="mt-4 w-full" type="submit">
          Add Certification
        </Button>
      </form>
    </Card>
  );
};

export default AddCertificationForm;
