import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { useChatbot } from "@/context/ChatbotContext";

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

  return (
    <>
      <button
        onClick={() => router.push("/chatbots/add")}
        className="absolute top-28 right-10 bg-white hover:bg-[#353535]  hover:text-white z-50 md:text-base text-[9px] text-black font-bold py-2 px-1 md:px-4 "
      >
        + Add
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 px-8 justify-start   gap-4  min-h-screen py-[5%] md:justify-center w-full bg-[#0f0f0f] text-white relative">
        
      </div>
    </>
  );
}
