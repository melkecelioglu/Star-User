import React, { useState, FormEvent,ChangeEvent } from "react";
import { BsTelegram } from "react-icons/bs";
import { FaMedium, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import Web3 from 'web3';
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const Import: React.FC = () => {

  const [privateKey, setPrivateKey] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const router = useRouter();
  

  const handlePrivateKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrivateKey(event.target.value);
  };
  

  const handleImport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create a new web3 instance
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

    try {
      // Import the account using the private key
      const importedAccount = web3.eth.accounts.privateKeyToAccount(privateKey.trim());

      // Set the account in state
      setAccount(importedAccount.address);
      console.log('Account imported:', importedAccount);
      toast.success('Wallet imported successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error importing the wallet:', error);
      toast.error('Error importing the wallet');
    }
  };

  const handleClick = () => {
    // Navigate back to the previous page
    window.history.back();
  };

  


  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
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

      <div className={`flex w-full h-screen overflow-hidden bg-black flex-col items-center justify-between `}>
        <div className="absolute z-0 left-0 h-full w-full overflow-hidden">
          <div className="absolute left-1/2 top-[50px] md:top-[50px] ml-[-2000px] h-[4000px] w-[4000px] rounded-full bg-transparent shadow-[0px_10px_100px_0px_rgba(255,255,255)] "></div>
        </div>
        <div className={`text-5xl py-4 flex flex-col items-center justify-center  text-black`}></div>
        <div className={`flex w-full z-10 h-screen overflow-hidden  flex-col items-center pt-48 justify-start  `}>
          <div className="flex justify-center space-x-4 ">
            <div className="max-w-lg mx-auto p-20 px-20 bg-black border shadow-[4px_4px_0px_0px_rgba(125,125,125)]">
              <div className="flex justify-center items-center">
                <button
                  className="py-1 px-16  border text-white font-semibold text-lg hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50  shadow-[4px_4px_0px_0px_rgba(125,125,125)]"
                  onClick={handleClick}
                >
                  <div className="flex items-center  justify-center">
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
                    Import Your Wallet
                  </div>
                </button>
              </div>
              <br />
              <h1 className="text-gray-300">
                Use your Secret Phrase or Private Key to import an existing VUZZ
                wallet.
              </h1>
              <br />
              <form onSubmit={handleImport}>
              <input
                type={isChecked ? "text" : "password"}
                className="py-2 px-4 border bg-[#282828] text-white border-black font-semibold text-hover:bg-gray-100 w-full"
                placeholder="Secret Phrase or Private Key"
                value={privateKey}
                onChange={handlePrivateKeyChange}
              />
              <div className="flex items-center text-white pt-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="agree">Show Secret Phrase or Private Key</label>
              </div>
              <br />
              <div className="flex justify-center items-center">
                <button type="submit" className="py-2 px-16 border text-white hover:text-black font-semibold text-lg hover:bg-gray-100 focus:outline-none focus:ring-shadow-smshadow-sm shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                  SUBMIT
                </button>
              </div>
              </form>
      {account && <p className="text-white">Wallet Imported: {account}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Import;
