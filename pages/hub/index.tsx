import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';


interface Chatbot {
  _id: string;
  sale: boolean;
  imageUrl?: string;
  status: string;
  name: string;
  description: string;
  price: number;
  owner: string;
  amount: number;
  creator: string;
}

export default function Dashboard() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);

  useEffect(() => {
    const fetchPublishedChatbots = async () => {
      try {
        const response = await axios.get('https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/published-chatbots');
        setChatbots(response.data);
      } catch (error) {
        console.error('Failed to fetch published chatbots', error);
      }
    };

    fetchPublishedChatbots();
  }, []);

  return (
    <main className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 px-8 justify-start gap-4 min-h-screen py-[5%] md:justify-center w-full bg-[#0f0f0f] text-white relative">
      
    </main>
  );
}
