import { ConnectButton } from "@rainbow-me/rainbowkit";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { useAccount, useBalance, Address } from "wagmi";
import { fetchBalance } from "wagmi/actions";

interface UserPercentProps {
  percent: number;
}

const UserPercent: React.FC<UserPercentProps> = ({
  percent,
}) => {
 

     
  

  return (
    <div className="">
     
    
            {/* The circular progress bar would be created here */}
            <div className="w-32 h-32 flex text-white items-center justify-center rounded-full border">
              <div className="text-center">
                <p className=" font-semibold">Completed</p>
                <p className=" font-bold">{percent}%</p>
              </div>
            </div>
            
         
    </div>
  );
};

export default UserPercent;
