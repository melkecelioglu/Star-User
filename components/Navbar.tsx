import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LuLogOut } from "react-icons/lu";

const Navbar = () => {

  function logout() {
    // Assuming the token is stored in localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('-walletlink:https://www.walletlink.org:session:id');
    
    // Redirect user to login page or home page
    window.location.href = '/';
}
  return (
    <div className="w-full bg-black flex border-b border-[#6c6c6c] justify-between items-center p-2">
      <div className="flex flex-col p-4 w-full">
        <Link href="/dashboard">
        <Image src="/logoA.png" width={48} height={48} alt="Logo Image" /></Link>
        
      </div>
      <div className="flex  p-4">
        <nav>
          
          <ul className="flex space-x-2 md:space-x-6 md:px-12">
            <li className="text-white   flex justify-center items-center hover:text-gray-300">
              <Link
                href="/dashboard"
                className="border md:text-base text-sm text-white px-12 py-1  flex   "
              >
                Credit Score
              </Link>
            </li>
            <li className="text-white  flex justify-center items-center hover:text-gray-300">
              <Link
                href="/chatbots"
                className="border md:text-base text-sm text-white px-12 py-4  flex"
              >
                Borrow
              </Link>
            </li>
            <li className="text-white  flex justify-center items-center hover:text-gray-300">
              <Link
                href="/hub"
                className="border md:text-base text-sm text-white px-12 py-1  flex "
              >
                Social Referral
              </Link>
            </li>
            <li onClick={logout} className="text-white  flex justify-center items-center hover:text-gray-300">
              <Link
                href="/hub"
                className="border md:text-base text-sm text-white px-4 py-2  flex "
              >
                <LuLogOut size={24} />
              </Link>
            </li>
          </ul>
        
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
