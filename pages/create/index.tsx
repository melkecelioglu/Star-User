import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { BsTelegram } from "react-icons/bs";
import { FaMedium } from "react-icons/fa6";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";

interface PasswordInputProps {
  placeholder: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className="py-2 px-16 pr-10 border bg-[#282828] border-black text-white font-semibold   focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50  shadow-[4px_4px_0px_0px_rgba(125,125,125)]"
        placeholder={placeholder}
      />
      <div
        className="absolute inset-y-0 right-3 flex items-center pr-3 cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="white"
            d="M8 6h8v2H8zm-4 4V8h4v2zm-2 2v-2h2v2zm0 2v-2H0v2zm2 2H2v-2h2zm4 2H4v-2h4zm8 0v2H8v-2zm4-2v2h-4v-2zm2-2v2h-2v-2zm0-2h2v2h-2zm-2-2h2v2h-2zm0 0V8h-4v2zm-10 1h4v4h-4z"
          ></path>
        </svg>
      </div>
    </div>
  );
};
const EmailInput: React.FC<PasswordInputProps> = ({ placeholder }) => {
 

  return (
    <div className="relative">
      <input
        type="email"
        className="py-2 px-16 pr-10 border bg-[#282828] border-black text-white font-semibold  focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50  shadow-[4px_4px_0px_0px_rgba(125,125,125)]"
        placeholder={placeholder}
      />
      <div
        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        
      >
        
      </div>
    </div>
  );
};

function Create() {
  const router = useRouter();

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <main>
      <div className="absolute z-10 text-white gap-4 flex top-1  md:top-4 left-4">
        <Link href="https://twitter.com/VuzzMind" target="_blank">
          <FaXTwitter size={24}></FaXTwitter>
        </Link>
        <Link href="https://t.me/VuzzMind">
          <BsTelegram
            className="cursor-pointer"
            size={24}
            target="_blank"
          />
        </Link>
        <Link href="https://medium.com/@VuzzAI" target="_blank">
          <FaMedium size={24} />
        </Link>
      </div>

      <div
        className={`flex  w-full h-screen overflow-hidden bg-black flex-col items-center justify-between `}
      >
        <div className="absolute z-0 left-0 h-full w-full overflow-hidden">
          <div className="absolute left-1/2 top-[50px] md:top-[50px] ml-[-2000px] h-[4000px] w-[4000px] rounded-full bg-transparent shadow-[0px_10px_100px_0px_rgba(255,255,255)] "></div>
        </div>
        <div
          className={`text-5xl py-4 flex flex-col items-center justify-center  text-black`}
        >
          <Image src="/logoA.png" width={62} height={62} alt="Logo Image" />
        </div>

        <div
          className={`flex w-full z-10 h-screen overflow-hidden  flex-col items-center pt-48 justify-start  `}
        >
          <div className="flex justify-center space-x-4 ">
            <div className="max-w-sm mx-auto p-6 bg-black border   shadow-[4px_4px_0px_0px_rgba(255,255,255)]">
              <div className="flex justify-center items-center">
                <button
                  className="py-1 px-10 border border-white text-white hover:text-black  font-semibold text-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 shadow-[4px_4px_0px_0px_rgba(125,125,125)]"
                  onClick={handleClick}
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 2048 2048"
                    >
                      <path
                        fill="gray"
                        d="M2048 1088H250l787 787l-90 90L6 1024L947 83l90 90l-787 787h1798z"
                      ></path>
                    </svg>
                    Set a Wallet Password
                  </div>
                </button>
              </div>
              <br></br>
              <div className="flex flex-col w-full justify-center">
              <div className="relative">
                <EmailInput placeholder="Email" />
              </div>
              <br />
              <div className="relative">
                <PasswordInput placeholder="New Password" />
              </div>
              <br />
              <div className="relative">
                <PasswordInput placeholder="Confirm new Password" />
              </div></div>
              <br />
              <div className="flex justify-center items-center">
                <button className="py-2 px-16 border border-white text-white hover:text-black font-semibold text-lg hover:bg-gray-100 focus:outline-none focus:ring-shadow-smshadow-sm shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const csrfToken = (await getCsrfToken(context)) || null;
  return {
    props: {
      csrfToken,
    },
  };
}

export default Create;

