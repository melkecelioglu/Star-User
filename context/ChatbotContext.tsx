import React, { createContext, useContext, ReactNode, useState } from 'react';

interface ChatbotContextType {
  price: number | "";
  amount: number | "";
  setPrice: React.Dispatch<React.SetStateAction<number | "">>;
  setAmount: React.Dispatch<React.SetStateAction<number | "">>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Define a type for the props expected by ChatbotProvider, including children
interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [price, setPrice] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");

  return (
    <ChatbotContext.Provider value={{ price, amount, setPrice, setAmount }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
