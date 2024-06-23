import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { BsTelegram } from "react-icons/bs";
import { useRouter } from "next/router";
import { getCsrfToken } from "next-auth/react";
import axios from "axios";

function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/login",
        { email }
      );
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      console.log(access_token);
      if (access_token) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="bg-gradient-to-b from-purple-900 to-purple-7800 text-white min-h-screen flex flex-col justify-between">
      <div className="absolute z-10 text-white gap-4 flex top-1  md:top-4 left-4">
        <Link href="https://twitter.com/_SDAV" target="_blank">
          <FaXTwitter size={24}></FaXTwitter>
        </Link>
        <Link href="https://t.me/sdaav">
          <BsTelegram className="cursor-pointer" size={24} target="_blank" />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <div className="text-5xl py-4 flex flex-col items-center justify-center">
          <Image src="/logoA.png" width={162} height={162} alt="Logo Image" />
        </div>

        <div className="flex flex-col items-center justify-center pt-24 md:pt-1">
          <h1 className="text-center text-3xl font-bold mb-6">
            Boost user retention on Starknet.
          </h1>

          <h2 className="text-center text-sm font-bold mb-6">
            by leveraging VC credentials for under-collateralized lending, enabling STRK borrowing for active governance participation.
          </h2>

          <div className="max-w-sm mx-auto p-12 bg-black border shadow-[4px_4px_0px_0px_rgba(255,255,255)]">
            <form onSubmit={handleLogin}>
              <label className="text-white">Email</label>
              <input
                type="email"
                className="py-2 px-4 my-4 border bg-[#282828] text-white border-black font-semibold text-hover:bg-gray-100 w-full"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
              />
              <br />
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="py-2 px-16 border text-white hover:text-black font-semibold text-lg hover:bg-gray-100 focus:outline-none focus:ring-shadow-smshadow-sm shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                >
                  SUBMIT
                </button>
              </div>
            </form>
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

export default Home;
