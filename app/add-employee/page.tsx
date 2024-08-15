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
import { idManagementContract } from "../web3/client";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

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

const RolesPage: FC = () => {
  const { mutate: sendTransaction } = useSendTransaction();
  const [employeeName, setEmployeeName] = useState<string>("");
  const [employeeRole, setEmployeeRole] = useState<string>("");
  const [employeeAddress, setEmployeeAddress] = useState<string>("");
  const [employeeIpfs, setEmployeeIpfs] = useState<string>("");

  const handleAddEmployee = (e: any) => {
    e.preventDefault();
    console.log(employeeName, employeeAddress, employeeRole, employeeIpfs);
    const transaction = prepareContractCall({
      contract: idManagementContract,
      method:
        "function addEmployee(string _name, string _role, address _employeeAddress, string _imageIpfs)",
      params: [employeeName, employeeRole, employeeAddress, employeeIpfs],
    });
    sendTransaction(transaction);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-semibold text-gray-700 text-center mb-8 mt-24">
        Add Employee
      </h1>
      <div className="flex justify-center">
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
      </div>
    </div>
  );
};

export default RolesPage;
