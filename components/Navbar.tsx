"use client";
import { client } from "@/app/web3/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ConnectButton } from "thirdweb/react";

const Navbar: React.FC = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`fixed w-full z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-opacity-90 bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            SecureID Chain
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/employees" className="hover:text-gray-300">
              Employees
            </Link>
            <Link href="/checkpoints" className="hover:text-gray-300">
              Checkpoints
            </Link>
            <Link href="/roles" className="hover:text-gray-300">
              Roles
            </Link>
            <Link href="/tracking" className="hover:text-gray-300">
              Tracking
            </Link>
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
            <ConnectButton client={client} theme={"light"} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
