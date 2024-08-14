// pages/index.tsx
"use client";
import { NextPage } from "next";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import ParallaxSection from "@/components/ParallaxSection";
import CarouselSection from "./CarouselSection";

const Home: NextPage = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600">
      <Head>
        <title>SecureID Chain - Blockchain-Based ID Card System</title>
        <meta
          name="description"
          content="Secure, immutable, and decentralized identity management"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ParallaxSection>
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">SecureID Chain</h1>
            <h2 className="text-2xl mb-8">
              Revolutionizing Identity Management with Blockchain Technology
            </h2>
            <Button size="lg">Get Started</Button>
          </div>
        </ParallaxSection>

        <ParallaxSection>
          <CarouselSection />
        </ParallaxSection>

        <ParallaxSection>
          <div className="text-center text-white w-3/5">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl mb-8">
              SecureID Chain uses advanced blockchain technology to create a
              secure, decentralized identity management system. Your personal
              information is encrypted and stored across a distributed network,
              ensuring maximum security and privacy.
            </p>
            <Button
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-purple-600 transition-colors duration-300"
            >
              Learn More
            </Button>
          </div>
        </ParallaxSection>

        <ParallaxSection>
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Join the Future of Identity Management
            </h2>
            <p className="text-xl mb-8">
              Be part of the revolution. Secure your identity with blockchain
              technology today.
            </p>
            <Button size="lg">Sign Up Now</Button>
          </div>
        </ParallaxSection>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4">
        © 2024 SecureID Chain. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
