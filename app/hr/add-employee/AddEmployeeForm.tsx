"use client";

import { FC, useState } from "react";
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
import { idManagementAddress } from "../../web3/client";
import idManagementABI from "../../web3/abis/idManagement.json";

const roles = [
  {
    label: "Driver",
    value: "DRIVER_ROLE",
  },
  {
    label: "Guard",
    value: "GUARD_ROLE",
  },
];

const AddEmployeeForm: FC = () => {
  const [employeeName, setEmployeeName] = useState<string>("");
  const [employeeRole, setEmployeeRole] = useState<string>("");
  const [employeeAddress, setEmployeeAddress] = useState<string>("");
  const [employeeIpfs, setEmployeeIpfs] = useState<string>("");

  const handleAddEmployee = async (e: any) => {
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
          .addEmployee(
            employeeName,
            employeeRole,
            employeeAddress,
            employeeIpfs
          )
          .send({ from: account });

        console.log("Employee added successfully");
      } else {
        console.error("Ethereum wallet is not available");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <Card className="w-1/2 p-6">
      <form onSubmit={handleAddEmployee}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Employee Name
          </label>
          <Input
            type="text"
            placeholder="Enter name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Employee Role
          </label>
          <Select onValueChange={(value) => setEmployeeRole(value)}>
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
            IPFS Image Hash
          </label>
          <Input
            type="text"
            placeholder="Qm..."
            value={employeeIpfs}
            onChange={(e) => setEmployeeIpfs(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <Button className="mt-4 w-full" type="submit">
          Add Employee
        </Button>
      </form>
    </Card>
  );
};

export default AddEmployeeForm;
