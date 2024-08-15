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
import { useContract } from "../_contexts";

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

const RolesPage: FC = () => {
  const { IdContract, account } = useContract();
  const [grantRole, setGrantRole] = useState<string>("");
  const [revokeRole, setRevokeRole] = useState<string>("");
  const [grantAddress, setGrantAddress] = useState<string>("");
  const [revokeAddress, setRevokeAddress] = useState<string>("");

  const handleGrantRole = async (e: any) => {
    e.preventDefault();

    if (!IdContract || !account) {
      console.error("Contract or account not available");
      return;
    }

    try {
      const transaction = await IdContract.methods
        .addRole(grantRole, grantAddress)
        .send({ from: account });

      console.log("Role granted successfully:", transaction);
    } catch (error) {
      console.error("Error granting role:", error);
    }
  };

  const handleRevokeRole = async (e: any) => {
    e.preventDefault();

    if (!IdContract || !account) {
      console.error("Contract or account not available");
      return;
    }

    try {
      const transaction = await IdContract.methods
        .removeRole(revokeRole, revokeAddress)
        .send({ from: account });

      console.log("Role revoked successfully:", transaction);
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
