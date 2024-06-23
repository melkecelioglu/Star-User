import { ConnectButton } from "@rainbow-me/rainbowkit";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { useAccount, useBalance, Address } from "wagmi";
import { fetchBalance } from "wagmi/actions";

interface UserInfoProps {
  completedSteps: number;
  totalSteps: number;
  balance: number;
  walletAddress: string;
  percent: number;
}

const UserInfo: React.FC<UserInfoProps> = ({
  completedSteps,
  totalSteps,
  balance,
  walletAddress,
  percent,
}) => {
  const account = useAccount();
  let accountAddress: string | undefined = account.address;
  let displayAddress: string = "";


  // Check if accountAddress is defined before slicing
  if (accountAddress) {
    displayAddress =
      accountAddress.length >= 10
        ? accountAddress.slice(0, 5) + "..." + accountAddress.slice(-5)
        : accountAddress;
  }


  


  const address =
    account.address && account.address.startsWith("0x")
      ? account.address
      : undefined;


  const [userBalance, setUserBalance] = useState(0);
      // User's address here
      const userAddress = account.address;
   
      useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get(`https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/get_balance?address=${userAddress}`);
                setUserBalance(response.data.balance);
            } catch (error) {
                console.error("Error fetching balance:", error);
                // Handle error
            }
        };

        fetchBalance();
    }, [userAddress]); 
   

  return (
    <div className="p-8 w-full flex md:flex-row flex-col text-white space-x-4 border h-full shadow-[4px_4px_0px_0px_rgba(255,255,255)] ">
      <div className="flex flex-col">
        <div className="font-bold text-3xl mb-4">
          Welcome to StarkUser
        </div>
       
        <div className="font-bold mb-4 text-[#FFFFFFCC] text-lg">
        Your credit score allows you to open a credit line in STRK to
vote in the governance and interact with the Starknet
ecosystem.
        </div>
        <p className="md:text-2xl text-lg break-words">
          Account: {displayAddress}
        </p>
        <p className="md:text-2xl text-lg break-words">
          STRK Balance: {userBalance} STRK{" "}
        </p>
      </div>
      <div className="border-l  border-[#313131] px-4">
        <div className="flex md:flex-row flex-col md:w-[340px] h-full items-center justify-center  text-white p-4">
          <div className="relative mr-4">
            {/* The circular progress bar would be created here */}
            <div className="w-32 h-32 flex text-black items-center justify-center rounded-full bg-white">
              <div className="text-center">
                <p className=" font-semibold">Completed</p>
                <p className=" font-bold">{percent}%</p>
              </div>
            </div>
            
          </div>
{/*           <a href="https://twitter.com/VuzzMindHub?ref_src=twsrc%5Etfw" className="bg-red-500" data-show-count="false">Follow @VuzzAI</a><script async src="https://platform.twitter.com/widgets.js"></script>
 */}          <div>
            <h2 className="text-xl font-bold">Your Progress</h2>
            <p>
              <span className="text-green-400">
                {completedSteps} out of {totalSteps}
              </span>{" "}
              steps completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
