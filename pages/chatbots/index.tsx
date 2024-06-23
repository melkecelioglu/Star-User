import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { useChatbot } from "@/context/ChatbotContext";
import UserPercent from "@/components/UserPercentage";

interface Chatbot {
  _id: string;
  sale: boolean;
  imageUrl?: string; // Optional if some chatbots might not have an image
  status: string;
  name: string;
  description: string;
  price: number;
  owner: string;
  amount: number;
  is_published: boolean;
  creator: string;
  assistant_id: string;
}

export default function Chatbots() {
  const router = useRouter();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]); 
  const { price, amount } = useChatbot();
  const [completedQuestsCount, setCompletedQuestsCount] = useState<number>(6);


  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/my-chatbots", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChatbots(response.data);
      } catch (error) {
        console.error("Failed to fetch chatbots", error);
        // Handle error
      }
    };

    fetchChatbots();
  }, []);

  const handleListChatbot = async (chatbotId :string) => {
    try {
      const token = localStorage.getItem("token");
      console.log(chatbotId, price, amount, token)
      await axios.post(
        `https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/publish-chatbot/${chatbotId}`,
        {
          price,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // After listing, you might want to refresh the chatbots list or update the state
      toast.success("Chatbot listed successfully");
      router.push("/dashboard");
      // Optionally refresh chatbots list here...
    } catch (error) {
      console.error("Failed to list chatbot", error);
      alert("Failed to list chatbot.");
    }
  };

  const percentage = Math.round((completedQuestsCount / 8) * 100);

  

  return (
    <div>
      <button
        onClick={() => router.push("/chatbots/add")}
        className="absolute top-28 right-10 bg-white hover:bg-[#353535]  hover:text-white z-50 md:text-base text-[9px] text-black font-bold py-2 px-1 md:px-4 "
      >
        + Add
      </button>

      <div className="py-[100px]">

        <div className="pb-[50px] grid place-items-center">
        <UserPercent percent={percentage} />

        <p className="p-4 text-center ">You can borrow $1,000 amount with your credit score</p>
        </div>
       

        {/* Borrow  section */}
        <div>
          <h3 className="font-bold text-3xl pt-[60px] text-center  pb-[30px]">BORROW STRK</h3>
        <div className="p-8 text-white mx-[90px] sm:mx-[350px] border shadow-[4px_4px_0px_0px_rgba(255,255,255)] ">
          
          
          <div className="sm:flex sm:justify-between">
          <h5 className="pb-2">ENTER A STRK AMOUNT </h5>
        
          <button className="px-5 py-2 border text-left sm:mt-[40px]  rounded-md">MAX: 1,000 STRK</button>
          </div>

          <div className="pt-[30px]">
            <p className="pb-2">Select a vSTRK percentage</p>
            <div className="space-y-3 space-x-3 sm:space-x-3" >
              <button className="px-5  py-2 border text-left  rounded-md">mininum amount 40%</button>
              <button className="px-5 py-2 border text-left  rounded-md">60%</button>
              <button className="px-5  py-2 border text-left  rounded-md">80%</button>
              <button className="px-5 py-2 border text-left  rounded-md">custom</button>
            </div>
          </div>
        </div>

        <div className="grid place-items-center  pt-[100px]">
          <button className="px-5 py-2 border rounded-md">CONFIRM TRANSACTION</button>
          <p className="text-sm sm:text-base text-center pt-[40px] pb-[200px] px-[30px] sm:px-[0px]">40% mininum of this amount is wrapped in VSTRK to get voting power on the starknet governance</p>

        </div>
        </div>


        <div className="p-8 w-full text-white space-x-4 border h-full ">
          <h3 className="text-center text-xl pt-4 sm:text-2xl">HOW DO YOU WANT TO USE YOUR VSTRK?</h3>


          <div  className="pt-[150px] sm:flex sm:justify-between sm:px-[100px] ">
            <div className="pb-[100px] sm:pb-[100px]">
            <button className="px-5 py-2 border rounded-md">DELEGATE TO MYSELF</button>
            <p className="pt-2 text-xs">on your delegate profile, you will have your <br />credit score uploaded on it</p>
            </div>
            
            <div>
            <button className="px-5 py-2 border rounded-md">DELEGATE TO THE VOTING POLL</button>
            <p className="pt-2 text-xs">when a proposal is live, you can vote collectively  <br/> through the voting pool to improve the voice of the user</p>
            </div>

          </div>
        </div>
        <div className="p-8 w-full text-white space-x-4 border h-full ">
        <h3 className="text-center text-xl pt-4 mb-6 sm:text-2xl">WANT TO BORROW MORE?</h3>
        <div className="grid place-items-center pb-[200px]">
        <button className="px-5  py-2 border rounded-md">INVITE 2 FRIENDS</button>
        </div>
        </div>
      </div>
    </div>
  );
}
