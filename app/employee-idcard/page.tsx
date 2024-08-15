// pages/employee-profile.tsx
"use client";

import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContract } from "../_contexts";
import { useEffect, useState } from "react";

interface LocationHistory {
  latitude: string;
  longitude: string;
  timestamp: number;
  checkpointId: number;
}

interface EmployeeData {
  name: string;
  role: string;
  active: boolean;
  lastUpdated: number;
  certifications: string[];
  ipfsHash: string;
  locationHistory: LocationHistory[];
}

const EmployeeProfile: NextPage = () => {
  const { IdContract, account } = useContract();
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!IdContract || !account) {
        console.error("Contract or account not available");
        setIsLoading(false);
        return;
      }

      try {
        const data = await IdContract.methods.getEmployee(account).call();
        setEmployeeData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [IdContract, account]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen pt-24 flex items-center justify-center">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen pt-24 flex items-center justify-center">
        <p className="text-white text-2xl">No employee data found.</p>
      </div>
    );
  }

  const { name, role, active, lastUpdated, certifications, ipfsHash } = employeeData;

  const formattedDate = new Date(lastUpdated * 1000).toLocaleDateString();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen pt-24">
      <Head>
        <title>Employee Profile - SecureID Chain</title>
        <meta name="description" content="Employee profile details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8">
        <Card className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{name}</h1>
            <h2 className="text-2xl text-gray-600 mb-6">{role}</h2>
            <div className="relative w-40 h-40 mx-auto mb-6">
              {ipfsHash ? (
                <Image
                  src={`https://ipfs.io/ipfs/${ipfsHash}`}
                  alt="Employee Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <Image
                  src="/images/employee-placeholder.png" // Placeholder image
                  alt="Employee Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              )}
            </div>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Status:</strong> {active ? "Active" : "Inactive"}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Last Updated:</strong> {formattedDate}
            </p>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Certifications:
              </h3>
              {certifications && certifications.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700">
                  {certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">No certifications available.</p>
              )}
            </div>
            <Button variant="outline" className="bg-blue-600 text-white">
              View Certification
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default EmployeeProfile;
