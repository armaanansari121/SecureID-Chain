"use client";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Web3 from "web3";
import { useEffect, useState } from "react";
import { idManagementAddress } from "../web3/client"; // Make sure this path is correct
import idManagementABI from "../web3/abis/idManagement.json"; // Ensure this path is correct
import Loader from "@/components/Loader";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

interface EmployeeData {
  name: string;
  role: string;
  active: boolean;
  lastUpdated: number;
  certifications: string[];
  ipfsHash: string;
  locationHistory: {
    latitude: string;
    longitude: string;
    timestamp: number;
    checkpointId: number;
  }[];
}

const EmployeeProfile: NextPage = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts[0]);

        const IdContract = new web3.eth.Contract(
          idManagementABI,
          idManagementAddress
        );
        console.log(IdContract);

        try {
          const data = await IdContract.methods.getEmployee(accounts[0]).call();
          setEmployeeData(data);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadBlockchainData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!employeeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md max-w-sm text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>No employee data found.</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {employeeData.name}
            </h1>
            <h2 className="text-2xl text-gray-600 mb-6">{employeeData.role}</h2>
            <div className="relative w-40 h-40 mx-auto mb-6">
              <Image
                src="/images/employee-placeholder.png" // Replace with the actual image path
                alt="Employee Image"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Status:</strong>{" "}
              {employeeData.active ? "Active" : "Inactive"}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Last Updated:</strong>{" "}
              {new Date(
                Number(employeeData.lastUpdated) * 1000
              ).toLocaleDateString()}
            </p>
            <div className="mb-6">
              <Button
                variant="outline"
                className="bg-blue-600 text-white"
                onClick={openModal}
              >
                View Certifications
              </Button>
            </div>

            {isModalOpen && (
              <DialogOverlay onDismiss={closeModal} className="z-20 mt-20">
                <DialogContent
                  aria-label="Certifications"
                  className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Certifications:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4">
                    {employeeData.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="bg-blue-600 text-white mt-4"
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                </DialogContent>
              </DialogOverlay>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default EmployeeProfile;
