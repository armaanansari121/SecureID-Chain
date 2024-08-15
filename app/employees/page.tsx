// pages/employee-profile.tsx
"use client";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EmployeeProfile: NextPage = () => {
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
            <h1 className="text-4xl font-bold text-gray-800 mb-4">John Doe</h1>
            <h2 className="text-2xl text-gray-600 mb-6">Software Engineer</h2>
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
              <strong>Status:</strong> Active
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Last Updated:</strong> August 15, 2024
            </p>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Certifications:
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Blockchain Fundamentals</li>
                <li>Ethereum Development</li>
                <li>Advanced Solidity</li>
              </ul>
            </div>
            <Button variant="outline" className="bg-blue-600 text-white">
              View Certification
            </Button>
          </div>
        </Card>
      </main>
      {/* 
      <footer className="bg-gray-800 text-white text-center py-4 mt-8">
        © 2024 SecureID Chain. All rights reserved.
      </footer> */}
    </div>
  );
};

export default EmployeeProfile;
