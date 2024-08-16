// Dashboard.tsx
"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard: FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen pt-24">
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Dashboard
        </h1>
        <div className="flex justify-center space-x-8">
          <Card className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Admin Section
              </h2>
              <a href="/admin" className="inline-block">
                <Button variant="outline" className="bg-blue-600 text-white">
                  Go to Admin
                </Button>
              </a>
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                HR Section
              </h2>
              <a href="/hr" className="inline-block">
                <Button variant="outline" className="bg-blue-600 text-white">
                  Go to HR
                </Button>
              </a>
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Manager Section
              </h2>
              <a href="/manager" className="inline-block">
                <Button variant="outline" className="bg-blue-600 text-white">
                  Go to Manager
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
