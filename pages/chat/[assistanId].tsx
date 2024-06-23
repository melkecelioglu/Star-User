"use client";
import Image from "next/image";
import useState from "react-usestateref";

import { useEffect, useRef } from "react";
import axios from "axios";
import { Outfit, Roboto } from "next/font/google";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/router";
const roboto = Roboto({ weight: "300", subsets: ["latin"] });

const out = Outfit({ weight: "200", subsets: ["latin"] });
enum Creator {
  Me = 0,
  Bot = 1,
}

interface MessageProps {
  text: string;
  from: Creator;
  key: number;
}

interface InputProps {
  onSend: (input: string) => void;
  disabled: boolean;
}

const ChatMessage = ({ text, from }: MessageProps) => {
  return (
    <div className="z-10">
      {from == Creator.Me && (
        <div className="bg-[#b0b0b080] justify-start relative z-10 p-4 my-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image
            src="/robot.png"
            alt="User"
            className="rounded-full"
            width={40}
            height={40}
          />

          <p className="text-white">{text}</p>
        </div>
      )}
      {from == Creator.Bot && (
        <div className="bg-[#cbcbcb40] p-4 z-10 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image
            src="/logoA.png"
            alt="User"
            className="bg-black rounded-full"
            width={40}
            height={40}
          />
          <p className="text-white">{text}</p>
        </div>
      )}
    </div>
  );
};

const ChatInput = ({ onSend, disabled }: InputProps) => {
  const [input, setInput] = useState("");

  const sendInput = () => {
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      sendInput();
    }
  };

  return (
    <div className="bg-transparent  p-2 rounded-lg flex justify-center">
      <input
        value={input}
        onChange={(e: any) => setInput(e.target.value)}
        className="w-full py-2 px-3 text-black border-4 border-white bg-white rounded-lg focus:outline-none"
        type="text"
        placeholder="Talk !"
        disabled={disabled}
        onKeyDown={(e) => handleKeyDown(e)}
      />

      {!disabled && (
        <button
          onClick={() => sendInput()}
          className="p-2 rounded-md text-gray-500 bottom-1.5 right-1"
        ></button>
      )}
    </div>
  );
};

export default function Chat() {
  const id = useParams();
  const [loading, setLoading] = useState(false);

  const [chatbot, setChatbot] = useState([]);
  async function getAssistantData() {
    const apiUrl = `https://vuzzai-api-kwc645oxbq-ew.a.run.app/assistants?assistant-id=${id.asisstantId}`;

    try {
      const response = await axios.get(apiUrl);
      console.log(response.data);
      setChatbot(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const bottomChatRef = useRef(null);
  const [messages, setMessages, messagesRef] = useState<MessageProps[]>([]);
/* 
  useEffect(() => {
    bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
   
  }, [messages]);
 */
 /*  useEffect(() => {
   
    createThread("hi");
  }, []); */

 /*  const [thread , setThread] = useState(""); */

 /*  const createThread = async (input: string) => {
    try {
      const response = await axios.get(
        `https://vuzzai-api-kwc645oxbq-ew.a.run.app/assistants/create-thread?message=${input}`
       
      ); 
      
      setThread(response.data)
    } catch (error) {
      console.log(error)
    }
  }; */

  const callApi = async (input:string) => {
    setLoading(true);
  
    const myMessage = {
      text: input,
      from: Creator.Me,
      key: new Date().getTime(),
    };
  
    setMessages([...messagesRef.current, myMessage]);
  
    try {
      const token = localStorage.getItem("token");
      console.log(id)
      const assistant_Id = id.assistanId; // Replace with your actual assistant ID
      const response = await axios.post(
        `https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/talkwith-chatbot`,
        {
          prompt: input, // Include the user input as the prompt
          assistant_id: assistant_Id, // Include the assistant ID
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((response) => {
        setLoading(false);
        if (response.data && response.data.response) { // Adjust according to your response structure
          const botMessage = {
            text: response.data.response, // Make sure this matches the response structure
            from: Creator.Bot,
            key: new Date().getTime(),
          };
          setMessages([...messagesRef.current, botMessage]);
        }
      });
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };


  return (
    <main
      className={`bg-black p-24 px-12 md:pb-32 flex flex-col pt-12 justify-between w-full  md:px-36 min-h-screen  ${roboto.className} bg-cover  mx-auto`}
    >
   
      <button
        onClick={handleGoBack}
        className="absolute bg-white md:left-[100px] text-black rounded-xl px-4 py-2"
      >
        Go Back
      </button>

      <div className="flex items-center w-full justify-end space-x-2">
        <div className="text-white">Status</div>
        <div className="h-4 w-4 bg-green-500 rounded-full"></div>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <Image
          alt="logo"
          src="/logoA.png"
          width={200}
          height={200}
        ></Image>

        <div className={roboto.className}>
          <div className="text-white text-xl">BETA</div>
        </div>
      </div>
      <div className="mt-10 flex flex-col z-10 px-4">
        {messages.map((msg: MessageProps) => (
          <ChatMessage key={msg.key} text={msg.text} from={msg.from} />
        ))}
        {loading ? (
          <div className="text-white mt-[-20px] ml-6 loading-dots">...</div>
        ) : (
          ""
        )}
        <div ref={bottomChatRef} />
      </div>
      <div className="sticky  items-start z-20 top-0 w-full pt-10 md:px-4">
        <ChatInput
          onSend={(input) => callApi(input)}
          disabled={loading}
        ></ChatInput>
       
      </div>
     
     
     
    </main>
  );
}