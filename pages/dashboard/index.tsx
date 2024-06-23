import React, { useEffect, useState } from 'react';

import Quests from '../../components/Quests';
import UserInfo from '../../components/UserInfo';


import Invite from '@/components/Invite';
import axios from 'axios';

interface CompletedQuestsResponse {
  completedQuestsCount: number;
}

export default function Dashboard() {



  const fetchCompletedQuestsCount = async (): Promise<number> => {
  try {
    const token = localStorage.getItem('token');
    console.log(token) // Assuming the token is stored in local storage
    const response = await axios.get<CompletedQuestsResponse>('https://Starknet-testnetapi-9e048bbe5549.herokuapp.com/get_completed_quests_count', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.completedQuestsCount;
  } catch (error) {
    console.error('Failed to fetch completed quests count', error);
    return 0;
  }
};

  const [completedQuestsCount, setCompletedQuestsCount] = useState<number>(0);

  useEffect(() => {
    const getCompletedQuestsCount = async () => {
      const count = await fetchCompletedQuestsCount();
      setCompletedQuestsCount(count);
    };

    getCompletedQuestsCount();
  }, []);
  

  const quests = [
    {id:1, description: "Import and Connect Starknet wallet",buttonTitle:"Done", details:"Connect with your initilazed Starknet Wallet to continue quests!", isActive:true },
    {id:2, description: "Follow Starknet on X",buttonTitle:"Sign In With X", details:"Follow Starknet on X for the latest updates and announcements. Connecting with the same account will not be counted" , isActive:true, secondButton:"Follow Starknet"},
    {id:3, description: "Claim Sepolia ETH",buttonTitle:"Claim",details:"Claim 0.01 Sepolia ETH to use on the testnet.(Claiming process may last almost 1 minute.)",isActive:true},
    {id:4, description: "Claim tStarknet",buttonTitle:"Claim",details:"Get free Starknet test tokens to try out Starknet’s features... (Claiming process may last almost 1 minute.)" , extras:"tStarknet Token Address :0x8731acFAfc612d1A7afdB20D97c97B06e40B32c5",isActive:true},
    {id:5, description: "Create Chatbot",buttonTitle:"Create", details:"Create a chatbot on Starknet",isActive:true},
    {id:6, description: "Publish Chatbot on Hub",buttonTitle:"Publish",details:"Publish your chatbot on Starknet Hub",isActive:true},
    {id:7, description: "Buy Chatbot",buttonTitle:"Buy",details:"Buy a chatbot from Starknet HUB !",isActive:false},
    {id:8, description: "Invite 3 Friends",buttonTitle:"Invite",details:"Invite 3 friends to join Starknet testnet",isActive:false},
  ];
/* ##test buy commit */
  const percentage = Math.round((completedQuestsCount / 8) * 100);
  
  return (
    
 
    <main className="flex  flex-col px-8 justify-start md:px-24 space-y-12 items-center md:items-end  min-h-screen  py-[3%] md:justify-center w-full bg-[#0f0f0f] text-white relative">
   
    <UserInfo totalSteps={8} percent={percentage} completedSteps={completedQuestsCount}  walletAddress="0x1ABC7154748D1CE5144478CDEB574AE2" balance={10000} />
    <div className='flex md:flex-row w-full flex-col space-y-8 md:space-y-0 md:space-x-8'>
    <Invite  />
    <Quests quests={quests} />
    </div>
    </main>

  );
}